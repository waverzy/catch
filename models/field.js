/**
 * Created by waver on 2017/4/26.
 */

module.exports = function(sequelize, DataTypes) {
    var Field = sequelize.define("Field", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true
            }},
        name: {type: DataTypes.STRING}},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Field.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Field;
};