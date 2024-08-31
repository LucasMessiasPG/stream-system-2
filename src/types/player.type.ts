export type Player = {
    name: string;
    nickname: string;
    history?: string;
    county?: string;
    extra_info?: string;
    flags: {
        energy: '0' | '1';
        supporter: '0' | '1';
        vstar: '0' | '1';
        retreat: '0' | '1';
        gx: '0' | '1';
        doubleLost: '0' | '1';
        win: '0' | '1';
    };
}