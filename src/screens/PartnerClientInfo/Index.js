/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, KeyboardAvoidingView, ScrollView, TextInput, FlatList, RefreshControl, Platform } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import ClosePopup from '../../components/ClosePopup'

// models
import { PartnerClients, PartnerClientOrders } from '../../models/Index'

// helpers
import { Utils, Storage, Dates } from '../../helpers/Index'

// globals
import { API, orderTypeName } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	chat:'<svg viewBox="0 0 16 16"><path d="M 2.5 2 C 1.675781 2 1 2.675781 1 3.5 L 1 8.5 C 1 9.324219 1.675781 10 2.5 10 L 3.992188 10 L 3.992188 12 L 6.664063 10 L 9.5 10 C 10.324219 10 11 9.324219 11 8.5 L 11 3.5 C 11 2.675781 10.324219 2 9.5 2 Z M 2.5 3 L 9.5 3 C 9.78125 3 10 3.21875 10 3.5 L 10 8.5 C 10 8.78125 9.78125 9 9.5 9 L 6.328125 9 L 4.992188 10 L 4.992188 9 L 2.5 9 C 2.21875 9 2 8.78125 2 8.5 L 2 3.5 C 2 3.21875 2.21875 3 2.5 3 Z M 12 5 L 12 6 L 13.5 6 C 13.78125 6 14 6.21875 14 6.5 L 14 11.5 C 14 11.78125 13.78125 12 13.5 12 L 11.003906 12 L 11.003906 13 L 9.671875 12 L 6.5 12 C 6.300781 12 6.128906 11.878906 6.046875 11.707031 L 5.242188 12.3125 C 5.511719 12.726563 5.972656 13 6.5 13 L 9.335938 13 L 12.003906 15 L 12.003906 13 L 13.5 13 C 14.324219 13 15 12.324219 15 11.5 L 15 6.5 C 15 5.675781 14.324219 5 13.5 5 Z"></path></svg>',
	comment:'<svg viewBox="0 0 16 16"><path d="M 2.5 2 C 1.675781 2 1 2.675781 1 3.5 L 1 11.5 C 1 12.324219 1.675781 13 2.5 13 L 7.347656 13 L 11 15.433594 L 11 13 L 12.5 13 C 13.324219 13 14 12.324219 14 11.5 L 14 3.5 C 14 2.675781 13.324219 2 12.5 2 Z M 2.5 3 L 12.5 3 C 12.78125 3 13 3.21875 13 3.5 L 13 11.5 C 13 11.78125 12.78125 12 12.5 12 L 10 12 L 10 13.566406 L 7.652344 12 L 2.5 12 C 2.21875 12 2 11.78125 2 11.5 L 2 3.5 C 2 3.21875 2.21875 3 2.5 3 Z M 4 5 L 4 6 L 11 6 L 11 5 Z M 4 7 L 4 8 L 11 8 L 11 7 Z M 4 9 L 4 10 L 8 10 L 8 9 Z"></path></svg>',
	orders:'<svg viewBox="0 0 128 128"><path d="M 33.5 11 C 26.3 11 20.5 16.8 20.5 24 L 20.5 104 C 20.5 111.2 26.3 117 33.5 117 L 94.5 117 C 101.7 117 107.5 111.2 107.5 104 L 107.5 24 C 107.5 16.8 101.7 11 94.5 11 L 33.5 11 z M 33.5 17 L 94.5 17 C 98.4 17 101.5 20.1 101.5 24 L 101.5 104 C 101.5 107.9 98.4 111 94.5 111 L 33.5 111 C 29.6 111 26.5 107.9 26.5 104 L 26.5 24 C 26.5 20.1 29.6 17 33.5 17 z M 40.5 33 C 38.8 33 37.5 34.3 37.5 36 C 37.5 37.7 38.8 39 40.5 39 L 85.5 39 C 87.2 39 88.5 37.7 88.5 36 C 88.5 34.3 87.2 33 85.5 33 L 40.5 33 z M 40.5 48 C 38.8 48 37.5 49.3 37.5 51 C 37.5 52.7 38.8 54 40.5 54 L 85.5 54 C 87.2 54 88.5 52.7 88.5 51 C 88.5 49.3 87.2 48 85.5 48 L 40.5 48 z M 40.5 63 C 38.8 63 37.5 64.3 37.5 66 C 37.5 67.7 38.8 69 40.5 69 L 61 69 C 62.7 69 64 67.7 64 66 C 64 64.3 62.7 63 61 63 L 40.5 63 z M 81 93.074219 C 80.225 93.074219 79.450391 93.350391 78.900391 93.900391 C 78.300391 94.400391 78 95.2 78 96 C 78 96.8 78.300391 97.599609 78.900391 98.099609 C 79.500391 98.699609 80.2 99 81 99 C 81.8 99 82.599609 98.699609 83.099609 98.099609 C 83.699609 97.499609 84 96.8 84 96 C 84 95.2 83.699609 94.400391 83.099609 93.900391 C 82.549609 93.350391 81.775 93.074219 81 93.074219 z"></path></svg>',
	discount:'<svg viewBox="0 0 16 16"><path d="M 5 3 C 3.902344 3 3 3.902344 3 5 C 3 6.097656 3.902344 7 5 7 C 6.097656 7 7 6.097656 7 5 C 7 3.902344 6.097656 3 5 3 Z M 12.269531 3.023438 L 3.023438 12.269531 L 3.726563 12.980469 L 12.980469 3.726563 Z M 5 4 C 5.558594 4 6 4.441406 6 5 C 6 5.558594 5.558594 6 5 6 C 4.441406 6 4 5.558594 4 5 C 4 4.441406 4.441406 4 5 4 Z M 11 9 C 9.902344 9 9 9.902344 9 11 C 9 12.097656 9.902344 13 11 13 C 12.097656 13 13 12.097656 13 11 C 13 9.902344 12.097656 9 11 9 Z M 11 10 C 11.558594 10 12 10.441406 12 11 C 12 11.558594 11.558594 12 11 12 C 10.441406 12 10 11.558594 10 11 C 10 10.441406 10.441406 10 11 10 Z"></path></svg>'
}

