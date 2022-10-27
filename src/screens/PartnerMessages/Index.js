/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, RefreshControl, KeyboardAvoidingView, Dimensions, Platform } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Loader from '../../components/Loader'
import Header from '../../components/Header'

// modeles
import { PartnerClientMessages } from '../../models/Index'

// helpers
import { Dates, Utils, Storage } from '../../helpers/Index'

// globals
import { API, chatType } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerMessagesScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			unreadMessages:[],
			messages:[],
			messagesAll:[],
			chatsPartners:[],
			search:null,
			refreshing:false,
			imageserror:[],
			loading:true,
			user:null
		}
	}
	componentDidMount = () => {
		this.unreadMessagesGet()
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				this.setState({user:JSON.parse(user)})
				this.focusListener = this.props.navigation.addListener('didFocus', () => {
					this.unreadMessagesGet()
					this.dataGet()
				})
				this.dataGet()
			}
		})
	}
	componentWillUnmount = () => this.focusListener.remove()
	refresh = () => this.setState({refreshing:true}, () => this.dataGet())
	dataGet = () => {
		PartnerClientMessages.chatsPartnerGet(this.state.user.id, (res) => {
			let messages = res.data
			if (messages.length === 0) {
				this.setState({loading:false})
				return
			}
			messages.forEach((v) => {
				const id = v.parentId || v.id
				let {chatsPartners} = this.state
				PartnerClientMessages.lastChatMessagesGet(id, (res) => {
					chatsPartners[id] = res.data
					this.setState({chatsPartners})
				})
			})
			messages.sort((a, b) => a.dateCreate > b.dateCreate ? -1 : 1)
			this.setState({messages,messagesAll:messages,loading:false,refreshing:false})
		})
	}
	unreadMessagesGet = () => Storage.get('unreadMessages', (unreadMessages) => this.setState({unreadMessages:JSON.parse(unreadMessages)}))
	search = (text) => {
		if (text.length > 0) {
			let messages = this.state.messagesAll.filter(f => this.messagesFind(f, text))
			this.setState({messages})
		} else this.setState({messages:this.state.messagesAll})
	}
	messagesFind = (item, text) => {
		const clientName = item.clientName ? item.clientName.toLowerCase() : '', partnerName = item.partnerName ? item.partnerName.toLowerCase() : '', message = item.message.toLowerCase()
		text = text.toLowerCase()
		return clientName.indexOf(text) !== -1 || partnerName.indexOf(text) !== -1 || message.indexOf(text) !== -1
	}
	initialsGet = (name) => {
		name = name.split(' ')
		return Utils.initialsGet(name[0],name[1])
	}
	imageErrorHandler = (id) => {
		let {imageserror} = this.state
		imageserror[id] = true
		this.setState({imageserror})
	}
	gotoMessage = (item) => this.props.navigation.navigate('PartnerMessageInfo', {data:this.state.chatsPartners[item.parentId || item.id]})
	messageCountGet = (item) => {
		const {unreadMessages,chatsPartners} = this.state, id = item.parentId || item.id
		let messages = chatsPartners
		messages = messages === undefined || messages === null ? [] : messages[id]
		let count = messages ? messages.length : 0
		if (count !== 0) {
			const lastDate = unreadMessages ? unreadMessages[`message_${chatType.PARTNER}_${id}`] : 0
			messages = messages.filter(f => f.dateCreate > (lastDate || 0))
			count = messages.length
		}
		return <View style={s.messagesblock}>
			{count === 0 ? null :
				<View style={s.count}>
					<Text style={[styles.text,count>99?styles.mini:styles.small,styles.bold,styles.white]}>{count>99?'99+':count}</Text>
				</View>
			}
		</View>
	}
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Сообщения от клиентов'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} />
			:
			<View style={s.container}>
				<View style={s.inner}>
					<View style={s.search}>
						<TextInput
							style={styles.text}
							value={this.state.search}
							onChangeText={this.search}
							autoCorrect={false}
							placeholder={'Поиск'}
							underlineColorAndroid={'transparent'} />
						<SvgXml width={16} height={16} fill={'#9a9a9b'} style={s.searchicon} xml={'<svg viewBox="0 0 50 50"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>'} />
					</View>
					<KeyboardAvoidingView behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
						{this.state.messages.length > 0 ?
							<FlatList
								style={s.list}
								data={this.state.messages}
								renderItem={({item}) => <TouchableOpacity onPress={() => this.gotoMessage(item)} style={s.item}>
									{this.state.imageserror[item.id] ?
										<View style={[s.avatar,s.placeholder,{backgroundColor:Utils.colorGet()}]}><Text style={[styles.text,styles.white,styles.upper]}>{this.initialsGet(item.clientName)}</Text></View>
										:
										<Image source={{uri:`${API.assets}clients/client_${item.clientId}.jpg`}} style={s.avatar} onError={() => this.imageErrorHandler(item.id)} />
									}
									<View>
										<Text style={[styles.text,styles.boldlight,s.nameblocktitle]} numberOfLines={1}>{item.clientName}</Text>
										{item.title !== undefined && <Text style={[styles.text,styles.small]} numberOfLines={1}>{item.authorName}</Text>}
										<View style={s.nameblockcount}>
											<View style={s.nameblock}>
												<Text style={[styles.text,styles.small,styles.grey]} numberOfLines={item.title===undefined?2:1}>{item.message}</Text>
											</View>
											{this.messageCountGet(item)}
										</View>
										<Text style={[styles.text,styles.mini,styles.grey,s.date]}>{Dates.get(item.dateCreate, {showMonthShortName:true,neerCheck:true})}</Text>
									</View>
								</TouchableOpacity>}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={() => this.refresh()} />
								}
								keyExtractor={(item, index) => index.toString()} />
						:
							<View style={s.notfound}>
								<Text style={styles.text}>Ничего не найдено</Text>
								{this.state.messagesAll.length === 0 ?
								<Text style={[styles.text,styles.small,styles.grey,styles.mt10]}>У вас нет созданных диалогов.</Text> :
								<Text style={[styles.text,styles.small,styles.grey,styles.mt10]}>По заданым условиям поиска не найдено ни одного диалога.</Text>}
							</View>
						}
					</KeyboardAvoidingView>
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
	inner: {
		marginTop:10,
	},
	notfound: {
		marginHorizontal:15,
		marginTop:20
	},
	item: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	avatar: {
		width:50,
		height:50,
		borderRadius:25,
		marginRight:15
	},
	placeholder: {
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#ccc'
	},
	search: {
		width:width-20,
		marginLeft:10,
		marginBottom:10,
		backgroundColor:'#f1f1f2',
		borderRadius:10,
		padding:Platform.OS === 'ios' ? 10 : 0,
		paddingLeft:35,
		paddingRight:15
	},
	searchicon: {
		position:'absolute',
		top:Platform.OS === 'ios' ? 12 : 17,
		left:10
	},
	list: {
		height:height-125,
		backgroundColor:'#fff'
	},
	date: {
		position:'absolute',
		top:0,
		right:0
	},
	nameblock: {
		width:(width-15-15-30-60)
	},
	nameblocktitle: {
		width:(width-15-15-30-100)
	},
	messagesblock: {
		width:30
	},
	nameblockcount: {
		flexDirection:'row'
	},
	count: {
		width:24,
		height:24,
		borderRadius:12,
		backgroundColor:'#007aff',
		alignItems:'center',
		justifyContent:'center',
		alignSelf:'flex-end'
	}
})