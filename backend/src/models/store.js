module.exports = (sequelize, Sequelize) => {
  return sequelize.define('store', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    department: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lat: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lng: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    openTime: {
      type: Sequelize.STRING,
      allowNull: false
    },
    openDay: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
