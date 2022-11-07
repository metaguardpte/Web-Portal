import FormInput from '@/components/Form/FormInput';
import { Progress, Space } from 'antd';
import { TOTP, URI, HOTP } from 'otpauth';
import { useEffect, useState } from 'react';
import { ItemFormat } from '@/pages/Share/components/ItemForm';

interface Props {
    item: ItemFormat;
}

const ToptForm = (props: Props) => {
    const { item } = props;
    const [strokeColor, setStrokeColor] = useState('green');
    const [otPasswordFront, setOTPasswordFront] = useState('');
    const [otPasswordBack, setOTPasswordBack] = useState('');
    const [countDown, setCountDown] = useState('');
    const [totalPercentTOTP, setTotalPercentTOTP] = useState(0);

    const removeBlank = (secret: any) => {
        return secret.replace(/\s/g, '');
    };

    const createTOTP = (secret: any): TOTP | HOTP | null => {
        let totp: TOTP | HOTP;
        try {
            if (secret.startsWith('otpauth')) {
                totp = URI.parse(secret);
            } else {
                totp = new TOTP({ secret: removeBlank(secret) });
            }
            return totp;
        } catch {
            return null;
        }
    };

    const maxSeconds = 30;
    const colorThreshold = (10 / maxSeconds) * 100;
    const generatePassword = (secret: any): string | null => {
        if (secret) {
            const totp = createTOTP(secret);
            if (totp) {
                const seconds = new Date().getUTCSeconds();
                const percent = (1 - (seconds % maxSeconds) / maxSeconds) * 100;
                if (Math.floor(percent) > Math.floor(colorThreshold)) {
                    setStrokeColor('green');
                } else {
                    setStrokeColor('red');
                }
                setTotalPercentTOTP(percent);
                setCountDown(Math.round((percent / 100) * 30).toString());
                return totp.generate();
            }
        }
        return null;
    };

    const showOneTimePassword = (totp: string) => {
        const password = generatePassword(totp);
        if (password) {
            setOTPasswordFront(password.substring(0, 3));
            setOTPasswordBack(password.substring(3));
        } else {
            setOTPasswordFront('');
            setOTPasswordBack('');
        }
    };

    const copyOneTimePassword = (secret: string) => {
        const password = generatePassword(secret);
        return password ?? '';
    };

    useEffect(() => {
        let timer: NodeJS.Timer;

        if (item.type === 'totp') {
            showOneTimePassword(item.text);
            timer = setInterval(() => showOneTimePassword(item.text), 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, []);
    return (
        <FormInput
            title={item.title}
            isEdit={false}
            copyValue={() => copyOneTimePassword(item.text)}
        >
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
    );
};

export default ToptForm;
