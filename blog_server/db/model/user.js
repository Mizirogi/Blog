module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user_auths', {
        // id: {
        //     type: DataTypes.STRING(50),
        //     primaryKey: true,
        //     autoIncrement: true
        // },
        name: { type: DataTypes.STRING(100), unique: true },
        pwd: DataTypes.STRING(15),
        createdAt: DataTypes.BIGINT,
        updatedAt: DataTypes.BIGINT,
    }, {
        timestamps: false
    })
}


// const UserInfo = function (sequelize, DataTypes) {
//     return sequelize.define('user_infos', {
//         uid: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV1,
//             allowNull: false,
//         },
//         name: { type: DataTypes.STRING(100), unique: true },
//         nick: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         sex: {
//             type: DataTypes.ENUM(['男', '女']),
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         phone: {
//             type: DataTypes.STRING
//         }
//     }, {
//         timestamps: false
//     })
// }


// UserInfo.sync({ force: true });
// User.sync({ force: true });

// module.exports = {
//     UserInfo,
//     User
// }
