/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { pushType } from '../globals/Сonstants'


const add = (title, subtitle, text, userid, type, data) => {
	const pushdata = {
		title:title,
		subtitle:subtitle,
		text:text,
		tag:type === pushType.USER ? 'user_id' : (type === pushType.ADS ? `ads_partner_id_${userid}` : 'partner_id'),
		value:userid,
		data:data
	}
	Http.post('pushes', {data:pushdata})
}

export {
	add
}