// start
export default class PartnerClientInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data:this.props.navigation.getParam('data'),
			comment:null,
			commenttemp:null,
			discount:null,
			user:null,
			orders:[],
			orderSelected:null,
			modalVisible:false,
			iscomment:false,
			isorders:false,
			isdiscount:false,
			refreshing:false,
			loading:true
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else this.setState({user:JSON.parse(user),loading:false}, () => this.refresh())
		})
	}
	refresh = () => this.setState({refreshing:true}, () => PartnerClientOrders.get(this.state.data.client.id, this.state.user.id, (res) => this.setState({refreshing:false,orders:res.data})))
	modalShow = (visible) => this.setState({modalVisible:visible})
	commentShow = () => this.setState({iscomment:true,isorders:false,isdiscount:false,commenttemp:this.state.data.comment}, this.modalShow())
	ordersShow = () => this.setState({iscomment:false,isorders:true,isdiscount:false}, this.modalShow())
	discountShow = () => this.setState({iscomment:false,isorders:false,isdiscount:true,discount:this.state.data.discountPersonal?this.state.data.discountPersonal.toString():null}, this.modalShow())
	avatarGet = (item) => {
		const avatar = item.imageAvatar ? `${API.assets}clients/${item.imageAvatar}` : item.avatar
		return avatar ? <Image source={{uri:avatar}} style={s.avatar} /> : <View style={[s.avatar,s.placeholder]}><Text style={[styles.text,styles.avatartext,styles.white,styles.upper]}>{this.initialsGet(item.name)}</Text></View>
	}
	initialsGet = (name) => {
		name = name.split(' ')
		return Utils.initialsGet(name[0],name[1])
	}
	gotoMessage = () => this.props.navigation.navigate('PartnerMessageInfo', {item:this.state.data.client})
	commentAdd = () => {
		let {data,user,commenttemp} = this.state
		PartnerClients.commentAdd(data.clientId, user.id, commenttemp)
		data.comment = commenttemp
		this.setState({data}, () => this.modalShow(false))
	}
	orderSelect = (idx) => this.setState({orderSelected:idx})
	orderPriceGet = (item) => {
		if (item.priceDiscount) return item.priceDiscount
		if (item.priceBonuses) return item.priceBonuses
		return item.price
	}
	discountSet = () => {
		let {data,user,discount} = this.state
		PartnerClients.discountUpdate(data.id, user.id, discount)
		data.discountPersonal = discount
		this.setState({data}, () => this.modalShow(false))
	}
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Пользователь'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} />
			:
			<View style={s.container}>
				<Modal animationType='slide' transparent={false} visible={this.state.modalVisible}>
					{this.state.iscomment ?
						<View style={[s.container,s.modalcontainer]}>
							<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>{'Комментарий'}</Text>
							<Text style={[styles.text,styles.grey]}>{this.state.data.name}</Text>
							<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
								<ScrollView scrollEnabled={false}>
									<TextInput
										multiline={true}
										placeholder={'Комментарий о клиенте'}
										value={this.state.commenttemp}
										style={[styles.text,s.textarea]}
										onChangeText={(commenttemp) => this.setState({commenttemp})} />
								</ScrollView>
								<View style={s.buttonblock}>
									<TouchableOpacity style={s.button} onPress={() => this.commentAdd()}>
										<Text style={[styles.text,styles.upper]}>Сохранить</Text>
									</TouchableOpacity>
								</View>
							</KeyboardAvoidingView>
						</View>
					:
					this.state.isorders ? <View style={[s.container,s.modalcontainer,s.modalcontainerfull]}>
						<Text style={[styles.text,styles.bold,styles.title,s.subtitle,s.subtitleorders]}>Продажи</Text>
						<View style={s.ordersummary}>
							<Text style={[styles.text,styles.grey]}>Сумма покупок <Text style={[styles.bold,styles.black]}>{Utils.moneyFormat(this.state.data.total)} ₽</Text></Text>
							<Text style={[styles.text,styles.grey]}>Доступно бонусов <Text style={[styles.bold,styles.black]}>{this.state.data.bonuses?`${this.state.data.bonuses} шт.`:'0'}</Text></Text>
							<Text style={[styles.text,styles.grey]}>Накопительная скидка <Text style={[styles.bold,styles.black]}>{this.state.data.discount?`${this.state.data.discount} %`:'нет'}</Text></Text>
							<Text style={[styles.text,styles.grey]}>Персональная скидка <Text style={[styles.bold,styles.black]}>{this.state.data.discountPersonal?`${this.state.data.discountPersonal} %`:'нет'}</Text></Text>
						</View>
						{this.state.orders.length === 0 ? <View style={s.notfound}>
							<Text style={styles.text}>Продажи не найдены</Text>
						</View>
						:
						<FlatList
							data={this.state.orders}
							style={s.list}
							renderItem={({item,index}) => <TouchableOpacity style={[s.listitem,index%2?s.listitemodd:null]} onPress={() => this.orderSelect(index)}>
								<View style={s.oneline}>
									<Text style={[styles.text,s.orderdate]}>{orderTypeName[item.type]} от {Dates.get(item.dateCreate, {showMonthShortName:true})}</Text>
									<Text style={styles.text}>{Utils.moneyFormat(this.orderPriceGet(item))} ₽</Text>
								</View>
								{this.state.orderSelected === index && <View style={s.orderdetails}>
									<Text style={[styles.text,styles.small]}>{item.comment}</Text>
									<View style={s.orderdetails}>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Полная сумма</Text>
											<Text style={[styles.text,styles.small]}>{Utils.moneyFormat(item.price)} ₽</Text>
										</View>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Сумма со скидкой</Text>
											<Text style={[styles.text,styles.small]}>{item.priceDiscount?`${Utils.moneyFormat(item.priceDiscount)} ₽`:'—'}</Text>
										</View>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Сумма с бонусами</Text>
											<Text style={[styles.text,styles.small]}>{item.priceBonuses?`${Utils.moneyFormat(item.priceBonuses)} ₽`:'—'}</Text>
										</View>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Скидка</Text>
											<Text style={[styles.text,styles.small]}>{item.discount?`${item.discount} %`:'—'}</Text>
										</View>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Потрачено бонусов</Text>
											<Text style={[styles.text,styles.small]}>{item.bonuses?`${item.bonuses} шт.`:'—'}</Text>
										</View>
										<View style={s.onelinelist}>
											<Text style={[styles.text,styles.small,s.detailstitle]}>Получено бонусов</Text>
											<Text style={[styles.text,styles.small]}>{item.bonusesAdded?`${item.bonusesAdded} шт.`:'—'}</Text>
										</View>
									</View>
								</View>}
							</TouchableOpacity>}
							refreshControl={
								<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={() => this.refresh()} />
							}
							keyExtractor={(item, index) => index.toString()} />
						}
						</View>
					:
						this.state.isdiscount ? <View style={[s.container,s.modalcontainer,s.modalcontainerfull]}>
								<Text style={[styles.text,styles.bold,styles.title,s.subtitle,s.subtitleorders]}>Персональная скидка</Text>
								<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
									<ScrollView scrollEnabled={false} style={s.ordersummary}>
										<Text style={[styles.text,styles.grey]}>Постоянная персональная скидка для покупателя, %</Text>
										<TextInput
											style={[styles.text,s.input]}
											value={this.state.discount}
											onChangeText={(discount) => this.setState({discount})}
											maxLength={2}
											placeholder={'15'}
											keyboardType='numeric'
											underlineColorAndroid={'transparent'} />
									</ScrollView>
									<View style={s.buttonblock}>
										<TouchableOpacity style={s.button} onPress={() => this.discountSet()}>
											<Text style={[styles.text,styles.upper]}>Сохранить</Text>
										</TouchableOpacity>
									</View>
								</KeyboardAvoidingView>
							</View>
						:
						null
					}
					<ClosePopup callback={() => this.modalShow(false)} />
				</Modal>
				{this.avatarGet(this.state.data.client)}
				<View style={s.nameblock}>
					<Text style={[styles.text,styles.titlebig,styles.bold,styles.center]}>{this.state.data.client.name}</Text>
					<Text style={[styles.text,styles.grey,styles.center,styles.mt10]}>{Utils.phoneFormatter(this.state.data.client.phone)}</Text>
					<Text style={[styles.text,styles.middle,styles.grey,styles.center,styles.mt10]}>{Dates.get(this.state.data.client.birthDay, {showMonthFullName:true,yearLetter:'г.'})}</Text>
				</View>
				{this.state.data.comment ? 
					<View style={s.comment}>
						<Text style={[styles.text,styles.small]}>{this.state.data.comment}</Text>
					</View>
				: null}
				<View style={s.panelblock}>
					<TouchableOpacity onPress={() => this.gotoMessage()} style={[s.panellink,s.panellinkone]}>
						<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.chat} />
						<Text style={[styles.text,styles.blue]}>Перейти в чат</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.commentShow()} style={s.panellink}>
						<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.comment} />
						<Text style={[styles.text,styles.blue]}>Написать комментарий</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.ordersShow()} style={s.panellink}>
						<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.orders} />
						<Text style={[styles.text,styles.blue]}>Список покупок</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.discountShow()} style={s.panellink}>
						<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.discount} />
						<Text style={[styles.text,styles.blue]}>Персональная скидка  {this.state.data.discountPersonal ? <Text style={[styles.middle,styles.grey,{textAlign:'right'}]}>{this.state.data.discountPersonal}%</Text> : null}</Text>
					</TouchableOpacity>
				</View>
			</View>
			}
		</View>
	}
}

