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
    methodName: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
  },
  {
    timestamps: true,
  }
);

db.rounds = sequelize.define(
  'round',
  {
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    // sessionId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps: true,
  }
);

db.logs = sequelize.define(
  'log',
  {
    type: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    money: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
    result: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: true,
  }
);

db.sessions.hasMany(db.rounds, { as: 'rounds' });
db.rounds.hasMany(db.logs, { as: 'logs' });

// db.logs.belongsTo(db.rounds, { foreignKey: 'roundId' });
// db.rounds.belongsTo(db.sessions, { foreignKey: 'sessionId' });

db.createSession = async (methodName, username) => {
  try {
    const result = await db.sessions.create({ methodName, username });
    return result;
  } catch (error) {
    throw error;
  }
};

db.createRound = async (sessionId) => {
  try {
    const result = await db.rounds.create({ sessionId });
    return result;
  } catch (error) {
    throw error;
  }
};

db.createLog = async (roundId, type, amount, money, result, status) => {
  try {
    const response = await db.logs.create({
      roundId,
      type,
      amount,
      money,
      result,
      status,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

db.updateLog = async (logId, logData) => {
  try {
    const response = await db.logs.update(logData, {
      where: {
        id: logId,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

db.readLogs = async (username, limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const results = await db.sessions.findAll({
      where: {
        username,
      },
      order: [
        ['createdAt', 'DESC'],
        [{ model: db.rounds, as: 'rounds' }, 'createdAt', 'DESC'],
        [
          { model: db.rounds, as: 'rounds' },
          { model: db.logs, as: 'logs' },
          'createdAt',
          'DESC',
        ],
      ],
      include: {
        model: db.rounds,
        as: 'rounds',
        include: {
          model: db.logs,
          as: 'logs',
        },
      },
      // raw: true,
      // nest: true,
      limit,
      offset,
    });
    const sessions = JSON.stringify(results, null, 2);
    const ber = JSON.parse(sessions);
    return ber;
  } catch (error) {
    throw error;
  }
};

module.exports = db;
