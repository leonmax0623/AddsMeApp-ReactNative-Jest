/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Dimensions, TextInput, TouchableOpacity, Keyboard, ScrollView, FlatList, Alert, Linking, Animated, Easing, Platform } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'
import Lightbox from 'react-native-lightbox'
import Sound from 'react-native-sound'
import Video from 'react-native-video'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import ImagePicker from 'react-native-image-picker'
import ParsedText from 'react-native-parsed-text'

// components
import Loader from '../../components/Loader'
import Header from '../../components/Header'
import Stickers from '../../components/Stickers'

// modeles
import { PartnerClientMessages, Clients, Pushes, DeletedMessages, Messages } from '../../models/Index'

// helpers
import { Dates, Http, Utils, Storage, Files } from '../../helpers/Index'

// globals
import { API, mediaType, messageStatus, pushType, chatType } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	plus:'<svg viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"></path></svg>',
	//smile:'<svg viewBox="0 0 50 50"><path d="M 25 2 A 1.0001 1.0001 0 0 0 24.845703 2.015625 C 12.227069 2.100968 2 12.361472 2 25 C 2 37.691367 12.308633 48 25 48 C 37.691367 48 48 37.691367 48 25 C 48 12.362796 37.775013 2.1030941 25.158203 2.015625 A 1.0001 1.0001 0 0 0 25 2 z M 25 4 C 36.610633 4 46 13.389367 46 25 C 46 36.610633 36.610633 46 25 46 C 13.389367 46 4 36.610633 4 25 C 4 13.389367 13.389367 4 25 4 z M 17 18 A 3 3 0 0 0 14 21 A 3 3 0 0 0 17 24 A 3 3 0 0 0 20 21 A 3 3 0 0 0 17 18 z M 33 18 A 3 3 0 0 0 30 21 A 3 3 0 0 0 33 24 A 3 3 0 0 0 36 21 A 3 3 0 0 0 33 18 z M 11.957031 28.988281 A 1.0001 1.0001 0 0 0 11.185547 30.582031 C 11.185547 30.582031 16.416667 38 25 38 C 33.583333 38 38.814453 30.582031 38.814453 30.582031 A 1.0010463 1.0010463 0 0 0 37.185547 29.417969 C 37.185547 29.417969 32.416667 36 25 36 C 17.583333 36 12.814453 29.417969 12.814453 29.417969 A 1.0001 1.0001 0 0 0 11.957031 28.988281 z"></path></svg>',
	send:'<svg viewBox="0 0 24 24"><path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M14.586,12L13,10.414V16c0,0.552-0.448,1-1,1h0 c-0.552,0-1-0.448-1-1v-5.586L9.414,12C9.024,12.39,8.39,12.39,8,12l0,0c-0.39-0.39-0.39-1.024,0-1.414l3.293-3.293 c0.39-0.39,1.024-0.39,1.414,0L16,10.586c0.39,0.39,0.39,1.024,0,1.414l0,0C15.61,12.39,14.976,12.39,14.586,12z"></path></svg>',
	play:'<svg viewBox="0 0 50 50"><path d="M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 19 35 L 19 15 L 36 25 Z"></path></svg>',
	pause:'<svg viewBox="0 0 50 50"><path d="M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 22 34 L 17 34 L 17 16 L 22 16 Z M 33 34 L 28 34 L 28 16 L 33 16 Z"></path></svg>',
	mic:'<svg viewBox="0 0 24 24"><path d="M 12 0 C 9.800781 0 8 1.800781 8 4 L 8 11 C 8 13.199219 9.800781 15 12 15 C 14.199219 15 16 13.199219 16 11 L 16 4 C 16 1.800781 14.199219 0 12 0 Z M 3 11 C 3 15.605469 6.523438 19.429688 11 19.9375 L 11 24 L 13 24 L 13 19.9375 C 17.476563 19.429688 21 15.605469 21 11 L 19 11 C 19 14.855469 15.855469 18 12 18 C 8.144531 18 5 14.855469 5 11 Z"></path></svg>',
	down:'<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 4.71875 6.015625 L 4.03125 6.734375 L 7.5 10.066406 L 10.96875 6.734375 L 10.28125 6.015625 L 7.5 8.679688 Z"></path></svg>'
}

