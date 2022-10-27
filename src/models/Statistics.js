/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (partnerId, callback) => Http.get('statistics', {conditions:[{k:'partnerId',v:partnerId}]}).then((res) => callback(res))

const add = (partnerId, clientId, type) => Http.post('statistics', {data:{partnerId,clientId,type}})

export {
	get,
	add
}