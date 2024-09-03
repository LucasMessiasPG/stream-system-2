'use client'

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketClient } from "../services/socket-client";
import { GameData } from "@/types/game.type";
import ScoreboardPlayer from "../components/ScoreboardPlayer";
import VS from '../public/img/vs.png'

import { useSearchParams } from 'next/navigation'
import Image from "next/image";

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

    if (!game) return (<></>);

    return (
        <div className='w-[1200px] bg-transparent text-shadow'>
            <div className='flex'>
                <ScoreboardPlayer
                        player={game.players.p1}
                        prize={game.prize.p1}
                        tie={game.flags.tie} />
                <div className='flex text-9xl mx-6 text-center'>
                    <div className='flex-1 mt-2'><span>{game.score.p1}</span></div>
                    <div className='flex-2 min-w-10'>
                        {/* <Image width={80} src={VS} alt='vesus' /> */}
                    </div>
                    <div className='flex-1 mt-2'><span>{game.score.p2}</span></div>
                </div>
                <ScoreboardPlayer
                    invert={true}
                    player={game.players.p2}
                    prize={game.prize.p2}
                    tie={game.flags.tie} />
            </div>
        </div>
    )
}