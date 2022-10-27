/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal } from 'react-native'

// plug-ins
import DatePicker from 'react-native-datepicker'

// components
import Header from '../../components/Header'

// models
import { Statistics, PartnerClients } from '../../models/Index'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// globals
import { statisticType } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerStatisticsInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			menu:[],
			statistics:[],
			clients:[],
			user:null,
			title:null,
			dateStart:null,
			dateEnd:null,
			dateStartTs:null,
			dateEndTs:null,
			count:0,
			type:0,
			group:0,
			modalVisible:false
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
				const menu = [
					{title:'Количество просмотров ленты всеми пользователями',group:1,type:statisticType.VIEW_ADS},
					{title:'Количество просмотров ленты клиентами',group:2,type:statisticType.VIEW_ADS},
					{title:'Количество просмотров ленты неизвестными пользователями',group:3,type:statisticType.VIEW_ADS},
					{title:'Количество просмотров профиля',type:statisticType.VIEW_PROFILE},
				]
				Statistics.get(user.id, (res) => this.setState({statistics:res.data}))
				PartnerClients.byPartnerGetLite(user.id, (res) => this.setState({clients:res.data}))
				const dateEnd = new Date(), dateEndTs = Math.round(dateEnd.getTime() / 1000), dateStart = new Date()
				dateStart.setDate(dateStart.getDate() - 7)
				const dateStartTs = Math.round(dateStart.getTime() / 1000)
				this.setState({dateStart,dateStartTs,dateEnd,dateEndTs,user,menu})
			}
		})
	}
	modalShow = (visible) => this.setState({modalVisible:visible})
	dateSet = (date, key) => {
		const d = date.split('.')
		const ts = new Date(`${d[2]}-${d[1]}-${d[0]}`).getTime()	
		this.setState({[`${key}Ts`]:Math.round(ts / 1000),[`${key}`]:date}, () => this.chartRebuild())
	}
	chartShow = (type, group, title) => {
		this.setState({title,type,group}, () => this.chartRebuild())
		this.modalShow(true)
	}
	chartRebuild = () => {
		const {statistics,dateStartTs,dateEndTs,type,group} = this.state
		let data = statistics.filter(f => f.type === type && f.dateCreate > dateStartTs && f.dateCreate < dateEndTs)
		if (type === statisticType.VIEW_ADS) {
			if (group === 2) data = data.filter(f => this.isClient(f.clientId))
			if (group === 3) data = data.filter(f => !this.isClient(f.clientId))
		}
		this.setState({count:data.length})
	}
	isClient = (id) => this.state.clients.filter(f => f.clientId === id).length > 0
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Просмотры профиля и ленты'} navigation={this.props.navigation} styles={styles} />
			<View style={s.container}>
				<Modal animationType='slide' transparent={false} visible={this.state.modalVisible}>
					<View style={[s.container,s.modalcontainer]}>
						<Text style={[styles.text,styles.bold,styles.title,s.subtitle]}>Статистика</Text>
						<Text style={[styles.text,styles.grey]}>{this.state.title}</Text>
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
						<Text style={[styles.text,styles.titlebig,styles.grey]}>Количество: <Text style={[styles.bold,styles.black]}>{this.state.count}</Text></Text>
					</View>
					<ClosePopup callback={() => this.modalShow(false)} />
				</Modal>
				<View style={s.lists}>
					{this.state.menu.map((v, i) => <TouchableOpacity key={i} style={[s.oneline,s.item]} onPress={() => this.chartShow(v.type, v.group, v.title)}>
						<Text style={styles.text}>{v.title}</Text>
					</TouchableOpacity>)}
				</View>
			</View>
		</View>
	}
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
	datepickercontainer: {
		flexDirection:'row',
		marginVertical:40
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