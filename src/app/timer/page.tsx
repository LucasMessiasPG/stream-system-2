'use client'

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketClient } from "../services/socket-client";
import { GameData } from "@/types/game.type";

import { useSearchParams } from 'next/navigation'

export default function Scoreboard () {
    const socketRef = useRef<Socket>()
    const [game, setGame] = useState<GameData | null>(null)
    const searchParams = useSearchParams()
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

    const parseTimeout = (timer: number) => {
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = Math.floor(timer % 60);
      
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <div className="w-100 bg-transparent">
            <span className="text-shadow text-4xl">{parseTimeout(game?.timer.current ?? 0)}</span>
        </div>
    )
}