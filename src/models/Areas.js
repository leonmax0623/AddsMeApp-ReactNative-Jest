/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const get = (callback) => Http.get('areas').then((res) => callback(res))

export {
	get
}