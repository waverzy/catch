var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

/* GET home page. */
router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open index.html');
    return res.render('index', {'admin': req.session.corp==='admi'});
});

router.post('/logout', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to logout');
    res.clearCookie('connect.sid', { path: '/' });
    return res.end();
});

router.post('/stat', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to get couponstat');
    var src = req.session.corp;
    if(!src) {
        return res.send({'msg': '登录状态异常，请退出重新登录！'});
    }
    models.sequelize.query('SELECT a.dest, a.totalnum, a.usednum, b.name FROM couponstats a, corporations b WHERE a.src=? AND a.dest=b.code', { replacements: [src], type: models.sequelize.QueryTypes.SELECT})
        .then(function (stats) {
            return res.send({'msg': 'success', 'stats': stats});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误' + error.message});
    });
});

router.post('/query', function (req, res) {
    var src = req.session.corp || '',
        dest = req.body.dest || '';
    if(src.length == 0 || dest.length == 0) {
        return res.send({'msg': '状态异常，请刷新页面或重新登录！'});
    }
    models.Coupon.findAll({
        where: {src: src, dest: dest}
    }).then(function (coupons) {
        if(coupons) {
            logger.info('user:[' + req.session.user + '] query coupons finished');
            return res.send({'msg': 'success', 'coupons': coupons});
        }
        throw new Error('不存在优惠券！')
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;
