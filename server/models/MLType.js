module.exports = (sequelize, types) => {
    return sequelize.define('money_location_types', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: types.STRING,
    }, {
        timestamps: false,
    });
};