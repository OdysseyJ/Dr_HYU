module.exports = (sequelize, Sequelize) => {
  return sequelize.define('reservation', {
    time: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
