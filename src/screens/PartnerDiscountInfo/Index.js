/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, ScrollView, Alert, Platform } from 'react-native'

// components
import Header from '../../components/Header'

// helpers
import { PartnerDiscounts } from '../../models/Index'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerDiscountInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data:this.props.navigation.getParam('data'),
			conditions:null,
			discount:null,
			user:null
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				this.setState({user:JSON.parse(user)})
				const {data} = this.state || {}
				this.setState({id:data.id,conditions:data?data.conditions.toString():null,discount:data?data.discount.toString():null})
			}
		})
	}
	save = () => {
		if (!this.state.conditions || !this.state.discount) {
			Alert.alert('Внимание!','Для сохранения скидочного условия необходимо заполнить все параметры',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
			return
		}
		const data = {
			partnerId:this.state.user.id,
			conditions:this.state.conditions,
			discount:this.state.discount
		}
		if (this.state.id) PartnerDiscounts.update(this.state.id, data)
		else PartnerDiscounts.add(data)
		Alert.alert('Успех!',this.state.id ? 'Скидочное условие было успешно добавлено' : 'Скидочное условие было успешно обновлено',[{text:'Хорошо',onPress:() => this.props.navigation.goBack()}],{cancelable:false})
	}
	remove = (id) => {
		Alert.alert('Внимание!', 'Вы уверены, что хотите удалить скидочное условие?',
			[{text: 'Нет', style: 'cancel'},{text: 'Да', onPress: () => {
				PartnerDiscounts.remove(id)
				this.props.navigation.goBack()
			}}], {cancelable: false})
	}
	render() {
		return <View style={styles.wrapper}>
			<Header title={this.state.data === null ? 'Добавить условие скидки' : 'Редактирование условия скидки'} navigation={this.props.navigation} styles={styles} />
			<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
				<ScrollView style={s.form} horizontal={false} >
					<Text style={[styles.text,styles.middle,styles.light,s.label]}>Порог срабатывания скидки, ₽</Text>
					<TextInput
						style={[styles.text,s.input]}
						value={this.state.conditions}
						onChangeText={(conditions) => this.setState({conditions})}
						maxLength={6}
						placeholder={Utils.moneyFormat(10000, false)}
						keyboardType='numeric'
						underlineColorAndroid={'transparent'} />
					<Text style={[styles.text,styles.middle,styles.light,s.label]}>Размер скидки, %</Text>
					<TextInput
						style={[styles.text,s.input]}
						value={this.state.discount}
						onChangeText={(discount) => this.setState({discount})}
						maxLength={2}
						placeholder={'5'}
						keyboardType='numeric'
						underlineColorAndroid={'transparent'} />
					{this.state.data && <Text style={[styles.text,styles.red,styles.mt10,styles.mb20]} onPress={() => this.remove(this.state.id)}>Удалить скидку</Text>}
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