import { Player } from "@/types/player.type";

export function BuildPlayer (): Player {
    const id = Math.floor(Math.random() * 100000);
    return {
        name: ``,
        nickname: ``,
        history: `0-0-0`,
        county: ``,
        extra_info: `extra info`,
        flags: {
            energy: '1',
            supporter: '1',
            vstar: '1',
            retreat: '1',
            gx: '1',
            doubleLost: '0',
            win: '0',
        }
    }
}