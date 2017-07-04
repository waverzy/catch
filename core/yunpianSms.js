/**
 * Created by waver on 2017/7/4.
 */
var request = require('request');

var path = require("path");
var env = process.env.NODE_ENV || "development";
var gConfig = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

function YunpianSms() {
    this.apikey = gConfig.apikey;
    this.validateMsg1 = "【执尔科技】您的本次验证码：";
    this.validateMsg2 = "，10分钟内输入有效。";
    this.couponMsg1 = "【执尔科技】获得";
    this.couponMsg2 = "优惠券1张，券码";
    this.couponMsg3 = "，享受";
    this.couponMsg4 = "，有效期至";
    this.couponMsg5 = "，商家地址：";
}

YunpianSms.prototype.sendValidateMsg = function (data, callback) {
    var param = {
        'apikey': this.apikey,
        'mobile': data.mobile,
        'text': this.validateMsg1 + data.code + this.validateMsg2
    };
    var api_url = 'https://sms.yunpian.com/v2/sms/single_send.json';
    request.post({
        url: api_url,
        form: param
    }, function (err, response, data) {
        if (callback) {
            callback(err, response, data);
        }
    });
};

YunpianSms.prototype.sendCouponMsg = function (data, callback) {
    var param = {
        'apikey': this.apikey,
        'mobile': data.mobile,
        'text': this.couponMsg1 + data.name + this.couponMsg2 + data.couponcode + this.couponMsg3 + data.discount + this.couponMsg4 + data.expiredate + this.couponMsg5 + data.address
    };
    var api_url = 'https://sms.yunpian.com/v2/sms/single_send.json';
    request.post({
        url: api_url,
        form: param
    }, function (err, response, data) {
        if (err) {
            return callback(err);
        }
        callback(null, response, data);
    });
};

exports.YunpianSms = YunpianSms;