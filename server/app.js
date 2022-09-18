import { Server } from 'socket.io';

import validateToken from './validateToken.js';

const io = new Server(9876, {
	cors: 'https://tauri.localhost'
});

console.log('Listening to socket.io');

io.on('connection', (socket) => {
	const clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
	console.log('Client connected: ' + socket.id + ' - ' + clientIpAddress);

	socket.on('auth', (data) => {
		validateToken(data.steamid, data.token, (err, authReturn) => {
			if(err) {
				console.error('Client authentication failed - SOCKETID: ' + socket.id + ' - ' + err);
				return;
			}

			console.log('Client authenticated - SOCKETID: ' + socket.id + ' - STEAMID: ' + authReturn.id);
		});
	});
});