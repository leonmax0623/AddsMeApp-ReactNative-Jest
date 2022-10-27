/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { messagesGroupsUserStatus } from '../globals/Сonstants'

const get = (id, callback) => Http.get('messagesgroupsusers', {conditions:[{k:'messagesGroupId',v:id},{k:'status',v:messagesGroupsUserStatus.ACTIVE}]}).then((res) => callback(res))
const allGet = (id, callback) => Http.get('messagesgroupsusers', {conditions:[{k:'messagesGroupId',v:id}]}).then((res) => callback(res))
const byUserGet = (id, callback) => Http.get('messagesgroupsusers', {conditions:[{k:'clientId',v:id},{k:'status',v:messagesGroupsUserStatus.ACTIVE}]}).then((res) => callback(res))

const add = (data, callback) => Http.post('messagesgroupsusers', {data}).then((res) => callback ? callback(res) : () => {})
const register = (id) => Http.put('messagesgroupsusers', {data:{status:messagesGroupsUserStatus.ACTIVE},conditions:[{k:'id',v:id}]})
const remove = (id) => Http.put('messagesgroupsusers', {data:{status:messagesGroupsUserStatus.IN_ACTIVE},conditions:[{k:'id',v:id}]})
const fromGroupRemove = (clientid, groupid) => Http.put('messagesgroupsusers', {data:{status:messagesGroupsUserStatus.IN_ACTIVE},conditions:[{k:'clientId',v:clientid},{k:'messagesGroupId',v:groupid}]})
const toGroupRegister = (clientid, groupid) => Http.put('messagesgroupsusers', {data:{status:messagesGroupsUserStatus.ACTIVE},conditions:[{k:'clientId',v:clientid},{k:'messagesGroupId',v:groupid}]})

export {
	get,
	allGet,
	byUserGet,
	add,
	register,
	remove,
	fromGroupRemove,
	toGroupRegister
}