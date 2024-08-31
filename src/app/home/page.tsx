'use client'

import { useEffect, useRef, useState } from 'react'

import type { Socket } from 'socket.io-client'
import { SocketClient } from '@/app/services/socket-client'
import CompleteLayout from '../components/CompleteLayout'
import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid';
import Link from 'next/link'

let socket: undefined | Socket

export default function Home() {
    const router = useRouter()

    return (
        <CompleteLayout>
            <div className='my-10'>
                <button
                    className='bg-blue-200 px-2 py-2 rounded-lg'
                    onClick={() => {
                        router.push(`/dashboard?id=${uuid()}`)
                    }}
                >
                    new Game
                </button>
            </div>
        </CompleteLayout>
    )
}