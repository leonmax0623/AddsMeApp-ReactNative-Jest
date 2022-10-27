/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Keyboard, FlatList, Dimensions, KeyboardAvoidingView, Alert, Platform } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'
import { WebView } from 'react-native-webview'

// components
import GoBack from '../../components/GoBack'
import ClosePopup from '../../components/ClosePopup'

// models
import { Partners, Clients, Areas } from '../../models/Index'

// helpers
import { Utils, Storage } from '../../helpers/Index'

// globals
import { API, partnerStatus, clientStatus } from '../../globals/Сonstants'

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
export default class RegisterScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phone:this.props.navigation.getParam('phone'),
			ismerchant:this.props.navigation.getParam('ismerchant'),
			name:null,
			area:null,
			areaname:null,
			areas:[],
			areasAll:[],
			email:null,
			modalVisible:false,
			isaccept:true,
			isareas:false,
			ispolicy:false
		}
	}
	componentDidMount = () => {
		Areas.get((res) => {
			let areas = this.dataPrepare(res.data)
			this.setState({areas,areasAll:areas})
			Storage.set('areas', JSON.stringify(areas))
		})
	}
	dataPrepare = (data) => {
		let areas = []
		data.forEach((v) => {
			if (v.parentId === 0) {
				areas.push(v)
				let childs = data.filter(f => f.parentId === v.id)
				areas = [...areas, ...childs]
			}
		})
		return areas
	}
	register = () => {
		let data = {
			name:this.state.name,
			phone:Utils.phoneNormalize(this.state.phone),
			code:Utils.codeGenerate(9),
			status:this.state.ismerchant?partnerStatus.ACTIVE:clientStatus.ACTIVE
		}
		if (this.state.ismerchant) {
			if (Utils.empty(this.state.name)) {
				Alert.alert('Внимание!','Для продолжения регистарции вам необходимо ввести название вашей организации',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
				return
			}
			if (Utils.empty(this.state.area)) {
				Alert.alert('Внимание!','Для продолжения регистарции вам необходимо указать сферу деятельности вашей организации',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
				return
			}
			data.area = this.state.area.name
			data.areaId = this.state.area.id
			data.email = this.state.email
			data.phoneContact = Utils.phoneNormalize(data.phone)
			Partners.add(data, (res) => {
				data.id = res.data.id
				Storage.set('user', JSON.stringify(data))
				Storage.set('startScreen', 'Partner')
				this.props.navigation.navigate('Partner')
			})
		} else {
			if (Utils.empty(this.state.name)) {
				Alert.alert('Внимание!','Для продолжения регистарции вам необходимо ввести свое имя',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
				return
			}
			Clients.add(data, (res) => {
				data.id = res.data.id
				data.isPersonalMessages = true
				data.isGroupInvite = true
				data.isActions = true
				data.isMessages = true
				data.isGroups = true
				data.isChat = false
				Storage.set('user', JSON.stringify(data))
				Storage.set('startScreen', 'Ads')
				this.props.navigation.navigate('Ads')
			})
		}
	}
	accept = () => this.setState({isaccept:!this.state.isaccept})
	modalShow = (modalVisible) => {
		Keyboard.dismiss()
		this.setState({modalVisible})
	}
	policyShow = () => this.setState({ispolicy:true,isareas:false}, () => this.modalShow(true))
	areasShow = () => this.setState({isareas:true,ispolicy:false}, () => this.modalShow(true))
	search = (text) => {
		if (text.length > 0) {
			let data = this.state.areasAll.filter(f => f.name.toLowerCase().indexOf(text.toLowerCase()) !== -1), areas = []
			data.forEach((v) => {
				if (v.parentId === 0) areas.push(v)
				else {
					let parent = areas.filter(f => f.id === v.parentId)
					if (parent.length === 0) {
						parent = this.state.areasAll.filter(f => f.id === v.parentId)
						areas.push(parent[0])
					}
					areas.push(v)
				}
			})
			this.setState({areas})
		}
		else this.setState({areas:this.state.areasAll})
	}
	areaSelect = (area) => {
		let areaname = area.name
		if (area.parentId !== 0) {
			let parent = this.state.areasAll.filter(f => f.id === area.parentId)
			if (parent.length > 0) areaname = `${parent[0].name}: ${areaname}`
		}
		this.setState({area,areaname}, () => this.modalShow(false))
	}
	render() {
		return <View style={styles.wrapper}>
			<GoBack navigation={this.props.navigation} noheader={true} />
			<Modal animationType='slide' transparent={false} visible={this.state.modalVisible}>
				{this.state.ispolicy && <View style={[s.container,s.modalcontainer]}>
					<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Политика конфиденциальности</Text>
					<WebView source={{uri:API.policy}} cacheEnabled={false} startInLoadingState={true} />
				</View>}
				{this.state.isareas && <View style={[s.container,s.modalcontainer]}>
					<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Выберите сферу деятельности</Text>
					<View style={s.search}>
						<TextInput
							style={styles.text}
							onChangeText={this.search}
							autoCorrect={false}
							placeholder={'Поиск'}
							underlineColorAndroid={'transparent'} />
						<SvgXml width={16} height={16} fill={'#9a9a9b'} style={s.searchicon} xml={'<svg viewBox="0 0 50 50"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>'} />
					</View>
					<KeyboardAvoidingView behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
						<FlatList
							style={s.list}
							data={this.state.areas}
							renderItem={({item}) => <TouchableOpacity onPress={() => this.areaSelect(item)} style={s.item}>
								{item.parentId === 0 ? 
									<Text style={[styles.text,styles.bold]} numberOfLines={1}>{item.name}</Text>
									:
									<Text style={[styles.text,{marginLeft:10}]} numberOfLines={1}>{item.name}</Text>
								}
							</TouchableOpacity>}
							keyExtractor={(item, index) => index.toString()} />
					</KeyboardAvoidingView>		
				</View>}
				<ClosePopup callback={() => this.modalShow(false)} />
			</Modal>
			<View style={s.container}>
				<View style={s.title}>
					<Text style={[styles.text,styles.bold,styles.title,styles.center]}>Завершение регистрации</Text>
				</View>
				<View style={styles.form}>
					<TextInput
						style={[styles.text,s.input]}
						value={this.state.name}
						onChangeText={(name) => this.setState({name})}
						autoCorrect={false}
						placeholder={this.state.ismerchant?'Название вашей организации':'Ваше имя'}
						autoFocus={true}
						underlineColorAndroid={'transparent'} />
					{this.state.ismerchant ?
					<TextInput
						style={[styles.text,s.input]}
						value={this.state.areaname}
						placeholder={'Сфера деятельности'}
						onFocus={this.areasShow}
						underlineColorAndroid={'transparent'} /> : null}
					{this.state.ismerchant ?
					<TextInput
						style={[styles.text,s.input]}
						value={this.state.email}
						onChangeText={(email) => this.setState({email})}
						autoCorrect={false}
						keyboardType='email-address'
						placeholder={'Адрес электронной почты'}
						underlineColorAndroid={'transparent'} /> : null}
					<View style={s.agree}>
						<TouchableOpacity onPress={this.accept}>
							<SvgXml width={24} height={24} xml={this.state.isaccept?icons.check.on:icons.check.off} />
						</TouchableOpacity>
						<Text style={[styles.text,styles.grey,{marginLeft:10}]}>Я согласен(на) <Text style={styles.underline} onPress={() => this.policyShow()}>политикой конфиденциальности</Text> и обработкой персональных данных.</Text>
					</View>
					{this.state.isaccept ?
						<TouchableOpacity onPress={() => this.register()} style={[styles.button,{marginTop:40}]}>
							<Text style={[styles.text,styles.white,styles.upper]}>Зарегистрироваться</Text>
						</TouchableOpacity>
					: 
						<View style={[styles.button,s.buttonDisable,{marginTop:40}]}>
							<Text style={[styles.text,styles.white,styles.upper]}>Зарегистрироваться</Text>
						</View>
					}
				</View>
			</View>
		</View>
	}
}

const { width, height } = Dimensions.get('window')
const s = StyleSheet.create({
	container: {
		margin:20,
		flex:1
	},
	modalcontainer: {
		paddingTop:20,
		marginHorizontal:15
	},
	title: {
		alignSelf:'center',
		width:'80%',
		marginBottom:40
	},
	input: {
		marginBottom:10,
		paddingTop:10,
		paddingBottom:10,
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
	},
	search: {
		marginTop:10,
		marginBottom:10,
		backgroundColor:'#f1f1f2',
		borderRadius:10,
		padding:Platform.OS === 'ios' ? 10 : 0,
		paddingLeft:35,
		paddingRight:15
	},
	searchicon: {
		position:'absolute',
		top:Platform.OS === 'ios' ? 12 : 17,
		left:10
	},
	item: {
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	list: {
		height:height-140
	}
})