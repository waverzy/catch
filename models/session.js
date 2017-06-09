/**
 * Created by waver on 2017/5/22.
 */

module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        sid: {type: DataTypes.STRING, primaryKey: true},
        userId: DataTypes.STRING,
        expires: DataTypes.DATE,
        data: DataTypes.STRING(10000)},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            engine: 'memory'
    });

    Session.sync({force: true}).then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Session;
};