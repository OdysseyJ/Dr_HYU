module.exports = (sequelize, Sequelize) => {
  return sequelize.define('prescription', {
    prescriptiontype: {
      type: Sequelize.STRING,
      allowNull: false
    },
    prescription: {
      type: Sequelize.STRING(1000),
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
