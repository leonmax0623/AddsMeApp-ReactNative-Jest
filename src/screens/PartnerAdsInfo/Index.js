/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, ScrollView, Alert, Platform } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import Lightbox from 'react-native-lightbox'

// components
import Header from '../../components/Header'

// helpers
import { Offers, Pushes } from '../../models/Index'

// helpers
import { Storage, Utils, Dates } from '../../helpers/Index'

// globals
import { API, offerStatus, pushType } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	check: {
		on:'<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#24a0ed"/><path d="M6.02155 10.8403L3.03042 7.84918C2.98986 7.80862 2.98986 7.74778 3.03042 7.70722L3.89227 6.84537C3.93283 6.80482 3.99366 6.80482 4.03422 6.84537L6.09252 8.90367L9.96578 5.03042C10.0063 4.98986 10.0672 4.98986 10.1077 5.03042L10.9696 5.89227C11.0101 5.93283 11.0101 5.99366 10.9696 6.03422L6.1635 10.8403C6.12294 10.8809 6.0621 10.8809 6.02155 10.8403Z" fill="white"/></svg>',
		off:'<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#aaa"/></svg>'
	}
}

// start
export default class PartnerAdsInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data:this.props.navigation.getParam('data'),
			user:null,
			title:null,
			date:null,
			dateTill:null,
			images:[],
			imagedata:[],
			imagetype:[],
			nodate:true
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
				this.setState({user})
				if (this.state.data) {
					const {data} = this.state
					this.setState({
						title:data.title,
						nodate:data.dateTill === null || data.dateTill === 0,
						dateTill:data.dateTill === null || data.dateTill === 0 ? null : data.dateTill,
						date:data.dateTill === null || data.dateTill === 0 ? null : new Date(data.dateTill*1000),
					})
					const images = [
						data.image1 ? `${API.assets}offers/${data.image1}` : null,
						data.image2 ? `${API.assets}offers/${data.image2}` : null,
						data.image3 ? `${API.assets}offers/${data.image3}` : null,
						data.image4 ? `${API.assets}offers/${data.image4}` : null
					]
					this.setState({images})
				} else this.setState({images:[null,null,null,null]})
			}
		})
	}
	yestodayGet = () => new Date((Math.round(new Date().getTime() / 1000) - Dates.tsDay) * 1000)
	imagePickerShow = (i) => {
		const options = {
			title:null,
			cancelButtonTitle:'Отмена',
			takePhotoButtonTitle:'Открыть камеру',
			chooseFromLibraryButtonTitle:'Выбрать из галереи',
			mediaType:'photo',
			quality:1,
			storageOptions: {
				skipBackup: true,
				path:'images'
			},
			tintColor:'#4a86cc',
			permissionDenied: {
				title:'Нет доступа к камере',
				text:'Для того чтобы иметь возможность снимать фото или видео, перейдите в Настройки и разрешите доступ к камере',
				reTryTitle:'Повторить',
				okTitle:'ОК'
			},
			maxWidth:500,
			maxHeight:500
		}
		const {images,imagedata,imagetype} = this.state
		ImagePicker.showImagePicker(options, (response) => {
			if (!response.didCancel && !response.error) {
				images[i] = response.uri
				imagedata[i] = response.data
				imagetype[i] = this.imageExtGet(response.type)
				this.setState({images,imagedata,imagetype})
			}
		})
	}
	imageExtGet = (ext) => {
		ext = ext.replace('image/', '')
		return ext === 'jpeg' ? 'jpg' : ext
	}
	imageRemove = (i) => {
		const {images,data} = this.state
		if (this.state.data) {
			const d = {}
			d[`image${i+1}`] = ''
			Offers.update(data.id, d)
		}
		images[i] = null
		this.setState({images})
	}
	dateSet = (date) => {
		const d = date.split('.')
		const ts = new Date(`${d[2]}-${d[1]}-${d[0]}`).getTime()	
		this.setState({dateTill:Math.round(ts / 1000),date})
	}
	nodateSet = () => this.setState({nodate:!this.state.nodate,date:null,dateTill:null})
	save = () => {
		if (Utils.empty(this.state.title)) {
			Alert.alert('Внимание!','Вы не заполнили обязателное поле "Текст"',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
			return
		}
		if (!this.state.nodate && Utils.empty(this.state.date)) {
			Alert.alert('Внимание!','Вы не заполнили поле "Дата окончания". Если предложение бессрочное, установите соответствующую галочку.',[{text:'Понятно',onPress:() => {}}],{cancelable:false})
			return
		}
		let data = {
			partnerId:this.state.user.id,
			title:this.state.title,
			dateTill:this.state.dateTill,
			status:offerStatus.ACTIVE
		}
		if (this.state.data === null) {
			Offers.add(data, (res) => this.orderImagesSave(res.data.id, {}))
			Pushes.add(this.state.user.name, null, this.state.title, this.state.user.id, pushType.ADS, {ads:this.state.user})
		}
		else this.orderImagesSave(this.state.data.id, data)
		this.props.navigation.goBack()
	}
	orderImagesSave = (id, data) => {
		const arr = [0,1,2,3]
		arr.forEach((v) => {
			data[`image${v+1}`] = this.state.imagedata[v] ? `offer_${id}_${v+1}.${this.state.imagetype[v]}` : null
			if (this.state.imagedata[v]) Offers.imageAdd(id, this.state.imagetype[v], v+1, this.state.imagedata[v])
		})
		if (data.image1 === null && data.image2 === null && data.image3 === null && data.image4 === null) return
		Offers.update(id, data)
	}
	remove = (id) => {
		Alert.alert('Внимание!', 'Вы уверены, что хотите удалить предлоение?',
			[{text: 'Нет', style: 'cancel'},{text: 'Да', onPress: () => {
				Offers.remove(id)
				this.props.navigation.goBack()
			}}], {cancelable: false})
	}
	render() {
		return <View style={styles.wrapper}>
			<Header title={this.state.data === null ? 'Новое предложение' : 'Редактирование предложения'} navigation={this.props.navigation} styles={styles} />
			<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
				<ScrollView style={s.form} horizontal={false} >
					<Text style={[styles.text,styles.middle,styles.light,s.label]}>Текст</Text>
					<TextInput
						style={[styles.text,s.input,s.textarea]}
						value={this.state.title}
						onChangeText={(title) => this.setState({title})}
						autoCorrect={false}
						multiline={true}
						placeholder={'Заголовок, название, описание'}
						underlineColorAndroid={'transparent'} />
					<Text style={[styles.text,styles.middle,styles.light,s.label]}>Дата окончания</Text>
					<DatePicker
						style={s.datepicker}
						date={this.state.date}
						mode={'date'}
						placeholder={'Дата окончания предложения'}
						format={'DD.MM.YYYY'}
						confirmBtnText={'Готово'}
						cancelBtnText={'Отмена'}
						minDate={this.yestodayGet()}
						customStyles={{
							dateText:styles.text,
							dateInput:s.input,
							placeholderText:[styles.text,styles.light],
							btnTextConfirm:[styles.text,styles.bold],
							btnTextCancel:[styles.text,styles.light]
						}}
						showIcon={false}
						onDateChange={(date) => this.dateSet(date)} />
					<TouchableOpacity onPress={this.nodateSet} style={s.nodate}>
						<SvgXml width={24} height={24} xml={this.state.nodate?icons.check.on:icons.check.off} />
						<Text style={[styles.text,styles.grey,{marginLeft:10}]}>Бессрочное предложение</Text>
					</TouchableOpacity>
					<Text style={[styles.text,styles.middle,styles.light,s.label]}>Изображения</Text>
					<View style={s.imagecontainer}>
						{this.state.images.map((v,i) => v ? <View key={i}>
								<Lightbox renderContent={() => <Image style={s.imageFullScreen} source={{uri:v}} />}>
									<Image source={{uri:v}} style={s.image}/>
								</Lightbox>
								<TouchableOpacity onPress={() => this.imagePickerShow(i)} style={s.edit} >
									<SvgXml width={32} height={32} fill={'#000'} xml={'<svg viewBox="0 0 35 35"><circle cx="17.5" cy="17.5" r="17.5" fill="#fefefe"/><path d="M23.727 10.7189C22.8283 9.76037 21.3713 9.76037 20.4726 10.7189L11.3496 20.4493C11.2871 20.5159 11.2419 20.5986 11.2184 20.6894L10.0187 25.3089C9.96932 25.4983 10.0195 25.7011 10.1497 25.8403C10.2801 25.9792 10.4703 26.0326 10.6479 25.9802L14.9791 24.7004C15.0642 24.6753 15.1417 24.6271 15.2042 24.5605L24.327 14.8299C25.2243 13.8707 25.2243 12.318 24.327 11.3589L23.727 10.7189Z" fill="#007aff"/></svg>'} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => this.imageRemove(i)} style={s.remove}>
									<SvgXml width={26} height={26} xml={'<svg viewBox="0 0 18 18"><path opacity="0.3" d="M9 0C7.8181 -1.76116e-08 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 0 7.8181 0 9C0 10.1819 0.232792 11.3522 0.685084 12.4442C1.13738 13.5361 1.80031 14.5282 2.63604 15.364C3.47177 16.1997 4.46392 16.8626 5.55585 17.3149C6.64778 17.7672 7.8181 18 9 18C10.1819 18 11.3522 17.7672 12.4442 17.3149C13.5361 16.8626 14.5282 16.1997 15.364 15.364C16.1997 14.5282 16.8626 13.5361 17.3149 12.4442C17.7672 11.3522 18 10.1819 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 -1.76116e-08 9 0Z" fill="#ddd"/><path d="M6.37609 6.00016C6.30162 6.00018 6.22886 6.02241 6.16709 6.064C6.10532 6.10559 6.05736 6.16466 6.02934 6.23365C6.00132 6.30265 5.99451 6.37843 6.00979 6.45131C6.02506 6.52419 6.06172 6.59086 6.11509 6.6428L8.47068 8.99839L6.11509 11.354C6.07916 11.3885 6.05048 11.4298 6.03072 11.4755C6.01096 11.5212 6.00053 11.5704 6.00002 11.6202C5.99951 11.67 6.00895 11.7194 6.02777 11.7655C6.0466 11.8116 6.07443 11.8535 6.10965 11.8887C6.14486 11.924 6.18675 11.9518 6.23286 11.9706C6.27897 11.9894 6.32837 11.9989 6.37817 11.9984C6.42797 11.9979 6.47717 11.9874 6.52288 11.9677C6.5686 11.9479 6.60991 11.9192 6.6444 11.8833L9 9.52771L11.3556 11.8833C11.3901 11.9192 11.4314 11.9479 11.4771 11.9677C11.5228 11.9874 11.572 11.9979 11.6218 11.9984C11.6716 11.9989 11.721 11.9894 11.7671 11.9706C11.8132 11.9518 11.8551 11.924 11.8904 11.8887C11.9256 11.8535 11.9534 11.8116 11.9722 11.7655C11.9911 11.7194 12.0005 11.67 12 11.6202C11.9995 11.5704 11.989 11.5212 11.9693 11.4755C11.9495 11.4298 11.9208 11.3885 11.8849 11.354L9.52931 8.99839L11.8849 6.6428C11.939 6.59022 11.9759 6.52253 11.9909 6.44859C12.0059 6.37465 11.9981 6.29792 11.9687 6.22846C11.9393 6.15899 11.8896 6.10002 11.8261 6.05928C11.7627 6.01855 11.6883 5.99794 11.6129 6.00016C11.5157 6.00306 11.4234 6.0437 11.3556 6.11348L9 8.46908L6.6444 6.11348C6.60952 6.07762 6.5678 6.04912 6.52172 6.02966C6.47563 6.0102 6.42612 6.00017 6.37609 6.00016Z" fill="#9299A2"/></svg>'} />
								</TouchableOpacity>
							</View>
							:
							<View key={i}>
								<View style={[s.image,s.placeholder]}></View>
								<TouchableOpacity onPress={() => this.imagePickerShow(i)} style={s.edit} >
									<SvgXml width={32} height={32} fill={'#000'} xml={'<svg viewBox="0 0 35 35"><circle cx="17.5" cy="17.5" r="17.5" fill="#fefefe"/><path d="M23.727 10.7189C22.8283 9.76037 21.3713 9.76037 20.4726 10.7189L11.3496 20.4493C11.2871 20.5159 11.2419 20.5986 11.2184 20.6894L10.0187 25.3089C9.96932 25.4983 10.0195 25.7011 10.1497 25.8403C10.2801 25.9792 10.4703 26.0326 10.6479 25.9802L14.9791 24.7004C15.0642 24.6753 15.1417 24.6271 15.2042 24.5605L24.327 14.8299C25.2243 13.8707 25.2243 12.318 24.327 11.3589L23.727 10.7189Z" fill="#007aff"/></svg>'} />
								</TouchableOpacity>
								<View style={s.remove}></View>
							</View>
							)
						}
					</View>
					{this.state.data && <Text style={[styles.text,styles.red,styles.mt20,styles.mb20]} onPress={() => this.remove(this.state.data.id)}>Удалить предложение</Text>}
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
	textarea: {
		maxHeight:250
	},
	buttonblock: {
		marginTop:10,
		marginBottom:21,
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
	},
	datepicker: {
		width:'100%'
	},
	imagecontainer: {
		alignItems:'center',
		flexDirection:'row',
		justifyContent:'space-between',
		marginBottom:10
	},
	image: {
		width:70,
		height:70,
		backgroundColor:'#ddd',
		borderRadius:10
	},
	placeholder: {
		backgroundColor:'#ddd'
	},
	edit: {
		position:'absolute',
		left:35-16,
		top:35-16,
		opacity:.7
	},
	imageFullScreen: {
		flex:1,
		resizeMode:'contain'
	},
	remove: {
		width:24,
		height:24,
		marginTop:10,
		alignSelf:'center'
	},
	nodate: {
		marginTop:10,
		marginBottom:15,
		flexDirection:'row',
		alignItems:'center'
	}
})