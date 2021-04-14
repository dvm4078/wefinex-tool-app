import includes from 'lodash/includes';
import values from 'lodash/values';
import isObject from 'lodash/isObject';

import method1Settings from './settings/method1';
import method2Settings from './settings/method2';
import method3Settings from './settings/method3';
import method4Settings from './settings/method4';
import method5Settings from './settings/method5';
import method6Settings from './settings/method6';
import method7Settings from './settings/method7';
import method8Settings from './settings/method8';
import method9Settings from './settings/method9';
import method10Settings from './settings/method10';
import method11Settings from './settings/method11';
import method12Settings from './settings/method12';
import method13Settings from './settings/method13';
import method14Settings from './settings/method14';
import method15Settings from './settings/method15';
import method16Settings from './settings/method16';
import method17Settings from './settings/method17';
import method18Settings from './settings/method18';
import method19Settings from './settings/method19';
import method20Settings from './settings/method20';
import method21Settings from './settings/method21';
import method22Settings from './settings/method22';
import method23Settings from './settings/method23';
import method24Settings from './settings/method24';
import method25Settings from './settings/method25';
import method26Settings from './settings/method26';
import method27Settings from './settings/method27';
import method28Settings from './settings/method28';
import method29Settings from './settings/method29';
import method30Settings from './settings/method30';

import riskReductionMethod1Settings from './riskReductionSettings/method1';
import riskReductionMethod2Settings from './riskReductionSettings/method2';
import riskReductionMethod3Settings from './riskReductionSettings/method3';
import riskReductionMethod4Settings from './riskReductionSettings/method4';

import { bet as requestBet, getBalance } from '../wefinex';
import db from '../../database';

const getRiskReductionSettings = (riskReductionMethod) => {
  switch (riskReductionMethod) {
    case '1':
      return riskReductionMethod1Settings;
    case '2':
      return riskReductionMethod2Settings;
    case '3':
      return riskReductionMethod3Settings;
    case '4':
      return riskReductionMethod4Settings;

    default:
      break;
  }
};