// start
export default class PartnerMessageInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			unreadMessages:[],
			id:0,
			data:this.props.navigation.getParam('data'),
			item:this.props.navigation.getParam('item'),
			title:'Сообщение',
			client:null,
			info:null,
			idx:0,
			inputHeight:0,
			message:null,
			audioIdx:0,
			audioIsPlay:false,
			audioPlaySeconds:0,
			audioDuration:[],
			audioRecordCancel:false,
			audioRecordShow:false,
			audioRecordSeconds:0,
			audioRecordFilename:null,
			videoPlay:[],
			stickerShow:false,
			loading:true,
			overlayshow:false,
			forbidden:false,
			user:null,
			isshowdown:false
		}
		this.animPanel = new Animated.Value(panelHide)
	}
	audios = []
	videos = []
	audioTimer = null
	messageTimer = null
	scrollY = 0
	componentWillReceiveProps = (props) => {
		let item = props.navigation.state.params.item
		this.panelShow(false)
		this.setState({item}, () => {
			const title = item.name
			const info = item.imageAvatar ? <Image source={{uri:`${API.assets}clients/${item.imageAvatar}`}} style={s.avatar} /> :
				<View style={[s.avatar,s.placeholder,{backgroundColor:Utils.colorGet()}]}><Text style={[styles.text,styles.white,styles.upper]}>{Utils.initialsGet(item.firstName)}</Text></View>
			this.setState({title,info})
		})
 	}
	componentDidMount = () => {
		Storage.get('unreadMessages', (unreadMessages) => {
			const {data} = this.state
			if (data && data.length > 0) {
				unreadMessages = JSON.parse(unreadMessages) || {}
				unreadMessages[`message_${chatType.PARTNER}_${data[0].parentId || data[0].id}`] = Dates.now()
				Storage.set('unreadMessages', JSON.stringify(unreadMessages))
			}
		})
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				user = JSON.parse(user)
				this.setState({user})
				const {item,data} = this.state
				let {title,videoPlay} = this.state
				if (item) {
					title = item.name
					const info = <Image source={{uri:`${API.assets}clients/${item.imageAvatar}`}} style={s.avatar} />
					this.setState({title,info})
					PartnerClientMessages.byClientGet(item.id, user.id, (res) => {
						let data = res.data
						const parent = data.length > 0 ? data[0] : {
								parentId:0,
								clientId:item.id,
								clientName:item.name,
								partnerId:user.id,
								partnerName:user.name,
								type:mediaType.EMPTY,
								isClient:false,
								statusPartner:messageStatus.READED,
								statusClient:messageStatus.READED,
								message:null,
								dateCreate:Dates.now()
							}
						data.sort((a, b) => a.id > b.id ? 1 : -1)
						if (data.length > 0)
							this.setState({id:data[data.length-1].id})
						this.setState({parent,data:this.dataPrepare(data),loading:false,client:item})
						this.unreadMessageSet(parent.parentId || parent.id)
					})
					return
				}
				data.forEach((v, i) => {
					if (v.type === mediaType.VIDEO) videoPlay[i] = true
					if (v.type === mediaType.AUDIO) {
						const audio = `${API.chats}audios/${v.message}`
						Http.download(audio)
					}
				})
				const parent = data[0]
				title = parent.clientName
				Clients.get(parent.clientId, (res) => {
					const client = res.data[0], info = <Image source={{uri:`${API.assets}clients/${client.imageAvatar}`}} style={s.avatar} />
					this.setState({parent,info,item:client,loading:false}, () => {
						if (this.messageTimer === null)
							this.messageTimer = setInterval(this.messagesUpdate, 1000)
					})
				})
				data.sort((a, b) => a.id > b.id ? 1 : -1)
				if (data.length > 0)
					this.setState({id:data[data.length-1].id})
				this.setState({videoPlay,title,data:this.dataPrepare(data)})
				
			}
		})
	}
	componentWillUnmount = () => {
		this.audios.forEach((v) => v.release())
		clearInterval(this.audioTimer)
		clearInterval(this.messageTimer)
	}
	dataPrepare = (data) => {
		return data.reduce((r, a) => {
			const d = Math.floor(a.dateCreate / Dates.tsDay)
			r[d] = [...r[d] || [], a]
			return r
		}, {})
	}
	messagesUpdate = () => {
		const {id,parent,data} = this.state
		PartnerClientMessages.lastGet(id, parent.id, false, (res) => {
			const messages = res.data
			if (messages.length > 0) {
				const id = messages[messages.length-1].id
				const day = Dates.nowDay()
				data[day] = data[day] || []
				data[day] = [...data[day], ...messages]
				this.setState({data,id})
			}
		})
	}
	unreadMessageSet = (id) => {
		Storage.get('unreadMessages', (unreadMessages) => {
			unreadMessages = JSON.parse(unreadMessages) || {}
			unreadMessages[`message_${chatType.PARTNER}_${id}`] = Dates.now()
			Storage.set('unreadMessages', JSON.stringify(unreadMessages))
		})
	}
	panelShow = (isshow) => {
		const go = (callback) => Animated.timing(this.animPanel,{toValue:isshow?panelY:panelHide,duration:200,easing:Easing.ease}).start(() => callback ? callback() : () => {})
		if (isshow) this.setState({overlayshow:isshow}, () => go())
		else go(() => this.setState({overlayshow:isshow}))
	}
	stickerToggle = () => {
		Keyboard.dismiss()
		this.setState({stickerShow:!this.state.stickerShow,inputHeight:0})
	}
	messageParse = (item, i) => {
		let {audioIsPlay,audioIdx} = this.state
		switch (item.type) {
			/*
			case mediaType.STICKER:
				let arr = item.message.split('-')
				if (arr.length === 2) {
					const stickers = Stickers.filter(f => f.code === arr[0])[0]
					if (stickers) {
						const sticker = stickers.stickers[arr[1]]
						if (sticker) return <Image source={sticker} style={s.stickerImage} />
					}
				}
				break
			*/
			case mediaType.IMAGE:
				return <Lightbox renderContent={() => <Image style={s.imageFullScreen} source={{uri:item.messagetemp||`${API.chats}images/${item.message}`}} />}>
					<Image source={{uri:item.messagetemp||`${API.chats}images/${item.message}`}} style={s.stickerImage} />
				</Lightbox>
			case mediaType.VIDEO:
				return <TouchableOpacity onPress={() => this.videoPlay(i)}>
					<Video
						ref={(v) => this.videos[i] = v}
						source={{uri:item.messagetemp||`${API.chats}videos/${item.message}`}}
						paused={this.state.videoPlay[i]}
						isBuffering={true}
						resizeMode={'cover'}
						style={s.videoPlaceholder}
						onFullscreenPlayerWillDismiss={() => this.videosStop(i)} />
				</TouchableOpacity>
			case mediaType.AUDIO:
				if (!this.audios[i]) {
					const audio = new Sound(item.message, Sound.DOCUMENT, () => {
						this.audios[i] = audio
						let {audioDuration} = this.state
						audioDuration[i] = {duration:audio.getDuration(),current:this.audioTimeGet(audio.getDuration()),width:0}
						this.setState({audioDuration})
					})
				}
				return <View style={s.audioBlock}>
					<TouchableOpacity onPress={() => audioIsPlay && audioIdx === i ? this.audioPause(i) : this.audioPlay(i)}><SvgXml width={32} height={32} xml={audioIsPlay && audioIdx === i ? icons.pause : icons.play} fill={'#4a86cc'} /></TouchableOpacity>
					<View style={s.audioInfo}>
						<View style={s.audioProgress}>
							<View style={{width:`${this.state.audioDuration[i]?this.state.audioDuration[i].width:0}%`,height:3,backgroundColor:'#4a86cc'}}></View>
						</View>
						<Text style={[styles.text,styles.small,styles.grey]}>{this.state.audioDuration[i] && this.state.audioDuration[i].current}</Text>
					</View>
				</View>
			case mediaType.TEXT:
				return <ParsedText
						style={styles.text}
						selectable={true}
						parse={[{type:'url', style:styles.link,onPress: (url) => Linking.openURL(url)}]}
						childrenProps={{allowFontScaling: false}}>
							{item.message}
						</ParsedText>
			case mediaType.INFO:
				return <Text style={[styles.text,styles.small,styles.italic]}>{item.message}</Text>
		}
		return null
	}
	save = (d, filename) => {
		const {data,user,parent,item} = this.state, day = Dates.nowDay()
		let message = {
			parentId:parent.parentId !== 0 ? parent.parentId : parent.id,
			clientId:parent.clientId,
			clientName:parent.clientName,
			partnerId:user.id,
			partnerName:user.name,
			statusPartner:messageStatus.READED,
			statusClient:messageStatus.NOT_READED,
			isClient:false,
			message:d.message,
			type:d.type
		}
		PartnerClientMessages.add(message, (res) => {
			if (parent.id === undefined) {
				parent.id = res.data.id
				message.id = parent.id
			}
			message.dateCreate = Dates.now()
			message.messagetemp = filename
			data[day] = data[day] || []
			data[day].push(message)
			this.setState({data,parent,inputHeight:0})
			this.unreadMessageSet(parent.id)
			if (item.isMessages)
				Pushes.add(user.name, null, Messages.messageGet(message.type, message.message), parent.clientId, pushType.USER, {partner:user})
			DeletedMessages.remove(parent.clientId, parent.id, chatType.PARTNER)
		})
	}
	stickerSet = (code, i) => this.save({message:`${code}-${i}`,type:mediaType.STICKER})
	messageSet = () => {
		const {message} = this.state
		this.save({message,type:mediaType.TEXT})
		this.setState({message:null})
	}
	audioSet = (isCancel) => {
		AudioRecorder.stopRecording()
		this.setState({audioRecordCancel:isCancel})
	}
	audiosStop = () => {
		this.audios.forEach((v) => v.stop())
		let {audioDuration} = this.state
		audioDuration.forEach((v) => v.current = this.audioTimeGet(v.duration))
		audioDuration.forEach((v) => v.width = 0)
		this.setState({audioDuration,audioIdx:0,audioIsPlay:false})
		clearInterval(this.audioTimer)
	}
	audioPlay = (i) => {
		if (this.state.audioIdx !== i) this.audiosStop()
		const audio = this.audios[i]
		if (audio) {
			let {audioDuration} = this.state
			audio.play((success) => {
				if (success) {
					audio.stop()
					audioDuration[i].width = '100%'
					clearInterval(this.audioTimer)
				  	this.setState({audioIsPlay:false,audioIdx:0,audioDuration})
				}
			})
			this.audioTimer = setInterval(() => audio.getCurrentTime((audioPlaySeconds) => {
				audioDuration[i].current = this.audioTimeGet(audioPlaySeconds)
				audioDuration[i].width = Math.round((audioPlaySeconds * 100) / audioDuration[i].duration)
				this.setState({audioPlaySeconds})
			}), 100)
			this.setState({audioIdx:i,audioIsPlay:true})
		}
	}
	audioPause = (i) => {
		const audio = this.audios[i]
		if (audio) {
			audio.pause()
			this.setState({audioIsPlay:false})
		}
	}
	audioTimeGet = (seconds) => {
		const m = parseInt(seconds % (60 * 60) / 60), s = parseInt(seconds % 60)
		return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s))
	}
	audioRecord = () => {
		AudioRecorder.requestAuthorization().then((isAuth) => {
			if (!isAuth) {
				Alert.alert('Нет доступа к микрофону', 'Для того чтобы иметь возможность записывать звуковые сообщения, перейдите в Настройки и разрешите доступ к микрофону', [{text:'Закрыть'},{text:'Настройки',onPress:() => Linking.openSettings(),style: 'cancel'}])
				return
			}
			this.audiosStop()
			Keyboard.dismiss()
			this.setState({audioRecordShow:true})
			const audioRecordFilename = `${new Date().valueOf()}.aac`
			AudioRecorder.prepareRecordingAtPath(AudioUtils.DocumentDirectoryPath + '/' + audioRecordFilename, {
				SampleRate:22050,
				Channels:1,
				AudioQuality:'Low',
				AudioEncoding:'aac',
				AudioEncodingBitRate:32000,
				IncludeBase64:true
			})
			AudioRecorder.startRecording()
			AudioRecorder.onFinished = (res) => {
				this.setState({audioRecordSeconds:0,audioRecordShow:false})
				const {audioRecordCancel} = this.state
				if (!audioRecordCancel) {
					this.save({message:audioRecordFilename,type:mediaType.AUDIO}, res.audioFileURL)
					Files.add(audioRecordFilename, 'audios', res.base64)
				}
			}
			AudioRecorder.onProgress = (data) => this.setState({audioRecordSeconds:data.currentTime})
			this.setState({audioRecordFilename})
		})
	}
	audioRecordCancel = () => this.audioSet(true)
	imagePickerShow = () => {
		const options = {
			title:null,
			cancelButtonTitle:'Отмена',
			takePhotoButtonTitle:'Открыть камеру',
			chooseFromLibraryButtonTitle:'Выбрать из галереи',
			mediaType:'mixed',
			quality:1,
			videoQuality:'high',
			durationLimit:60,
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
			if (!response.didCancel && !response.error) {
				const filename = Utils.filenameGet(response.uri).toLowerCase()
				this.save({message:filename,type:Utils.isVideo(filename) ? mediaType.VIDEO : mediaType.IMAGE}, response.uri)
				if (Utils.isVideo(filename)) Files.add(filename, 'videos', response.uri, true)
				else Files.add(filename, 'images', response.data)
			}
		})
	}
	videoPlay = (i) => {
		this.audiosStop()
		const video = this.videos[i]
		if (video) {
			let {videoPlay} = this.state
			videoPlay[i] = false
			this.setState({videoPlay})
			video.presentFullscreenPlayer()
		}
	}
	videosStop = () => {
		let videoPlay = []
		this.state.videoPlay.forEach((v, i) => videoPlay[i] = true)
		this.setState({videoPlay})
	}
	addStyleGet = (type) => type == mediaType.STICKER ? s.nobg : (type == mediaType.VIDEO || type == mediaType.IMAGE ? [s.nobg,s.nobgImageVideo] : null)
	addDateStyleGet = (type) => type == mediaType.IMAGE || type == mediaType.VIDEO ? s.dateOver : s.date
	initialsGet = (name) => {
		name = name.split(' ')
		return Utils.initialsGet(name[0],name[1])
	}
	scrollDown = () => this.setState({isshowdown:false}, this.s.scrollToEnd({animated:true}))
	render() {
		const {data,idx,inputHeight} = this.state
		return <View style={styles.wrapper}>
			<Header
				title={this.state.title}
				navigation={this.props.navigation}
				styles={styles}
				context={{
					component:this.state.info || <View style={[s.avatar,s.placeholder]}><Text style={[styles.text,styles.white,styles.upper]}>{Utils.initialsGet('?')}</Text></View>,
					callback:() => this.panelShow(true)
				}} />

			{this.state.loading ? <Loader styles={styles} />
			:
			<KeyboardAvoidingView style={s.container} behavior={Platform.select({android:undefined,ios:'padding'})} enabled>
				<ScrollView ref={ref => this.s = ref}
					scrollEventThrottle={1}
					onContentSizeChange={(width, height) => {
						this.scrollY = height
						this.s.scrollToEnd({animated:true})
					}}
					onScroll={(event) => {
						const y = event.nativeEvent.contentOffset.y
						this.setState({isshowdown:(this.scrollY - y) > 1000})
					}}>
					{
						Object.entries(data).map((entry, i) => <View key={i}>
							<Text style={[styles.text,styles.mini,styles.grey,styles.center,s.separator]}>{Dates.get(entry[0] * Dates.tsDay, {neerCheck:true,showMonthFullName:true})}</Text>
							{entry[1].map((v, i) => v.partnerId === this.state.user.id && !v.isClient ?
								<View key={i} style={[s.message,s.me,this.addStyleGet(v.type)]}>
									{this.messageParse(v, i)}
									<Text style={[styles.text,styles.mini,styles.grey,this.addDateStyleGet(v.type)]}>{Dates.get(v.dateCreate, {showMonthShortName:true,neerCheck:true})}</Text>
								</View>
								:
								<View key={i} style={s.item}>
									<View style={[s.message,this.addStyleGet(v.type)]}>
										{this.messageParse(v, i)}
										<Text style={[styles.text,styles.mini,styles.grey,this.addDateStyleGet(v.type)]}>{Dates.get(v.dateCreate, {showMonthShortName:true,neerCheck:true})}</Text>
									</View>
								</View>
							)}
							</View>
						)
					}
				</ScrollView>
				{this.state.isshowdown ? <TouchableOpacity style={s.arrowdown} onPress={() => this.scrollDown()}><SvgXml width={32} height={32} xml={icons.down} fill={'#2979ff'} /></TouchableOpacity> : null}
				{this.state.item ?
					this.state.item.isPersonalMessages === 0 ?
						<View style={s.messageBlockNoMessages}>
							<Text style={[styles.text,styles.middle,styles.grey]}>Пользователь запретил отправлять ему личные сообщения</Text>
						</View>
					:
						<View style={[s.messageBlock,s.messageBlockInner,inputHeight>40?s.messageBlockTop:null]}>
							{this.state.audioRecordShow ?
							<View style={s.recordBlock}>
								<View style={{flexDirection:'row'}}>
									<Image source={require('./images/rec.gif')} style={s.rec} />
									<Text style={[styles.text,styles.small,styles.grey]}>{this.audioTimeGet(this.state.audioRecordSeconds)}</Text>
								</View>
								<Text style={[styles.text,styles.small,styles.grey,{marginRight:20,color:'#4a86cc'}]} onPress={() => this.audioRecordCancel()}>Отмена</Text>
							</View>
							:
							<View>
								<View style={[s.messageBlockInner,inputHeight>40?s.messageBlockTop:null]}>
									<TouchableOpacity onPress={() => this.imagePickerShow(false)}><SvgXml width={26} height={26} xml={icons.plus} fill={'#9c9fa8'} /></TouchableOpacity>
									<TextInput
										style={[styles.text,s.input]}
										value={this.state.message}
										onChangeText={(message) => this.setState({message})}
										onFocus={() => this.setState({stickerShow:false,inputHeight:0})}
										onBlur={() => this.setState({inputHeight:0})}
										onContentSizeChange={(event) => this.setState({inputHeight:event.nativeEvent.contentSize.height})}
										multiline={true}
										placeholder={'Сообщение'}
										underlineColorAndroid={'transparent'} />
									{/*
									<TouchableOpacity onPress={() => this.stickerToggle()} style={s.smileIcon}><SvgXml width={22} height={22} xml={icons.smile} fill={this.state.stickerShow?'#4a86cc':'#9c9fa8'} /></TouchableOpacity>
									*/}
								</View>
							</View>
							}
							{this.state.message ?
								<TouchableOpacity onPress={() => this.messageSet()}><SvgXml width={32} height={32} xml={icons.send} fill={'#2979ff'} /></TouchableOpacity>
								:
								(this.state.audioRecordShow ?
									<TouchableOpacity onPress={() => this.audioSet()}><SvgXml width={32} height={32} xml={icons.send} fill={'#2979ff'} /></TouchableOpacity>
									:
									<TouchableOpacity onPress={() => this.audioRecord()}><SvgXml width={22} height={22} xml={icons.mic} style={{marginLeft:4}} fill={'#9c9fa8'} /></TouchableOpacity>
								)
							}
						</View>
				: null}
				{this.state.stickerShow && <View style={s.stickersBlock}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={s.stickerHeadBlock}>
						{Stickers.map((v, i) =>
							<TouchableOpacity key={i} style={[s.thumbBlock,idx===i?s.thumbSelected:null]} onPress={() => this.setState({idx:i})}>
								<Image source={v.cover} style={s.thumb} />
							</TouchableOpacity>
						)}
					</ScrollView>
					<FlatList
						data={Stickers[idx].stickers}
						style={s.stickerBlock}
						contentContainerStyle={s.stickerBlockContent}
						numColumns={4}
						renderItem={({item, index}) => (
							<TouchableOpacity onPress={() => this.stickerSet(Stickers[idx].code, index)}>
								<Image source={item} style={s.sticker} />
							</TouchableOpacity>
						)}
						keyExtractor={(item, index) => index.toString()} />
				</View>}
			</KeyboardAvoidingView>
			}
			{this.state.overlayshow && <View style={s.overlay}>
				<Animated.View style={[s.panel,{top:this.animPanel}]}>
					<View style={s.panelblock}>
						<TouchableOpacity onPress={() => this.panelShow(false)} style={s.cancel}>
							<Text style={[styles.text,styles.blue]}>Закрыть</Text>
						</TouchableOpacity>
						{this.state.item ?
							<View style={s.contactinfo}>
								{this.state.item.imageAvatar ?
									<Image source={{uri:`${API.assets}clients/${this.state.item.imageAvatar}`}} style={s.avatarinfo} /> :
									<View style={[s.avatarinfo,s.placeholder,{backgroundColor:Utils.colorGet()}]}><Text style={[styles.text,styles.avatartext,styles.white,styles.upper]}>{this.initialsGet(this.state.item.name)}</Text></View>
								}
								<Text style={[styles.text,styles.title,styles.bold,styles.center]}>{this.state.item.name}</Text>
								<Text style={[styles.text,styles.grey,styles.center,styles.mt10]}>{Utils.phoneFormatter(this.state.item.phone)}</Text>
								<Text style={[styles.text,styles.middle,styles.grey,styles.center,styles.mt10]}>{Dates.get(this.state.item.birthDay, {showMonthFullName:true,yearLetter:'г.'})}</Text>
							</View>
						: null}
					</View>
				</Animated.View>
			</View>}
		</View>
	}
}

