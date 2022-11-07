import { useIntl } from '@umijs/max';
import FormGroup from '@/components/Form/FormGroup';
import FormInput from '@/components/Form/FormInput';
import FormItem from '@/components/Form/FormItem';
import { VaultItemType } from '@/components/IconMap';
import { getItemIcon } from '@/utils/tools';
import { Input, Space, Typography } from 'antd';
import ToptInput from './ToptInput';
import PasswordInput from './PasswordInput';
import country from '@/utils/country';

export interface ItemFormat {
    title: string;
    type: 'text' | 'textArea' | 'totp' | 'password' | 'country';
    text: string;
    hidden?: boolean;
    name: string;
}

export interface ShareDetail {
    type: VaultItemType;
    title: string;
    items: ItemFormat[][];
    tags: string[];
}

const { Text } = Typography;

export default (props: { data: ShareDetail }) => {
    const { data } = props;
    const intl = useIntl();

    const getInput = (item: ItemFormat) => {
        item.title = intl.formatMessage({ id: item.title });
        switch (item.type) {
            case 'text':
                return (
                    <FormInput title={item.title} isEdit={false} copyValue={() => item.text}>
                        <Input value={item.text} />
                    </FormInput>
                );
            case 'password':
                return <PasswordInput item={item} />;
            case 'textArea':
                return (
                    <FormInput title={item.title} isEdit={false} copyValue={() => item.text}>
                        <Input.TextArea
                            value={item.text}
                            autoSize={{ minRows: 2, maxRows: Number.MAX_SAFE_INTEGER }}
                        />
                    </FormInput>
                );
            case 'totp':
                return <ToptInput item={item} />;
            case 'country':
                return (
                    <FormInput
                        title={item.title}
                        isEdit={false}
                        copyValue={() =>
                            intl.formatMessage({
                                id: `country.${item.text}`,
                            })
                        }
                    >
                        <Input value={country[item.text]['name']}></Input>
                    </FormInput>
                );
        }
    };

    const getIcon = () => {
        let iconTag = '';
        if (data.type === VaultItemType.Login) {
            for (const itemGroup of data.items) {
                if (iconTag) break;
                for (const item of itemGroup) {
                    if (item.name === 'loginUri') {
                        iconTag = item.text;
                        break;
                    }
                }
            }
        } else if (data.type === VaultItemType.CreditCard) {
            for (const itemGroup of data.items) {
                if (iconTag) break;
                for (const item of itemGroup) {
                    if (item.name === 'cardType') {
                        iconTag = item.text;
                        break;
                    }
                }
            }
        }
        return getItemIcon(data.type, 40, iconTag);
    };

    const filterHidden = () => {
        const result: ShareDetail['items'] = [];
        data.items.forEach((itemGroup) => {
            const tmp: ItemFormat[] = [];
            itemGroup.forEach((item) => {
                if (!item.hidden) tmp.push(item);
            });
            if (tmp.length > 0) result.push(tmp);
        });
        return result;
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    marginBottom: 15,
                }}
            >
                <div
                    style={{
                        boxShadow: '0px 1px 3.8px 0.2px rgb(0 0 0 / 10%)',
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                        background: 'white',
                        padding: 5,
                    }}
                >
                    {getIcon()}
                </div>
                <Text ellipsis={{ tooltip: data.title }} style={{ fontSize: 20, fontWeight: 600 }}>
                    {data.title}
                </Text>
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size={15}>
                {filterHidden().map((itemGroup, key) => {
                    return (
                        <FormGroup key={key}>
                            {itemGroup.map((item, index) => {
                                return <FormItem key={index}>{getInput(item)}</FormItem>;
                            })}
                        </FormGroup>
                    );
                })}
            </Space>
        </div>
    );
};
