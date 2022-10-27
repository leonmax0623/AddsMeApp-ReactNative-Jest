/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, FlatList, RefreshControl, KeyboardAvoidingView, Dimensions, Animated, Easing, Platform, PermissionsAndroid, Keyboard } from 'react-native'

// plug-ins
import Contacts from 'react-native-contacts'
import { SvgXml } from 'react-native-svg'
import ImagePicker from 'react-native-image-picker'
import { SwipeListView } from 'react-native-swipe-list-view'

// components
import Tabs from '../../components/Tabs'
import Loader from '../../components/Loader'
import Header from '../../components/Header'

// modeles
import { Messages, MessagesGroups, PartnerClientMessages, Clients, MessagesGroupsUsers, DeletedMessages } from '../../models/Index'

// helpers
import { Dates, Utils, Storage } from '../../helpers/Index'

// globals
import { API, mediaType, chatType, messagesGroupsUserStatus } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class MessagesScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			unreadMessages:[],
			contacts:[],
			messages:[],
			messagesAll:[],
			chats:[],
			chatsGroup:[],
			chatsPartners:[],
			search:null,
			refreshing:false,
			imageserror:[],
			overlayshow:false,
			loading:true,
			isgroup:false,
			groupname:null,
			groupimage:null,
			groupimagedata:null,
			groupimagetype:null,
			users:[],
			rowIndex:null,
			deleted:[],
			user:null
		}
		this.animPanel = new Animated.Value(panelHide)
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
				if (Platform.OS === 'ios') this.contactsGet()
				else {
					PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
						.then((res) => {
							if (res !== 'granted') return
							this.contactsGet()
						})
				}
				this.dataGet()
			}
		})
	}
	componentWillUnmount = () => this.focusListener.remove()
	refresh = () => this.setState({refreshing:true}, () => this.dataGet())
	dataGet = () => {
		const {user} = this.state
		DeletedMessages.get(user.id, (res) => {
			this.setState({deleted:res.data})
			Messages.chatsGet(user.id, (res) => {
				let messages = this.deletedRemove(res.data, chatType.MESSAGE)
				messages.forEach((v) => {
					const id = v.parentId || v.id
					let {chats} = this.state
					Messages.lastChatMessagesGet(id, (res) => {
						chats[id] = res.data
						this.setState({chats})
					})
				})
				PartnerClientMessages.chatsGet(user.id, (res) => {
					messages = [...messages, ...this.deletedRemove(res.data, chatType.PARTNER)]
					messages.forEach((v) => {
						const id = v.parentId || v.id
						let {chatsPartners} = this.state
						PartnerClientMessages.lastChatMessagesGet(id, (res) => {
							chatsPartners[id] = res.data
							this.setState({chatsPartners})
						})
					})
					MessagesGroups.chatsGet(user.id, (res) => {
						let msg = res.data, allowed = []
						MessagesGroupsUsers.byUserGet(user.id, (res) => {
							res.data.forEach((v) => {
								let m = msg.filter(f => (f.parentId === 0 && f.id === v.messagesGroupId) || (f.parentId !== 0 && f.parentId === v.messagesGroupId))
								if (m.length > 0) allowed.push(m[0])
							})
							messages = [...messages, ...this.deletedRemove(allowed, chatType.GROUP)]
							messages.forEach((v) => {
								const id = v.parentId || v.id
								let {chatsGroup} = this.state
								MessagesGroups.lastChatMessagesGet(id, (res) => {
									chatsGroup[id] = res.data
									this.setState({chatsGroup})
								})
							})
							messages.sort((a, b) => a.dateCreate > b.dateCreate ? -1 : 1)
							this.setState({messages,messagesAll:messages,loading:false,refreshing:false})
						})
					})
				})
			})
		})
	}
	deletedRemove = (messages, type) => {
		const msgs = []
		messages.forEach((v) => {
			const m = this.state.deleted.filter(f => f.messageId === (v.parentId || v.id) && f.type === type)
			if (m.length === 0) msgs.push(v)
		})
		return msgs
	}
	unreadMessagesGet = () => Storage.get('unreadMessages', (unreadMessages) => this.setState({unreadMessages:JSON.parse(unreadMessages)}))
	contactsGet = () => {
		Contacts.getAll((error, contacts) => {
			if (!error) {
				if (contacts.length === 0) return
				let c = [], phones = [], contactsOut = []
				contacts.forEach((v) => {
					let phone = v.phoneNumbers.length > 0 ? v.phoneNumbers[0].number : null
					if (Utils.empty(v.givenName) && Utils.empty(v.familyName)) v.givenName = v.company
					if (!Utils.empty(v.givenName) && !Utils.empty(phone)) {
						phone = Utils.phoneFormatter(Utils.phoneNormalize(phone))
						if (Utils.empty(phone)) phone = v.phoneNumbers[0].number
						if (!Utils.empty(phone)) {
							phone = Utils.phoneClear(phone)
							if (phone.length === 11) {
								c.push({firstName:v.givenName,lastName:v.familyName,avatar:v.hasThumbnail?v.thumbnailPath:null,phone})
								phones.push(phone)
							}
						}
					}
					c.sort((a, b) => a.firstName > b.firstName ? 1 : -1)
				})
				if (phones.length === 0) return
				Clients.byPhonesGet(phones, (res) => {
					res.data.forEach((v) => {
						let item = c.filter(f => Utils.phoneClear(f.phone) === v.phone)
						if (item.length > 0) {
							item = item[0]
							item.id = v.id
							item.imageAvatar = v.imageAvatar
							item.isActions = v.isActions
							item.isChat = v.isChat
							item.isGroupInvite = v.isGroupInvite
							item.isGroups = v.isGroups
							item.isMessages = v.isMessages
							item.isPersonalMessages = v.isPersonalMessages
							contactsOut.push(item)
						}
					})
					this.setState({contacts:contactsOut})
				})
			}
		})
	}
	messageCountGet = (item) => {
		const {unreadMessages} = this.state, id = item.parentId || item.id, type = this.chatTypeGet(item)
		let messages
		switch (type) {
			case  chatType.MESSAGE:
				messages = this.state.chats
				break
			case chatType.GROUP:
				messages = this.state.chatsGroup
				break
			case chatType.PARTNER:
				messages = this.state.chatsPartners
				break
			default: break
		}
		messages = messages === undefined || messages === null ? [] : messages[id]
		let count = messages ? messages.length : 0
		if (count !== 0) {
			const lastDate = unreadMessages ? unreadMessages[`message_${type}_${id}`] : 0
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
	search = (text) => {
		if (text.length > 0) {
			let messages = this.state.messagesAll.filter(f => this.messagesFind(f, text))
			this.setState({messages})
		} else this.setState({messages:this.state.messagesAll})
	}
	messagesFind = (item, text) => {
		const clientName = item.clientName ? item.clientName.toLowerCase() : '', authorName = item.authorName ? item.authorName.toLowerCase() : '', message = item.message.toLowerCase()
		text = text.toLowerCase()
		return clientName.indexOf(text) !== -1 || authorName.indexOf(text) !== -1 || message.indexOf(text) !== -1
	}
	isPartnerMessages = (item) => item.partnerId !== undefined
	nameGet = (item) => {
		if (item.title === undefined) return item.clientId === this.state.user.id ? (this.isPartnerMessages(item) ? item.partnerName : item.authorName) : item.clientName
		if (item.parentId === 0) {
			let parent = this.state.messagesAll.filter(f => f.id === item.id)
			return parent[0].title
		}
		if (this.state.chatsGroup !== undefined && this.state.chatsGroup !== null) {
			let chat = this.state.chatsGroup[item.parentId]
			if (chat !== undefined && chat !== null) {
				chat = chat.filter(f => f.id === item.parentId)
				if (chat.length > 0) return chat[0].title
			}
		}
		return 'Группа'
	}
	initialsGet = (item) => {
		let name = this.nameGet(item).split(' ')
		return Utils.initialsGet(name[0],name[1])
	}
	imageErrorHandler = (id) => {
		let {imageserror} = this.state
		imageserror[id] = true
		this.setState({imageserror})
	}
	panelShow = (isshow) => {
		const go = (callback) => Animated.timing(this.animPanel,{toValue:isshow?panelY:panelHide,duration:200,easing:Easing.ease}).start(() => callback ? callback() : () => {})
		if (isshow) this.setState({overlayshow:isshow}, () => go())
		else go(() => this.setState({overlayshow:isshow}))
	}
	avatarGet = (item) => {
		return item.avatar ? <Image source={{uri:item.avatar}} style={s.avatar} /> :
				(item.imageAvatar ? <Image source={{uri:`${API.assets}clients/${item.imageAvatar}`}} style={s.avatar} /> :
					<View style={[s.avatar,s.placeholder]}><Text style={[styles.text,styles.white,styles.upper]}>{Utils.initialsGet(item.firstName,item.lastName)}</Text></View>)
	}
	imageGet = (item) => {
		if (item.title !== undefined) {
			if (item.parentId !== 0) {
				if (this.state.chatsGroup !== undefined && this.state.chatsGroup !== null) {
					let chat = this.state.chatsGroup[item.parentId]
					if (chat !== undefined && chat !== null) {
						chat = chat.filter(f => f.id === item.parentId)
						if (chat.length > 0) item = chat[0]
					}
				}
			}
			return item.imageAvatar ? <Image source={{uri:`${API.assets}groups/${item.imageAvatar}`}} style={s.avatar} /> :
				<View style={[s.avatar,s.placeholder,this.colorGet(item)]}><Text style={[styles.text,styles.white,styles.upper]}>{Utils.initialsGet(item.title)}</Text></View>
		}
		return this.isPartnerMessages(item) ? <Image source={{uri:`${API.assets}partners/partner_${item.partnerId}_1.jpg${Utils.uniqueLink()}`}} style={s.avatar} /> :
			<Image source={{uri:`${API.assets}clients/client_${item.clientId===this.state.user.id?item.authorId:item.clientId}.jpg`}} style={s.avatar} onError={() => this.imageErrorHandler(item.id)} />
	}
	colorGet = (item) => {
		if (!this.isPartnerMessages(item)) return {backgroundColor:Utils.colorGet()}
		return null
	}
	chatTypeGet = (item) => {
		if (this.isPartnerMessages(item)) return chatType.PARTNER
		if (item.title !== undefined) return chatType.GROUP
		return chatType.MESSAGE
	}
	gotoMessage = (item, index) => {
		const {rowIndex} = this.state
		if (rowIndex !== null && parseInt(rowIndex) === index) return
		let chat, type = this.chatTypeGet(item)
		switch (type) {
			case  chatType.MESSAGE:
				chat = this.state.chats
				break
			case chatType.GROUP:
				chat = this.state.chatsGroup
				break
			case chatType.PARTNER:
				chat = this.state.chatsPartners
				break
			default: break
		}
		let data = chat[item.parentId || item.id]
		if (data) this.props.navigation.navigate('MessageInfo', {data,type})
	}
	gotoMessageById = (item) => {
		this.panelShow(false)
		if (item) this.props.navigation.navigate('MessageInfo', {item,type:chatType.MESSAGE})
	}
	gotoContacts = () => this.props.navigation.navigate('Contacts')
	groupHide = () => {
		Keyboard.dismiss()
		this.setState({groupname:null,isgroup:false,users:[],groupimage:null,groupimagedata:null,groupimagetype:null})
	}
	groupShow = () => this.setState({isgroup:true})
	userSelect = (id) => {
		let {users} = this.state, selected = users.includes(id)
		if (selected) users = users.filter(f => f !== id)
		else users.push(id)
		this.setState({users})
	}
	imagePickerShow = () => {
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
		ImagePicker.showImagePicker(options, (response) => {
			if (!response.didCancel && !response.error)
				this.setState({groupimage:response.uri,groupimagedata:response.data,groupimagetype:this.imageExtGet(response.type)})
		})
	}
	imageExtGet = (ext) => {
		ext = ext.replace('image/', '')
		return ext === 'jpeg' ? 'jpg' : ext
	}
	save = () => {
		let users = []
		this.state.users.forEach((v) => {
			const user = this.state.contacts.filter(f => f.id === v)
			if (user.length === 1) users.push(user[0])
		})
		let data = {
			authorId:this.state.user.id,
			authorName:this.state.user.name,
			title:this.state.groupname,
			message:`${this.state.user.name} создал(а) группу «${this.state.groupname}»`,
			type:mediaType.INFO,
			dateCreate:Dates.now()
		}
		let chat = [data]
		MessagesGroups.add(data, (res) => {
			const id = res.data.id
			chat[0].id = id
			MessagesGroupsUsers.add({messagesGroupId:id,clientId:this.state.user.id,status:messagesGroupsUserStatus.ACTIVE})
			if (this.state.groupimagedata) {
				MessagesGroups.update(id, {imageAvatar:`group_${id}.${this.state.groupimagetype}`})
				MessagesGroups.imageAdd(id, this.state.groupimagetype, this.state.groupimagedata)
				chat[0].imageAvatar = `group_${id}.${this.state.groupimagetype}`
			} else chat[0].imageAvatar = ''
			users.forEach((v) => {
				const name = `${v.firstName} ${v.lastName}`
				const data = {
					parentId:id,
					authorId:v.id,
					authorName:name,
					message:`${name} вступил(а) в группу`,
					type:mediaType.INFO
				}
				chat.push(data)
				MessagesGroups.add(data)
				MessagesGroupsUsers.add({messagesGroupId:id,clientId:v.id,status:messagesGroupsUserStatus.ACTIVE})
			})
			this.setState({groupname:null,isgroup:false,users:[],groupimage:null,groupimagedata:null,groupimagetype:null}, () => {
				this.panelShow(false)
				this.props.navigation.navigate('MessageInfo', {data:chat,type:chatType.GROUP})
			})
		})
	}
	messageDelete = (rowMap) => {
		const {rowIndex,messages,user} = this.state
		if (rowIndex !== null && rowMap[rowIndex]) {
			rowMap[rowIndex].closeRow()
			const msg = messages[rowIndex]
			DeletedMessages.add(user.id, msg.parentId || msg.id, this.chatTypeGet(msg))
			messages.splice(rowIndex, 1)
			this.setState({messages})
		}
	}
	render() {
		return <View style={styles.wrapper}>
			<Header
				title={'Сообщения'}
				styles={styles}
				context={{
					icon:'<svg viewBox="0 0 128 128"><path d="M 79.335938 15.667969 C 78.064453 15.622266 76.775 15.762109 75.5 16.099609 C 72.1 16.999609 69.299609 19.199219 67.599609 22.199219 L 64 28.699219 C 63.2 30.099219 63.699609 32.000781 65.099609 32.800781 L 82.400391 42.800781 C 82.900391 43.100781 83.400391 43.199219 83.900391 43.199219 C 84.200391 43.199219 84.399219 43.199609 84.699219 43.099609 C 85.499219 42.899609 86.1 42.399219 86.5 41.699219 L 90.199219 35.199219 C 91.899219 32.199219 92.4 28.700781 91.5 25.300781 C 90.6 21.900781 88.400391 19.100391 85.400391 17.400391 C 83.525391 16.337891 81.455078 15.744141 79.335938 15.667969 z M 60.097656 38.126953 C 59.128906 38.201172 58.199219 38.724609 57.699219 39.599609 L 27.5 92 C 24.1 97.8 22.200781 104.30039 21.800781 110.90039 L 21 123.80078 C 20.9 124.90078 21.5 125.99961 22.5 126.59961 C 23 126.89961 23.5 127 24 127 C 24.6 127 25.199219 126.8 25.699219 126.5 L 36.5 119.40039 C 42 115.70039 46.7 110.8 50 105 L 80.300781 52.599609 C 81.100781 51.199609 80.599219 49.3 79.199219 48.5 C 77.799219 47.7 75.899609 48.199609 75.099609 49.599609 L 44.800781 102 C 41.900781 106.9 37.899609 111.20039 33.099609 114.40039 L 27.300781 118.19922 L 27.699219 111.30078 C 27.999219 105.60078 29.699609 100 32.599609 95 L 62.900391 42.599609 C 63.700391 41.199609 63.200781 39.3 61.800781 38.5 C 61.275781 38.2 60.678906 38.082422 60.097656 38.126953 z M 49 121 C 47.3 121 46 122.3 46 124 C 46 125.7 47.3 127 49 127 L 89 127 C 90.7 127 92 125.7 92 124 C 92 122.3 90.7 121 89 121 L 49 121 z M 104 121 A 3 3 0 0 0 101 124 A 3 3 0 0 0 104 127 A 3 3 0 0 0 107 124 A 3 3 0 0 0 104 121 z"></path></svg>',
					callback:() => this.panelShow(true)
				}} />
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
							<SwipeListView
								disableRightSwipe
								style={s.list}
								data={this.state.messages}
								renderItem={({item, rowMap, index}) => <TouchableWithoutFeedback onPress={() => this.gotoMessage(item, index)}>
									<View style={s.item}>
										{!this.isPartnerMessages(item) && this.state.imageserror[item.id] ?
											<View style={[s.avatar,s.placeholder,this.colorGet(item)]}><Text style={[styles.text,styles.white,styles.upper]}>{this.initialsGet(item)}</Text></View> : 
											this.imageGet(item)
										}
										<View>
											<Text style={[styles.text,styles.boldlight,s.nameblocktitle]} numberOfLines={1}>{this.nameGet(item)}</Text>
											{item.title !== undefined && <Text style={[styles.text,styles.small]} numberOfLines={1}>{item.authorName}</Text>}
											<View style={s.nameblockcount}>
												<View style={s.nameblock}>
													<Text style={[styles.text,styles.small,styles.grey]} numberOfLines={item.title===undefined?2:1}>{Messages.messageGet(item.type, item.message)}</Text>
												</View>
												{this.messageCountGet(item)}
											</View>
											<Text style={[styles.text,styles.mini,styles.grey,s.date]}>{Dates.get(item.dateCreate, {showMonthShortName:true,neerCheck:true})}</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>}
								renderHiddenItem={(item, rowMap) => <View style={s.listrowback}>
									<TouchableOpacity style={s.listrowdelete} onPress={() => this.messageDelete(rowMap)}>
										<SvgXml width={26} height={26} fill={'#fff'} xml={'<svg viewBox="0 0 16 16"><path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.324219 3.675781 14 4.5 14 L 10.5 14 C 11.324219 14 12 13.324219 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 4 4 L 11 4 L 11 12.5 C 11 12.78125 10.78125 13 10.5 13 L 4.5 13 C 4.21875 13 4 12.78125 4 12.5 Z M 5 5 L 5 12 L 6 12 L 6 5 Z M 7 5 L 7 12 L 8 12 L 8 5 Z M 9 5 L 9 12 L 10 12 L 10 5 Z"></path></svg>'} />
									</TouchableOpacity>
								</View>}
								onRowOpen={(rowIndex) => this.setState({rowIndex})}
								onRowClose={() => this.setState({rowIndex:null})}
								rightOpenValue={-75}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={() => this.refresh()} />
								}
								keyExtractor={(item, index) => index.toString()}
								useNativeDriver={false} />
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
			<Tabs styles={styles} page={'messages'} navigation={this.props.navigation} />
			{this.state.overlayshow && <View style={s.overlay}>
				<Animated.View style={[s.panel,{top:this.animPanel}]}>
					{this.state.isgroup ?
						<View>
							<View style={s.panelblock}>
								<Text style={[styles.text,styles.title,styles.bold,styles.center]}>Группа</Text>
								<TouchableOpacity onPress={() => this.groupHide()} style={s.cancel}>
									<Text style={[styles.text,styles.blue]}>Назад</Text>
								</TouchableOpacity>
								{!Utils.empty(this.state.groupname) ? <TouchableOpacity onPress={() => this.save()} style={s.save}>
									<Text style={[styles.text,styles.bold,styles.blue]}>Создать</Text>
									</TouchableOpacity> : <Text style={[styles.text,styles.bold,styles.light,s.save]}>Создать</Text>}
							</View>
							<View style={s.groupname}>
								{this.state.groupimage ? <Image source={{uri:this.state.groupimage}} style={s.groupavatar} /> :
									<TouchableOpacity onPress={() => this.imagePickerShow()} style={s.addphoto}>
										<SvgXml width={26} height={26} fill={'#999'} xml={'<svg viewBox="0 0 24 24"><path d="M 14.119141 1.9980469 L 9.8769531 2.0019531 C 9.3179531 2.0019531 8.7832969 2.2364375 8.4042969 2.6484375 L 7.1640625 4 L 4 4 C 2.9 4 2 4.9 2 6 L 2 18 C 2 19.1 2.9 20 4 20 L 20 20 C 21.1 20 22 19.1 22 18 L 22 6 C 22 4.9 21.1 4 20 4 L 16.841797 4 L 15.59375 2.6445312 C 15.21475 2.2325313 14.679141 1.9980469 14.119141 1.9980469 z M 12 7 C 14.8 7 17 9.2 17 12 C 17 14.8 14.8 17 12 17 C 9.2 17 7 14.8 7 12 C 7 9.2 9.2 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path></svg>'} />
									</TouchableOpacity>
								}
								<TextInput
									style={[styles.text,s.groupnameinput]}
									value={this.state.groupname}
									onChangeText={(groupname) => this.setState({groupname})}
									autoCorrect={false}
									placeholder={'Название группы'}
									underlineColorAndroid={'transparent'} />
							</View>
							<KeyboardAvoidingView behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
								<FlatList
									style={[s.panellist,s.panellistnotop]}
									data={this.state.contacts.filter(f => f.isGroupInvite === 1)}
									renderItem={({item}) => <TouchableOpacity onPress={() => this.userSelect(item.id)} style={s.item}>
										{this.avatarGet(item)}
										<View>
											<Text style={styles.text}>{item.firstName} {item.lastName}</Text>
											<Text style={[styles.text,styles.small,styles.grey]}>{Utils.phoneFormatter(item.phone)}</Text>
										</View>
										{this.state.users.includes(item.id) ? <SvgXml width={24} height={24} fill={'#007aff'} style={s.checkbox} xml={'<svg viewBox="0 0 24 24"><path d="M11.707,15.707C11.512,15.902,11.256,16,11,16s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L11,13.586l8.35-8.35C17.523,3.251,14.911,2,12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10 c0-1.885-0.531-3.642-1.438-5.148L11.707,15.707z"></path></svg>'} /> :
										<SvgXml width={24} height={24} fill={'#ccc'} style={s.checkbox} xml={'<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>'} />}
									</TouchableOpacity>}
									keyExtractor={(item, index) => index.toString()} />
							</KeyboardAvoidingView>
						</View>
						:
						<View>
							<View style={[s.panelblock,s.panelheader]}>
								<Text style={[styles.text,styles.title,styles.bold,styles.center]}>Сообщение</Text>
								<TouchableOpacity onPress={() => this.groupShow()} style={s.panellink}>
									<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={'<svg viewBox="0 0 16 16"><path d="M 4.5 3 C 3.125 3 2 4.125 2 5.5 C 2 6.441406 2.535156 7.253906 3.304688 7.679688 C 1.40625 8.210938 0 9.9375 0 12 L 1 12 C 1 10.0625 2.5625 8.5 4.5 8.5 C 5.65625 8.5 6.664063 9.0625 7.296875 9.929688 C 7.113281 10.421875 7 10.945313 7 11.5 C 7 13.980469 9.019531 16 11.5 16 C 13.980469 16 16 13.980469 16 11.5 C 16 9.617188 14.832031 8.003906 13.183594 7.335938 C 13.679688 6.875 14 6.226563 14 5.5 C 14 4.125 12.875 3 11.5 3 C 10.125 3 9 4.125 9 5.5 C 9 6.226563 9.320313 6.875 9.816406 7.335938 C 8.988281 7.671875 8.28125 8.242188 7.78125 8.96875 C 7.230469 8.367188 6.527344 7.902344 5.71875 7.671875 C 6.476563 7.238281 7 6.429688 7 5.5 C 7 4.125 5.875 3 4.5 3 Z M 4.5 4 C 5.335938 4 6 4.664063 6 5.5 C 6 6.335938 5.335938 7 4.5 7 C 3.664063 7 3 6.335938 3 5.5 C 3 4.664063 3.664063 4 4.5 4 Z M 11.5 4 C 12.335938 4 13 4.664063 13 5.5 C 13 6.335938 12.335938 7 11.5 7 C 10.664063 7 10 6.335938 10 5.5 C 10 4.664063 10.664063 4 11.5 4 Z M 11.5 8 C 13.4375 8 15 9.5625 15 11.5 C 15 13.4375 13.4375 15 11.5 15 C 9.5625 15 8 13.4375 8 11.5 C 8 10.910156 8.15625 10.363281 8.414063 9.875 L 8.4375 9.859375 C 8.4375 9.855469 8.433594 9.851563 8.429688 9.847656 C 9.019531 8.75 10.164063 8 11.5 8 Z M 11 9 L 11 11 L 9 11 L 9 12 L 11 12 L 11 14 L 12 14 L 12 12 L 14 12 L 14 11 L 12 11 L 12 9 Z"></path></svg>'} />
									<Text style={[styles.text,styles.blue]}>Создать группу</Text>
								</TouchableOpacity>
							</View>
							{this.state.contacts.length > 0 ?
								<FlatList
									style={s.panellist}
									data={this.state.contacts}
									renderItem={({item}) => <TouchableOpacity onPress={() => this.gotoMessageById(item)} style={s.item}>
										{this.avatarGet(item)}
										<View>
											<Text style={styles.text}>{item.firstName} {item.lastName}</Text>
											<Text style={[styles.text,styles.small,styles.grey]}>{Utils.phoneFormatter(item.phone)}</Text>
										</View>
									</TouchableOpacity>}
									keyExtractor={(item, index) => index.toString()} />
							:
								<View style={s.notfound}>
									<Text style={[styles.text,styles.mt10]}>В приложении нет ни одного контакта из вашей адресной книги.</Text>
									<Text style={[styles.text,styles.mt10]}>Пригласить людей в приложении вы можете в разделе <Text style={[styles.text,styles.blue]} onPress={() => this.gotoContacts()}>Контакты</Text>.</Text>
								</View>
							}
							<TouchableOpacity onPress={() => this.panelShow(false)} style={s.cancel}>
								<Text style={[styles.text,styles.blue]}>Закрыть</Text>
							</TouchableOpacity>
						</View>
					}
				</Animated.View>
			</View>}
		</View>
	}
}

