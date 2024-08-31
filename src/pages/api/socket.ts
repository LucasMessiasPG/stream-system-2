'use server'

import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'
import { Server } from 'socket.io'
import { v4 as uuid } from 'uuid';
import { GameData } from '@/types/game.type'
import { BuildGame } from './BuildGame'
import _ from 'lodash';
import { Cache } from 'memory-cache';
// @ts-ignore
import pokemon from 'pokemontcgsdk';

interface SocketServer extends HTTPServer {
	io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
	server: SocketServer;
}

declare module 'socket.io' {
	interface Socket {
		sendMessage(action: string, data: Record<string, any>): void;
	}	
}

interface NextApiResponseWithSocket extends NextApiResponse {
	socket: SocketWithIO;
}


let io: IOServer;
const cache = new Cache<string, GameData>();
const GAME_TIME = 1000 * 60 * 60 * 6
pokemon.configure({apiKey: process.env.TCG_TOKEN})
const cardTimer = new Map();

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
	if (res.socket.server.io) {
		if (io === res.socket.server.io) {
			console.log('Socket is already running');
			return res.end();
		}
	}
	console.log('Socket is initializing');
	io = new Server(res.socket.server);

	res.socket.server.io = io;

	io.on('connection', (socket) => {
		console.log('new client - ', socket.id)

		socket.sendMessage = function (action, data) {
			socket.emit(action, JSON.stringify(data));
		}

		socket.on('getGame', (id: string) => {
			socket.join(id)
			let game = cache.get(id);

			if (!game) {
				game = BuildGame({ id })
				cache.put(id, game, GAME_TIME);
			}
			socket.sendMessage('game', game)
		})

		socket.on('isScoreBoard', (id: string) => {
			socket.join(`${id}-scoreboard`)
			
			const config = cardTimer.get(id);
			
			if (config && config.url)
				socket.emit('showImg20', config.url);
		})

		socket.on('newGame', () => {
			const id = uuid();
			socket.join(id)

			let game = BuildGame({ id });
			
			cache.put(id, game, GAME_TIME);
			socket.sendMessage('game', game)
		})

		socket.on('getCard', (query: string) => {
			let matchNumbers = query.match(new RegExp('^([0-9]{1,3})\/([0-9]{1,3})$'));
			let term = matchNumbers && matchNumbers[1] !== undefined ? `number:${matchNumbers[1]} set.printedTotal:${matchNumbers[2]}` : `name:${query}`;

			pokemon.card.where({ q: term})
				.then((result: any) => {
					const cards = result.data.map((card: any) => {
						return {
							name: card.name,
							number: card.number,
							printedTotal: card.set.printedTotal,
							images: card.images
						}
					});
					socket.sendMessage('getCard', cards);
				})
		})
		socket.on('showImg20', (data: string) => {
			let [id, url] = data.split(',')
			io.to(id).emit('showImg20', url);
			
		})
		socket.on('resetGame', (id: string) => {
			let game = BuildGame({ id });
			
			cache.put(id, game, GAME_TIME);
			socket.sendMessage('game', game)
			io.to(id).emit('game', JSON.stringify(game))
		})

		socket.on('updateGame', (field: string) => {
			let [id, key, value] = field.split(',')

			if (key === 'timer.current' && +value > 999) {
				key = 'timer.status'
				value = 'stoped'
			}

			let game = cache.get(id);

			if (game) {
				game = _.set(game, key, value)
				if (key === 'image.url') {
					
					const config = cardTimer.get(id);

					if (config)
						clearTimeout(config.timer);

					const timer = setTimeout(() => {
						let newGame = cache.get(id);
						
						if (newGame) {
							newGame.image.url = null;
							cache.put(id, newGame, GAME_TIME)
							io.to(id).emit('game', JSON.stringify(game))
						}
					}, 1000 * 20)

					cardTimer.set(id, { timer });
				}

				cache.put(id, game, GAME_TIME)
				
				const listKeyToBroadcast = [
					'timer.current',
					'image.url',
				]
	
				if (listKeyToBroadcast.includes(key))
					io.to(`${id}-scoreboard`).emit('game', JSON.stringify(game))
				else
					io.to(id).emit('game', JSON.stringify(game))
			}
		})

		socket.on('actions', (action: string) => {
			switch(action) {
				case 'getGame':
					socket.sendMessage('game', BuildGame())
			}
		})
	});

	return res.end();
}

export default SocketHandler