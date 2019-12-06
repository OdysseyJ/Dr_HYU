module.exports = (sequelize, Sequelize) => {
  return sequelize.define('log', {
    logtype: {
      type: Sequelize.STRING,
      allowNull: false
    },
    time: {
      type: Sequelize.STRING,
      allowNull: true
    },
    prescriptiontype: {
      type: Sequelize.STRING,
      allowNull: true
    },
    prescription: {
      type: Sequelize.STRING(1000),
      allowNull: true
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
