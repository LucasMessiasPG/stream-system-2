'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

import type { Socket } from 'socket.io-client'
import { SocketClient } from '@/app/services/socket-client'
import CompleteLayout from '../components/CompleteLayout'
import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GameData } from '@/types/game.type'
import _ from 'lodash';
import { FormPlayer } from '../components/FormPlayer'
import { InputGame } from '../components/InputGame'
import pokeball from '../public/img/pokeball.png'
import Image from 'next/image'

export default function Dashboard() {
    const socketRef = useRef<Socket>()
    const [game, setGame] = useState<GameData | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [socket, setSocket] = useState<Socket>()
    const [cards, setCards] = useState<any[]>()
    const searchParams = useSearchParams()
    const id = searchParams?.get('id')
    const router = useRouter()
    let interval: NodeJS.Timeout;
    useEffect(() => {
        const controller = new AbortController();

        SocketClient(controller.signal)
            .then((socket: Socket) => {
                socketRef.current = socket;
                setSocket(socket);
                socket.emit("getGame", id);

                socket.on('game', (data: string) => {
                    const game = JSON.parse(data) as GameData;

                    if (['running', 'stoped'].includes(game.timer.status)) {
                        if (interval) clearInterval(interval);

                        if (game.timer.status == 'running') {
                            let countTime = game.timer.current
                            interval = setInterval(() => {
                                socket.emit('updateGame', `${id},timer.current,${++countTime}`)
                            }, 1000)
                        }
                    }
                    setGame(game);
                })

                socket.on('getCard', (cards: any) => {
                    setLoading(false);
                    setCards(JSON.parse(cards))
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
                socketRef.current.close();
            }
        };
    }, [])

    if (!game || !socket) return (<div>Carregando</div>)

    if (!id) return redirect('/home');

    return (
        <CompleteLayout>
            <div className='my-10'>
                <div className='flex mb-10'>
                    <Link className='mx-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white' href={`/scoreboard?id=${id}`} rel="noopener noreferrer" target="_blank"> scoreboard </Link>
                    <Link className='mx-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white' href={`/timer?id=${id}`} rel="noopener noreferrer" target="_blank"> timer </Link>
                    <Link className='mx-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white' href={`/card?id=${id}`} rel="noopener noreferrer" target="_blank"> carta </Link>
                    <div className='flex-1 text-right'>
                        <button
                            className='rigth-1 mx-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white'
                            onClick={() => socket.emit("resetGame", id) }>
                                Redefir Jogo
                        </button>
                    </div>
                </div>

                <div className='w-full m-auto'>
                    <iframe className='w-[1205px] h-[200px] bg-white m-auto border-2 border-gray-800' src={`/scoreboard?id=${id}`} />
                </div>
                
                <div className='flex flex-wrap'>
                    <div className='bg-white rounded-lg ml-10 flex-1 mt-10 border-2 border-gray-800'>
                        <FormPlayer gameId={id} game={game} socket={socket} slug='p1' />
                    </div>
                    <div className='bg-white rounded-lg ml-10 flex-1 mt-10 border-2 border-gray-800'>
                        <FormPlayer gameId={id} game={game} socket={socket} slug='p2' />
                    </div>
                    
                    <div className="bg-white rounded-lg ml-10 pt-5 mt-10 pb-10 border-2 border-gray-800">
                        <h4 className='ml-2 mb-5'>Timer</h4>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200 ${game.timer.status === 'running' ? 'border-pink-800' : ''}`} onClick={() => {
                            socket.emit('updateGame', `${id},timer.status,running`)
                        }}>Start</button>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200 ${game.timer.status === 'stoped' || game.timer.status === 'idle' ? 'border-pink-800' : ''}`} onClick={() => {
                            socket.emit('updateGame', `${id},timer.status,stoped`)
                        }}>Stop</button>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200`} onClick={() => {
                            socket.emit('updateGame', `${id},timer.current,0`)
                        }}>Reset</button>
                        <iframe className='w-[250px] h-[50px] pl-3 mt-5 h-10 bg-white m-auto border-2 border-gray-800' src={`/timer?id=${id}`} />

                        <h4 className='ml-2 my-5'>Resultado da partida</h4>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200 ${game.players.p1.flags.win === '1' ? 'border-pink-800' : ''}`} onClick={() => {
                            socket.emit('updateGame', `${id},players.p1.flags.win,${game.players.p1.flags.win === '1' ? '0' : '1'}`)
                        }}>Win P1</button>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200 ${game.players.p2.flags.win === '1' ? 'border-pink-800' : ''}`} onClick={() => {
                            socket.emit('updateGame', `${id},players.p2.flags.win,${game.players.p2.flags.win === '1' ? '0' : '1'}`)
                        }}>Win P2</button>
                        <button className={`mx-2 px-3 py-2 border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200 ${game.flags.tie === '1' ? 'border-pink-800' : ''}`} onClick={() => {
                            socket.emit('updateGame', `${id},flags.tie,${game.flags.tie === '1' ? '0' : '1'}`)
                        }}>Tie</button>
                    </div>
                </div>

                <div className='flex mb-10'>
                    <div className='bg-white rounded-lg ml-10 py-5 mt-10 flex-1 border-2 border-gray-800'>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            socket.emit('getCard', search)
                            setCards([]);
                            setLoading(true);
                        }}>
                            <InputGame
                                label='Mostrar carta'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setSearch(e.target.value);
                                }}
                                id='getCard'/>
                            <button className='border-2 border-gray-800 ml-5 px-2 py-1 rounded-lg bg-white hover:bg-gray-200' type='submit'>Procurar</button>
                        </form>
                        <div className='flex flex-wrap'>
                            {loading ? <Image className='animate-spin ml-10 mt-10' src={pokeball} alt='' width='50' /> : <></> }
                            {cards?.length ? cards.map((card, index) => {
                                return (
                                    <div className='w-[200px] mx-5 px-2 py-2' key={index}>
                                        <h3>{card.name}</h3>
                                        <p>{card.number}/{card.printedTotal}</p>
                                        <img src={card.images.small} alt={card.name} />
                                        <button
                                            type='button'
                                            onClick={() => {
                                                socket.emit('updateGame', `${id},image.url,${card.images.large}`)
                                            }}
                                            className='border-2 border-gray-200 mt-2 px-2 py-1 rounded-lg bg-white hover:bg-gray-200'>
                                            Mostar 20seg
                                        </button>
                                    </div>
                                )
                            }) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className='bg-white rounded-lg ml-10 py-5 mt-10 px-3 w-[350px] mx-auto'>
                        <iframe className='w-[290px] h-[400px] bg-white m-auto border-2 border-gray-800' src={`/card?id=${id}`} />
                    </div>
                </div>
            </div>
        </CompleteLayout>
    )
}