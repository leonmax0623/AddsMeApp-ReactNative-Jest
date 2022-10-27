/*
 * adsme
 * (c) pavit.design, 2020
 */

 // helpers
import { Http } from '../helpers/Index'

// globals
import { partnerClientStatus } from '../globals/Сonstants'

const get = (clientId, partnerId, callback) => Http.get('partnerclients', {conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId},{k:'status',v:partnerClientStatus.ACTIVE}]}).then((res) => callback(res))
const byPartnerGet = (id, callback) => Http.request('partnerclients', 'byPartnerGet', {id}).then((res) => callback(res))
const byPartnerGetLite = (partnerId, callback) => Http.get('partnerclients', {conditions:[{k:'partnerId',v:partnerId}]}).then((res) => callback(res))
const byClientActiveGet = (clientId, callback) => Http.get('partnerclients', {conditions:[{k:'clientId',v:clientId},{k:'status',v:partnerClientStatus.ACTIVE}]}).then((res) => callback(res))

const register = (clientId, partnerId, callback) => {
	Http.get('partnerclients', {conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]})
		.then((res) => {
			if (res.data.length > 0) {
				if (callback) callback(res.data[0])
				update(clientId, partnerId, partnerClientStatus.ACTIVE)
			}
			else Http.post('partnerclients', {data:{clientId,partnerId,status:partnerClientStatus.ACTIVE}})
		})
}
const unregister = (clientId, partnerId) => update(clientId, partnerId, partnerClientStatus.IN_ACTIVE)
const update = (clientId, partnerId, status) => Http.put('partnerclients', {data:{status},conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]})
const commentAdd = (clientId, partnerId, comment) => Http.put('partnerclients', {data:{comment},conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]})
const discountUpdate = (clientId, partnerId, discount) => Http.put('partnerclients', {data:{discount},conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]})

const insert = (clientId, partnerId, data) => Http.put('partnerclients', {data,conditions:[{k:'clientId',v:clientId},{k:'partnerId',v:partnerId}]})

export {
	get,
	byPartnerGet,
	byPartnerGetLite,
	byClientActiveGet,
	register,
	unregister,
	commentAdd,
	discountUpdate,
	insert
}