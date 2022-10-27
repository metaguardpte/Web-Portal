import { ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Space, Input, Button, Select, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import { AES } from '@/utils/crypto/cryptoUntity';
import ItemForm, { ShareDetail } from './components/ItemForm';
import { getShare } from '@/services/share';
import { StringToBase64 } from '@/utils/crypto/unitity';
import styles from './index.less';
import { useLocalTimeSimple } from '@/hooks/useLocalTime';
import FormGroup from '@/components/Form/FormGroup';
import FormInput from '@/components/Form/FormInput';
import FormItem from '@/components/Form/FormItem';
import ImportCode from './components/ImportCode';
import { num64To16 } from '@/utils/radix';

const { Option } = Select;

let itemId = '';
let originKey = '';
let secretKey = '';

const urlParams = window.location.hash.replace('#', '').split('/');
if (urlParams.length >= 2) {
    itemId = urlParams[0];
    originKey = urlParams[1];
    secretKey = originKey;
    if (secretKey) secretKey = num64To16(secretKey);
}

export enum VaultItemType {
    Login = 0,
    SecureNodes = 1,
    CreditCard = 2,
    Identity = 3,
}

const itemTypeMap = {
    0: 'share.type.login',
    1: 'share.type.secureNode',
    2: 'share.type.creditCard',
    3: 'share.type.identity',
};

const App: React.FC = () => {
    const [needAuth, setNeedAuth] = useState(false);
    const [password, setPassword] = useState('');
    const [data, setData] = useState<ShareDetail>();
    const [importKey, setImportKey] = useState<string>('');
    const intl = useIntl();
    const [sharer, setSharer] = useState('');
    const [expired, setExpired] = useState('');
    const [showError, setShowError] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [itemType, setItemType] = useState('');
    const [pinError, setPinError] = useState('');
    const [devMod, setDevMod] = useState(false);

    const localTime = useLocalTimeSimple();

    const getShareInfo = async () => {
        if (secretKey && itemId) {
            setShowError(false);
            const res = await getShare(itemId, password);
            if (!res.fail && res.payload) {
                const datas = res.payload;
                setItemType(() => intl.formatMessage({ id: itemTypeMap[datas.itemType] }));
                setSharer(datas.email);
                setExpired(localTime(datas.expiredTime));
                const detail = JSON.parse(await AES.decryptText(datas.detail, secretKey));
                setData(detail);

                const importCode = StringToBase64(`${itemId}+${datas.checkCode}+${originKey}`);
                setImportKey(importCode);

                setNeedAuth(false);
                return true;
            } else {
                if (res.errorId === 'err_authentication_failed') {
                    setNeedAuth(true);
                } else {
                    setShowError(true);
                }
            }
        }
        return false;
    };

    const onPasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPinError('');
        let v = e.target.value;
        if (v) v = await AES.digest(v);
        setPassword(v);
    };

    const verifyPin = async () => {
        setVerifyLoading(true);
        if (!(await getShareInfo())) {
            setPinError(intl.formatMessage({ id: 'share.auth.failed' }));
        }
        setVerifyLoading(false);
    };

    useEffect(() => {
        getShareInfo();
        const onKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Z' && e.ctrlKey) {
                setDevMod((s) => !s);
            }
        };
        window.addEventListener('keydown', onKeydown);
        return () => {
            window.removeEventListener('keydown', onKeydown);
        };
    }, []);

    const onModChange = (e: string) => {
        sessionStorage.setItem('backMod', e);
        location.reload();
    };

    return (
        <>
            <Layout style={{ height: '100%' }}>
                {devMod ? (
                    <div>
                        <Select
                            defaultValue={sessionStorage.getItem('backMod') ?? 'default'}
                            onChange={(e) => onModChange(e)}
                            style={{ position: 'absolute', right: 0, width: 100 }}
                        >
                            <Option value={'default'}>default</Option>
                            <Option value={'dev'}>dev</Option>
                            <Option value={'test'}>test</Option>
                            <Option value={'pre'}>pre</Option>
                        </Select>
                    </div>
                ) : (
                    <></>
                )}
                <div style={{ backgroundImage: 'url(./background.png)' }} className={styles.main}>
                    <div className={styles.header}>
                        <Row style={{ marginTop: 50 }}>
                            <Col
                                style={{
                                    fontSize: 24,
                                    fontWeight: 600,
                                    paddingLeft: 200,
                                    display: 'flex',
                                }}
                                span={12}
                            >
                                <div
                                    style={{
                                        height: 4,
                                        width: 4,
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        margin: 'auto 15px auto 0',
                                    }}
                                ></div>
                                <div>
                                    {intl.formatMessage({
                                        id: 'share.header',
                                    })}
                                </div>
                            </Col>
                            <Col
                                span={12}
                                style={{
                                    textAlign: 'right',
                                    paddingTop: 10,
                                    display: !needAuth && !showError ? '' : 'none',
                                }}
                            >
                                <Space className={styles.titleLight} style={{ fontSize: 18 }}>
                                    <ClockCircleOutlined />
                                    <div>
                                        {intl.formatMessage({
                                            id: 'share.expired.tip',
                                        })}{' '}
                                        {expired}
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.content}>
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                display: showError ? 'none' : '',
                            }}
                            className={styles.scroll}
                        >
                            <div
                                style={{
                                    display: needAuth ? 'none' : '',
                                }}
                            >
                                <div className={styles.formHeader}>
                                    <div
                                        style={{
                                            margin: 'auto',
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: '#464AFF',
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'share.from1',
                                        })}{' '}
                                        {sharer}{' '}
                                        {intl.formatMessage(
                                            {
                                                id: 'share.from2',
                                            },
                                            {
                                                itemType: itemType,
                                            },
                                        )}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: 594,
                                        margin: 'auto',
                                    }}
                                >
                                    <div>{data ? <ItemForm data={data} /> : <></>}</div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: needAuth ? '' : 'none',
                                    width: 594,
                                    margin: 'auto',
                                }}
                            >
                                <div
                                    className={styles.titleHeavy}
                                    style={{
                                        margin: '20px  0 20px 0',
                                        fontSize: 16,
                                        textAlign: 'left',
                                    }}
                                >
                                    {intl.formatMessage({
                                        id: 'share.pin.title',
                                    })}
                                </div>
                                <Form>
                                    <FormGroup>
                                        <FormItem
                                            label={intl.formatMessage({
                                                id: 'share.pin.code',
                                            })}
                                            hasFeedback
                                            validateStatus={'error'}
                                            help={pinError}
                                        >
                                            <FormInput>
                                                <Input.Password onChange={onPasswordChange} />
                                            </FormInput>
                                        </FormItem>
                                    </FormGroup>
                                </Form>
                                <div>
                                    <Button
                                        size="small"
                                        loading={verifyLoading}
                                        className={styles.verifyButton}
                                        onClick={verifyPin}
                                    >
                                        {intl.formatMessage({
                                            id: 'share.verify',
                                        })}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: showError ? 'flex' : 'none',
                                flex: 1,
                                margin: 'auto',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ margin: 'auto' }}>
                                <div>
                                    <ExclamationCircleOutlined className={styles.errorIcon} />
                                </div>
                                <div className={styles.titleHeavy} style={{ fontSize: 16 }}>
                                    {intl.formatMessage({
                                        id: 'share.not.exist.tip',
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ height: 30, display: 'flex' }}>
                            <div
                                className={styles.dividerCircle}
                                style={{
                                    marginLeft: -15,
                                }}
                            ></div>
                            <div className={styles.divider}></div>
                            <div
                                className={styles.dividerCircle}
                                style={{
                                    marginRight: -15,
                                }}
                            ></div>
                        </div>
                        <div
                            style={{
                                height: 130,
                            }}
                        >
                            <div
                                style={{
                                    display: !needAuth && !showError ? '' : 'none',
                                }}
                            >
                                <ImportCode importKey={importKey} />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 50, color: 'white', display: 'flex' }}>
                        <div style={{ margin: 'auto' }}>
                            {intl.formatMessage({
                                id: 'share.visit.1',
                            })}{' '}
                            <a
                                href="https://www.zpassapp.com"
                                target="_blank"
                                style={{
                                    color: 'white',
                                    textDecoration: 'underline',
                                }}
                                rel="noreferrer"
                            >
                                www.zpassapp.com
                            </a>{' '}
                            {intl.formatMessage({
                                id: 'share.visit.2',
                            })}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default App;
