module.exports = (sequelize, Sequelize) => {
  return sequelize.define('favorite', {
    hname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sname: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })
}
