module.exports = (sequelize, Sequelize) => {
  return sequelize.define('log', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    time: {
      type: Sequelize.STRING,
      allowNull: true
    },
    prescription: {
      type: Sequelize.STRING,
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
