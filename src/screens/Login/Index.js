/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Modal, Keyboard, Platform } from 'react-native'

// plug-ins
import { TextInputMask } from 'react-native-masked-text'
import { SvgXml } from 'react-native-svg'
import { WebView } from 'react-native-webview'

// components
import GoBack from '../../components/GoBack'
import ClosePopup from '../../components/ClosePopup'

// models
import { Partners, Clients } from '../../models/Index'

// helpers
import { Utils } from '../../helpers/Index'

// globals
import { API } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	check: {
		on:'<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#24a0ed"/><path d="M6.02155 10.8403L3.03042 7.84918C2.98986 7.80862 2.98986 7.74778 3.03042 7.70722L3.89227 6.84537C3.93283 6.80482 3.99366 6.80482 4.03422 6.84537L6.09252 8.90367L9.96578 5.03042C10.0063 4.98986 10.0672 4.98986 10.1077 5.03042L10.9696 5.89227C11.0101 5.93283 11.0101 5.99366 10.9696 6.03422L6.1635 10.8403C6.12294 10.8809 6.0621 10.8809 6.02155 10.8403Z" fill="white"/></svg>',
		off:'<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#24a0ed"/></svg>'
	}
}

// start
export default class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ismerchant:this.props.navigation.getParam('ismerchant'),
			phone:null,
			modalVisible:false,
			modaltitle:null,
			modalurl:null,
			isaccept:true
		}
	}
	phoneCheck = () => {
		const phone = Utils.phoneNormalize(this.state.phone)
		if (Utils.empty(phone)) return
		if (this.state.ismerchant) {
			Partners.registerCheck(phone, (res) => {
				if (res.code === 1) Partners.login(phone, (res) => this.gotoSms(phone, res))
				else this.gotoSms(phone, null)
			})
		} else {
			Clients.registerCheck(phone, (res) => {
				if (res.code === 1) Clients.login(phone, (res) => this.gotoSms(phone, res))
				else this.gotoSms(phone, null)
			})
		}
	}
	accept = () => this.setState({isaccept:!this.state.isaccept})
	modalShow = (modalVisible) => {
		Keyboard.dismiss()
		this.setState({modalVisible})
	}
	infoShow = (title, url) => this.setState({modaltitle:title,modalurl:url}, () => this.modalShow(true))
	gotoSms = (phone, data) => this.props.navigation.navigate('Sms', {phone,ismerchant:this.state.ismerchant,data})
	render() {
		return <View style={styles.wrapper}>
			<GoBack navigation={this.props.navigation} noheader={true} />
			<Modal animationType='slide' transparent={false} visible={this.state.modalVisible}>
				<View style={[s.container,s.modalcontainer]}>
					<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>{this.state.modaltitle}</Text>
					<WebView source={{uri:this.state.modalurl}} cacheEnabled={false} startInLoadingState={true} />
				</View>
				<ClosePopup callback={() => this.modalShow(false)} />
			</Modal>
			<View style={s.container}>
				<View style={s.title}>
					<Text style={[styles.text,styles.bold,styles.title,styles.center]}>Добро пожаловать!</Text>
				</View>
				<View style={styles.form}>
					<TextInputMask
						type = { 'custom' }
						options = {{
							keyboardType: 'cel-phone',
							mask: '+7 (999) 999-99-99'
						}}
						maxLength={18}
						keyboardType='phone-pad'
						textContentType='username'
						onChangeText={(phone) => this.setState({phone})}
						value={this.state.phone}
						placeholder='Номер телефона'
						style={[styles.text,s.input]}
						autoFocus={true}
						underlineColorAndroid={'transparent'} />
					<View style={styles.mt10}>
						<Text style={[styles.text,styles.grey,styles.small]}>Введите номер мобильного телефона для регистрации или входа в свой аккаунт.</Text>
					</View>
					<View style={s.agree}>
						<TouchableOpacity onPress={this.accept}>
							<SvgXml width={24} height={24} xml={this.state.isaccept?icons.check.on:icons.check.off} />
						</TouchableOpacity>
					<Text style={[styles.text,styles.grey,styles.ml10]}>Я согласен(на) с <Text style={styles.underline} onPress={() => this.infoShow('Политика конфиденциальности', API.policy)}>политикой конфиденциальности</Text> и обработкой персональных данных, а так же ознакомился(ась) с {this.state.ismerchant ? <Text style={styles.underline} onPress={() => this.infoShow('Договор-оферта', API.offer)}>договором-офертой</Text> : <Text style={styles.underline} onPress={() => this.infoShow('Лицензионнопе соглашение', API.tos)}>лицензионным соглашением</Text>}.</Text>
					</View>
					{this.state.isaccept ?
						<TouchableOpacity onPress={() => this.phoneCheck()} style={styles.mt20}>
							<View style={[styles.button]}>
								<Text style={[styles.text,styles.white,styles.upper]}>Продолжить</Text>
							</View>
						</TouchableOpacity>
					: 
						<View style={[styles.button,styles.mt20,s.buttonDisable]}>
							<Text style={[styles.text,styles.white,styles.upper]}>Продолжить</Text>
						</View>
					}
				</View>
			</View>
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		margin:20,
		flex:1,
		backgroundColor:'#fff'
	},
	modalcontainer: {
		paddingTop:20,
		marginHorizontal:15
	},
	title: {
		alignSelf:'center',
		width:'70%',
		marginBottom:20
	},
	input: {
		paddingVertical:Platform.OS === 'ios' ? 10 : 0,
		borderBottomColor:'#3b3b3b',
		borderBottomWidth:1
	},
	agree: {
		marginTop:20,
		flexDirection:'row',
		justifyContent:'space-between'
	},
	buttonDisable: {
		backgroundColor:'#89898950'
	},
	subtitle: {
		marginBottom:20
	}
})