const { width, height } = Dimensions.get('window')
const panelY = 100, panelHide = height+10
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
		borderBottomWidth:.5,
		backgroundColor:'#fff'
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
		height:height-(Platform.OS === 'ios' ? 185 : 220),
		backgroundColor:'#fff'
	},
	date: {
		position:'absolute',
		top:2,
		right:0
	},
	overlay: {
		position:'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		backgroundColor:'#00000030'
	},
	panel: {
		position:'relative',
		height:height-panelY,
		paddingTop:20,
		paddingHorizontal:5,
		marginHorizontal:5,
		backgroundColor:'#fff',
		borderRadius:10,
		borderBottomLeftRadius:0,
		borderBottomRightRadius:0,
		shadowColor:'#000',
		shadowOffset:{
			width:0,
			height:2,
		},
		shadowOpacity:.25,
		shadowRadius:6,
		elevation:5
	},
	panelblock: {
		paddingHorizontal:15,
	},
	panelheader: {
		borderBottomColor:'#007aff30',
		borderBottomWidth:.5
	},
	panellink: {
		flexDirection:'row',
		alignItems:'center',
		padding:15,
		paddingHorizontal:0
	},
	panelicon: {
		marginRight:20,
		marginLeft:5
	},
	panellist: {
		height:height-270,
		paddingTop:10
	},
	panellistnotop: {
		paddingTop:0
	},
	cancel: {
		position:'absolute',
		top:2,
		left:15
	},
	save: {
		position:'absolute',
		top:2,
		right:15
	},
	groupname: {
		marginTop:10,
		marginBottom:10,
		padding:10,
		alignItems:'center',
		flexDirection:'row',
		borderBottomWidth:1,
		borderBottomColor:'#eee'
	},
	checkbox: {
		position:'absolute',
		right:15
	},
	addphoto: {
		backgroundColor:'#eee',
		width:50,
		height:50,
		borderRadius:25,
		alignItems:'center',
		justifyContent:'center',
		marginRight:10
	},
	groupavatar: {
		width:50,
		height:50,
		borderRadius:25,
		marginRight:10
	},
	groupnameinput: {
		width:(width-50-10-20-20)
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
	},
	listrowback: {
		alignItems:'center',
		backgroundColor:'#ddd',
		flexDirection:'row',
		flex:1,
		justifyContent:'space-between',
		paddingLeft:15
	},
	listrowdelete: {
		position:'absolute',
		width:75,
		top:0,
		bottom:0,
		right:0,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#c00'
	}
})