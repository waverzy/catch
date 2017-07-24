/**
 * Created by waver on 2017/7/21.
 */

module.exports = function(sequelize, DataTypes) {
    var Apply = sequelize.define("Apply", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING, allowNull: false},
        linkman: DataTypes.STRING,
        tel: DataTypes.STRING,
        note: DataTypes.STRING},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Apply.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Apply;
};