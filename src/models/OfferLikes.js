/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (id, callback) => Http.get('offerlikes', {conditions:[{k:'offerId',v:id}]}).then((res) => callback ? callback(res) : () => {})
const add = (id, clientId, callback) => Http.post('offerlikes', {data:{clientId,offerId:id}}).then((res) => callback ? callback(res) : () => {})
const remove = (id, clientId, callback) => Http.remove('offerlikes', {conditions:[{k:'clientId',v:clientId},{k:'offerId',v:id}]}).then((res) => callback ? callback(res) : () => {})

export {
	get,
	add,
	remove
}