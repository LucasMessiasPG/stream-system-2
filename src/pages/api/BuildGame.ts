import { GameData } from "@/types/game.type";
import { Player } from "@/types/player.type";
import { BuildPlayer } from "./BuildPlayer";
import { v4 as uuid } from 'uuid';

type BuildGameData = {
    id?: string;
    p1?: Player;
    p2?: Player;
    colldown?: number
}

export function BuildGame(data?: BuildGameData): GameData {
    const { id, p1, p2, colldown } = data ?? {};
    return {
        colldown: colldown ?? 0,
        players: {
            p1: p1 ?? BuildPlayer(),
            p2: p2 ?? BuildPlayer()
        },
        id: id ?? uuid(),
        prize: {
            p1: 3,
            p2: 3
        },
        score: {
            p1: 0,
            p2: 0
        },
        image: {
            url: null,
            timer: null,
        },
        timer: {
            current: 0,
            status: 'idle',
        },
        flags: {
            tie: '0'
        }
    }
}