const { width, height } = Dimensions.get('window')
const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	avatar: {
		alignSelf:'center',
		width:100,
		height:100,
		borderRadius:50,
		marginTop:40,
		marginBottom:20
	},
	placeholder: {
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#ccc'
	},
	nameblock: {
		width:width-60,
		alignSelf:'center'
	},
	oneline: {
		justifyContent:'space-between',
		flexDirection:'row'
	},
	onelinelist: {
		flexDirection:'row'
	},
	panelblock: {
		width:width-10
	},
	panellink: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#007aff30',
		borderBottomWidth:.5
	},
	panellinkone: {
		marginTop:20,
		borderTopColor:'#007aff30',
		borderTopWidth:.5
	},
	panelicon: {
		marginRight:20,
		marginLeft:5
	},
	comment: {
		marginTop:15,
		marginHorizontal:15,
		padding:15,
		backgroundColor:'#fffcc0',
		borderRadius:10
	},
	modalcontainer: {
		paddingTop:40,
		marginHorizontal:15
	},
	modalcontainerfull: {
		marginHorizontal:0
	},
	textarea: {
		height:300,
		padding:10,
		marginVertical:20,
		backgroundColor:'#f8f8f8'
	},
	subtitle: {
		marginBottom:15,
		paddingLeft:15
	},
	subtitleorders: {
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
	},
	list: {
		marginTop:20
	},
	listitem: {
		padding:10,
		paddingVertical:15,
		backgroundColor:'#f2f2f2'
	},
	listitemodd: {
		backgroundColor:'transparent'
	},
	notfound: {
		width:width-30,
		marginLeft:15,
		marginTop:10
	},
	orderdetails: {
		marginTop:10
	},
	detailstitle: {
		width:130
	},
	ordersummary: {
		width:width-60,
		marginTop:20,
		paddingLeft:15
	},
	input: {
		marginTop:20,
		marginBottom:10,
		paddingBottom:10,
		borderBottomColor:'#3b3b3b',
		borderBottomWidth:1,
		borderTopWidth:0,
		borderLeftWidth:0,
		borderRightWidth:0,
		alignItems:'flex-start'
	}
})