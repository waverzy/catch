/**
 * Created by waver on 2017/4/26.
 */

module.exports = function(sequelize, DataTypes) {
    var Corporation = sequelize.define("Corporation", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        code: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1,4]
            }},
        name: {type: DataTypes.STRING},
        state: {type: DataTypes.BOOLEAN}},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Corporation.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Corporation;
};