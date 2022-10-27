/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { offerStatus } from '../globals/Сonstants'

const get = (partnerId, callback) => Http.get('offers', {conditions:[{k:'partnerId',v:partnerId},{k:'status',v:offerStatus.ACTIVE}]}).then((res) => callback(res))
const activeGet = (partnerId, callback) => Http.request('offers', 'activeGet', {data:{partnerId}}).then((res) => callback(res))

const add = (data, callback) => Http.post('offers', {data}).then((res) => callback ? callback(res) : () => {})
const update = (id, data) => Http.put('offers', {data,conditions:[{k:'id',v:id}]})
const remove = (id) => Http.put('offers', {data:{status:offerStatus.IN_ACTIVE},conditions:[{k:'id',v:id}]})

const imageAdd = (id, type, idx, data) => Http.file('images/add/', type, data, [{name:'id',data:id},{name:'type',data:'offer'},{name:'index',data:idx}], () => {}, () => {})

export {
	get,
	activeGet,
	add,
	update,
	remove,
	imageAdd
}