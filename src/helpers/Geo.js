/*
 * adsme
 * (c) pavit.design, 2020
 */

import haversine from 'haversine-distance'

// globals
import { MAPS } from '../globals/Сonstants'


const request = (latitude, longitude, success, fail) => {
	fetch(MAPS.urlGeoCodes(latitude, longitude), {method:'GET'})
		.then(res => {
			console.log(res)
			return res.json()
		})
		.then(res => {
			console.log(res)
			if (success) success(res)
		})
		.catch(error => {
			console.log(error)
			if (fail) fail(error)
		})
}

const get = (latitude, longitude, success, fail) => request(latitude, longitude, (res) => {
	if (res.status == 'OK') {
		let adr = res.results[0]
		let address = `${adr.address_components[1].short_name}, ${adr.address_components[0].long_name}`
		success(address)
	} else {
		if (res.status != 'ZERO_RESULTS') fail()
	}
}, () => fail ? fail() : {})

const distanceGet = (a, b) => {
	const distance = haversine(a, b)
	return isNaN(distance) ? 0 : distanceFormat(distance)
}

const distanceFormat = (distance) => distance ? (distance / 1000).toFixed(2).replace('.00', '') : 0

const routeGet = (distance) => {
	distance = parseFloat(distance)
	if (distance < 1) return `${(distance * 1000)} м`
	return `${distance.toFixed(1)} км`
}

const durationGet = (duration) => `${Math.round(duration)} мин.`

export {
	get,
	distanceGet,
	distanceFormat,
	routeGet,
	durationGet
}