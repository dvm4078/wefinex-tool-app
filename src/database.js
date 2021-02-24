const Sequelize = require('sequelize');

const dbPath = './db.sqlite3';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sessions = sequelize.define(
  'session',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);

db.rounds = sequelize.define(
  'round',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

db.logs = sequelize.define(
  'log',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roundId: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    result: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: true,
  }
);

db.logs.belongsTo(db.rounds, { foreignKey: 'roundId', as: 'Round' });
db.rounds.belongsTo(db.sessions, { foreignKey: 'sessionId', as: 'Session' });

module.exports = db;
