/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, Alert, Keyboard, Platform } from 'react-native'

// plug-ins
import QRCode from 'react-native-qrcode-svg'
import { SvgXml } from 'react-native-svg'
import { TextInputMask } from 'react-native-masked-text'
import OneSignal from 'react-native-onesignal'
import QRCodeScanner from 'react-native-qrcode-scanner';

// components
import Header from '../../components/Header'
import ClosePopup from '../../components/ClosePopup'

// models
import { Clients, PartnerClients, PartnerClientOrders, PartnerClientMessages, PartnerBonuses, PartnerDiscounts, Pushes } from '../../models/Index'

// helpers
import { Storage, Utils, Dates } from '../../helpers/Index'

// globals
import { orderType, pushType } from '../../globals/Сonstants'

// styles
import styles, {isX} from '../../styles/Styles'

// start
export default class PartnerScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			menu:[],
			messageCount:0,
			code:null,
			price:null,
			priceFinal:null,
			comment:null,
			discount:0,
			discountSum:0,
			discounts:[],
			bonus:null,
			maxBonus:null,
			useBonus:null,
			bonusesAdded:null,
			partnerclient:{},
			step:1,
			isinfo:false,
			isadd:false,
			isqr:false,
			isnext:false,
			modalVisible:false
		}
	}
	stopCheck = (user) => {
		if (user.dateTill && user.dateTill < Dates.now()) {
			const screen = 'Stop'
			Storage.set('startScreen', screen)
			this.props.navigation.navigate(screen)
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				user = JSON.parse(user)
				this.stopCheck(user)
				this.setState({user})
				this.focusListener = this.props.navigation.addListener('didFocus', () => {
					this.dataGet(this.state.user.id)
					Storage.get('user', (user) => {
						user = JSON.parse(user)
						this.stopCheck(user)
						this.setState({user})
					})
				})
				OneSignal.sendTag('partner_id', user.id.toString())
				const menu = [
					{title:'Профиль',link:'PartnerProfile',dateTill:user.dateTill},
					{title:'Мои предложения',link:'PartnerAds'},
					{title:'Программы лояльности',link:'PartnerLoyality'},
					{title:'Статистика',link:'PartnerStatistics'},
					//{title:'Пополнить счет',link:'PartnerBalance',money:user.balance},
					{title:'Пополнить счет',link:'PartnerBalance'},
					{title:'Сообщения от клиентов',link:'PartnerMessages',iscount:true},
					{title:'Настройки',link:'PartnerSettings'}
				]
				this.setState({user,menu})
				PartnerBonuses.get(user.id, (res) => this.setState({bonus:res.data[0]}))
				PartnerDiscounts.get(user.id, (res) => this.setState({discounts:res.data}))
				this.dataGet(user.id)
			}
		})
	}
	componentWillUnmount = () => this.focusListener.remove()
	dataGet = (userid) => {
		Storage.get('unreadMessages', (unreadMessages) => {
			unreadMessages = JSON.parse(unreadMessages)
			let lastDate = 0
			if (unreadMessages) Object.entries(unreadMessages).forEach((v) => lastDate = v[1] > lastDate ? v[1] : lastDate)
			PartnerClientMessages.unreadCountGet(userid, lastDate, (res) => this.setState({messageCount:res.data}))
			this.setState({unreadMessages})
		})
	}
	modalShow = (visible) => this.setState({modalVisible:visible}, () => visible ? {} : this.setState({isnext:false,isqr:false,isadd:false,isinfo:false,code:null,price:null,comment:null,discount:0,step:1}))
	infoShow = () => this.setState({isnext:false,isqr:false,isinfo:true,isadd:false}, () => this.modalShow(true))
	addShow = () => Storage.get('user', (user) => this.setState({user:JSON.parse(user),isnext:false,isqr:false,isinfo:false,isadd:true}, () => this.modalShow(true)))
	go = (link) => this.props.navigation.navigate(link)
	textLineRender = (title, text) => text ? <View style={s.row}>
		<Text style={[styles.text,styles.middle,styles.light,s.label]}>{title}</Text>
		<Text style={styles.text}>{text}</Text>
	</View> : null
	scheduleGet = (item) => {
		let days = []
		const week = ['Понедельник','Вторник','Среда','Четверг','Патница','Суббота','Воскресенье'], today = new Date().getDay()
		week.forEach((v,i) => {
			const time = Utils.empty(item[`workTime${i+1}`]) ? 'Выходной' : (item[`workTime${i+1}`] === item[`workTime${i+1}End`] && item[`workTime${i+1}`] === '00:00' ? 'Круглосуточно' : `${item[`workTime${i+1}`]} - ${item[`workTime${i+1}End`]}`)
			days.push(<View key={i} style={[s.oneline,s.dayrow,i===(today===0?6:today-1)?s.dayrowtoday:null]}>
				<Text style={styles.text}>{v}</Text>
				<Text style={styles.text}>{time}</Text>
			</View>)
		})
		return <View>
			<Text style={[styles.text,styles.bold,{marginBottom:5}]}>Время работы</Text>
			<View>{days}</View>
		</View>
	}
	clientFind = () => {
		let {code,user} = this.state
		code = code = Utils.codeClear(code)
		if (code.length !== 9) return
		Clients.byCodeGet(code, (res) => {
			let client = res.data[0]
			if (!client) {
				Alert.alert('Внимание!','Пользователь не найден!',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
				return
			}
			PartnerClients.register(client.id, user.id, (data) => this.setState({partnerclient:data}))
			this.setState({client,step:2})
			Keyboard.dismiss()
		})
	}
	bonusCheck = () => {
		if (this.state.user.bonus) {
			let {bonuses,total} = this.state.partnerclient
			let {price,priceFinal,bonus} = this.state
			if (bonus === null) {
				Alert.alert('Ошибка!','У вас не настроена бонусная программа!',[{text:'Настроить',onPress:() => {
					this.modalShow(false)
					this.props.navigation.navigate('PartnerBonuses')
				}}],{cancelable:false})
				return
			}
			let maxBonus = (price * (Utils.empty(bonus.max) ? 0 : parseFloat(bonus.max))) / 100
			let bonusesAdded = (price * (Utils.empty(bonus.topUp) ? 0 : parseFloat(bonus.topUp))) / 100
			maxBonus = bonuses > maxBonus ? maxBonus : (Utils.empty(bonuses) ? 0 : bonuses)
			let withdraw = Utils.empty(bonus.withdraw) ? 0 : parseFloat(bonus.withdraw)
			priceFinal = price - (maxBonus * withdraw)
			total = (Utils.empty(total) ? 0 : total) + parseFloat(price)
			this.setState({maxBonus,useBonus:String(maxBonus),bonusesAdded,priceFinal,total,step:3})
		}
		else {
			let {price,priceFinal,discounts} = this.state
			let {discountPersonal,discount,total} = this.state.partnerclient
			let partnerDiscount = this.state.user.discount
			discountPersonal = Utils.empty(discountPersonal) ? 0 : discountPersonal
			discount = Utils.empty(discount) ? 0 : discount
			total = (Utils.empty(total) ? 0 : total) + parseFloat(price)
			priceFinal = price
			discounts.forEach((v) => {
				if (total > v.conditions)
					discount = v.discount > discount ? v.discount : discount
			})
			let discountSum = discount
			discount = discountPersonal > discount ? discountPersonal : discount
			discount = partnerDiscount > discount ? partnerDiscount : discount
			if (discount > 0) priceFinal = price - ((price * discount) / 100)
			this.setState({discount,discountSum,priceFinal,total,step:4})
		}
	}
	bonusUpdate = (useBonus) => {
		let withdraw = Utils.empty(this.state.bonus.withdraw) ? 0 : parseFloat(this.state.bonus.withdraw)
		if (useBonus > this.state.maxBonus) return
			this.setState({useBonus,priceFinal:this.state.price - (useBonus * withdraw)})
	}
	discountSave = () => {
		const order = {
			partnerId:this.state.user.id,
			clientId:this.state.client.id,
			clientName:this.state.client.name,
			price:this.state.price,
			priceDiscount:this.state.priceFinal,
			discount:this.state.discount,
			comment:this.state.comment,
			type:orderType.PAY
		}
		PartnerClientOrders.add(order)
		let partnerclient = {
			discount:this.state.discountSum,
			total:this.state.total
		}
		PartnerClients.insert(this.state.client.id, this.state.user.id, partnerclient)
		this.push()
		this.exit()
	}
	bonusSave = () => {
		const useBonus = Utils.empty(this.state.useBonus) ? 0 : parseInt(this.state.useBonus)
		const order = {
			partnerId:this.state.user.id,
			clientId:this.state.client.id,
			clientName:this.state.client.name,
			price:this.state.price,
			priceBonuses:useBonus === 0 ? 0 : this.state.priceFinal,
			bonusesAdded:useBonus === 0 ? this.state.bonusesAdded : 0,
			bonuses:useBonus,
			comment:this.state.comment,
			type:orderType.PAY
		}
		PartnerClientOrders.add(order)
		let partnerclient = {
			bonuses:useBonus === 0 ? (this.state.partnerclient.bonuses + this.state.bonusesAdded) : (this.state.partnerclient.bonuses - useBonus),
			total:this.state.total
		}
		PartnerClients.insert(this.state.client.id, this.state.user.id, partnerclient)
		this.push()
		this.exit()
	}
	push = () => Pushes.add('Новая покупка', null, `Вы совершили покупку у ${this.state.user.name}`, this.state.client.id, pushType.USER)
	exit = () => Alert.alert('Успех!','Продажа зарегистрирована! Покупателю было отправлено сообщение об этом',[{text:'Хорошо',onPress:() => this.modalShow(false)}],{cancelable:false})
	onSuccess = (e) => this.setState({code:e.data,isqr:false,isnext:true})
	qrCameraShow = (isshow) => this.setState({isqr:isshow}, () => Keyboard.dismiss())
	codeUpdate = (code) => this.setState({code,isnext:code.length===11})
	render() {
		if (this.state.user === null) return null
		return <View style={styles.wrapper}>
			<Header
				title={this.state.user.name}
				styles={styles}
				context={{
					icon:'<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 5 L 8 5 L 8 4 Z M 7 6 L 7 11 L 8 11 L 8 6 Z"></path></svg>',
					callback:() => this.infoShow()
				}} />
			<Modal animationType='slide' transparent={false} visible={this.state.modalVisible}>
				{this.state.isinfo ? <View style={[s.container,s.modalcontainer]}>
					<Text style={[styles.text,styles.bold,styles.title,styles.mb10]}>Мои данные</Text>
					<ScrollView>
						<View style={s.row}>
							<QRCode value={this.state.user.code} size={150} />
						</View>
						{this.textLineRender('Код партнера', Utils.codeFormatter(this.state.user.code))}
						{this.textLineRender('Телефон для входа', Utils.phoneFormatter(this.state.user.phone))}
						{this.textLineRender('Название', this.state.user.name)}
						{this.textLineRender('Сфера деятельности', this.state.user.area)}
						{this.textLineRender('Контактный телефон', this.state.user.phoneContact)}
						{this.textLineRender('Адрес электронной почты', this.state.user.email)}
						{this.textLineRender('Тэги', this.state.user.tags)}
						{this.textLineRender('Адрес', this.state.user.address)}
						{this.textLineRender('Описание', this.state.user.info)}
						{this.scheduleGet(this.state.user)}
					</ScrollView>
				</View> : null}
				{this.state.isadd ? <View style={[s.container,s.modalcontainer]}>
					<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Новая продажа</Text>
					{this.state.step === 1 && <View style={s.block}>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Код клиента (9 цифр)</Text>
						<TextInputMask
							ref={(textinput) => this.textinput = textinput}
							type = { 'custom' }
							options = {{
								keyboardType: 'numeric',
								mask: '9999-99-999'
							}}
							autoFocus={true}
							maxLength={11}
							keyboardType='phone-pad'
							textContentType='username'
							onChangeText={(code) => this.codeUpdate(code)}
							value={this.state.code}
							placeholder='1234-56-789'
							style={[styles.text,styles.titlebig,styles.bold,s.input]}
							underlineColorAndroid={'transparent'} />
						<TouchableOpacity style={s.qricon} onPress={() => this.qrCameraShow(true)}>
							<SvgXml width={28} height={28} fill={'#000'} xml={'<svg viewBox="0 0 16 16"><path d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 4.5 C 1 5.324219 1.675781 6 2.5 6 L 3 6 L 3 7 L 4 7 L 4 6 L 4.5 6 C 5.324219 6 6 5.324219 6 4.5 L 6 2.5 C 6 1.675781 5.324219 1 4.5 1 Z M 4 7 L 4 8 L 5 8 L 5 7 Z M 4 8 L 3 8 L 3 9 L 4 9 Z M 3 8 L 3 7 L 2 7 L 2 8 Z M 11.5 1 C 10.675781 1 10 1.675781 10 2.5 L 10 4.5 C 10 5.324219 10.675781 6 11.5 6 L 12 6 L 12 7 L 13 7 L 13 6 L 13.5 6 C 14.324219 6 15 5.324219 15 4.5 L 15 2.5 C 15 1.675781 14.324219 1 13.5 1 Z M 13 7 L 13 8 L 14 8 L 14 7 Z M 13 8 L 12 8 L 12 9 L 13 9 Z M 13 9 L 13 10 L 14 10 L 14 9 Z M 13 10 L 12 10 L 12 11 L 13 11 Z M 12 10 L 12 9 L 11 9 L 11 10 Z M 2.5 2 L 4.5 2 C 4.78125 2 5 2.21875 5 2.5 L 5 4.5 C 5 4.78125 4.78125 5 4.5 5 L 2.5 5 C 2.21875 5 2 4.78125 2 4.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 8 2 L 8 3 L 7 3 L 7 4 L 8 4 L 8 5 L 9 5 L 9 2 Z M 11.5 2 L 13.5 2 C 13.78125 2 14 2.21875 14 2.5 L 14 4.5 C 14 4.78125 13.78125 5 13.5 5 L 11.5 5 C 11.21875 5 11 4.78125 11 4.5 L 11 2.5 C 11 2.21875 11.21875 2 11.5 2 Z M 3 3 L 3 4 L 4 4 L 4 3 Z M 12 3 L 12 4 L 13 4 L 13 3 Z M 6 6 L 6 7 L 9 7 L 9 8 L 10 8 L 10 6 Z M 7 8 L 7 9 L 6 9 L 6 10 L 10 10 L 10 9 L 8 9 L 8 8 Z M 2.5 10 C 1.675781 10 1 10.675781 1 11.5 L 1 13.5 C 1 14.324219 1.675781 15 2.5 15 L 4.5 15 C 5.324219 15 6 14.324219 6 13.5 L 6 11.5 C 6 10.675781 5.324219 10 4.5 10 Z M 2.5 11 L 4.5 11 C 4.78125 11 5 11.21875 5 11.5 L 5 13.5 C 5 13.78125 4.78125 14 4.5 14 L 2.5 14 C 2.21875 14 2 13.78125 2 13.5 L 2 11.5 C 2 11.21875 2.21875 11 2.5 11 Z M 7 11 L 7 14 L 8 14 L 8 11 Z M 3 12 L 3 13 L 4 13 L 4 12 Z M 10 12 L 10 13 L 11 13 L 11 12 Z M 11 13 L 11 14 L 12 14 L 12 13 Z M 12 13 L 13 13 L 13 12 L 12 12 Z M 13 13 L 13 14 L 14 14 L 14 13 Z"></path></svg>'} />
						</TouchableOpacity>
						{this.state.isnext && <TouchableOpacity style={s.button} onPress={() => this.clientFind()}>
							<Text style={[styles.text,styles.upper]}>Найти клиента</Text>
						</TouchableOpacity>}
					</View>}
					{this.state.step === 2 && <View style={s.block}>
						<Text style={[styles.text,styles.bold]}>{Utils.codeFormatter(this.state.client.code)}</Text>
						<Text style={[styles.text,styles.grey,styles.mt10,styles.mb10]}>{Utils.phoneMask(this.state.client.phone)}</Text>
						<Text style={[styles.text,styles.grey,styles.mb30]}>{Utils.nameMask(this.state.client.name)}</Text>
						<TextInput
							style={[styles.text,styles.titlebig,styles.bold,s.input]}
							value={this.state.price}
							onChangeText={(price) => this.setState({price})}
							maxLength={8}
							placeholder={'Сумма, ₽'}
							keyboardType='numeric'
							autoFocus={true}
							underlineColorAndroid={'transparent'} />
						<TextInput
							style={[styles.text,s.input,s.textarea]}
							value={this.state.comment}
							onChangeText={(comment) => this.setState({comment})}
							multiline={true}
							placeholder={'Комментарий к продаже, описание товаров, любая дополнительная иформация'}
							underlineColorAndroid={'transparent'} />
						{this.state.price > 0 && <TouchableOpacity style={s.button} onPress={() => this.bonusCheck()}>
							<Text style={[styles.text,styles.upper]}>Далее</Text>
						</TouchableOpacity>}
					</View>}
					{this.state.step === 3 && <View style={s.block}>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Сумма к оплате</Text>
						<Text style={[styles.text,styles.titlebig,styles.mb10]}><Text style={styles.bold}>{Utils.moneyFormat(parseFloat(this.state.priceFinal), true)}</Text> <Text style={styles.grey}>₽</Text></Text>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Сумма продажи</Text>
						<Text style={[styles.text,styles.title,styles.mb10]}>{Utils.moneyFormat(parseFloat(this.state.price), true)} <Text style={styles.grey}>₽</Text></Text>
						<View style={s.oneline}>
							<View style={s.bonusespanel}>
								<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Доступно бонусов</Text>
								<Text style={[styles.text,styles.title]}>{this.state.partnerclient.bonuses} <Text style={styles.grey}>шт</Text></Text>
							</View>
							<View style={s.bonusespanel2}>
								<Text style={[styles.text,styles.middle,styles.light,s.labelform]} numberOfLines={1}>Будет начислено бонусов</Text>
								<Text style={[styles.text,styles.title]}>{this.state.bonusesAdded} <Text style={styles.grey}>шт</Text></Text>
								<Text style={[styles.text,styles.mini,styles.mt5]}>При условии чистой продажи без оплаты части суммы бонусами</Text>
							</View>
						</View>
						<Text style={[styles.text,styles.grey,styles.mt10]}>Оплата бонусами</Text>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform,styles.mb10]}>Можно использовать {this.state.maxBonus} шт, 1 бонус = {this.state.bonus.withdraw} ₽</Text>
						<TextInput
							style={[styles.text,styles.titlebig,styles.bold,s.input]}
							value={this.state.useBonus}
							onChangeText={(useBonus) => this.bonusUpdate(useBonus)}
							maxLength={8}
							placeholder={'Количество'}
							keyboardType='numeric'
							autoFocus={true}
							underlineColorAndroid={'transparent'} />
						<TouchableOpacity style={s.button} onPress={() => this.bonusSave()}>
							<Text style={[styles.text,styles.upper]}>Провести</Text>
						</TouchableOpacity>
					</View>}
					{this.state.step === 4 && <View style={s.block}>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Сумма к оплате</Text>
						<Text style={[styles.text,styles.titlebig,styles.mb20]}><Text style={styles.bold}>{Utils.moneyFormat(parseFloat(this.state.priceFinal), true)}</Text> <Text style={styles.grey}>₽</Text></Text>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Сумма продажи</Text>
						<Text style={[styles.text,styles.title,styles.mb20]}>{Utils.moneyFormat(parseFloat(this.state.price), true)} <Text style={styles.grey}>₽</Text></Text>
						<Text style={[styles.text,styles.middle,styles.light,s.labelform]}>Итоговая скидка</Text>
						<Text style={[styles.text,styles.title]}>{this.state.discount} <Text style={styles.grey}>%</Text></Text>
						<View style={s.discountsinfo}>
							<Text style={[styles.text,styles.middle,styles.grey]}>Постоянная скидка <Text style={[styles.bold,styles.black]}>{this.state.user.discount?`${this.state.user.discount} %`:'нет'}</Text></Text>
							<Text style={[styles.text,styles.middle,styles.grey]}>Накопительная скидка <Text style={[styles.bold,styles.black]}>{this.state.discount?`${this.state.discount} %`:'нет'}</Text></Text>
							<Text style={[styles.text,styles.middle,styles.grey]}>Персональная скидка <Text style={[styles.bold,styles.black]}>{this.state.partnerclient.discountPersonal?`${this.state.partnerclient.discountPersonal} %`:'нет'}</Text></Text>
						</View>
						<TouchableOpacity style={s.button} onPress={() => this.discountSave()}>
							<Text style={[styles.text,styles.upper]}>Провести</Text>
						</TouchableOpacity>
					</View>}
					{this.state.isqr && <View style={s.qrcamera}>
						<QRCodeScanner showMarker={true} markerStyle={s.qrmarker} onRead={this.onSuccess} />
					</View>}
				</View> : null}
				<ClosePopup callback={() => this.modalShow(false)} />
			</Modal>
			<View style={s.lists}>
				{this.state.menu.map((v, i) => <TouchableOpacity key={i} style={[s.oneline,s.item,i===this.state.menu.length-1?s.itemlast:null]} onPress={() => v.callback ? v.callback() : this.go(v.link)}>
					<Text style={[styles.text,v.color?{color:v.color}:null]}>{v.title}</Text>
					{v.dateTill !== undefined ? <Text style={[styles.text,styles.middle,styles.grey]}>{v.dateTill ? `подписка до ${Dates.get(v.dateTill)}` : 'бессрочная подписка'}</Text> : null}
					{v.money !== undefined ? <Text style={[styles.text,styles.middle,styles.grey]}>{Utils.moneyFormat(v.money||0, false)} ₽</Text> : null}
					{v.iscount && this.state.messageCount > 0 ? <View style={s.count}>
						<Text style={[styles.text,this.state.messageCount>99?styles.mini:styles.small,styles.bold,styles.white]}>{this.state.messageCount>99?'99+':this.state.messageCount}</Text>
					</View> : null}
				</TouchableOpacity>)}
				<View style={s.addpanel}>
					<TouchableOpacity style={s.addmask} onPress={() => this.addShow()}>
						<SvgXml style={s.add} xml={'<svg viewBox="0 0 20 20"><path d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0Z" fill="#28b351"/><path d="M14 11H11V14H9V11H6V9H9V6H11V9H14V11Z" fill="#fff"/></svg>'} />
					</TouchableOpacity>
					<Text style={[styles.text,styles.small,styles.green,styles.bold,s.addtext]}>Новая продажа</Text>
				</View>
			</View>
		</View>
	}
}

