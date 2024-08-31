import pokeballSVG from '@/app/public/img/pokeball.png';
import Image from 'next/image';

export default function Prizes({ doubleLost,  lives, invert = false }: { doubleLost: '0' | '1'; lives: number, invert?: boolean }) {

    const getPrizesSvg = function() {
        const prizes = []
        for(var i = 0; i < 6; i++) {
            prizes.push(
                <div className={`border-4 mx-[1px] rounded-full px-0.5 py-0.5  ${ (doubleLost === '1' && i < 2) ? 'border-red-600' : ' border-transparent'}`} >
                    <Image
                        className={`${i < lives ? 'opacity-100':  'grayscale opacity-30'}`}
                        key={i}
                        width={30}
                        height={30}
                        src={pokeballSVG} alt='pokeball' />
                </div>
            )
        }
        return (
            <>
                {prizes}
            </>
        )
    }
    return (
        <div className={`flex flex-wrap w-[100px] content-center ${invert ? 'flex-row-reverse' : '' }`} >
            {getPrizesSvg()}
        </div>
    )
}