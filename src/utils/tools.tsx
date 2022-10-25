import IconMap, { VaultItemType } from '@/components/IconMap';
import Image from '@/components/Image';

export const prependHttp = (url: string) => {
    const regWithSchema =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regWithoutSchema =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

    if (url.match(regWithSchema)) {
        return url;
    } else if (url.match(regWithoutSchema)) {
        return `http://${url}`;
    } else {
        return url;
    }
};

export const getFaviconUrl = (url: string) => {
    try {
        const u = new URL(prependHttp(url));
        return `${u.origin}/favicon.ico`;
    } catch (e) {
        return 'defaultFavicon';
    }
};

export const getImgUriByType = (cardType: string | undefined) => {
    const supportTypes = [
        'american-express',
        'unionpay',
        'visa',
        'diners-club',
        'discover',
        'jcb',
        'maestro',
        'mastercard',
    ];
    if (!cardType || !supportTypes.find((type) => type === cardType)) {
        return 'defaultFavicon';
    }
    return `./credit-card-${cardType}.png`;
};

export const getItemIcon = (itemType: VaultItemType, size: number, tag?: string) => {
    let icon;
    if (itemType === VaultItemType.Login) {
        const url = getFaviconUrl(tag!);

        icon = <Image defaulticon={IconMap(VaultItemType.Login, size)} size={size} src={url} />;
    } else if (itemType === VaultItemType.CreditCard) {
        const url = getImgUriByType(tag!);
        icon = (
            <Image defaulticon={IconMap(VaultItemType.CreditCard, size)} size={size} src={url} />
        );
    } else {
        icon = IconMap(itemType, size);
    }
    return icon;
};
