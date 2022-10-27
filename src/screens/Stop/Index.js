/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// globals
import { API } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class StopScreen extends Component {
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
	toLogin = () => {
		Storage.get('unreadMessages', (unreadMessages) => {
			Storage.clear()
			Storage.set('startScreen', 'Start')
			Storage.set('unreadMessages', unreadMessages)
			this.props.navigation.navigate('Start')
		})
	}
	toPay = () => Linking.openURL(Utils.payUrlGet(this.state.user.id))
	render() {
		if (this.state.user === null) return null
		return <View style={styles.wrapper}>
				<View style={s.warning}>
					<SvgXml style={s.icon} fill={'red'} xml={'<svg viewBox="0 0 22 19"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.2894 1.00787L20.8434 15.9769C21.0171 16.281 21.1079 16.6254 21.1067 16.9756C21.1055 17.3259 21.0124 17.6696 20.8366 17.9726C20.6608 18.2755 20.4086 18.527 20.1051 18.7018C19.8017 18.8767 19.4576 18.9688 19.1074 18.9689H1.99936C1.64912 18.9688 1.30505 18.8767 1.00158 18.7018C0.698106 18.527 0.445867 18.2755 0.270099 17.9726C0.0943301 17.6696 0.00119481 17.3259 1.14197e-05 16.9756C-0.00117197 16.6254 0.0896379 16.281 0.263355 15.9769L8.81736 1.00687C8.99235 0.700974 9.24507 0.446748 9.54993 0.269935C9.85478 0.0931216 10.2009 0 10.5534 0C10.9058 0 11.2519 0.0931216 11.5568 0.269935C11.8616 0.446748 12.1144 0.700974 12.2894 1.00687V1.00787Z" fill="#F52B18"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.55334 4.96875H11.5533V11.9688H9.55334V4.96875ZM9.55334 13.9688H11.5533V15.9688H9.55334V13.9688Z" fill="white"/></svg>'} />
					<Text style={[styles.text,styles.bold,styles.center]}>Доступ к вашему аккаунту приостановлен!</Text>
					<Text style={[styles.text,styles.mt20,styles.center]}>Мы заметели, что у вас есть неоплаченная подписка на доступ к сервису.</Text>
					<Text style={[styles.text,styles.mt5,styles.center]}>Для возобновления деятельности необходимо оплатить месячную подписку в размере <Text style={styles.bold}>700 ₽</Text>.</Text>
				</View>
				<TouchableOpacity style={{marginTop:10,alignItems:'center'}} onPress={() => this.toPay()}>
					<View style={styles.button}>
						<Text style={[styles.text,styles.white,styles.upper]}>Перейти к оплате</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.toLogin()}>
					<Text style={[styles.text,styles.small,styles.grey,styles.center]}>Войти под другим аккаунтом</Text>
				</TouchableOpacity>
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	warning: {
		marginTop:80,
		marginBottom:50,
		paddingHorizontal:20
	},
	icon: {
		alignSelf:'center',
		marginTop:10,
		marginBottom:40,
		width:100,
		height:100
	}
})