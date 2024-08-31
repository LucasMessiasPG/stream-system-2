'use client'

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketClient } from "../services/socket-client";

import { useSearchParams } from 'next/navigation'
import { GameData } from "@/types/game.type";

export default function Scoreboard () {
    const searchParams = useSearchParams()
    const socketRef = useRef<Socket>()
    const [game, setGame] = useState<GameData | null>(null)
    const id = searchParams?.get('id')

    useEffect(() => {
        const controller = new AbortController();
        SocketClient(controller.signal)
            .then((socket: Socket) => {
                socketRef.current = socket;
                socket.emit("getGame", id);
                socket.emit("isScoreBoard", id);

                socket.on('game', (data: string) => {
                    const game = JSON.parse(data);
                    setGame(game);
                })
            })
            .catch((e) => {
                if (controller.signal.aborted) {
                    console.debug("User aborted the request");
                }
            });


        return () => {
            controller.abort();
            if (socketRef.current) {
                console.log('close connection')
                socketRef.current.close();
            }
        };
    }, [])

    return (
        <div className="px-0 mx-0 bg-transparent">
            { game?.image.url ? <img className="max-h-[500px]" src={game?.image.url} alt="" /> : <></> }
        </div>
    )
}