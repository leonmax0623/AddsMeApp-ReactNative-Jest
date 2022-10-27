/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (id, callback) => Http.get('deletedmessages', {conditions:[{k:'clientId',v:id}]}).then((res) => callback(res))

const add = (clientId, messageId, type) => Http.post('deletedmessages', {data:{clientId,messageId,type}})

const remove = (clientid, messageId, type) => Http.request('deletedmessages', 'delete', {conditions:[{k:'clientId',v:clientid},{k:'messageId',v:messageId},{k:'type',v:type}]})

export {
	get,
	add,
	remove
}