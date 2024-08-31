import { GameData } from "@/types/game.type";
import { Socket } from "socket.io-client";
import { InputGame } from "./InputGame";
import { ChangeEvent, useEffect, useState } from "react";
import pokeball from '../public/img/pokeball.png'
import _ from 'lodash';
import Image from "next/image";

type FormPlayerProps = {
    gameId: string;
    slug: 'p1' | 'p2';
    game: GameData;
    socket: Socket;
}

const playerTransalete = {
    'p1': 'Player 1',
    'p2': 'Player 2'
}

const prizes = [0,1,2,3,4,5]

export function FormPlayer({ gameId, game, socket, slug }: FormPlayerProps) {
    const [ player, setPlayer ] = useState(game.players[slug]);

    useEffect(() => {
        setPlayer(game.players[slug]);
    }, [game.players])

    return (
        <div className='my-4 w-full'>
            <div className="flex flex-col md:flex-row">
                <div className='flex-1'>
                    <InputGame
                        label={`${playerTransalete[slug]} Nome`}
                        value={player.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            socket.emit('updateGame', `${gameId},players.${slug}.name,${e.target.value}`)
                        }}
                        id={`${slug}-name`}/>
                </div>
                <div className='flex-1'>
                    <InputGame
                        label={`${playerTransalete[slug]} Nick`}
                        value={player.nickname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            socket.emit('updateGame', `${gameId},players.${slug}.nickname,${e.target.value}`)
                        }}
                        id={`${slug}-nickname`}/>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className='flex-1'>
                    <InputGame
                        label={`${playerTransalete[slug]} Região`}
                        value={player.county}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            socket.emit('updateGame', `${gameId},players.${slug}.county,${e.target.value}`)
                        }}
                        id={`${slug}-Country`}/>
                </div>
                <div className='flex-1'>
                    <div className='flex-1'>
                    <InputGame
                        label={`${playerTransalete[slug]} Desempenho`}
                        value={player.history}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            socket.emit('updateGame', `${gameId},players.${slug}.history,${e.target.value}`)
                        }}
                        id={`${slug}-history`}/>
                </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row'>
                <div className="flex pl-5 flex-col md:flex-row">
                    <span className='mt-1 mr-3'>Prêmios</span>
                    {prizes.map(index => {
                        return <Image
                            width={20}
                            alt='pokebal'
                            src={pokeball}
                            onClick={() => {
                                socket.emit('updateGame', `${gameId},prize.${slug},${++index}`)
                            }}
                            className={`h-[20px] mt-2 mx-1 cursor-pointer ${index < game.prize[slug] ? '' : 'grayscale'}`}/>
                    })}
                </div>
                <div className="flex pl-5 flex-col md:flex-row">
                    <span className='mt-1 mr-3'>Pontuação</span>
                    <button
                        className='border-2 border-gray-200 px-2 py-1 rounded-lg hover:bg-white'
                        onClick={() => {
                        socket.emit('updateGame', `${gameId},score.${slug},${_.min([++game.score[slug], 9])}`)
                    }}>+ 1</button>
                    <button
                        className='border-2 border-gray-200 px-2 py-1 rounded-lg hover:bg-white'
                        onClick={() => {
                        socket.emit('updateGame', `${gameId},score.${slug},${_.max([--game.score[slug], 0])}`)
                    }}>- 1</button>
                </div>
            </div>
            <div className='flex flex-col md:flex-row'>
                <span className='mt-1 mr-3 pl-5'>V Star</span>
                <button
                    className={`mr-2 border-2 border-gray-200 px-2 py-1 rounded-lg ${player.flags.vstar === '0' ? 'border-pink-800' : ''}`}
                    onClick={() => {
                    socket.emit('updateGame', `${gameId},players.${slug}.flags.vstar,0`)
                }}>Usado</button>
                <button
                    className={`border-2 border-gray-200 px-2 py-1 rounded-lg ${player.flags.vstar === '1' ? 'border-pink-800' : ''}`}
                    onClick={() => {
                    socket.emit('updateGame', `${gameId},players.${slug}.flags.vstar,1`)
                }}>Não usado</button>
            </div>
            <div className='flex flex-col md:flex-row mt-2'>
                <span className='mt-1 mr-3 pl-5'>Double lost</span>
                <button
                    className={`mr-2 border-2 border-gray-200 px-2 py-1 rounded-lg ${player.flags.doubleLost === '1' ? 'border-pink-800' : ''}`}
                    onClick={() => {
                    socket.emit('updateGame', `${gameId},players.${slug}.flags.doubleLost,1`)
                }}>Sim</button>
                <button
                    className={`mr-2 border-2 border-gray-200 px-2 py-1 rounded-lg ${player.flags.doubleLost === '0' ? 'border-pink-800' : ''}`}
                    onClick={() => {
                    socket.emit('updateGame', `${gameId},players.${slug}.flags.doubleLost,0`)
                }}>Não</button>
            </div>
        </div>
    )
}