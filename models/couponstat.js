/**
 * Created by waver on 2017/4/28.
 */

module.exports = function(sequelize, DataTypes) {
    var Couponstat = sequelize.define("Couponstat", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        src: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            unique: 'compositeIndex',
            validate: {
                notEmpty: true,
                len: [1,4]
            }},
        dest: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            unique: 'compositeIndex',
            validate: {
                notEmpty: true,
                len: [1,4]
            }},
        totalnum: DataTypes.INTEGER,
        usednum: DataTypes.INTEGER},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Couponstat.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Couponstat;
};