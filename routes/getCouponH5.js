/**
 * Created by waver on 2017/8/10.
 */
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();
var models =  require('../models');

router.get('/', function(req, res) {
    logger.info('user:[' + req.ip + '] open getCouponH5.html');
    if(req.query.c && req.query.c.length >= 4) {
        var corpCode = req.query.c.substr(0, 4);
        req.session.src = corpCode;
        models.sequelize.query('SELECT c.code, c.name, d.address, d.tel, d.description, d.discount, d.picture FROM corporations c, corpdetails d WHERE c.state=true AND c.code=d.code AND c.code IN (SELECT dest FROM corprelations WHERE state=true AND src=?)', { replacements: [corpCode], type: models.sequelize.QueryTypes.SELECT})
            .then(function(corps) {
                if(corps && corps.length>0) {
                    logger.info('user:[' + req.ip + '] getCouponH5.html initialize ');
                    return res.render('getCouponH5', {layout: false, 'corps': corps});
                } else {
                    throw new Error('未查询到合作商户！');
                }
        }).catch(function (error) {
            logger.error('user:[' + req.ip + '] ' + error.stack);
            return res.render('tipH5', {layout: false});
        });
    } else {
        res.render('tipH5', {layout: false});
    }
});

module.exports = router;
