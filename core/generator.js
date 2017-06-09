/**
 * Created by waver on 2017/5/5.
 */
const crypto = require('crypto');

/**
 * @param src The source corporation.
 * @param dest The destination corporation.
 * @param num Number of coupons.
 * @param len Length of coupon code.
 */
module.exports = function (src, dest, num, len) {
    var timestamp=new Date().getTime();
    // if(len && len<=32 && len>0) {
    //     length = len;
    // }
    var codes = [];
    for(var i=0; i<num; i++) {
        var repeat = false;
        var code = "";
        do {
            repeat = false;
            const md5 = crypto.createHash('md5');
            md5.update(src+timestamp+dest);
            code = md5.digest("hex").substr(8, len);
            for(var j=0; j<codes.length; j++) {
                if(code == codes[j]) {
                    repeat = true;
                    timestamp++;
                    break;
                }
            }
        } while (repeat);
        codes.push(code);
        timestamp++;
    }
    return codes;
};
    
