/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (callback) => Http.get('chats').then((res) => callback(res))
const nearGet = (latitude, longitude, callback) => Http.request('chats', 'nearGet', {data:{latitude,longitude}}).then((res) => callback(res))
const lastNearGet = (id, authorId, latitude, longitude, callback) => Http.request('chats', 'lastNearGet', {data:{id,authorId,latitude,longitude}}).then((res) => callback(res))

const add = (data) => Http.post('chats', {data})

export {
	get,
	lastNearGet,
	nearGet,
	add
}