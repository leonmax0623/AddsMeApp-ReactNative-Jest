/*
 * adsme
 * (c) pavit.design, 2020
 */

import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

// helpers
import { Debug } from './Index'

// globals
import { API } from '../globals/Сonstants'

const get = (controller, data) => request(controller, 'get', data)
const post = (controller, data) => request(controller, 'add', data)
const put = (controller, data) => request(controller, 'update', data)
const remove = (controller, data) => request(controller, 'delete', data)

const request = (controller, method, data) => {
	return new Promise((resolve, reject) => {
		const url = `${API.url}${controller}/${method}`
		const options = {
			method:'POST',
			headers:new Headers({'Authentication':API.key}),
			body: data == null ? null : JSON.stringify(data)
		}
		fetch(url, options)
			.then(res => {
				console.log(res)
				return res.json()
			})
			.then(res => {
				console.log(res)
				if (res.code == 0) resolve(res)
				else reject(res)
			})
			.catch(error => {
				console.log(error)
				Debug.add(`http. url:${url}, data:${data}, error:${error}`)
				reject(error)
			})
	})
}

const file = (method, type, data, params, success, fail) => {
	params.push({name:'image',filename:`filename.${type}`,type:type,data:data})
	const url = `${API.url}${method}`
	RNFetchBlob.fetch('POST', url, {
		'Authentication':API.key,
		'Content-Type':'multipart/form-data'
	}, params)
	.then(res => {
		console.log(res)
		if (success) success(res)
	})
	.catch(error => {
		console.log(error)
		if (fail) fail(error)
	})
}

const download = (url, progress) => {
	if (url == null) return
	const { config, fs } = RNFetchBlob
	const file = url.replace(/^.*\//gi, ''),
		dest = `${fs.dirs.DocumentDir}/${file}`,
		tmpPath = `${dest}.download`
	fs.exists(tmpPath)
		.then(async (ext) => {
			if (ext) {
				if (Platform.OS === 'android') return fs.stat(dest)
				await fs.appendFile(dest, tmpPath, 'uri')
				return await fs.stat(tmpPath)
			}
			return Promise.resolve({size:0})
		})
		.then((stat) => {
			config({
				IOSBackgroundTask: true,
				IOSDownloadTask: true,
				path:Platform.OS === 'android' ? tmpPath : dest,
				fileCache: true
			})
			.fetch('GET', url, {Range:Platform.OS === 'android' ? `bytes=${stat.size}-` : ''})
			.progress((receivedStr, totalStr) => {
				if (progress)
					progress(receivedStr, totalStr)
			})
			.catch(async (err) => console.log('download file error:', err))
		})
		.then((file) => {
			if (Platform.OS === 'android') return fs.appendFile(dest, file.path(), 'uri')
		})
		.then(() => {
			if (Platform.OS === 'android') return fs.unlink(tmpPath)
			return null
		})
		.then(() => {
			return fs.stat(dest)
		})
		.then(async (stat) => {
			console.log('downloaded successfully')
		})
}

export {
	get,
	post,
	put,
	remove,
	file,
	request,
	download
}