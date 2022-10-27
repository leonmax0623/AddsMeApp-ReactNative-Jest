/*
 * adsme
 * (c) pavit.design, 2020
 */

const tsDay = 86400

const now = () => Math.round(new Date().getTime() / 1000)
const nowDay = () => Math.floor(now() / tsDay)

const yearsGet = (date) => new Date(now()*1000 - date.getTime()).getFullYear() - 1970

const todayGet = () => {
	const now = new Date()
	return Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000)
}

const isToday = (date) => {
	const today = new Date()
	return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()
}
const isYestoday = (ts) => {
	const today = todayGet()
	const yestoday = today - tsDay
	return ts < today && ts >= yestoday
}
const isTomorrow = (ts) => {
	const today = todayGet()
	const tomorrow = today + (tsDay * 2)
	return ts >= (today + tsDay) && ts < tomorrow
}

const isWeek = (ts) => {
	const today = todayGet()
	return ts >= (today - (tsDay * 7)) && ts < today
}

const get = (ts, options) => {
	const d = new Date(ts*1000)
	const months = {
		short:	['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
		full:	['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
	}
	const weekdays = ['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье']
	options = options || {}
	let m = d.getMonth(), day = d.getDate(), year = d.getFullYear(), separator = '.', yearLetter = '', yearSeparator = ''
	if (options.showMonthFullName) {
		m = months.full[m]
		separator = ' '
	}
	else if (options.showMonthShortName) {
		m = months.short[m]
		separator = ' '
	}
	else {
		m = m + 1
		m = m > 9 ? m : `0${m}`
		day = day > 9 ? m : `0${day}`
	}
	let time = ''
	if (options.showTime) {
		let h = d.getHours(), min = d.getMinutes(), s = d.getSeconds()
		h = h === 0 ? '00' : h
		min = min > 9 ? min : `0${min}`
		s = s > 9 ? s : `0${s}`
		s = options.showSeconds ? `:${s}` : ''
		time = `, ${h}:${min}${s}`
	}
	yearSeparator = options.yearSeparator ? `${options.yearSeparator} ` : separator
	yearLetter = options.yearLetter ? ` ${options.yearLetter} ` : ''
	if (options.yearHide) {
		year = ''
		yearLetter = ''
		yearSeparator = ''
	}
	if (options.neerCheck) {
		let istoday = isToday(d), isyestoday = isYestoday(ts), istomorrow = isTomorrow(ts), isweek = isWeek(ts)
		if (istoday || isyestoday || istomorrow || isweek) {
			m = ''
			day = ''
			separator = ''
			year = ''
			yearLetter = ''
			yearSeparator = ''
			if (isweek) {
				const weekDay = new Date(ts*1000).getDay()
				day = weekdays[weekDay === 0 ? 6 : weekDay - 1]
			}
			if (istoday) day = 'сегодня'
			if (isyestoday) day = 'вчера'
			if (istomorrow) day = 'завтра'
		}
	}
	return `${day}${separator}${m}${yearSeparator}${year}${yearLetter}${time}`
}

const timeGet = (ts) => {
	const d = new Date(ts*1000)
	let h = d.getHours(), min = d.getMinutes(), s = d.getSeconds()
	h = h === 0 ? '00' : h
	min = min > 9 ? min : `0${min}`
	s = s > 9 ? s : `0${s}`
	s = `:${s}`
	return `${h}:${min}${s}`
}

export {
	tsDay,
	get,
	yearsGet,
	now,
	nowDay,
	timeGet
}