const { width, height } = Dimensions.get('window')
const panelY = 350, panelHide = height+10
const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	item: {
		flexDirection:'row',
		alignItems:'flex-end'
	},
	image: {
		width:32,
		height:32,
		borderRadius:16,
		marginLeft:10,
		marginBottom:5
	},
	avatar: {
		width:28,
		height:28,
		borderRadius:14,
		alignSelf:'flex-end',
		marginRight:15
	},
	placeholder: {
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#ccc'
	},
	message: {
		maxWidth:(width-80-20),
		minWidth:120,
		paddingHorizontal:10,
		paddingTop:10,
		paddingBottom:20,
		borderRadius:15,
		backgroundColor:'#ecedf1',
		margin:5,
		marginLeft:10
	},
	me: {
		backgroundColor:'#cce4ff',
		alignSelf:'flex-end',
		marginRight:10
	},
	separator: {
		marginVertical:20,
		padding:4,
		borderRadius:4,
		backgroundColor:'#f8f8f8'
	},
	nobg: {
		backgroundColor:'#fff',
		paddingHorizontal:0,
		paddingTop:0
	},
	nobgImageVideo: {
		paddingBottom:0
	},
	date: {
		position:'absolute',
		bottom:5,
		right:10
	},
	dateOver: {
		position:'absolute',
		bottom:2,
		right:4,
		color:'#fff',
		backgroundColor:'#00000080',
		padding:4
	},
	messageBlock: {
		marginHorizontal:5,
		padding:5
	},
	messageBlockTop: {
		alignItems:'flex-start'
	},
	messageBlockInner: {
		flexDirection:'row',
		alignItems:'center'
	},
	messageBlockNoMessages: {
		padding:30,
		paddingVertical:10,
		backgroundColor:'#f8f8f8'
	},
	recordBlock: {
		width:width-44,
		height:36,
		paddingTop:8,
		flexDirection:'row',
		justifyContent:'space-between'
	},
	rec: {
		top:4,
		marginRight:6,
		width:10,
		height:10
	},
	input: {
		width:width-80,
		marginHorizontal:5,
		borderRadius:20,
		borderColor:'#e1e2e6',
		borderWidth:1,
		padding:Platform.OS === 'ios' ? 8 : 0,
		paddingLeft:15,
		paddingRight:35,
		backgroundColor:'#f2f3f5'
	},
	smileIcon: {
		position:'absolute',
		right:Platform.OS === 'ios' ? 13 : 9,
		top:Platform.OS === 'ios' ? 7 : 4
	},
	stickersBlock: {
		backgroundColor:'#fff'
	},
	stickerHeadBlock: {
		width:width-20,
		height:46,
		alignSelf:'center',
		flexDirection:'row'
	},
	thumbBlock: {
		margin:5,
		width:40,
		height:40,
		alignItems:'center',
		justifyContent:'center'
	},
	thumb: {
		width:36,
		height:36
	},
	thumbSelected: {
		backgroundColor:'#eee',
		borderRadius:10
	},
	stickerBlock: {
		width:width-20,
		marginLeft:10,
		height:210,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	stickerBlockContent: {
		justifyContent:'space-between'
	},
	sticker: {
		width:width/4-10,
		height:width/4-10,
		marginRight:5,
		marginVertical:5
	},
	stickerImage: {
		width:120,
		height:120
	},
	audioBlock: {
		flexDirection:'row'
	},
	audioInfo: {
		width:(width-80-20-70),
		marginLeft:10
	},
	audioProgress: {
		height:4,
		marginTop:14,
		marginBottom:3,
		backgroundColor:'#ccc'
	},
	imageFullScreen: {
		flex:1,
		resizeMode:'contain'
	},
	videoPlaceholder: {
		width:196,
		height:110
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
	panellink: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#007aff30',
		borderBottomWidth:.5
	},
	panellinkone: {
		marginTop:20,
		borderTopColor:'#007aff30',
		borderTopWidth:.5
	},
	panellinkinvite: {
		marginTop:0,
		paddingTop:0
	},
	panelicon: {
		marginRight:20,
		marginLeft:5
	},
	paneliconmessage: {
		marginRight:10
	},
	panelblock: {
		padding:0,
	},
	cancel: {
		position:'absolute',
		top:2,
		left:15
	},
	contactinfo: {
		marginTop:20
	},
	avatarinfo: {
		alignSelf:'center',
		width:100,
		height:100,
		borderRadius:50,
		marginBottom:20
	},
	avatargroup: {
		width:40,
		height:40,
		borderRadius:20,
		marginRight:15
	},
	invite: {
		position:'absolute',
		top:2,
		right:15
	},
	panellist: {
		height:height-270,
		paddingTop:10,
		marginTop:10
	},
	panellistclients: {
		height:height-320,
		marginTop:20,
		borderTopColor:'#007aff30',
		borderTopWidth:.5
	},
	panellistclientsadmin: {
		height:height-280
	},
	panelname: {
		width:(width-15-15-40-20-40)
	},
	itemgroup: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	panelnotfound: {
		padding:15,
		marginTop:10
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
		borderRadius:25
	},
	groupnameinput: {
		width:(width-50-10-20-20)
	},
	arrowdown: {
		position:'absolute',
		right:0,
		bottom:60,
		width:50,
		backgroundColor:'#fff',
		paddingLeft:7,
		paddingTop:5,
		paddingBottom:4,
		borderTopLeftRadius:20,
		borderBottomLeftRadius:20,
		shadowColor:'#000',
		shadowOffset:{
			width:0,
			height:1,
		},
		shadowOpacity:.1,
		shadowRadius:2
	}
})