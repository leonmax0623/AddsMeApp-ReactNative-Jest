/*
 * adsme
 * (c) pavit.design, 2020
 */

import { API } from "../globals/Сonstants"

const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

const codeGenerate = (len) => {
	let digits = '0123456789', code = ''
	for (let i = 0; i < len; i++)
		code += digits.charAt(Math.floor(Math.random() * digits.length))
	return code
}

const codeFormatter = (code) => code.replace(/(\d{4})(\d{2})(\d+)/gi, '$1-$2-$3')

const codeClear = (code) => code.replace(/\-/gi, '')

const phoneNormalize = (phone) => {
	if (!empty(phone)) {
		phone = phoneClear(phone)
		if (!empty(phone)) phone = phone.length < 10 ? '' : phone
		if (!empty(phone)) phone = '7' + phone.slice(1)
	}
	return phone || null
}

const phoneClear = (phone) => {
	if (!empty(phone)) {
		phone = phone.replace(/\s+/gi, '')
		phone = phone.replace(/-/gi, '')
		phone = phone.replace(/\(/gi, '')
		phone = phone.replace(/\)/gi, '')
		phone = phone.replace(/\+/gi, '')
		phone = phone.replace(/[^\d]+/gi, '')
	}
	return phone || null
}

const phoneFormatter = (phone) => empty(phone) ? phone : phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')

const phoneMask = (phone) => '+7 (xxx) xxx-xx-' + phoneFormatter(phone).substr(-2)

const empty = (text) => text == null || text == '' || text.toString().trim() == ''

const filenameGet = (url) => url.replace(/^.*\//gi, '')

const initialsGet = (firstName, lastName) => {
	firstName = !empty(firstName) ? firstName.trim() : firstName
	lastName = !empty(lastName) ? lastName.trim() : lastName
	firstName = !empty(firstName) ? firstName[0] : ''
	lastName = !empty(lastName) ? lastName[0] : ''
	return empty(firstName) && empty(lastName) ? '*' : `${firstName}${lastName}`.trim()
}

const moneyFormat = (amount, nofraction) => amount ? amount.toFixed(nofraction === undefined || nofraction === true ? 2 : 0).replace(/(\d)(?=(\d{3})+(?!\d)\.?)/g, '$1 ') : 0

/*
const colorGet = (id, isuser) => {
	const colors1 = ['#80bd9e','#336b87','#ba5536','#a43820','#68829E','#598234','#486b00','#6fb98f','#2c7873','#fb6542'],
		colors2 = ['#ffbb00','#5bc8ac','#f18d9e','#86ac41','#7da3a1','#9b4f0f','#c99e10','#f0810f','#c05805','#db9501']
	id = id%10
	return isuser ? colors1[id] : colors2[id]
}
*/

const colorGet = () => '#80bd9e'

const isVideo = (filename) => filename.indexOf('.mov') !== -1 || filename.indexOf('.mp4') !== -1 || filename.indexOf('.m4v') !== -1 || filename.indexOf('.3gp') !== -1

const nameMask = (name) => {
	const initials = name.split(' ')
	let mask = '***'
	if (initials[0]) mask = initials[0][0] + initials[0].split('').map(v => '*').join('')
	if (initials[1]) mask += ' ' + initials[1][0] + initials[1].split('').map(v => '*').join('')
	return mask
}

const linkNormalize = (link) => {
	link = link.replace('https://', '').replace('http://', '')
	return `https://${link}`
}

const uniqueLink = () => `?${codeGenerate(20)}`

const payUrlGet = (id) => `${API.pay}?userid=${id}`

export {
	uuidv4,
	codeGenerate,
	codeFormatter,
	codeClear,
	phoneNormalize,
	phoneFormatter,
	phoneClear,
	phoneMask,
	empty,
	filenameGet,
	initialsGet,
	moneyFormat,
	colorGet,
	isVideo,
	nameMask,
	linkNormalize,
	uniqueLink,
	payUrlGet
}