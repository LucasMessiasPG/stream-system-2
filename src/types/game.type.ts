import { Player } from "./player.type";

export type GameData = {
    id: string;
    players: {
        p1: Player;
        p2: Player;
    };
    score: {
        p1: number;
        p2: number;
    };
    colldown: number;
    prize: {
        p1: number;
        p2: number;
    };
    image: {
        url: string | null;
        timer: NodeJS.Timeout | null;
    };
    timer: {
        current: 0;
        status: 'idle' | 'running' | 'stoped';
    };
    flags : {
        tie: '1' | '0',
    }
}