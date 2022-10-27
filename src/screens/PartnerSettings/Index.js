/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// modeles
import { Partners } from '../../models/Index'

// helpers
import { Utils, Storage } from '../../helpers/Index'

import { partnerStatus } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerSettingsScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			loading:true
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else this.setState({loading:false,user:JSON.parse(user)})
		})
	}
	go = (link) => this.props.navigation.navigate(link)
	action = () => {
		let {user} = this.state
		if (user.status === partnerStatus.ACTIVE) {
			Alert.alert('Внимание!', 'Вы уверены, что хотите остановить деятельность?',
				[{text: 'Нет', style: 'cancel'},{text: 'Да', onPress: () => {
					Partners.stop(user.id)
					user.status = partnerStatus.DELETED
					Storage.set('user', JSON.stringify(user))
					this.props.navigation.goBack()
				}}], {cancelable: false})

		} else {
			user.status = partnerStatus.ACTIVE
			Partners.start(user.id)
			Storage.set('user', JSON.stringify(user))
			Alert.alert('Внимание!!','Ваш аккаунт ативирован!',[{text:'Хорошо',onPress:() => this.props.navigation.goBack()}],{cancelable:false})
		}
	}
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Настройки'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} />
			:
				<View style={s.container}>
					<View style={[s.container,s.lists]}>
						<TouchableOpacity style={[s.oneline,s.item]} onPress={() => this.action()}>
							<Text style={[styles.text,this.state.user.status === partnerStatus.ACTIVE?styles.red:null]}>{this.state.user.status === partnerStatus.ACTIVE ? 'Остановить деятельность' : 'Возобновить деятельность'}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[s.oneline,s.item]} onPress={() => this.go('PartnerRemove')}>
							<Text style={styles.text}>Выйти из аккаунта</Text>
							<SvgXml width={22} height={22} fill={'#9a9a9b'} xml={'<svg viewBox="0 0 16 16"><path d="M 5.710938 2.007813 L 5.039063 2.742188 L 10.761719 8 L 5.039063 13.253906 L 5.710938 13.996094 L 11.839844 8.367188 C 11.941406 8.273438 12 8.140625 12 8 C 12 7.859375 11.941406 7.726563 11.839844 7.632813 Z"></path></svg>'} />
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
	oneline: {
		justifyContent:'space-between',
		flexDirection:'row',
		alignItems:'center'
	},
	lists: {
		padding:6,
		paddingTop:20
	},
	item: {
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	message: {
		width:width-15-15-50
	},
	input: {
		width:50,
		marginTop:10,
		marginBottom:10,
		paddingBottom:10,
		borderBottomColor:'#3b3b3b',
		borderBottomWidth:1,
		borderTopWidth:0,
		borderLeftWidth:0,
		borderRightWidth:0,
		alignItems:'flex-start',
		textAlign:'right'
	}
})