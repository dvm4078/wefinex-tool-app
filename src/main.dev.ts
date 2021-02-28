/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import log from 'electron-log';
import { io } from 'socket.io-client';

import MenuBuilder from './menu';
import * as WefinexServices from './services/wefinex';
import store from './services/store';
import startTrading from './services/bet';

import { BASE_URL } from './constants/global';

// const fetch = require('node-fetch');

const db = require('./database');

db.sequelize.sync();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    // autoUpdater.logger = log;
    // autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let listened = false;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();

      let socket = null;

      const stopTrade = () => {
        if (socket) {
          socket.close();
          socket = null;
        }
      };

      if (!listened) {
        listened = true;
        ipcMain.on('start-trade', async (event, options) => {
          console.log('main start-trade', options);
          try {
            if (socket) {
              stopTrade();
            }
            socket = io.connect(BASE_URL, {
              reconnection: true,
              reconnectionDelay: 2000,
              reconnectionDelayMax: 60000,
              reconnectionAttempts: 'Infinity',
              timeout: 10000,
              query: `tid=${options.tid}`,
            });
            socket.on('connect', () => {
              event.reply('start-trade-reply', {
                success: true,
              });
            });
            startTrading(options, socket, mainWindow, stopTrade);
          } catch (error) {
            console.error(error);
            event.reply('start-trade-reply', {
              success: false,
              message: error.message,
            });
          }
        });

        ipcMain.on('stop-trade', async (event, options) => {
          console.log('main stop-trade', options);
          try {
            if (socket) {
              stopTrade();
              event.reply('stop-trade-reply', {
                success: true,
              });
            }
          } catch (error) {
            console.error(error);
            event.reply('stop-trade-reply', {
              success: false,
              message: error.message,
            });
          }
        });
        ipcMain.on('logout', async (event) => {
          stopTrade();
          store.delete('access_token');
          store.delete('refresh_token');
          store.delete('userAgent');
        });
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('before-quit', () => {
  store.delete('access_token');
  store.delete('refresh_token');
  store.delete('userAgent');
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('login-wefinex', async (event, token) => {
  // console.log('main login wefinex token', token);
  try {
    const result = await WefinexServices.getProfile(token);
    event.reply('login-wefinex-reply', {
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    event.reply('login-wefinex-reply', {
      success: false,
      message: error.message,
    });
  }
});

ipcMain.on('wefinex-get-balance', async (event) => {
  try {
    const result = await WefinexServices.getBalance();
    event.reply('wefinex-get-balance-reply', {
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    event.reply('wefinex-get-balance-reply', {
      success: false,
      message: error.message,
    });
  }
});

ipcMain.on('get-trading-log', async (event, params) => {
  try {
    const [count, rows] = await Promise.all([
      db.countSessions(params.username),
      db.readLogs(params.username, params.limit || 5, params.page || 1),
    ]);
    event.reply('get-trading-log-reply', {
      success: true,
      data: rows,
      total: count,
    });
  } catch (error) {
    console.error(error);
    event.reply('get-trading-log-reply', {
      success: false,
      message: error.message,
    });
  }
});
