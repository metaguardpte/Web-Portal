import FormGroup from '@/components/Form/FormGroup';
import FormInput from '@/components/Form/FormInput';
import FormItem from '@/components/Form/FormItem';
import { VaultItemType } from '@/components/IconMap';
import { getItemIcon } from '@/utils/tools';
import { EyeInvisibleOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Input, Progress, Space, Typography } from 'antd';
import { TOTP, URI, HOTP } from 'otpauth';
import { useEffect, useState } from 'react';


interface ItemFormat {
    title: string;
    type: 'text' | 'textArea' | 'totp' | 'password';
    text: string;
    hidden?: boolean;
}

export interface DataFormat {
    title: string;
    type: VaultItemType;
    items: ItemFormat[][];
    tags: string[];
}

const PasswordIcon = <div style={{ height: 30, paddingTop: 8 }} ><MoreOutlined rotate={90} style={{ fontSize: 18 }} /><MoreOutlined rotate={90} style={{ fontSize: 18 }} /></div>

const { Text } = Typography;

const PasswordInput = (props: { item: ItemFormat }) => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<JSX.Element>(PasswordIcon);


    const handleShowPwd = (show: boolean) => {
        setIsShowPassword(show)
        if (show) {
            setPassword(<Input style={{ height: 30 }} value={props.item.text} />);
        } else {
            setPassword(PasswordIcon);
        }
    }

    return (
        <FormInput title={props.item.title} isEdit={false} copyValue={() => props.item.text} fieldButtions={
            [
                {
                    icon: isShowPassword
                        ? (
                            <EyeOutlined className='zp-icon' />
                        )
                        : (
                            <EyeInvisibleOutlined className='zp-icon' />
                        ),
                    onclick: () => {
                        handleShowPwd(!isShowPassword)
                    }
                }
            ]
        }>
            {password}
        </FormInput>
    )
};



export default (props: { data: DataFormat }) => {
    const { data } = props;
    const [strokeColor, setStrokeColor] = useState('green')
    const [otPasswordFront, setOTPasswordFront] = useState('')
    const [otPasswordBack, setOTPasswordBack] = useState('')
    const [countDown, setCountDown] = useState('')
    const [totalPercentTOTP, setTotalPercentTOTP] = useState(0)




    const removeBlank = (secret: any) => {
        return secret.replace(/\s/g, '')
    }

    const createTOTP = (secret: any): TOTP | HOTP | null => {
        let totp: TOTP | HOTP
        try {
            if (secret.startsWith('otpauth')) {
                totp = URI.parse(secret)
            } else {
                totp = new TOTP({ secret: removeBlank(secret) })
            }
            return totp
        } catch {
            return null
        }
    }

    const maxSeconds = 30
    const colorThreshold = (10 / maxSeconds) * 100
    const generatePassword = (secret: any): string | null => {
        if (secret) {
            const totp = createTOTP(secret)
            if (totp) {
                const seconds = new Date().getUTCSeconds()
                const percent = (1 - (seconds % maxSeconds) / maxSeconds) * 100
                if (Math.floor(percent) > Math.floor(colorThreshold)) {
                    setStrokeColor('green')
                } else {
                    setStrokeColor('red')
                }
                setTotalPercentTOTP(percent)
                setCountDown(Math.round((percent / 100) * 30).toString())
                return totp.generate()
            }
        }
        return null
    }

    const showOneTimePassword = (totp: string) => {
        const password = generatePassword(totp);
        if (password) {
            setOTPasswordFront(password.substring(0, 3))
            setOTPasswordBack(password.substring(3))
        } else {
            setOTPasswordFront('')
            setOTPasswordBack('')
        }
    }



    const copyOneTimePassword = (secret: string) => {
        const password = generatePassword(secret)
        return password ?? ''
    }

    useEffect(() => {
        let timer: NodeJS.Timer;
        data.items.forEach(itemGroup => {
            itemGroup.forEach(item => {
                if (item.type === 'totp') {
                    showOneTimePassword(item.text);
                    timer = setInterval(() => showOneTimePassword(item.text), 1000)
                }
            })
        })

        return () => {
            clearTimeout(timer)
        }
    }, [])


    const getInput = (item: ItemFormat) => {
        switch (item.type) {
            case 'text':
                return <FormInput title={item.title} isEdit={false} copyValue={() => item.text}><Input value={item.text} /></FormInput>;
            case 'password':
                return <PasswordInput item={item} />
            case 'textArea':
                return <FormInput title={item.title} isEdit={false} copyValue={() => item.text}><Input.TextArea value={item.text} /></FormInput>;
            case 'totp':
                return (
                    <FormInput title={item.title} isEdit={false} copyValue={() => copyOneTimePassword(item.text)}>
                        <div>
                            <Space>
                                <span>{otPasswordFront}</span>
                                <span>{otPasswordBack}</span>
                                <Progress
                                    style={{ transform: 'scaleX(-1)' }}
                                    type="circle"
                                    showInfo={false}
                                    strokeColor={strokeColor}
                                    strokeWidth={15}
                                    trailColor={'unset'}
                                    percent={totalPercentTOTP}
                                    width={15}
                                />
                                <span>{countDown}</span>
                            </Space>
                        </div>
                    </FormInput>
                )
        }
    }

    const getIcon = () => {
        let uri = ''
        if (data.type === VaultItemType.Login) {
            uri = data.items[1][0].text
        } else if (data.type === VaultItemType.CreditCard) {
            //  uri = data.items[0][0].text
            uri = 'mastercard'
        }
        return getItemIcon(data.type, 32, uri)
    }


    return (
        <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div
                    style={{
                        boxShadow: '0px 1px 3.8px 0.2px rgb(0 0 0 / 10%)',
                        height: 44,
                        width: 44,
                        borderRadius: 10,
                        background: 'white',
                        padding: 6
                    }}
                >
                    {getIcon()}
                </div>
                <Text ellipsis={{ tooltip: data.title }}>{data.title}</Text>
            </div>
            <Space direction='vertical' style={{ width: '100%' }} size={15}>
                {data.items.map((itemGroup, key) => {
                    return (
                        <FormGroup key={key}>
                            {itemGroup.map((item, index) => {
                                if (item.hidden !== true) {
                                    return (
                                        <FormItem key={index}>
                                            {getInput(item)}
                                        </FormItem>
                                    )
                                } else {
                                    return <></>
                                }
                            })}
                        </FormGroup>
                    )
                })}
            </Space>
        </div>

    )
}

