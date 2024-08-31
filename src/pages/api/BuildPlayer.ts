import { Player } from "@/types/player.type";

export function BuildPlayer (): Player {
    const id = Math.floor(Math.random() * 100000);
    return {
        name: `player-${id}`,
        nickname: `nick-${id}`,
        history: `0-1-0`,
        county: `US`,
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