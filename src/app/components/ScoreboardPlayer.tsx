import { Player } from "@/types/player.type";
import Prizes from "./Prizes";
import Image from "next/image";
import VStar from '../public/img/vstar-logo.png'

type ScoreboardPlayerProps = {
    player: Player;
    prize: number;
    invert?: boolean;
    tie: '1' | '0';
}

export default function ScoreboardPlayer({ player, prize, invert = false, tie }: ScoreboardPlayerProps) {
    return (
        <div className='flex flex-1 flex-col'>
            <div className={`flex ${invert ? 'flex-row-reverse' : 'text-right'}`}>
                <div className='flex flex-col w-full'>
                    <div className='mt-6 text-5xl'>
                        <span className=''>{player.name}</span>
                    </div>
                    <span className='text-3xl'>{player.nickname}</span>
                </div>
                <div className={`${invert ? 'mr-6' : 'ml-6'} mt-4`}>
                    <Prizes doubleLost={player.flags.doubleLost} lives={prize} invert={invert} />
                </div>
            </div>
            <div className={`w-full mt-[-30px] ${!invert ? '' : ''}`}>
                <div className={`flex  ${invert ? 'flex-row-reverse ml-44' : 'mr-44'}`}>
                    <div className={`w-full ${invert ? 'text-left ml-2' : 'text-right mr-2'}`}>
                        <span className='text-2xl'>{player.county}</span>
                    </div>
                    <div className='min-w-32 text-center text-4xl'>
                        <span>{player.history}</span>
                    </div>
                    <div className={`text-center ${invert ? 'flex-row-reverse mr-2' : 'ml-2'}`}>
                        <span className={`inline-block mt-2 ${player.flags.vstar === '1' ? '' : 'grayscale'}`}>
                            <Image height={100} src={VStar} alt='vesus' />
                        </span>
                    </div>
                </div>
            </div>
            { player.flags.win === '1' ? (
                    <div className={`absolute text-9xl top-5 text-blue-200 animate-bounce opacity-40 ${invert ? 'right-20' : 'left-20'}`}>
                    <span>WIN</span>
                </div>
                ) : (
                    <></> 
                )
            }
            { tie === '1' ? (
                    <div className={`absolute text-9xl top-5 text-orange-200 animate-bounce opacity-40 ${invert ? 'right-20' : 'left-20'}`}>
                    <span>TIE</span>
                </div>
                ) : (
                    <></> 
                )
            }
            
        </div>
    )
}