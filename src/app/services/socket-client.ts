import io from 'socket.io-client'

import type { Socket } from 'socket.io-client'

export async function SocketClient(signal: AbortSignal) {
    await fetch("/api/socket", { signal });

    const socket: Socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("Connected, connection id is - ", socket.id);
    });

    return socket;
}