/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerRemoveScreen extends Component {
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
	logout = () => {
		Alert.alert('Внимание!', 'Вы уверены, что хотите выйти?',
			[{text: 'Нет', style: 'cancel'},{text: 'Да', onPress: () => {
				Storage.get('unreadMessages', (unreadMessages) => {
					Storage.clear()
					Storage.set('startScreen', 'Start')
					Storage.set('unreadMessages', unreadMessages)
					this.props.navigation.navigate('Start')
				})
			}}], {cancelable: false})
	}
	render() {
		if (this.state.user === null) return null
		return <View style={styles.wrapper}>
			<Header title={'Выход из аккаунта'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} />
			:
				<View style={[s.container,s.lists]}>
					<View style={s.warning}>
						<SvgXml style={s.icon} fill={'red'} xml={'<svg viewBox="0 0 22 19"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.2894 1.00787L20.8434 15.9769C21.0171 16.281 21.1079 16.6254 21.1067 16.9756C21.1055 17.3259 21.0124 17.6696 20.8366 17.9726C20.6608 18.2755 20.4086 18.527 20.1051 18.7018C19.8017 18.8767 19.4576 18.9688 19.1074 18.9689H1.99936C1.64912 18.9688 1.30505 18.8767 1.00158 18.7018C0.698106 18.527 0.445867 18.2755 0.270099 17.9726C0.0943301 17.6696 0.00119481 17.3259 1.14197e-05 16.9756C-0.00117197 16.6254 0.0896379 16.281 0.263355 15.9769L8.81736 1.00687C8.99235 0.700974 9.24507 0.446748 9.54993 0.269935C9.85478 0.0931216 10.2009 0 10.5534 0C10.9058 0 11.2519 0.0931216 11.5568 0.269935C11.8616 0.446748 12.1144 0.700974 12.2894 1.00687V1.00787Z" fill="#F52B18"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.55334 4.96875H11.5533V11.9688H9.55334V4.96875ZM9.55334 13.9688H11.5533V15.9688H9.55334V13.9688Z" fill="white"/></svg>'} />
						<Text style={[styles.text,styles.bold]}>Выход из учетной записи подразумевает:</Text>
						<Text style={[styles.text,styles.mt20]}>Вы выходите из аккаунта и для повторного доступа к своим данным вам будет необходимо заново пройти процедуру входа используя номер мобильного телефона {'\r'}<Text style={styles.bold}>{Utils.phoneFormatter(this.state.user.phone)}</Text>.</Text>
					</View>
					<TouchableOpacity style={s.item} onPress={() => this.logout()}>
						<Text style={[styles.text,styles.red]}>Выйти из аккаунта</Text>
					</TouchableOpacity>
				</View>
			}
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	warning: {
		marginBottom:50,
		paddingHorizontal:20
	},
	icon: {
		alignSelf:'center',
		marginTop:10,
		marginBottom:40,
		width:100,
		height:100
	},
	lists: {
		padding:6,
		paddingTop:20
	},
	item: {
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5,
		borderTopColor:'#ddd',
		borderTopWidth:.5,
		justifyContent:'center',
		flexDirection:'row',
		alignItems:'center'
	}
})