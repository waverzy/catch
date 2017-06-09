/**
 * Created by waver on 2017/4/28.
 */

module.exports = function(sequelize, DataTypes) {
    var Coupon = sequelize.define("Coupon", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        src: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1,4]
            }},
        dest: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1,4]
            }},
        couponcode: {type: DataTypes.STRING, allowNull: false},
        couponno: DataTypes.BIGINT,//后续索引用
        discount: DataTypes.STRING,
        customer: DataTypes.STRING,
        state: DataTypes.BOOLEAN},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Coupon.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Coupon;
};