import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TextInput, Dimensions, Alert } from 'react-native'

// models
import { Feedbacks } from '../models/Index'

// helpers
import { Utils } from '../helpers/Index'

// globals
import { feedbackType } from '../globals/Сonstants'

export default ComplaintPopup = (props) => {
	const { styles, partner, client, user, offer, callback }  = props
	let message = null
	const send = () => {
		if (Utils.empty(message)) return
		let data = {
			clientId:client.id,
			clientName:client.name,
			message:message,
			type:user ? feedbackType.USER : (partner ? feedbackType.PARTNER : feedbackType.OFFER)
		}
		switch (data.type) {
			case feedbackType.USER:
				data.userId = user.id
				data.userName = user.name
				break
			case feedbackType.OFFER:
				data.offerId = offer.id
				data.offerTitle = offer.title
				break
			case feedbackType.PARTNER:
				data.partnerId = partner.id
				data.partnerName = partner.name
				break
			default: break;
		}
		Feedbacks.add(data)
		Alert.alert('Спасибо!','Жалоба успешно отправлена! Мы обязательно разберемся в этой ситуации',[{text:'Хорошо',onPress:() => callback()}],{cancelable:false})
	}
	return (
		<View style={[s.container,s.modalcontainer]}>
			<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Пожаловаться</Text>
			<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
				<ScrollView scrollEnabled={false}>
					<TextInput
						multiline={true}
						placeholder={'Сообщение'}
						value={message}
						style={[styles.text,s.textarea]}
						onChangeText={(m) => message = m}
						autoFocus={true} />
				</ScrollView>
				<View style={s.buttonblock}>
					<TouchableOpacity style={s.button} onPress={() => send()}>
						<Text style={[styles.text,styles.upper]}>Отправить</Text>
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