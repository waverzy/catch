/**
 * Created by waver on 2017/5/16.
 */

module.exports = function(sequelize, DataTypes) {
    var Corprelation = sequelize.define("Corprelation", {
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
        name: {type: DataTypes.STRING},
        state: DataTypes.BOOLEAN},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Corprelation.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Corprelation;
};