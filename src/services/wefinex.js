import toString from 'lodash/toString';

import store from './store';

const fetch = require('node-fetch').default;

export const renewAccessToken = async (token) => {
  try {
    // console.log('-----------  Start renew access token ------------------');
    // console.log('refresh_token', token.refresh_token);
    // console.log(
    //   '-----------------------------------------------------------------'
    // );
    const response = await fetch('https://wefinex.net/api/auth/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://wefinex.net',
        referer: 'https://wefinex.net/index',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': store.get('userAgent'),
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
        //   '-----------  renew access token 200 with error ------------------'
        // );
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
        throw new Error(data.m);
      }
      store.set('access_token', toString(data.d.access_token));
      store.set('refresh_token', toString(data.d.refresh_token));
      // console.log(
      //   '-----------  renew access token success 200 ------------------'
      // );
      // console.log('access_token', data.d.access_token);
      // console.log('refresh_token', data.d.refresh_token);
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
    // console.log('access_token', token.access_token);
    // console.log('refresh_token', token.refresh_token);
    // console.log('-----------  ---------------- ------------------');
    const t = token || {};
    if (!t.access_token || !t.refresh_token) {
      const access_token = store.get('access_token');
      const refresh_token = store.get('refresh_token');
      if (access_token && refresh_token) {
        t.access_token = access_token;
        t.refresh_token = refresh_token;
        // console.log(
        //   '-----------  restore access token from store ------------------'
        // );
        // console.log('access_token', t.access_token);
        // console.log('refresh_token', t.refresh_token);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
      } else {
        throw new Error('Vui lòng đăng nhập Wefinex');
      }
    } else {
      store.set('access_token', t.access_token);
      store.set('refresh_token', t.refresh_token);
      store.set('userAgent', t.userAgent);
      // console.log('-----------  save access token to store ------------------');
      // console.log('access_token', t.access_token);
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
        //   '-----------  get profile 200 with error ------------------'
        // );
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
      }
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
      // await slep(random(1000, 1000));
      // console.log('newToken', newToken);
      const data = await getProfile({});
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const getBalance = async () => {
  try {
    // await slep(random(500, 2000));
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
        // console.log(
        //   '-----------  Get balance 200 with error ------------------'
        // );
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
      }
      // console.log('-----------  get balance 200 ------------------');
      // console.log('response data', data);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      return data.d;
    } else if (response.status === 401) {
      // console.log('-----------  get balance 401 ------------------');
      // console.log('response', response);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      await renewAccessToken({
        access_token,
        refresh_token,
      });
      // await slep(random(1000, 1000));
      const data = await getBalance();
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const bet = async (type, amount, betAccountType) => {
  try {
    const access_token = toString(store.get('access_token'));
    const refresh_token = toString(store.get('refresh_token'));

    // console.log('-----------  Start bet ------------------');
    // console.log('access_token', access_token);
    // console.log('refresh_token', refresh_token);
    // console.log(
    //   '-----------------------------------------------------------------'
    // );

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
          betAccountType,
        }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        // console.log('-----------  start bet 200 with error ------------------');
        // console.log('response data', data);
        // console.log(
        //   '-----------------------------------------------------------------'
        // );
        throw new Error(data.m);
      }
      // console.log('-----------  bet 200 ------------------');
      // console.log('response data', data);
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      return data.d;
    } else if (response.status === 401) {
      // console.log('-----------  bet balance 401 ------------------');
      // console.log(
      //   '-----------------------------------------------------------------'
      // );
      await renewAccessToken({
        access_token,
        refresh_token,
      });
      // await slep(random(1000, 1000));
      const data = await bet(type, amount, betAccountType);
      return data;
    }
  } catch (error) {
    throw error;
  }
};
