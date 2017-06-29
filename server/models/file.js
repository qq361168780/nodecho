'use strict';

module.exports = function (sequelize, DataTypes) {
    var File = sequelize.define('File', {
        key: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true
    });

    File.associate = function (models) {
        File.belongsTo(models.User);
    };

    return File;
};
