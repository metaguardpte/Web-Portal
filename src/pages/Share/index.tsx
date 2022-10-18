import FormGroup from '@/components/Form/FormGroup';
import FormInput from '@/components/Form/FormInput';
import FormItem from '@/components/Form/FormItem';
import { FacebookOutlined, GithubOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Space, Input, Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import { AES } from '@/utils/crypto/cryptoUntity';
import ItemForm, { DataFormat } from './ItemForm';

const { Footer, Content } = Layout;


interface InfoFormat {
  needAuth: boolean
  encryptData: string,
  expires: string,
  data?: DataFormat
}


let itemId = '';
let secretKey = '';

const urlParams = history.location.pathname.split('/')
console.log(urlParams)
if (urlParams.length >= 4) {
  console.log(history)
  itemId = urlParams[2];
  secretKey = urlParams[3];
  console.log(urlParams)
}

secretKey = 'DE6316B15551E55B00B78E083F557E6B57DF5F04D83D00BDCEED5B666AD8E807'



const App: React.FC = () => {
  const [needAuth, setNeedAuth] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [data, setData] = useState<DataFormat>();



  const getShareInfo = async (code = 0) => {
    const info: InfoFormat = {
      needAuth: false,
      encryptData: "8E/zqVBZE/TF1ykbvRkKi6Q7+cqN/eDruQKYoCuyb0dYj1VNsniEuqE27ioUPlrGaX2R7Oq0XZkVrPrDzth6Dhz15uUTvh+1DR3yY17ZtYHmTHyFX/Awu0oK30ufp89+k4mVReUtNCGAQaQ4etRw0FYpNxGbfLgIyt7Zrv87GmkE3ne5Apy0OC4onZYqcYwP9SCNPU8E7xB+0cQc52JcHi6yDrzTIBKHiOG0JqTzSGxA6WhfRhMh8AIo1mX988UO0xuH9ZKlu8jpSc/jIL1EEWvo5Hu1BbMxAYYjN6tpgbRzSNRnUezCSvsm/QF16UEAjW2u/+5+IiB2HJssf3R0tv55BLPaNSTAPzd+ZEh2IDPUl4oswmV9jgfGVytHFTEw3tQPm403Npt95Rr6s/HYvUD3qIwZHm5y0uFHaj/EwEg17nCVbrVNhNBD7MO1OuGQ9AoMoBlMzjyFCoCSma8w3P5k9lHkRESKe7zmDKjwEKe5bSNV4YTR5CiB0nY7707qKbXPBPjAFplV5TKXU1V1DiH56n4YWViQGWhAW8/zqyhXCwNPM4JKfJscuxG1ryxAxiotk2K7AZe9eF6yKtqNNPaTA5pgNxfnyuMRgVIOPOodfPaNcdnB+QHXS6VAkGb9IULEVhXn7CxN6Uqh6qutFJeSe+3Us4Wb9M/i915UFd/THdI5OMIDqvOShTY8uWgbTR4rYSTu4lDHPj8aSyUmYjQJAn79NkZN/nmAQVt8q/XqSwtnZ2aCEc611mkCclH4ULqb8BolHuC5UDgifLguWrY5qugk72zGuHjm6ijsU6ZOszYqkxIiceD7KiUZbmFJbL0L/qLkI+eGU7e5",
      expires: "2022/10/13 17:38",
    }
    if (!info.needAuth && info.encryptData) {
      info.data = JSON.parse(await AES.decryptText(info.encryptData, secretKey))
    }
    return info;
  }

  const sendCode = async () => {
    setShowCode(true)
  }

  const validCode = async () => {
    setNeedAuth(false);
    const info = await getShareInfo(123);
    setData(info.data)
  }



  const init = async () => {
    const info = await getShareInfo();
    if (info.needAuth) {
      setNeedAuth(true);
    } else {
      setData(info.data)
    }
  }


  useEffect(() => {
    init();
  }, [])



  return (
    <>
      <Layout style={{ height: '100%' }}>
        <Content style={{
          textAlign: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          height: '100%',
        }} >
          <div style={{ width: 600, display: 'inline-block' }}>
            <div><img src='./logo-mini.png' style={{ marginTop: 30, height: 50, width: 50 }}></img></div>
            <div>有人在 ZPass 上与你共享了项目</div>
            <div style={{ display: needAuth ? 'none' : '' }}>
              <div></div>
              <div>
                <div >
                  {data ? <ItemForm data={data} /> : <></>}
                </div>
              </div>
            </div>
            <div style={{ display: needAuth ? '' : 'none' }}>
              <div >
                <Form>
                  <Form.Item style={{ display: showCode ? 'none' : '' }}>
                    <FormGroup height={60}>
                      <FormItem label="Email"  >
                        <FormInput name='email'><Input /></FormInput>
                      </FormItem>
                    </FormGroup>

                    <Form.Item noStyle>
                      <Button onClick={sendCode} type='primary'>Send Code</Button>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item style={{ display: showCode ? '' : 'none' }}>
                    <FormGroup height={60}>
                      <FormItem label="Code"  >
                        <FormInput name='code'><Input /></FormInput>
                      </FormItem>
                    </FormGroup>

                    <Form.Item>
                      <Button onClick={validCode} type='primary'>Valid Code</Button>
                    </Form.Item>
                    <Form.Item >
                      <a onClick={() => setShowCode(false)}>Resend</a>
                    </Form.Item>
                  </Form.Item>

                </Form>
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ backgroundColor: '#08243e' }}>
          <Row>
            <Col span={12} style={{ textAlign: 'center', color: 'white' }}>
              Copyright 2022 zpassapp.com. All Rights Reserved. User Service Agreement | Privacy Notice
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Space>
                <a><GithubOutlined style={{ fontSize: 20 }} /></a>
                <a><FacebookOutlined style={{ fontSize: 20 }} /></a><a><TwitterOutlined style={{ fontSize: 20 }} /></a><a><YoutubeOutlined style={{ fontSize: 20 }} /></a>
              </Space>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </>
  )
};

export default App;