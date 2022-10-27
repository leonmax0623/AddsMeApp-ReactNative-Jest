/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, RefreshControl } from 'react-native'

// plug-ins
import DatePicker from 'react-native-datepicker'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// models
import { PartnerClientOrders } from '../../models/Index'

// helpers
import { Utils, Storage, Dates } from '../../helpers/Index'

// globals
import { orderTypeName } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerOrdersScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			orders:[],
			total:0,
			totalFull:0,
			bonuses:0,
			dateStart:null,
			dateEnd:null,
			dateStartTs:null,
			dateEndTs:null,
			orderSelected:null,
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
			else {
				const dateEnd = new Date(), dateEndTs = Math.round(dateEnd.getTime() / 1000), dateStart = new Date()
				dateStart.setDate(dateStart.getDate() - 7)
				const dateStartTs = Math.round(dateStart.getTime() / 1000)
				this.setState({user:JSON.parse(user),loading:false,dateStart,dateStartTs,dateEnd,dateEndTs}, () => this.refresh())
			}
		})
	}
	refresh = () => this.setState({refreshing:true}, () => {
		PartnerClientOrders.byPartnerGet(this.state.user.id, (res) => {
			const orders = res.data.filter(f => f.dateCreate > this.state.dateStartTs && f.dateCreate < (this.state.dateEndTs + Dates.tsDay))
			const total = orders.length == 0 ? 0 : (orders.length === 1 ? orders[0].price : orders.reduce((acc, val) => (acc instanceof Object ? acc.price : acc) + val.price))
			const totalFull = orders.length == 0 ? 0 : (orders.length === 1 ? (orders[0].priceDiscount === 0 ? (orders[0].priceBonuses === 0 ? orders[0].price : orders[0].priceBonuses) : orders[0].priceDiscount) : orders.reduce((acc, val) => (acc instanceof Object ? (acc.priceDiscount === 0 ? acc.priceBonuses : acc.priceDiscount) : acc) + (val.priceDiscount === 0 ? (val.priceBonuses === 0 ? val.price : val.priceBonuses) : val.priceDiscount)))
			const bonuses = orders.length == 0 ? 0 : (orders.length === 1 ? orders[0].bonuses : orders.reduce((acc, val) => (acc instanceof Object ? acc.bonuses : acc) + val.bonuses))
			this.setState({refreshing:false,orders,total,totalFull,bonuses})
		})
	})
	dateSet = (date, key) => {
		const d = date.split('.')
		const ts = new Date(`${d[2]}-${d[1]}-${d[0]}`).getTime()	
		this.setState({[`${key}Ts`]:Math.round(ts / 1000),[`${key}`]:date}, () => this.refresh())
	}
	orderPriceGet = (item) => {
		if (item.priceDiscount) return item.priceDiscount
		if (item.priceBonuses) return item.priceBonuses
		return item.price
	}
	orderSelect = (idx) => this.setState({orderSelected:idx})
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Учет продаж'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} />
			:
			<View style={s.container}>
				<View style={s.datepickercontainer}>
					<DatePicker
						style={s.datepicker}
						date={this.state.dateStart}
						mode={'date'}
						placeholder={'Начало периода'}
						format={'DD.MM.YYYY'}
						confirmBtnText={'Готово'}
						cancelBtnText={'Отмена'}
						customStyles={{
							dateText:styles.text,
							dateInput:s.input,
							placeholderText:[styles.text,styles.light],
							btnTextConfirm:[styles.text,styles.bold],
							btnTextCancel:[styles.text,styles.light]
						}}
						showIcon={false}
						onDateChange={(dateStart) => this.dateSet(dateStart, 'dateStart')} />
					<DatePicker
						style={s.datepicker}
						date={this.state.dateEnd}
						mode={'date'}
						placeholder={'Конец периода'}
						format={'DD.MM.YYYY'}
						confirmBtnText={'Готово'}
						cancelBtnText={'Отмена'}
						customStyles={{
							dateText:styles.text,
							dateInput:s.input,
							placeholderText:[styles.text,styles.light],
							btnTextConfirm:[styles.text,styles.bold],
							btnTextCancel:[styles.text,styles.light]
						}}
						showIcon={false}
						onDateChange={(dateEnd) => this.dateSet(dateEnd, 'dateEnd')} />
				</View>
				{this.state.orders.length === 0 ? <View style={s.notfound}>
					<Text style={styles.text}>Продажи не найдены</Text>
				</View>
				:
				<View>
					<View style={s.ordersummary}>
						<Text style={[styles.text,styles.grey]}>Сумма продаж <Text style={[styles.bold,styles.black]}>{Utils.moneyFormat(this.state.total)} ₽</Text></Text>
						<Text style={[styles.text,styles.grey]}>Сумма поступлений <Text style={[styles.bold,styles.black]}>{Utils.moneyFormat(this.state.totalFull)} ₽</Text></Text>
						<Text style={[styles.text,styles.grey]}>Принято бонусов <Text style={[styles.bold,styles.black]}>{this.state.bonuses} шт.</Text></Text>
					</View>
					<FlatList
						data={this.state.orders}
						style={s.list}
						renderItem={({item,index}) => <TouchableOpacity style={[s.listitem,index%2?s.listitemodd:null]} onPress={() => this.orderSelect(index)}>
							<View style={s.oneline}>
								<Text style={[styles.text,s.orderdate]}>{orderTypeName[item.type]} от {Dates.get(item.dateCreate, {showMonthShortName:true})}</Text>
								<Text style={styles.text}>{Utils.moneyFormat(this.orderPriceGet(item))} ₽</Text>
							</View>
							<Text style={[styles.text,styles.mt5]}>{item.clientName}</Text>
							{this.state.orderSelected === index && <View style={s.orderdetails}>
								{!Utils.empty(item.comment) && <Text style={[styles.text,styles.small]}>{item.comment}</Text>}
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
				</View>
				}
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
	list: {
		marginTop:20,
		height:height-210
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
		marginHorizontal:15,
		marginTop:20
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
	comment: {
		marginTop:15,
		marginHorizontal:15,
		padding:15,
		backgroundColor:'#fffcc0',
		borderRadius:10
	},
	datepickercontainer: {
		flexDirection:'row',
		marginTop:20,
		marginHorizontal:15
	},
	datepicker: {
		width:140,
		marginRight:40
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
	}
})