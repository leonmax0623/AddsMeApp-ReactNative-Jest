/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globasl
import { requestOderType } from '../globals/Сonstants'


const get = (clientId, partnerId, callback) => Http.get('partnerclientorders', {conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]}).then((res) => callback(res))
const byPartnerGet = (partnerId, callback) => Http.get('partnerclientorders', {conditions:[{k:'partnerId',v:partnerId}],orders:[{k:'id',isd:requestOderType.DESC}]}).then((res) => callback(res))

const add = (data) => Http.post('partnerclientorders', {data})

export {
	get,
	byPartnerGet,
	add
}