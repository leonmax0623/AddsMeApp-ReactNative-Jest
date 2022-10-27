/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { requestConcatinationType, requestOderType } from '../globals/Сonstants'

const byClientGet = (clientId, partnerId, callback) => Http.get('partnerclientmessages', {conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}],orders:[{k:'dateCreate',isd:requestOderType.ASC}]}).then((res) => callback(res))
const chatsGet = (id, callback) => Http.request('partnerclientmessages', 'chatsGet', {id}).then((res) => callback(res))
const chatsPartnerGet = (id, callback) => Http.request('partnerclientmessages', 'chatsPartnerGet', {id}).then((res) => callback(res))

const lastChatMessagesGet = (id, callback) => Http.get('partnerclientmessages', {conditions:[{k:'id',v:id},{k:'parentId',v:id,con:requestConcatinationType.OR}],orders:[{k:'dateCreate',isd:requestOderType.DESC}]}).then((res) => callback(res))
const lastGet = (id, parentId, isClient, callback) => Http.request('partnerclientmessages', 'lastGet', {data:{id,parentId,isClient:isClient?0:1}}).then((res) => callback(res))

const unreadCountGet = (id, ts, callback) => Http.request('partnerclientmessages', 'unreadCountGet', {data:{id,dateCreate:ts}}).then((res) => callback(res))

const add = (data, callback) => Http.post('partnerclientmessages', {data}).then((res) =>  callback ? callback(res) : () => {})

export {
	byClientGet,
	chatsGet,
	chatsPartnerGet,
	lastChatMessagesGet,
	lastGet,
	unreadCountGet,
	add
}