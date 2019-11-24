module.exports = (sequelize, Sequelize) => {
  return sequelize.define('prescription', {
    prescription: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
