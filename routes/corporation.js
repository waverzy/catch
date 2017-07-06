/**
 * Created by waver on 2017/4/28.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();
var multer = require('multer');
var FILE_PATH = 'images/';
var storage = multer.diskStorage({
    destination: 'public/' + FILE_PATH,
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

router.get('/', function(req, res, next) {
    /*if(!req.session.user) {
        return res.redirect('/login');
    }*/
    logger.info('user:[' + req.session.user + '] open corporation.html');
    var result = {};
    models.sequelize.query('SELECT c.code, c.name, c.state, d.address, d.linkman, d.tel, d.mobile, d.description, d.picture, d.field, d.fieldname, d.expiredate, d.discount FROM corporations c, corpdetails d WHERE c.code=d.code', { type: models.sequelize.QueryTypes.SELECT})
        .then(function(corps) {
            result.corps = corps;
            return models.Field.findAll();
        }).then(function(fields) {
        logger.info('user:[' + req.session.user + '] corporation.html initialize ');
        return res.render('corporation', {'corps': result.corps, 'fields': fields, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        next(error);
    });
});

router.post('/upload', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to upload picture');
    var upload = multer({
        storage: storage,
        limits: {
            files: 1,
            fileSize: 1000*1024
        }
    }).single('picture');
    upload(req, res, function(err) {
        if(err) {
            logger.error(err.stack);
            return res.send({'msg': err.message});
        }
        logger.info('user:[' + req.session.user + ']upload[' + req.file.filename + '] finished');
        return models.Corpdetail.findOne({
            where: {
                code: req.body.code
            }
        }).then(function (corpdetail) {
            if(corpdetail) {
                return corpdetail.update({'picture': FILE_PATH + req.file.filename}, {fields: ['picture']});
            }
            throw new Error('机构信息不存在，无法更新图片！');
        }).then(function () {
            logger.info('user:[' + req.session.user + '] update picture finished ');
            return res.send({'msg': 'success'});
        }).catch(function (error) {
            logger.error('user:[' + req.session.user + '] ' + error.stack);
            return res.send({'msg': '错误:' + error.message});
        });
    });
});

router.post('/upsert', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to upsert corporation');
    var results = {};
    //upsert长度超过时会自动截取
    models.Corporation.upsert({
        'code': req.body.code,
        'name': req.body.name,
        'state': req.body.state!=0}).then(function (result) {
        // result = [x] or [x, y]
        // [x] if you're not using Postgres
        // [x, y] if you are using Postgres
        // The promise returns an array with one or two elements.
        // The first element is always the number of affected rows,
        // while the second element is the actual affected rows
        // (only supported in postgres with options.returning true.)
        // if(result[0]) {
        //     throw new Error('BasicInfo无记录更新！');
        // }
        // if(result[0] > 1) {
        //     throw new Error('BasicInfo更新记录超过一条！');
        // }
        results.first = result;
        var picture = req.body.picture;
        if(picture && picture.length>0 && picture.indexOf(FILE_PATH) !== 0) {
            picture = '';
            logger.error('user:[' + req.session.user + '] 上传图片路径错误！');
        }
        return models.Corpdetail.upsert({
            code: req.body.code,
            address: req.body.address,
            linkman: req.body.linkman,
            tel: req.body.tel,
            mobile: req.body.mobile,
            description: req.body.description,
            picture: picture,
            field: req.body.field,
            fieldname: req.body.fieldname,
            expiredate: req.body.expiredate,
            discount: req.body.discount
        });
    }).then(function (result) {
        // if(result[0] < 1) {
        //     throw new Error('DetailInfo无记录更新！');
        // }
        // if(result[0] > 1) {
        //     throw new Error('DetailInfo更新记录超过一条！');
        // }
        results.second = result;
        logger.info('user:[' + req.session.user + '] upsert corporation info finished ');
        return res.send({'msg': 'success', 'upsert': results.first});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/select', function(req, res) {
    logger.info('user:[' + req.session.user + '] begin to get corp select list ');
    models.Corporation.findAll({
        attributes: ['code', 'name']
    }).then(function (corplist) {
        logger.info('user:[' + req.session.user + '] get corp select list finished ');
        return res.send({'msg': 'success', 'corps': corplist});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    })
});

module.exports = router;