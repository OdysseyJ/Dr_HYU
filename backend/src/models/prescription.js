module.exports = (sequelize, Sequelize) => {
  return sequelize.define('prescription', {
    prescription: {
      type: Sequelize.STRING,
      allowNull: false
    },
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
