/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (clientId, latitude, longitude, callback) => Http.request('clientpositions', 'nearGet', {data:{clientId,latitude,longitude}}).then((res) => callback(res))

const add = (data) => Http.post('clientpositions', {data})

export {
	get,
	add
}