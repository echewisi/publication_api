const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Seller', 'Buyer'),
      allowNull: false,
      defaultValue: 'Buyer',
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Book, {
      foreignKey: 'userId',
      as: 'books', 
    });
  };

  return User;
};
