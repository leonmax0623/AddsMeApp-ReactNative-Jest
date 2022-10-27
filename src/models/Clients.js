/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { requestOderType } from '../globals/Сonstants'

const get = (id, callback) => Http.get('clients', {conditions:[{k:'id',v:id}]}).then((res) => callback(res))
const byPhonesGet = (phones, callback) => Http.request('clients', 'byPhonesGet', {phones}).then((res) => callback(res))
const byIdsGet = (ids, callback) => Http.request('clients', 'byIdsGet', {ids}).then((res) => callback(res))
const byCodeGet = (code, callback) => Http.get('clients', {conditions:[{k:'code',v:code}]}).then((res) => callback(res))

const login = (phone, callback) => Http.request('clients', 'login', {conditions:[{k:'phone',v:phone}]}).then((res) => callback(res.data[0]));
const smsCheck = (phone, code, callback) => Http.request('clients', 'smsCheck', {conditions:[{k:'phone',v:phone},{k:'code',v:code}],orders:[{k:'id',isd:requestOderType.DESC}]}).then((res) => callback(res.data[0]))
const registerCheck = (phone, callback) => Http.request('clients', 'registerCheck', {conditions:[{k:'phone',v:phone}]}).then((res) => callback(res.data))

const add = (data, callback) => Http.post('clients', {data}).then((res) => callback ? callback(res) : () => {})
const update = (id, data) => Http.put('clients', {data,conditions:[{k:'id',v:id}]})

const imageAdd = (id, type, data) => Http.file('images/add/', type, data, [{name:'id',data:id},{name:'type',data:'client'}], () => {}, () => {})

export {
	get,
	byPhonesGet,
	byIdsGet,
	byCodeGet,
	add,
	update,
	login,
	smsCheck,
	registerCheck,
	imageAdd
}