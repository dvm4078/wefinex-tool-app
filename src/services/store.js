const Store = require('electron-store');

const schema = {
  access_token: {
    type: 'string',
  },
  refresh_token: {
    type: 'string',
  },
};

const store = new Store({ schema });

export default store;
