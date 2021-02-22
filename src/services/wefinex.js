const fetch = require('node-fetch');

class WefinexServices {
  renewAccessToken = async (token) => {
    try {
      const response = await fetch('https://wefinex.net/api/auth/auth/token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: 'Botrade',
          grant_type: 'refresh_token',
          refresh_token: `${token.refresh_token}`,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw error;
    }
  };

  getProfile = async (token) => {
    try {
      const response = await fetch('https://wefinex.net/api/auth/me/profile', {
        headers: {
          authorization: `Bearer ${token.access_token}`,
        },
      });
      console.log('response', response);
      if (response.status === 200) {
        const data = await response.json();
        return { data, token };
      } else if (response.status === 401) {
        const newToken = await this.renewAccessToken(token);
        this.getProfile(newToken.access_token);
      }
    } catch (error) {
      throw error;
    }
  };

  getBlance = async () => {};

  bet = async () => {};
}

export default new WefinexServices();
