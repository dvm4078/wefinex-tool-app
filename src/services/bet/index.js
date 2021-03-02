import method1Settings from './settings/method1';
import method2Settings from './settings/method2';
import method3Settings from './settings/method3';
import method4Settings from './settings/method4';
import method5Settings from './settings/method5';
import method6Settings from './settings/method6';
import method7Settings from './settings/method7';

import { bet as requestBet, getBalance } from '../wefinex';
import db from '../../database';

const handleTrading = async (
  options,
  socket,
  mainWindow,
  methodSettings,
  methodName,
  method
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
      withWefinex,
    } = options;
    let isStop = false;

    let isAllowBet = true;
    if (
      (method == '1' &&
        startWhenTakeProfitTimes &&
        startWhenTakeProfitTimesValue) ||
      (startWhenStopLossTimes && startWhenStopLossTimesValue)
    ) {
      isAllowBet = false;
    }

    let session = null;
    let round = null;
    let log = null;

    if (saveHistory) {
      session = await db.createSession(methodName, username);
    }

    let consecutiveWins = 0;

    let times = 1;
    let winAmount = 0;

    const reset = () => {
      round = null;
      times = 1;
      consecutiveWins = 0;
    };

    const handleBet = async (type, amount) => {
      try {
        if (!isAllowBet || isStop) {
          return;
        }
        const settingOnTime = methodSettings[times];
        const realAmount = settingOnTime.amount * (betValue || 1);
        if (settingOnTime.signalAmount == amount) {
          if (saveHistory && !round && session) {
            round = await db.createRound(session.id);
          }
          let betType = type;
          if (methodSettings.isInverse) {
            if (type === 'UP') {
              betType = 'DOWN';
            } else {
              betType = 'UP';
            }
          }

          await requestBet(betType, realAmount, betAccountType);
          const money = 0 - parseInt(realAmount || '0');
          if (saveHistory && round) {
            log = await db.createLog(
              round.id,
              betType,
              realAmount,
              money,
              null,
              'waiting'
            );
          } else {
            log = {
              money,
              amount: realAmount,
            };
          }
        }
      } catch (error) {
        mainWindow.webContents.send('trading-status', {
          error: true,
          message: `Lỗi khi vào lệnh ${error.message}`,
        });
      }
    };

    let lanThang = 0;
    let lanThua = 0;
    const handleResult = async (result) => {
      try {
        if (methodSettings.isInverse) {
          if (result === 'WIN') {
            result = 'LOSE';
          } else {
            result = 'WIN';
          }
        }
        if (!isAllowBet) {
          if (result === 'WIN') {
            lanThang += 1;
          } else {
            lanThua += 1;
          }
          if (
            startWhenTakeProfitTimes &&
            startWhenTakeProfitTimesValue &&
            startWhenTakeProfitTimesValue == lanThang
          ) {
            lanThang = 0;
            isAllowBet = true;
          }
          if (
            startWhenStopLossTimes &&
            startWhenStopLossTimesValue &&
            startWhenStopLossTimesValue == lanThua
          ) {
            lanThua = 0;
            isAllowBet = true;
          }
        }

        const settingOnTime = methodSettings[times];

        if (!log) {
          return;
        }

        /* RAW */
        let money = log.money;
        if (result === 'WIN') {
          times = settingOnTime.winAction;
          money = (log.amount * 95) / 100;
          winAmount += money;

          if (saveHistory && log) {
            await db.updateLog(log.id, { status: 'success', result, money });
            // log = null;
          }

          /* Xủ lý chốt lãi */
          if (method == '1' && takeProfit && takeProfitValue) {
            let winValue = winAmount;
            if (withWefinex) {
              const balance = await getBalance();
              if (betAccountType === 'LIVE') {
                winValue = balance.availableBalance - initialBalance;
              } else {
                winValue = balance.demoBalance - initialBalance;
              }
            }

            if (takeProfitType == '%') {
              winValue = (winValue / initialBalance) * 100;
            }
            if (winValue >= takeProfitValue) {
              if (startWhenTakeProfit) {
                if (saveHistory) {
                  session = await db.createSession(methodName, username);
                }
                winAmount = 0;
                reset();
              } else {
                isStop = true;
                mainWindow.webContents.send('trading-status', {
                  completeMethod: method,
                  error: false,
                  message: `Đã chốt lãi ${methodName}`,
                });
              }
            }
          }
          /* Kết thúc xủ lý chốt lãi */

          consecutiveWins += 1;
        } else if (result === 'LOSE') {
          winAmount += money;
          times = settingOnTime.loseAction;

          if (saveHistory && log) {
            await db.updateLog(log.id, { status: 'success', result, money });
            // log = null;
          }

          /* Xử lý chốt lỗ */
          if (method == '1' && stopLoss && stopLossValue) {
            let lossValue = winAmount;
            if (withWefinex) {
              const balance = await getBalance();
              if (betAccountType === 'LIVE') {
                lossValue = balance.availableBalance - initialBalance;
              } else {
                lossValue = balance.demoBalance - initialBalance;
              }
            }
            if (lossValue < 0) {
              lossValue = Math.abs(lossValue);
              if (stopLossType == '%') {
                lossValue = (lossValue / initialBalance) * 100;
              }
              if (lossValue >= stopLossValue) {
                if (startWhenStopLoss) {
                  if (saveHistory) {
                    session = await db.createSession(methodName, username);
                  }
                  winAmount = 0;
                  reset();
                } else {
                  isStop = true;
                  mainWindow.webContents.send('trading-status', {
                    completeMethod: method,
                    error: false,
                    message: `Đã chốt lỗ ${methodName}`,
                  });
                }
              }
            }
          }
          /* Kết thúc xử lý chốt lỗ */

          consecutiveWins = 0;
        }
        log = null;
        if (consecutiveWins === 2) {
          reset();
        }
        if (times === 1) {
          reset();
        }
        mainWindow.webContents.send('end-bet', '');
      } catch (error) {
        console.error(error);
        mainWindow.webContents.send('trading-status', {
          error: true,
          message: `Lỗi khi xử lý kết quả ${error.message}`,
        });
      }
    };

    socket.on('signal', ({ amount, type }) => {
      handleBet(type, amount);
    });

    socket.on('result', ({ result }) => {
      handleResult(result);
    });
  } catch (error) {
    mainWindow.webContents.send('trading-status', {
      error: true,
      message: `Lỗi khi khởi tạo phương pháp vào lệnh ${error.message}`,
    });
  }
};

const startTrading = async (options, socket, mainWindow) => {
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
            method
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
            method
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
            method
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
            method
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
            method
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
            method
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
            method
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
            method
          );
        }
        default:
          return null;
      }
    });
    const results = await Promise.all(tasks);
    return results;
  } catch (error) {
    mainWindow.webContents.send('trading-status', {
      forceStop: true,
      error: true,
      message: `Lỗi ${error.message}`,
    });
    if (socket) {
      socket.close();
      socket = null;
    }
  }
};

export default startTrading;
