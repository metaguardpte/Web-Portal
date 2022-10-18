import {
    IdCardH,
    Key,
    BankCard,
    FolderOpen,
} from '@icon-park/react';

export  enum VaultItemType {
        Login = 0,
        SecureNodes = 1,
        CreditCard = 2,
        Identity = 3,
    }

const IconMap = (type: VaultItemType, size: number) => {
    console.log(VaultItemType)
    switch (type) {
        case VaultItemType.Login: {
            const Icon = Key;
            return <Icon fill="#be94f0" size={size} />;
        }
        case VaultItemType.SecureNodes: {
            const Icon = FolderOpen;
            return <Icon fill="#efb271" size={size} />;
        }
        case VaultItemType.CreditCard: {
            const Icon = BankCard;
            return <Icon fill="#b4d988" size={size} />;
        }
        case VaultItemType.Identity: {
            const Icon = IdCardH;
            return <Icon fill="#f77878" size={size} />;
        }
        default:
            return <></>;
    }
};

export default IconMap;
