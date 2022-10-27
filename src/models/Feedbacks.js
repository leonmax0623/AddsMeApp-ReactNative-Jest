/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

const add = (data) => Http.post('feedbacks', {data})

export {
	add
}