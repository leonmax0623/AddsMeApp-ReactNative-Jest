/*
 * adsme
 * (c) pavit.design, 2020
 */

import RNFetchBlob from 'rn-fetch-blob'

// globals
import { API } from '../globals/Сonstants'

const add = (filename, type, data, ispath) => {
	const params = [{name:'type',data:type},{name:'name',data:filename},{name:'file',filename,data:ispath ? RNFetchBlob.wrap(data.replace('file://', '')) : data}]
	const url = `${API.url}files/add/`
	RNFetchBlob.fetch('POST', url, {
		'Authentication':API.key,
		'Content-Type':'multipart/form-data'
	}, params)
	.then((res) => console.log(res))
	.catch((error) => console.log(error))
}

export {
	add
}