const checkReductionMethod = (method, options, methodSettings) => {
  const {
    riskReduction1Methods,
    riskReduction1Value,
    riskReduction2Methods,
    riskReduction2Value,
    riskReduction3Methods,
    riskReduction3Value,
    riskReduction4Methods,
    riskReduction4Value,
  } = options;
  if (includes(riskReduction1Methods, method) && riskReduction1Value) {
    return {
      method: '1',
      value: riskReduction1Value,
      signal: methodSettings.commonSignal,
    };
  } else if (includes(riskReduction2Methods, method) && riskReduction2Value) {
    return {
      method: '2',
      value: riskReduction2Value,
      signal: methodSettings.commonSignal,
    };
  } else if (includes(riskReduction3Methods, method) && riskReduction3Value) {
    return {
      method: '3',
      value: riskReduction3Value,
      signal: methodSettings.commonSignal,
    };
  } else if (includes(riskReduction4Methods, method) && riskReduction4Value) {
    return {
      method: '5',
      value: riskReduction4Value,
      signal: methodSettings.commonSignal,
    };
  } else {
    return {};
  }
};

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
      startWhenTakeProfit,
      startWhenStopLoss,
      saveHistory,
      initialBalance,
      username,
      withWefinex,
      totalStopLossValue,
      totalTakeProfitValue,
    } = options;
    let isStop = false;

    let isAllowBet = true;

    const {
      method: riskReductionMethod,
      value: riskReductionValue,
      signal: riskReductionSignal,
    } = checkReductionMethod(method, options, methodSettings);
    // console.log(
    //   'checkReductionMethod(method, options, methodSettings)',
    //   checkReductionMethod(method, options, methodSettings)
    // );
    if (riskReductionMethod && riskReductionValue) {
      // recheck
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
    let virtualTime = 1;
    let winAmount = 0;

    const reset = () => {
      round = null;
      times = 1;
      consecutiveWins = 0;
    };

    let isVirtualBetting = false;

    const riskReductionSettings = getRiskReductionSettings(riskReductionMethod);
    // console.log('riskReductionSettings', riskReductionSettings);

    const handleVirtualBet = (amount) => {
      if (isAllowBet) {
        return;
      }
      const settingOnTime = riskReductionSettings[virtualTime];
      const signalAmount = riskReductionSignal || settingOnTime.signalAmount;
      isVirtualBetting =
        signalAmount == amount || riskReductionSettings.withSignal;
      // console.log(
      //   '-------------------handle virtual bet-------------------------'
      // );
      // console.log('settingOnTime.signalAmount', settingOnTime.signalAmount);
      // console.log('amount', amount);
      // console.log(
      //   ' riskReductionSettings.withSignal',
      //   riskReductionSettings.withSignal
      // );
      // console.log(' isVirtualBetting', isVirtualBetting);
      // console.log('');
    };

    let winNum = 0;
    let loseNum = 0;
    let fNum = 0;

    const checkRiskReduction = (result) => {
      if (isAllowBet) {
        return;
      }
      // console.log(
      //   '-------------------check risk reducation-------------------------'
      // );
      // console.log('riskReductionValue', riskReductionValue);
      // console.log('isVirtualBetting', isVirtualBetting);
      if (!isVirtualBetting) {
        return;
      }
      const settingOnTime = riskReductionSettings[virtualTime];
      // console.log('settingOnTime', settingOnTime);
      isVirtualBetting = false;
      let rs = result;

      if (riskReductionSettings.isInverse) {
        if (result === 'WIN') {
          rs = 'LOSE';
        } else {
          rs = 'WIN';
        }
      }

      // console.log('result', result);

      if (riskReductionSettings.withTime) {
        // console.log('with time');
        if (rs === 'WIN') {
          winNum += 1;
          loseNum = 0;
        } else {
          winNum = 0;
          loseNum += 1;
        }
        // console.log('winNum', winNum);
        // console.log('loseNum', loseNum);
        // console.log('riskReductionValue', riskReductionValue);
        if (loseNum == riskReductionValue) {
          // console.log('start bet');
          isAllowBet = true;
          loseNum = 0;
        }
        return;
      }
      if (rs === 'WIN') {
        virtualTime = settingOnTime.winAction;
        // console.log('virtualTime', virtualTime);
      } else {
        virtualTime = settingOnTime.loseAction;
        // console.log('virtualTime', virtualTime);
        // winNum = 0;
        // loseNum += 1;
        if (virtualTime == 1) {
          // loseNum = 0;
          fNum += 1;
          // console.log('fNum', fNum);
          // console.log('riskReductionValue', riskReductionValue);
          if (fNum == riskReductionValue) {
            // console.log('start betting');
            fNum = 0;
            isAllowBet = true;
          }
        }
      }

      // if (loseNum == riskReductionSettings.times - 1) {
      //   loseNum = 0;
      //   fNum += 1;
      //   if (fNum == riskReductionValue) {
      //     fNum = 0;
      //     isAllowBet = true;
      //   }
      // }
    };

    const handleBet = async (type, amount) => {
      try {
        handleVirtualBet(amount);
        if (!isAllowBet || isStop) {
          return;
        }
        const settingOnTime = methodSettings[times];
        let realAmount = settingOnTime.amount * (betValue || 1);
        if (methodSettings.withSignal) {
          const stot =
            values(methodSettings).find(
              (_stot) => isObject(_stot) && _stot.signalAmount == amount
            ) || {};
          if (stot.amount) {
            realAmount = stot.amount;
          } else {
            realAmount = amount;
          }
        }
        if (settingOnTime.signalAmount == amount || methodSettings.withSignal) {
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
          const money = 0 - parseFloat(realAmount || '0');
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

    const handleResult = async (result) => {
      try {
        checkRiskReduction(result);
        if (methodSettings.isInverse) {
          if (result === 'WIN') {
            result = 'LOSE';
          } else {
            result = 'WIN';
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
          winAmount -= money;
          global.winAmount = global.winAmount || 0 - money;

          if (saveHistory && log) {
            await db.updateLog(log.id, { status: 'success', result, money });
            // log = null;
          }

          /* Xủ lý chốt lãi */
          if (
            (withWefinex || method == '1') &&
            takeProfit &&
            (takeProfitValue || totalTakeProfitValue)
          ) {
            let winValue = totalTakeProfitValue ? global.winAmount : winAmount;
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
                if (riskReductionMethod && riskReductionValue) {
                  isAllowBet = false;
                }
                // lanThang = 0;
                // lanThua = 0;
                reset();
              } else {
                // eslint-disable-next-line
                if (withWefinex) {
                  socket.close();
                  socket = null;
                  mainWindow.webContents.send('trading-status', {
                    forceStop: true,
                    error: false,
                    message: `Đã đạt giới hạn chốt lãi`,
                  });
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
          }
          /* Kết thúc xủ lý chốt lãi */

          consecutiveWins += 1;
        } else if (result === 'LOSE') {
          winAmount += money;
          global.winAmount = global.winAmount || 0 + money;
          times = settingOnTime.loseAction;

          if (saveHistory && log) {
            await db.updateLog(log.id, { status: 'success', result, money });
            // log = null;
          }

          /* Xử lý chốt lỗ */
          if (
            (withWefinex || method == '1') &&
            stopLoss &&
            (stopLossValue || totalStopLossValue)
          ) {
            let lossValue = totalStopLossValue ? global.winAmount : winAmount;
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
                  if (riskReductionMethod && riskReductionValue) {
                    isAllowBet = false;
                  }
                  // lanThang = 0;
                  // lanThua = 0;
                  reset();
                } else {
                  // eslint-disable-next-line
                  if (withWefinex) {
                    socket.close();
                    socket = null;
                    mainWindow.webContents.send('trading-status', {
                      forceStop: true,
                      error: false,
                      message: `Đã đạt giới hạn chốt lỗ`,
                    });
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
          }
          /* Kết thúc xử lý chốt lỗ */

          consecutiveWins = 0;
        }
        log = null;
        if (
          methodSettings.consecutiveWins &&
          methodSettings.consecutiveWins === consecutiveWins
        ) {
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
          const methodName = 'QLV1 - Phương pháp 1';
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
          const methodName = 'QLV1 - Phương pháp 2';
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
          const methodName = 'QLV1 - Phương pháp 3';
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
          const methodName = 'QLV1 - Phương pháp 4';
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
          const methodName = 'QLV1 - Phương pháp 5';
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
          const methodName = 'QLV1 - Phương pháp 6';
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
          const methodName = 'QLV4 - Phương pháp 1';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '8': {
          const methodSettings = method8Settings;
          const methodName = 'QLV2 - Phương pháp 1';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '9': {
          const methodSettings = method9Settings;
          const methodName = 'QLV2 - Phương pháp 2';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '10': {
          const methodSettings = method10Settings;
          const methodName = 'QLV2 - Phương pháp 3';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '11': {
          const methodSettings = method11Settings;
          const methodName = 'QLV2 - Phương pháp 4';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '12': {
          const methodSettings = method12Settings;
          const methodName = 'QLV2 - Phương pháp 5';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '13': {
          const methodSettings = method13Settings;
          const methodName = 'QLV2 - Phương pháp 6';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '14': {
          const methodSettings = method14Settings;
          const methodName = 'QLV4 - Phương pháp 2';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '15': {
          const methodSettings = method15Settings;
          const methodName = 'QLV3 - Phương pháp 1';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '16': {
          const methodSettings = method16Settings;
          const methodName = 'QLV3 - Phương pháp 2';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '17': {
          const methodSettings = method17Settings;
          const methodName = 'QLV3 - Phương pháp 3';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '18': {
          const methodSettings = method18Settings;
          const methodName = 'QLV3 - Phương pháp 4';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '19': {
          const methodSettings = method19Settings;
          const methodName = 'QLV3 - Phương pháp 5';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '20': {
          const methodSettings = method20Settings;
          const methodName = 'QLV3 - Phương pháp 6';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '21': {
          const methodSettings = method21Settings;
          const methodName = 'Săn rồng 2';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '22': {
          const methodSettings = method22Settings;
          const methodName = 'Săn rồng 3';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '23': {
          const methodSettings = method23Settings;
          const methodName = 'Săn rồng 4';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '24': {
          const methodSettings = method24Settings;
          const methodName = 'Săn rồng 5';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '25': {
          const methodSettings = method25Settings;
          const methodName = 'Săn rồng 6';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '26': {
          const methodSettings = method26Settings;
          const methodName = 'Săn rồng 2 ngược';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '27': {
          const methodSettings = method27Settings;
          const methodName = 'Săn rồng 3 ngược';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '28': {
          const methodSettings = method28Settings;
          const methodName = 'Săn rồng 4 ngược';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '29': {
          const methodSettings = method29Settings;
          const methodName = 'Săn rồng 5 ngược';
          return handleTrading(
            options,
            socket,
            mainWindow,
            methodSettings,
            methodName,
            method
          );
        }
        case '30': {
          const methodSettings = method30Settings;
          const methodName = 'Săn rồng 6 ngược';
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
