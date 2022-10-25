const base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-*';

export const toBase = (num: number, ben = base.length) => {
    let arr = [];
    let numb = num;
    while (numb > 0) {
        arr.push(base[numb % ben]);
        numb = Math.floor(numb / ben);
    }
    return arr.reverse().join('');
};

export const to10 = (baseNum: string, ben = base.length) => {
    const baseList = baseNum.split('').reverse().join('');
    let val = 0;
    for (let i = 0; i < baseList.length; i++) {
        let c = baseList[i];
        val += base.indexOf(c) * Math.pow(ben, i);
    }
    return val;
};

export const num16To64 = (origin: string) => {
    let target = '';
    let lastLength = 0;
    for (let i = 0; i < origin.length; i += 3) {
        let c = origin.substring(i, i + 3);
        lastLength = c.length;
        let t = to10(c, 16);
        let b = toBase(t, 64);
        if (b.length < 2) b = '0'.repeat(2 - b.length) + b;
        target += b;
    }
    return target + lastLength.toString();
};

export const num64To16 = (origin: string) => {
    let target = '';
    let lastLength = parseInt(origin.substring(origin.length - 1, origin.length));
    const originNew = origin.substring(0, origin.length - 1);
    for (let i = 0; i < originNew.length; i += 2) {
        let c = originNew.substring(i, i + 2);
        let t = to10(c, 64);
        let b = toBase(t, 16);
        if (b.length < 3) b = '0'.repeat(3 - b.length) + b;
        if (i > originNew.length - 3) {
            b = b.substring(b.length - lastLength);
        }
        target += b;
    }
    return target;
};
