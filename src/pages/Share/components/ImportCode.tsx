import { Col, Row, Image, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';
import { useIntl } from '@umijs/max';
import styles from '../index.less';
import { DownloadOutlined } from '@ant-design/icons';

interface Props {
    importKey: string;
}

const ImportCode = (props: Props) => {
    const { importKey } = props;
    const [qrCode, setQrCode] = useState('');
    const intl = useIntl();

    const getQrCode = async () => {
        setQrCode(await toDataURL(importKey));
    };

    useEffect(() => {
        if (importKey) {
            getQrCode();
        }
    }, [importKey]);

    const copyCode = async () => {
        navigator.clipboard.writeText(importKey);
        message.success(intl.formatMessage({ id: 'share.copied' }));
    };

    return (
        <Row>
            <Col span={8} style={{ textAlign: 'left' }}>
                <div
                    style={{
                        width: 'fit-content',
                        marginLeft: 177,
                        textAlign: 'center',
                    }}
                >
                    <div style={{}}>
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                border: '1px solid #DDE0FF',
                                borderRadius: 5,
                            }}
                            src={qrCode}
                        ></Image>
                    </div>
                    <div className={styles.titleSmall}>
                        {intl.formatMessage({
                            id: 'share.qrcode.scan',
                        })}
                    </div>
                </div>
            </Col>
            <Col span={16} style={{ textAlign: 'left', marginLeft: -10 }}>
                <div className={styles.titleMax} style={{ marginBottom: 10 }}>
                    {intl.formatMessage({
                        id: 'share.qrcode.title',
                    })}
                </div>
                <div className={styles.titleLight}>
                    {intl.formatMessage({
                        id: 'share.qrcode.tip',
                    })}
                </div>
                <div style={{ width: 373 }}>
                    <Input
                        className={styles.importInput}
                        value={importKey}
                        readOnly
                        suffix={
                            <Button
                                type="primary"
                                className={styles.importButton}
                                onClick={copyCode}
                            >
                                {intl.formatMessage({
                                    id: 'share.copy',
                                })}
                            </Button>
                        }
                    />
                </div>
                <div className={styles.download}>
                    <DownloadOutlined style={{ fontSize: 18 }} />{' '}
                    {intl.formatMessage({
                        id: 'share.qrcode.have',
                    })}{' '}
                    ?{' '}
                    <a
                        href="https://www.zpassapp.com/download/"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            textDecoration: 'underline',
                        }}
                        className={styles.colorPurple}
                    >
                        {intl.formatMessage({
                            id: 'share.qrcode.download',
                        })}
                    </a>
                </div>
            </Col>
        </Row>
    );
};

export default ImportCode;