const { width, height } = Dimensions.get('window')
const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	modalcontainer: {
		paddingTop:40,
		marginHorizontal:15
	},
	qrcamera: {
		position:'absolute',
		top:0,
		left:-15,
		width:width,
		height:height,
		backgroundColor:'#000'
	},
	row: {
		marginBottom:20
	},
	label: {
		marginBottom:5
	},
	oneline: {
		justifyContent:'space-between',
		flexDirection:'row'
	},
	lists: {
		padding:6,
		marginTop:10
	},
	item: {
		padding:15,
		paddingHorizontal:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	itemlast: {
		borderBottomWidth:0
	},
	addpanel: {
		position:'absolute',
		width:width,
		height:40,
		left:0,
		top:height-(Platform.OS === 'ios' ? (isX ? 170 : 126) : 154),
		backgroundColor:'#fff',
		borderTopColor:'#eee',
		borderTopWidth:1
	},
	addmask: {
		width:70,
		height:70,
		marginTop:-35,
		alignItems:'center',
		alignSelf:'center',
		backgroundColor:'#eee',
		borderRadius:35,
		borderWidth:2,
		borderColor:'#fff',
		alignItems:'center',
		justifyContent:'center'
	},
	add: {
		width:54,
		height:54,
		alignItems:'center',
		alignSelf:'center'
	},
	addtext: {
		marginTop:-4,
		alignSelf:'center'
	},
	input: {
		marginBottom:10,
		paddingBottom:10,
		borderBottomColor:'#3b3b3b',
		borderBottomWidth:1,
		borderTopWidth:0,
		borderLeftWidth:0,
		borderRightWidth:0,
		alignItems:'flex-start'
	},
	textarea: {
		height:80
	},
	labelform: {
		marginBottom:5
	},
	button: {
		width:width-30,
		padding:15,
		marginTop:5,
		marginBottom:20,
		backgroundColor:'#ffd93e',
		borderRadius:10,
		alignItems:'center',
		alignSelf:'center'
	},
	block: {
		marginVertical:10
	},
	discountsinfo: {
		marginTop:20,
		marginBottom:50,
		padding:10,
		paddingHorizontal:15,
		backgroundColor:'#f9f9f9'
	},
	bonusespanel: {
		width:'47%'
	},
	bonusespanel2: {
		width:'54%'
	},
	qricon: {
		position:'absolute',
		right:10,
		top:20
	},
	qrmarker: {
		borderColor:'#fff',
		borderWidth:2
	},
	count: {
		width:24,
		height:24,
		backgroundColor:'#007aff',
		borderRadius:12,
		alignItems:'center',
		justifyContent:'center'
	}
})