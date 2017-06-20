/**
 * Created by waver on 2017/4/26.
 */

module.exports = function(sequelize, DataTypes) {
    var Tip = sequelize.define("Tip", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        content: DataTypes.STRING,
        expiredate: DataTypes.STRING,
        state: {type: DataTypes.BOOLEAN}},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Tip.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Tip;
};