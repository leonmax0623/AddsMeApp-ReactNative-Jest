/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { requestOderType, partnerStatus } from '../globals/Сonstants'

const get = (id, callback) => Http.get('partners', {conditions:[{k:'id',v:id}]}).then((res) => callback(res))
const byIdGet = (id, callback) => Http.get('partners', {conditions:[{k:'id',v:id}]}).then((res) => callback(res.data[0]))
const nearGet = (latitude, longitude, clientId, callback) => Http.request('partners', 'nearGet', {data:{latitude,longitude,id:clientId}}).then((res) => callback(res))

const login = (phone, callback) => Http.request('partners', 'login', {conditions:[{k:'phone',v:phone}]}).then((res) => callback(res.data[0]))
const smsCheck = (phone, code, callback) => Http.request('partners', 'smsCheck', {conditions:[{k:'phone',v:phone},{k:'code',v:code}],orders:[{k:'id',isd:requestOderType.DESC}]}).then((res) => callback(res.data[0]))
const registerCheck = (phone, callback) => Http.request('partners', 'registerCheck', {conditions:[{k:'phone',v:phone}]}).then((res) => callback(res.data))

const add = (data, callback) => Http.post('partners', {data}).then((res) => callback(res))
const update = (id, data, callback) => Http.put('partners', {data,conditions:[{k:'id',v:id}]}).then((res) => callback ? callback(res) : () => {})
const start = (id) => Http.put('offers', {data:{status:partnerStatus.ACTIVE},conditions:[{k:'id',v:id}]})
const stop = (id) => Http.put('offers', {data:{status:partnerStatus.DELETED},conditions:[{k:'id',v:id}]})

const imageAdd = (id, type, idx, data) => Http.file('images/add/', type, data, [{name:'id',data:id},{name:'type',data:'partner'},{name:'index',data:idx}], () => {}, () => {})

export {
	get,
	byIdGet,
	nearGet,
	login,
	smsCheck,
	registerCheck,
	add,
	update,
	start,
	stop,
	imageAdd
}