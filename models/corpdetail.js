/**
 * Created by waver on 2017/4/27.
 */

module.exports = function(sequelize, DataTypes) {
    var Corpdetail = sequelize.define("Corpdetail", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        code: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [0,4]
            }},
        address: DataTypes.STRING,
        linkman: DataTypes.STRING,
        tel: DataTypes.STRING,
        mobile: DataTypes.STRING,
        description: DataTypes.STRING(2000),
        picture: DataTypes.STRING,
        field: DataTypes.INTEGER,
        fieldname: DataTypes.STRING},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    Corpdetail.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return Corpdetail;
};