import { VaultItemType } from '@/components/IconMap';
import { requester } from './requester';

interface ShareItem {
    id: number;
    itemId: string;
    itemType: VaultItemType;
    expiredTime: string;
    limitedTimes: number | null;
    createTime: string;
    detail: string;
    checkCode: string;
    email: string;
    userName: string;
}

export async function getShare(id: string | number, password?: string) {
    return requester.get<ShareItem>(`/api/sharing`, {
        Id: id,
        PasswordHash: password,
    });
}
