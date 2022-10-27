/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { requestConcatinationType, requestOderType, requestConditionType } from '../globals/Сonstants'

const get = (id, callback) => {
	Http.get('messagesgroups', {conditions:[{k:'id',v:id}]})
		.then((res) => {
			if (callback) {
				const data = res.data[0]
				callback(data)
			}
		})
}
const parentsGet = (clientId, callback) => Http.get('messagesgroups', {conditions:[{k:'authorId',v:clientId},{k:'parentId',v:0,op:requestConditionType.IS_NULL}]}).then((res) => callback(res))
const chatsGet = (id, callback) => Http.request('messagesgroups', 'chatsGet', {id}).then((res) => callback(res))

const lastChatMessagesGet = (id, callback) => Http.get('messagesgroups', {conditions:[{k:'id',v:id},{k:'parentId',v:id,con:requestConcatinationType.OR}],orders:[{k:'dateCreate',isd:requestOderType.DESC}]}).then((res) => callback(res))
const lastGet = (id, parentId, authorId, callback) => Http.request('messagesgroups', 'lastGet', {data:{id,parentId,authorId}}).then((res) => callback(res))

const add = (data, callback) => Http.post('messagesgroups', {data}).then((res) => callback ? callback(res) : () => {})
const update = (id, data) => Http.put('messagesgroups', {data,conditions:[{k:'id',v:id}]})

const imageAdd = (id, type, data) => Http.file('images/add/', type, data, [{name:'id',data:id},{name:'type',data:'group'}], () => {}, () => {})

export {
	get,
	parentsGet,
	chatsGet,
	lastChatMessagesGet,
	lastGet,
	add,
	update,
	imageAdd
}