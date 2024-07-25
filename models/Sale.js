const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    saleDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Sale.associate = (models) => {
    Sale.belongsTo(models.Book, {
      foreignKey: 'bookId',
      as: 'book', // alias for the relationship
    });
    Sale.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user', // alias for the relationship
    });
  };

  return Sale;
};
