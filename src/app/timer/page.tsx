'use client'

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketClient } from "../services/socket-client";
import { GameData } from "@/types/game.type";
import { useSearchParams } from 'next/navigation'

class LocalTimer {
    current = 0;
    interval: NodeJS.Timeout | null = null;
    status: 'running' | 'stoped' | 'idle' = 'idle';

    initialValue(value: number, offset: number) {
        let diff = new Date().getTime() - new Date(value).getTime();
        this.current = Math.max((diff / 1000) + offset, 0);
    }

    start(cb?: any) {
        if (this.status == 'running') return;

        this.status = 'running'
        this.interval = setInterval(() => {
            this.current += 1;
            if(cb) cb(this.current);
        }, 1000);
    }

    stop() {
        if (this.status == 'stoped') return;
        this.status = 'stoped'
        if (this.interval)
            clearInterval(this.interval)

        this.interval = null;
    }

    reset(cb: any) {
        cb(0)
        let currentStatus = this.status;
        this.stop()
        this.current = 0;
        if (currentStatus == 'running')
            this.start(cb);
        else 
            cb(this.current)
    }
}

export default function Scoreboard () {
    const searchParams = useSearchParams()
    const socketRef = useRef<Socket>()
    const [game, setGame] = useState<GameData | null>(null)
    const [timer, setTimer] = useState<number>(0)
    const id = searchParams?.get('id')
    const localTimer = new LocalTimer();

    useEffect(() => {
        document.title = "Timer - StremSystem";
      }, []);

    useEffect(() => {
        const controller = new AbortController();
        SocketClient(controller.signal)
            .then((socket: Socket) => {
                socketRef.current = socket;
                socket.emit("getGame", id);
                socket.emit("isScoreBoard", id);

                socket.on('game', (data: string) => {
                    const game = JSON.parse(data);
                    
                    localTimer.current = game.timer.current;
                    if (game.timer.startAt)
                        localTimer.initialValue(game.timer.startAt, game.timer.offset);

                    if (game.timer.status == 'running') {
                        localTimer.start(setTimer)
                    }
                    setGame(game);
                })

                socket.on('statusTimer', (data: string) => {
                    switch(data) {
                        case 'running': 
                            localTimer.start(setTimer)
                            break;
                        case 'stoped':
                            localTimer.stop()
                            break;
                        case 'reset':
                            localTimer.reset(setTimer)
                            break;
                    }
                });
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
            <span className="text-shadow text-4xl">{parseTimeout(timer ?? 0)}</span>
        </div>
    )
}