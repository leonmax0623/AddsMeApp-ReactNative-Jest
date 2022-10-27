/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { requestConcatinationType, requestOderType, mediaType } from '../globals/Сonstants'


const byUserGet = (id, userid, callback) => Http.request('messages', 'byUserGet', {id,userId:userid}).then((res) => callback(res))
const chatsGet = (id, callback) => Http.request('messages', 'chatsGet', {id}).then((res) => callback(res))

const lastChatMessagesGet = (id, callback) => Http.get('messages', {conditions:[{k:'id',v:id},{k:'parentId',v:id,con:requestConcatinationType.OR}],orders:[{k:'dateCreate',isd:requestOderType.DESC}]}).then((res) => callback(res))
const lastGet = (id, parentId, authorId, callback) => Http.request('messages', 'lastGet', {data:{id,parentId,authorId}}).then((res) => callback(res))

const add = (data, callback) => Http.post('messages', {data}).then((res) => callback ? callback(res) : () => {})

const messageGet = (type, message) => {
	switch (type) {
		case mediaType.STICKER:
			return 'Стикер'
		case mediaType.IMAGE:
			return 'Изображение'
		case mediaType.VIDEO:
			return 'Видео'
		case mediaType.AUDIO:
			return 'Аудиосообщение'
	}
	return message
}

export {
	byUserGet,
	chatsGet,
	lastChatMessagesGet,
	lastGet,
	add,
	messageGet
}