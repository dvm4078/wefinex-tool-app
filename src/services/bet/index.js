import method1Settings from './settings/method1';
import method2Settings from './settings/method2';
import method3Settings from './settings/method3';
import method4Settings from './settings/method4';
import method5Settings from './settings/method5';
import method6Settings from './settings/method6';
import method7Settings from './settings/method7';

import { bet as requestBet } from '../wefinex';
import db from '../../database';

const handleTrading = async (options, socket, methodSettings) => {
  try {
    const {
      methods,
      takeProfit,
      takeProfitValue,
      takeProfitType,
      stopLoss,
      stopLossValue,
      stopLossType,
      startWhenTakeProfitTimes,
      startWhenTakeProfitTimesValue,
      startWhenStopLossTimes,
      startWhenStopLossTimesValue,
      startWhenTakeProfit,
      startWhenStopLoss,
      saveHistory,
    } = options;

    const session = await db.createSession();
    let round = null;
    let log = null;

    let consecutiveWins = 0;

    let times = 1;
    let timesWin = 0;
    let timesLose = 0;

    let waitingResult = false;

    const reset = () => {
      round = null;
      log = null;
      times = 1;
      timesWin = 0;
      timesLose = 0;
      waitingResult = false;
      consecutiveWins = 0;
    };

    const handleBet = async (type, amount) => {
      try {
        if (!round) {
          round = await db.createRound(session.id);
        }
        const settingOnTime = methodSettings[times];
        if (settingOnTime.signalAmount == amount) {
          const result = await requestBet(type, amount);
          waitingResult = true;
          if (saveHistory) {
            const money = 0 - parseInt(amount || '0');
            log = await db.createLog(
              round.id,
              type,
              amount,
              money,
              null,
              'waiting'
            );
          }
          return result;
        }
      } catch (error) {
        throw error;
      }
    };

    const handleResult = async (result) => {
      try {
        const settingOnTime = methodSettings[times];
        if (waitingResult) {
          let money = log.money;
          if (result == 'WIN') {
            consecutiveWins += 1;
            times = settingOnTime.winAction;
            money = (log.amount * 95) / 100;
            if (consecutiveWins === 2) {
              reset();
            }
          } else if (result == 'LOSE') {
            consecutiveWins = 0;
            times = settingOnTime.loseAction;
          }
          if (saveHistory) {
            await db.updateLog(log.id, { status: 'success', result, money });
          }
        }
      } catch (error) {
        throw error;
      }
    };

    socket.on('signal', ({ amount, type }) => {
      handleBet(type, amount);
    });

    socket.on('result', ({ result }) => {
      handleResult(result);
    });
  } catch (error) {
    throw error;
  }
};

const startTrading = async (options, socket) => {
  try {
    const { methods } = options;

    const tasks = methods.map((method) => {
      switch (method) {
        case '0': {
          const methodSettings = method1Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '1': {
          const methodSettings = method1Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '2': {
          const methodSettings = method2Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '3': {
          const methodSettings = method3Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '4': {
          const methodSettings = method4Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '5': {
          const methodSettings = method5Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '6': {
          const methodSettings = method6Settings;
          return handleTrading(options, socket, methodSettings);
        }
        case '7': {
          const methodSettings = method7Settings;
          return handleTrading(options, socket, methodSettings);
        }
        default:
          return null;
      }
    });
    const results = await Promise.all(tasks);
    return results;
  } catch (error) {
    throw error;
  }
};

export default startTrading;
