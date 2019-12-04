module.exports = (sequelize, Sequelize) => {
  return sequelize.define('favorite', {
    uemail: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    hname: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    sname: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    }
  })
}
