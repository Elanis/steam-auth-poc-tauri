import fetch from 'node-fetch';

import { APP_ID, PUBLISHER_KEY } from './constants.js';

export default async function validateToken(steamid, token, f) {
	const ticket = Buffer.from(token).toString('hex');
	const url = `https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/?key=${PUBLISHER_KEY}&appId=${APP_ID}&ticket=${ticket}`;

	const res = await fetch(url);
	if(res.status !== 200) {
		return f('ERR_API_INVALID_STATUS_CODE');
	}

	const data = (await res.json()).response.params;

	if(data.steamid !== steamid || data.ownersteamid !== steamid) {
		console.log(data);
		console.log(steamid);
		return f('ERR_INVALID_ACCOUNT');
	}

	if(data.publisherbanned) {
		return f('ERR_USER_BANNED');
	}

	return f(null, {
		id: steamid,
	});
}
