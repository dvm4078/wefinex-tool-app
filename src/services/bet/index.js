import method1Settings from './settings/method1';
import method2Settings from './settings/method2';
import method3Settings from './settings/method3';
import method4Settings from './settings/method4';
import method5Settings from './settings/method5';
import method6Settings from './settings/method6';
import method7Settings from './settings/method7';

import { bet as requestBet } from '../wefinex';
import db from '../../database';

const handleTrading = async (
  options,
  socket,
  mainWindow,
  methodSettings,
  methodName,
  stopTrade
) => {
  try {
    const {
      betAccountType,
      methods,
      betValue,
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
      initialBalance,
      username,
    } = options;

    let session = null;
    let round = null;
    let log = null;

    if (saveHistory) {
      session = await db.createSession(methodName, username);
    }

    let consecutiveWins = 0;

    let times = 1;
    let timesWin = 0;
    let timesLose = 0;
    let winAmount = 0;
    let loseAmount = 0;

    let waitingResult = false;

    const reset = () => {
      round = null;
      // log = null;
      times = 1;
      timesWin = 0;
      timesLose = 0;
      // waitingResult = false;
      consecutiveWins = 0;
      winAmount = 0;
      loseAmount = 0;
    };

    const handleBet = async (type, amount) => {
      try {
        if (saveHistory && !round && session) {
          round = await db.createRound(session.id);
        }
        const settingOnTime = methodSettings[times];
        const realAmount = amount * settingOnTime.amount * (betValue || 1);
        if (settingOnTime.signalAmount == amount) {
          const result = await requestBet(type, realAmount, betAccountType);
          waitingResult = true;
          if (saveHistory && round) {
            const money = 0 - parseInt(realAmount || '0');
            log = await db.createLog(
              round.id,
              type,
              realAmount,
              money,
              null,
              'waiting'
            );
          }
          return result;
        }
      } catch (error) {
        stopTrade();
        mainWindow.webContents.send('trading-error', error.message);
        throw error;
      }
    };

    const handleResult = async (result) => {
      try {
        const settingOnTime = methodSettings[times];
        if (waitingResult && log) {
          let money = log.money;
          if (result === 'WIN') {
            consecutiveWins += 1;
            timesWin += 1;
            times = settingOnTime.winAction;
            money = (log.amount * 95) / 100;
            winAmount += money;
            if (takeProfit && takeProfitValue) {
              let winValue = winAmount;
              if (takeProfitType == '%') {
                winValue = (winValue / initialBalance) * 100;
                if (winValue === takeProfitValue) {
                  socket.close();
                }
              }
            }
            if (
              startWhenTakeProfitTimes &&
              startWhenTakeProfitTimesValue &&
              startWhenTakeProfitTimesValue == timesWin
            ) {
              reset();
            }
            if (consecutiveWins === 2) {
              reset();
            }
            if (times === 1) {
              reset();
            }
          } else if (result === 'LOSE') {
            timesLose += 1;
            loseAmount -= money;
            if (stopLoss && stopLossValue) {
              let lossValue = loseAmount;
              if (stopLossType == '%') {
                lossValue = (lossValue / initialBalance) * 100;
                if (lossValue === stopLossValue) {
                  socket.close();
                }
              }
            }
            if (
              startWhenStopLossTimes &&
              startWhenStopLossTimesValue &&
              startWhenStopLossTimesValue == timesLose
            ) {
              reset();
            }
            consecutiveWins = 0;
            times = settingOnTime.loseAction;
            if (times === 1) {
              reset();
            }
          }
          if (saveHistory && log) {
            await db.updateLog(log.id, { status: 'success', result, money });
            log = null;
          }
          mainWindow.webContents.send('end-bet', '');
          waitingResult = false;
        }
      } catch (error) {
        stopTrade();
        mainWindow.webContents.send('trading-error', error.message);
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
    stopTrade();
    throw error;
  }
};

const startTrading = async (options, socket, mainWindow, stopTrade) => {
  try {
    const { methods } = options;

    const tasks = methods.map((method) => {
      switch (method) {
        case '0': {
          const methodSettings = method1Settings;
          const methodName = 'Phương pháp tổng hợp';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '1': {
          const methodSettings = method1Settings;
          const methodName = 'Phương pháp 1';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '2': {
          const methodSettings = method2Settings;
          const methodName = 'Phương pháp 2';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '3': {
          const methodSettings = method3Settings;
          const methodName = 'Phương pháp 3';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '4': {
          const methodSettings = method4Settings;
          const methodName = 'Phương pháp 4';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '5': {
          const methodSettings = method5Settings;
          const methodName = 'Phương pháp 5';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '6': {
          const methodSettings = method6Settings;
          const methodName = 'Phương pháp 6';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        case '7': {
          const methodSettings = method7Settings;
          const methodName = 'Phương pháp 7';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            stopTrade
          );
        }
        default:
          return null;
      }
    });
    const results = await Promise.all(tasks);
    return results;
  } catch (error) {
    stopTrade();
    throw error;
  }
};

export default startTrading;
