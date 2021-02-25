import store from './store';

const fetch = require('node-fetch');

export const renewAccessToken = async (token) => {
  try {
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
        throw new Error(data.m);
      }
      store.set('access_token', data.d.access_token);
      store.set('refresh_token', data.d.refresh_token);
      return data.d;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (token) => {
  try {
    if (!token.access_token || !token.refresh_token) {
      const access_token = store.get('access_token');
      const refresh_token = store.get('refresh_token');
      if (access_token && refresh_token) {
        token.access_token = access_token;
        token.refresh_token = refresh_token;
      }
      console.log('new token', token);
    }
    const response = await fetch('https://wefinex.net/api/auth/me/profile', {
      headers: {
        authorization: `Bearer ${token.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.m);
      }
      store.set('access_token', token.access_token);
      store.set('refresh_token', token.refresh_token);
      return data.d;
    } else if (response.status === 401) {
      await renewAccessToken(token);
      // console.log('newToken', newToken);
      getProfile({});
    }
  } catch (error) {
    throw error;
  }
};

export const getBalance = async () => {
  try {
    const access_token = store.get('access_token');
    const refresh_token = store.get('refresh_token');
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
      getBalance();
    }
  } catch (error) {
    throw error;
  }
};

export const bet = async (type, amount) => {
  try {
    const access_token = store.get('access_token');
    const refresh_token = store.get('refresh_token');
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
    console.log('type', type);
    console.log('amount', amount);
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
      bet(type, amount);
    }
  } catch (error) {
    throw error;
  }
};
