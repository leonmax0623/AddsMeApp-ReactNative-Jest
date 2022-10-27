/*
 * adsme
 * (c) pavit.design, 2020
 */

const url = 'http://adsme.app'
//const url = 'http://localhost'

export const API = {
	url		: `${url}/api/`,
	assets	: `${url}/assets/`,
	chats	: `${url}/assets/chats/`,
	app		: `${url}/getapp.html`,
	policy	: `${url}/privacy.html`,
	offer	: `${url}/offer.html`,
	tos		: `${url}/tos.html`,
	pay		: `${url}/pay.php`,
	partner	: 'adsme://partner/',
	key		: '809ba2c6-6f3f-462d-a34e-d82ce94179a5',
	pushKey	: '7c9e9b14-2937-43c1-9eb2-6c9724ce43cf',
	version	: '1.2'
}

export const MAPS = {
	key				: 'AIzaSyDrHcpTYVLL6WigXhj7eRgQODfNuw6qGo0',
	urlGeoCodes:	(latitude, longitude) => `https://maps.googleapis.com/maps/api/geocode/json?language=ru&address=${latitude},${longitude}&key=${MAPS.key}`,
	deltas: {
		latitude	: .009,
		longitude	: .009
	}
}

export const requestConditionType = {
	EQUAL		: 0,
	NOT_EQUAL	: 1,
	LESS		: 2,
	MORE		: 3,
	IS_NULL		: 4,
	NOT_NULL	: 5,
	LIKE		: 6
}

export const requestConcatinationType = {
	AND		: 0,
	OR		: 1
}

export const requestOderType = {
	ASC			: 0,
	DESC		: 1
}

export const mediaType = {
	EMPTY		: 0,
	TEXT		: 1,
	STICKER		: 2,
	IMAGE		: 3,
	VIDEO		: 4,
	AUDIO		: 5,
	INFO		: 6,
	GROUP		: 7
}

export const feedbackType = {
	FEEDBACK	: 0,
	USER		: 1,
	OFFER		: 2,
	PARTNER		: 3
}

export const orderType = {
	PAY			: 0,
	REFUND		: 1
}
export const orderTypeName = ['Покупка','Возврат']

export const messageStatus = {
	NOT_READED	: 0,
	READED		: 1
}

export const partnerClientStatus = {
	ACTIVE		: 0,
	IN_ACTIVE	: 1
}

export const chatType = {
	MESSAGE		: 0,
	GROUP		: 1,
	PARTNER		: 2
}

export const messagesGroupsUserStatus = {
	ACTIVE		: 0,
	IN_ACTIVE	: 1
}

export const offerStatus = {
	ACTIVE		: 0,
	IN_ACTIVE	: 1
}

export const partnerStatus = {
	ACTIVE		: 0,
	BANNED		: 1,
	DELETED		: 2
}

export const transactionsType = {
	DEBIT		: 0,
	CREDIT		: 1
}
export const transactionsTypeName = ['Поступление','Расход']

export const transactionsStatus = {
	ADD			: 0,
	FINISH		: 1
}
export const transactionsStatusName = ['Новая операция','Операция завершена']

export const statisticType = {
	VIEW_PROFILE	: 0,
	VIEW_ADS		: 1
}

export const clientStatus = {
	ACTIVE		: 0,
	BANNED		: 1,
	DELETED		: 2
}

export const pushType = {
	USER		: 0,
	PARTNER		: 1,
	ADS			: 2
}
