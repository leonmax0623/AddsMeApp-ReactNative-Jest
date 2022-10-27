import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TextInput, Dimensions } from 'react-native'

// models
import { PartnerClientMessages, DeletedMessages, Pushes } from '../models/Index'

// helpers
import { Utils, Storage, Dates } from '../helpers/Index'

// globals
import { messageStatus, mediaType, chatType, pushType } from '../globals/Сonstants'

export default MessagePopup = (props) => {
	const { navigation, styles, partner, user, callback }  = props
	let message = null, parentId = 0
	const send = () => {
		if (Utils.empty(message)) return
		let data = {
			clientId:user.id,
			clientName:user.name,
			partnerId:partner.id,
			partnerName:partner.name,
			statusClient:messageStatus.READED,
			statusPartner:messageStatus.NOT_READED,
			isClient:true,
			message:message,
			type:mediaType.TEXT
		}
		if (parentId !== 0) data.parentId = parentId
		PartnerClientMessages.add(data, (res) => {
			const id = parentId === 0 ? res.data.id : parentId
			Storage.get('unreadMessages', (unreadMessages) => {
				unreadMessages = JSON.parse(unreadMessages) || {}
				unreadMessages[`message_${chatType.PARTNER}_${id}`] = Dates.now()
				Storage.set('unreadMessages', JSON.stringify(unreadMessages))
			})
			DeletedMessages.remove(user.id, id, chatType.PARTNER)
			Pushes.add(user.name, null, message.message, partner.id, pushType.PARTNER, {partneruser:user})
			if (callback) callback()
		})
	}
	PartnerClientMessages.byClientGet(user.id, partner.id, (res) => {
		if (res.data.length > 0) parentId = res.data[0].id
	})
	const tochat = () => navigation.navigate('MessageInfo', {item:partner,type:chatType.PARTNER})
	return (
		<View style={[s.container,s.modalcontainer]}>
			<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Сообщение продавцу</Text>
			<Text style={[styles.text,styles.grey]}>{partner.name}</Text>
			<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
				<ScrollView scrollEnabled={false}>
					<TextInput
						multiline={true}
						placeholder={'Сообщение'}
						value={message}
						style={[styles.text,s.textarea]}
						onChangeText={(m) => message = m} />
				</ScrollView>
				<View style={s.buttonblock}>
					<TouchableOpacity style={s.button} onPress={() => send()}>
						<Text style={[styles.text,styles.upper]}>Отправить</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => tochat()}>
						<Text style={[styles.text,styles.blue]}>Перейти к диалогу с продавцом</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</View>
	)
}

const {width,height} = Dimensions.get('window')
const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	modalcontainer: {
		paddingTop:40,
		marginHorizontal:15
	},
	textarea: {
		height:300,
		padding:10,
		marginVertical:20,
		backgroundColor:'#f8f8f8'
	},
	subtitle: {
		marginBottom:5
	},
	button: {
		width:width-30,
		padding:15,
		marginBottom:15,
		backgroundColor:'#ffd93e',
		borderRadius:10,
		alignItems:'center'
	},
	buttonblock: {
		marginTop:10,
		marginBottom:20,
		alignItems:'center'
	}
})