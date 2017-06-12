/**
 * Created by waver on 2017/5/10.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open corprelation.html');
    models.Corporation.findAll().then(function(corplist) {
        logger.info('user:[' + req.session.user + '] corprelation.html initialize');
        return res.render('corprelation', {'corps': corplist, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/selectOut', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to query unrelated corps');
    models.sequelize.query('SELECT code, name FROM corporations WHERE state=true AND code NOT IN (SELECT dest FROM corprelations WHERE src=?)', { replacements: [req.body.src], type: models.sequelize.QueryTypes.SELECT
    }).then(function (result) {
        logger.info('user:[' + req.session.user + '] query unrelated corps finished');
        return res.send({'msg': 'success', 'unrelated': result});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/selectIn', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to query related corps');
    models.sequelize.query('SELECT dest, name FROM corprelations WHERE src=?', { replacements: [req.body.src], type: models.sequelize.QueryTypes.SELECT
    }).then(function (result) {
        logger.info('user:[' + req.session.user + '] query related corps finished');
        return res.send({'msg': 'success', 'related': result});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/insert', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to insert relations');
    var relations = JSON.parse(req.body.relations), src = req.body.src;
    if(relations instanceof Array && relations.length>0 && src) {
        for(var i=0; i<relations.length; i++) {
            relations[i].src = src;
            relations[i].state = true;
        }
        models.Corprelation.bulkCreate(relations).then(function() {
            logger.info('user:[' + req.session.user + '] insert finished ');
            return res.send({'msg': 'success'});
        }).catch(function (error) {
            logger.error('user:[' + req.session.user + '] ' + error.stack);
            return res.send({'msg': '错误:' + error.message});
        });
    } else {
        logger.error('user:[' + req.session.user + '] 传递的机构列表或源机构不合法！');
        return res.send({'msg': '传递内容不合法！'});
    }
});

router.post('/delete', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to delete relations');
    var relations = JSON.parse(req.body.relations), src = req.body.src;
    if(relations instanceof Array && relations.length>0 && src) {
        models.Corprelation.destroy({
            where: {
                src: src,
                dest: {
                    $in: relations
                }
            }
        }).then(function(affectedRows) {
            if(affectedRows < 1) {
                throw new Error('数据不存在！');
            }
            logger.info('user:[' + req.session.user + '] delete finished ');
            return res.send({'msg': 'success'});
        }).catch(function (error) {
            logger.error('user:[' + req.session.user + '] ' + error.stack);
            return res.send({'msg': '错误:' + error.message});
        });
    } else {
        logger.error('user:[' + req.session.user + '] 传递的机构列表或源机构不合法！');
        return res.send({'msg': '传递内容不合法！'});
    }
});

module.exports = router;