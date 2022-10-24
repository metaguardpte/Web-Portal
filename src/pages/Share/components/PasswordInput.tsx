import FormInput from '@/components/Form/FormInput';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';
import { ItemFormat } from './ItemForm';

const PasswordIcon = (
    <div style={{ height: 30, paddingTop: 8 }}>
        <MoreOutlined rotate={90} style={{ fontSize: 18 }} />
        <MoreOutlined rotate={90} style={{ fontSize: 18 }} />
    </div>
);

const PasswordInput = (props: { item: ItemFormat }) => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<JSX.Element>(PasswordIcon);

    const handleShowPwd = (show: boolean) => {
        setIsShowPassword(show);
        if (show) {
            setPassword(
                <Input style={{ height: 30 }} value={props.item.text} />,
            );
        } else {
            setPassword(PasswordIcon);
        }
    };

    return (
        <FormInput
            title={props.item.title}
            isEdit={false}
            copyValue={() => props.item.text}
            fieldButtions={[
                {
                    icon: isShowPassword ? (
                        <EyeOutlined className="zp-icon" />
                    ) : (
                        <EyeInvisibleOutlined className="zp-icon" />
                    ),
                    onclick: () => {
                        handleShowPwd(!isShowPassword);
                    },
                },
            ]}
        >
            {password}
        </FormInput>
    );
};

export default PasswordInput;
