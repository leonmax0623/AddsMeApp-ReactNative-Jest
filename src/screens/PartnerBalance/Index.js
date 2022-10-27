/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList, RefreshControl, Alert, Linking } from 'react-native'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// models
import { PartnerTransactions } from '../../models/Index'

// helpers
import { Storage, Utils, Dates } from '../../helpers/Index'

// models
import { API, transactionsStatus, transactionsStatusName } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerBalanceScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			transactions:[],
			loading:true,
			refreshing:false
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else this.setState({user:JSON.parse(user)}, () => this.refresh())
		})
	}
	refresh = () => this.setState({refreshing:true}, () => PartnerTransactions.get(this.state.user.id, (res) => this.setState({transactions:res.data,refreshing:false,loading:false})))
	add = () => {
		Alert.alert('Внимание!', 'Пополнить баланс?',
			[{text: 'Нет', style: 'cancel'},{text: 'Да', onPress: () => {
				Linking.openURL(Utils.payUrlGet(this.state.user.id))
			}}], {cancelable: false})
	}
	colorGet = (item) => item.status === transactionsStatus.FINISH ? styles.green : styles.grey
	render() {
		return <View style={styles.wrapper}>
			<Header
				title={'Операции'}
				styles={styles}
				navigation={this.props.navigation} 
				context={{
					icon:'<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 7 L 4 7 L 4 8 L 7 8 L 7 11 L 8 11 L 8 8 L 11 8 L 11 7 L 8 7 L 8 4 Z"></path></svg>',
					callback:() => this.add()
				}} />
			{this.state.loading ? <Loader styles={styles} /> :
				this.state.transactions.length === 0 ?
				<View style={s.notfound}>
					<Text style={styles.text}>Операции не найдены</Text>
				</View>
				:
				<FlatList
					style={s.list}
					data={this.state.transactions}
					renderItem={({item}) => <View style={s.item}>
						<Text style={styles.text}>{Dates.get(item.dateCreate)}</Text>
						<Text style={[styles.text,styles.middle,this.colorGet(item)]}>{transactionsStatusName[item.status]}</Text>
						<Text style={styles.text}>{Utils.moneyFormat(item.amount)} ₽</Text>
					</View>}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.refresh()} />
					}
					keyExtractor={(item, index) => index.toString()} />
			}
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	list: {
		paddingTop:20,
		width:'100%'
	},
	item: {
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		padding:10,
		paddingHorizontal:15,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	notfound: {
		marginHorizontal:15,
		marginTop:20
	}
})