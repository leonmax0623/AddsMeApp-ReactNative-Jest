/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Dimensions, Alert, Platform } from 'react-native'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// models
import { PartnerBonuses } from '../../models/Index'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerBonusesScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			discounts:[],
			user:null,
			bonuses:{},
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
				user = JSON.parse(user)
				PartnerBonuses.get(user.id, (res) => {
					const bonuses = res.data.length > 0 ? res.data[0] : {}
					this.setState({user,id:bonuses.id,topUp:bonuses.topUp?String(bonuses.topUp):null,withdraw:bonuses.withdraw?String(bonuses.withdraw):null,max:bonuses.max?String(bonuses.max):null,isaccept:user.bonus,loading:false})
				})
			}
		})
	}
	save = () => {
		let {user} = this.state
		if (!this.state.topUp || !this.state.withdraw || !this.state.max) {
			Alert.alert('Внимание!','Для сохранения бонусной программы необходимо заполнить все параметры',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
			return
		}
		const data = {
			partnerId:user.id,
			topUp:this.state.topUp,
			withdraw:this.state.withdraw,
			max:this.state.max
		}
		if (this.state.id) PartnerBonuses.update(user.id, data)
		else PartnerBonuses.add(data, (res) => this.setState({id:res.data.id}))
		Alert.alert('Успех!','Информация обновлена успешно',[{text:'Хорошо',onPress:() => this.props.navigation.goBack()}],{cancelable:false})
	}
	render() {
		return this.state.loading ? <Loader styles={styles} /> :
			<View style={styles.wrapper}>
				<Header title={'Бонусная программа'} navigation={this.props.navigation} styles={styles} />
				<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
					<ScrollView style={s.form} horizontal={false} >
						<Text style={[styles.text,styles.middle,styles.light,s.label]}>Процент начисления от сумму покупки</Text>
						<TextInput
							style={[styles.text,s.input]}
							value={this.state.topUp}
							onChangeText={(topUp) => this.setState({topUp})}
							maxLength={2}
							placeholder={'30%'}
							keyboardType='numeric'
							underlineColorAndroid={'transparent'} />
						<Text style={[styles.text,styles.middle,styles.light,s.label]}>Стоимость бонусного балла, ₽</Text>
						<TextInput
							style={[styles.text,s.input]}
							value={this.state.withdraw}
							onChangeText={(withdraw) => this.setState({withdraw})}
							maxLength={4}
							placeholder={'0.5'}
							keyboardType='numeric'
							underlineColorAndroid={'transparent'} />
						<Text style={[styles.text,styles.middle,styles.light,s.label]}>Максимальный процент оплаты бонусами</Text>
						<TextInput
							style={[styles.text,s.input]}
							value={this.state.max}
							onChangeText={(max) => this.setState({max})}
							maxLength={2}
							placeholder={'50%'}
							keyboardType='numeric'
							underlineColorAndroid={'transparent'} />
					</ScrollView>
					<View style={s.buttonblock}>
						<TouchableOpacity style={s.button} onPress={() => this.save()}>
							<Text style={[styles.text,styles.upper]}>Сохранить</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</View>
	}
}

const {width,height} = Dimensions.get('window')
const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	form: {
		paddingHorizontal:30,
		paddingTop:10,
		width:'100%',
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
	buttonblock: {
		marginTop:10,
		marginBottom:20,
		alignItems:'center'
	},
	button: {
		width:width-30,
		padding:15,
		backgroundColor:'#ffd93e',
		borderRadius:10,
		alignItems:'center'
	},
	label: {
		marginTop:10,
		marginBottom:10
	}
})