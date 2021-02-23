import store from './store';

const fetch = require('node-fetch');

class WefinexServices {
  renewAccessToken = async (token) => {
    try {
      const response = await fetch('https://wefinex.net/api/auth/auth/token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: 'Botrade',
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
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

  getProfile = async (token) => {
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
        store.set('access_token', token.access_token);
        store.set('refresh_token', token.refresh_token);
        return data.d;
      } else if (response.status === 401) {
        const newToken = await this.renewAccessToken(token);
        this.getProfile(newToken);
      }
    } catch (error) {
      throw error;
    }
  };

  getBlance = async () => {
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
        return data.d;
      } else if (response.status === 401) {
        await this.renewAccessToken({
          access_token,
          refresh_token,
        });
        this.getBlance();
      }
    } catch (error) {
      throw error;
    }
  };

  bet = async (type, amount) => {
    try {
      const access_token = store.get('access_token');
      const refresh_token = store.get('refresh_token');
      const response = await fetch(
        'https://wefinex.net/api/wallet/binaryoption/bet',
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            betType: type,
            betAmount: amount,
            betAccountType: 'LIVE',
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        return data.d;
      } else if (response.status === 401) {
        await this.renewAccessToken({
          access_token,
          refresh_token,
        });
        this.bet(type, amount);
      }
    } catch (error) {
      throw error;
    }
  };
}

export default new WefinexServices();
