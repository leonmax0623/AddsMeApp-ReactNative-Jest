/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (partnerId, callback) => Http.get('partnerbonuses', {conditions:[{k:'partnerId',v:partnerId}]}).then((res) => callback ? callback(res) : () => {})

const add = (data, callback) => Http.post('partnerbonuses', {data}).then((res) => callback(res))
const update = (partnerId, data) => Http.put('partnerbonuses', {data,conditions:[{k:'partnerId',v:partnerId}]})

export {
	get,
	add,
	update
}