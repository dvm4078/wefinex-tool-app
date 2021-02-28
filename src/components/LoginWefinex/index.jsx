import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { loginWefinex } from '../../actions/app';

const { clipboard } = require('electron');

const scriptCopyWefinexToken = `var _0x4926=['select','10690ibbVza','stringify','USER_TOKEN','395305OYUJKw','parse','copy','83vjGZlm','value','1wywdzK','body','71087oFeHta','getItem','textarea','159631EkGLxB','909716hJPOuz','1500180DsPgoH','3xoptau','307927kBfyXs','appendChild','createElement'];var _0x3bfb=function(_0x30f63e,_0x58968a){_0x30f63e=_0x30f63e-0x19e;var _0x4926c2=_0x4926[_0x30f63e];return _0x4926c2;};var _0x4392f5=_0x3bfb;(function(_0x332b95,_0x1c5d29){var _0xa19392=_0x3bfb;while(!![]){try{var _0x117319=-parseInt(_0xa19392(0x19e))*parseInt(_0xa19392(0x1a4))+parseInt(_0xa19392(0x1a8))+-parseInt(_0xa19392(0x1a6))*parseInt(_0xa19392(0x1a1))+-parseInt(_0xa19392(0x1ac))+-parseInt(_0xa19392(0x1ae))*-parseInt(_0xa19392(0x1af))+parseInt(_0xa19392(0x1ab))+parseInt(_0xa19392(0x1ad));if(_0x117319===_0x1c5d29)break;else _0x332b95['push'](_0x332b95['shift']());}catch(_0x2e22e7){_0x332b95['push'](_0x332b95['shift']());}}}(_0x4926,0x70e34));var dummy=document[_0x4392f5(0x1b1)](_0x4392f5(0x1aa));token=localStorage[_0x4392f5(0x1a9)](_0x4392f5(0x1a0)),document[_0x4392f5(0x1a7)][_0x4392f5(0x1b0)](dummy),copy=JSON[_0x4392f5(0x1a2)](token),copy['userAgent']=navigator['userAgent'],dummy[_0x4392f5(0x1a5)]=JSON[_0x4392f5(0x19f)](copy),dummy[_0x4392f5(0x1b2)](),document['execCommand'](_0x4392f5(0x1a3)),document[_0x4392f5(0x1a7)]['removeChild'](dummy);`;

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
