/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (partnerId, callback) => Http.get('partnerdiscounts', {conditions:[{k:'partnerId',v:partnerId}]}).then((res) => callback ? callback(res) : () => {})

const add = (data, callback) => Http.post('partnerdiscounts', {data}).then((res) => callback ? callback(res) : () => {})
const update = (id, data) => Http.put('partnerdiscounts', {data,conditions:[{k:'id',v:id}]})

const remove = (id) => Http.request('partnerdiscounts', 'delete', {conditions:[{k:'id',v:id}]})

export {
	get,
	add,
	update,
	remove
}