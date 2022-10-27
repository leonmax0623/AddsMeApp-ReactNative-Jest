/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Header from '../../components/Header'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	next:'<svg viewBox="0 0 16 16"><path d="M 5.710938 2.007813 L 5.039063 2.742188 L 10.761719 8 L 5.039063 13.253906 L 5.710938 13.996094 L 11.839844 8.367188 C 11.941406 8.273438 12 8.140625 12 8 C 12 7.859375 11.941406 7.726563 11.839844 7.632813 Z"></path></svg>'
}

// start
export default class PartnerStatisticsScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else this.setState({user:JSON.parse(user)})
		})
	}
	gotoInfo = () => this.props.navigation.navigate('PartnerStatisticsInfo')
	gotoUsers = () => this.props.navigation.navigate('PartnerClients')
	gotoOrders = () => this.props.navigation.navigate('PartnerOrders')
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Статистика'} styles={styles} navigation={this.props.navigation} />
			<View style={s.lists}>
				<TouchableOpacity style={[s.oneline,s.item]} onPress={() => this.gotoInfo()}>
					<Text style={styles.text}>Просмотры профиля и ленты</Text>
					<SvgXml width={22} height={22} fill={'#9a9a9b'} xml={icons.next} />
				</TouchableOpacity>
				<TouchableOpacity style={[s.oneline,s.item]} onPress={() => this.gotoUsers()}>
					<Text style={styles.text}>Учет клиентов</Text>
					<SvgXml width={22} height={22} fill={'#9a9a9b'} xml={icons.next} />
				</TouchableOpacity>
				<TouchableOpacity style={[s.oneline,s.item]} onPress={() => this.gotoOrders()}>
					<Text style={styles.text}>Учет продаж</Text>
					<SvgXml width={22} height={22} fill={'#9a9a9b'} xml={icons.next} />
				</TouchableOpacity>
			</View>
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
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
	oneline: {
		justifyContent:'space-between',
		flexDirection:'row'
	}
})