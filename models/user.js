/**
 * Created by waver on 2017/4/28.
 */

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING, allowNull: false, unique: true},
        password: {type: DataTypes.STRING, allowNull: false},
        corp: DataTypes.CHAR(4),
        auth: DataTypes.STRING},
        {
            charset: 'utf8',
            collate: 'utf8_general_ci'
    });

    User.sync().then(function() {
        // ok ... everything is nice!
    }).catch(function(error) {
        console.log(error);
    });

    return User;
};