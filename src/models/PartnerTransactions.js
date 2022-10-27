/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (partnerId, callback) => Http.get('partnertransactions', {conditions:[{k:'partnerId',v:partnerId}]}).then((res) => callback(res))


export {
	get
}