import random from 'lodash/random';
import toString from 'lodash/toString';

import store from './store';

const fetch = require('node-fetch').default;

const slep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const renewAccessToken = async (token) => {
  try {
    // console.log('-----------  Start renew access token ------------------');
    // console.log('token', token);
    // console.log(
    //   '-----------------------------------------------------------------'
    // );
    await slep(random(1000, 3000));
    const response = await fetch('https://wefinex.net/api/auth/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'Botrade',
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        // console.log(
        //   '-----------  renew access token 200 but error ------------------'
        // );
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
        throw new Error(data.m);
      }
      store.set('access_token', toString(data.d.access_token));
      store.set('refresh_token', toString(data.d.refresh_token));
      // console.log('-----------  renew access token 200 ------------------');
      // console.log('response data', data);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      return data.d;
    } else {
      // console.log('----------- renew access token !200 ------------------');
      // console.log('response', response);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (token) => {
  try {
    // console.log('-----------  Start get profile ------------------');
    const t = token || {};
    if (!token.access_token || !token.refresh_token) {
      const access_token = store.get('access_token');
      const refresh_token = store.get('refresh_token');
      if (access_token && refresh_token) {
        t.access_token = toString(access_token);
        t.refresh_token = toString(refresh_token);
        // console.log(
        //   '-----------  restore access token from store ------------------'
        // );
        // console.log('access_token', t.access_token);
        // console.log('refresh_token', t.refresh_token);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
      }
    } else {
      store.set('access_token', t.access_token);
      store.set('refresh_token', t.refresh_token);
      // console.log('-----------  save access token to store ------------------');
      // console.log('access_token', t.access_token);
      // console.log('refresh_token', t.refresh_token);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
    }
    const response = await fetch('https://wefinex.net/api/auth/me/profile', {
      headers: {
        authorization: `Bearer ${t.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.m);
        // console.log(
        //   '-----------  get profile 200 but error ------------------'
        // );
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
      }
      // store.set('access_token', token.access_token);
      // store.set('refresh_token', token.refresh_token);
      // console.log('-----------  get profile 200 ------------------');
      // console.log('response data', data);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      return data.d;
    } else if (response.status === 401) {
      // console.log('-----------  get profile 401 ------------------');
      // console.log('response', response);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      await renewAccessToken(token);
      // console.log('newToken', newToken);
      await getProfile({});
    }
  } catch (error) {
    throw error;
  }
};

export const getBalance = async () => {
  try {
    await slep(random(500, 2000));
    const access_token = toString(store.get('access_token'));
    const refresh_token = toString(store.get('refresh_token'));
    // console.log('-----------  Start get balance ------------------');
    // console.log('access_token', access_token);
    // console.log('refresh_token', refresh_token);
    // console.log(
    //   '-----------------------------------------------------------------'
    // );
    const response = await fetch(
      'https://wefinex.net/api/wallet/binaryoption/bo-balance',
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.m);
      }
      return data.d;
    } else if (response.status === 401) {
      await renewAccessToken({
        access_token,
        refresh_token,
      });
      await getBalance();
    }
  } catch (error) {
    throw error;
  }
};

export const bet = async (type, amount) => {
  try {
    await slep(random(1000, 5000));
    const access_token = toString(store.get('access_token'));
    const refresh_token = toString(store.get('refresh_token'));

    const response = await fetch(
      'https://wefinex.net/api/wallet/binaryoption/bet',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          betType: type,
          betAmount: amount,
          betAccountType:
            process.env.NODE_ENV === 'development' ? 'DEMO' : 'LIVE',
        }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        console.log('error data', data);
        throw new Error(data.m);
      }
      return data.d;
    } else if (response.status === 401) {
      await renewAccessToken({
        access_token,
        refresh_token,
      });
      await bet(type, amount);
    }
  } catch (error) {
    throw error;
  }
};
