module.exports = (sequelize, Sequelize) => {
  return sequelize.define('user', {
    // 0 = patient, 1 = hospital, 2 = store
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usertype: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phonenum: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lat: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    lng: {
      type: Sequelize.DOUBLE,
      allowNull: true
    }
  })
}
