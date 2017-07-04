/**
 * Created by waver on 2017/6/30.
 */
var request = require('request');
var crypto = require('crypto');

var path = require("path");
var env = process.env.NODE_ENV || "development";
var gConfig = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

/**
 *
 * 阿里云短信发送接口 nodejs 版本
 * 阿里云短信API官方文档: https://help.aliyun.com/document_detail/28759.html?spm=5176.doc28758.6.676.BibeOU
 * https://help.aliyun.com/document_detail/55284.html?spm=5176.doc55284.6.553.X1OvEY
 *
 */
var aliyunSmsUtil = {

    config: {
        Version: "2017-05-25",
        AccessKeyId: gConfig.AccessKeyId,
        AccessKeySecret: gConfig.AccessKeySecret,
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        SignName: "执尔科技",
        TemplateCode1: "SMS_75770018",
        Action: "SendSms",
        Format: "JSON"
    },

    /**
     * 阿里云短信发送接口
     * @param data  发送短信的参数，请查看阿里云短信模板中的变量做一下调整，格式如：{code:"1234", phone:"13062706593"}
     * @param callback 发送短信后的回调函数
     */
    sendMessage: function (data, callback) {
        var that = this;
        var param = {
            'Format': that.config.Format,
            'Version': that.config.Version,
            'AccessKeyId': that.config.AccessKeyId,
            'SignatureMethod': that.config.SignatureMethod,
            'SignatureVersion': that.config.SignatureVersion,
            'SignatureNonce': Math.floor(Math.random() * 10).toString(),
            'Timestamp': new Date().toISOString(),
            'PhoneNumbers': data.phone,
            'SignName': that.config.SignName,
            'TemplateCode': that.config[data.template],
            'TemplateParam': data.params,
            'Action': that.config.Action
        };
        param.Signature = this.getSignature(param, that.config.AccessKeySecret);
        var api_url = 'http://dysmsapi.aliyuncs.com/?';
        request.post({
            url: api_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: param
        }, function (err, response, data) {
            if (callback) {
                callback(err, response, data);
            }
        });
    },

    /**
     * 阿里云短信接口， 签名函数
     * @param param 发送短信的参数
     * @param AccessKeySecret 阿里短信服务所用的密钥值
     */
    /*signParameters: function (param, AccessKeySecret) {
        var param2 = {}, data=[];
        var oa = Object.keys(param).sort();
        for (var i = 0; i < oa.length; i++) {
            var key = oa[i];
            param2[key] = param[key];
        }
        for (var key in param2) {
            data.push(encodeURIComponent(key) + '=' + encodeURIComponent(param2[key]));
        }
        data = data.join('&');
        var StringToSign = 'POST' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(data);
        AccessKeySecret = AccessKeySecret + '&';
        // return crypto.createHmac('sha1', AccessKeySecret).update(new Buffer(StringToSign, 'utf-8')).digest('base64');
        return crypto.createHmac('sha1', AccessKeySecret).update(new Buffer(StringToSign, 'utf-8')).digest().toString('base64');
    },*/

    getSignature: function (params, AccessKeySecret) {
        var paramsStr = this.toQueryString(params);
        var signTemp = 'POST' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(paramsStr);
        return crypto.createHmac('sha1', AccessKeySecret+'&').update(new Buffer(signTemp, 'utf-8')).digest('base64');
    },

    toQueryString: function (params) {
        return Object.keys(params).sort().map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }
};

module.exports = aliyunSmsUtil;