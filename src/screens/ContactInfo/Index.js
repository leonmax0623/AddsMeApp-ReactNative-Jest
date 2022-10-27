/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, Easing, FlatList, Alert } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import GoBack from '../../components/GoBack'
import Loader from '../../components/Loader'

// modeles
import { MessagesGroups, MessagesGroupsUsers, Clients } from '../../models/Index'

// helpers
import { Utils, Dates } from '../../helpers/Index'

// globals
import { API, chatType, mediaType, messagesGroupsUserStatus } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// icons
const icons = {
	groupadd:'<svg viewBox="0 0 16 16"><path d="M 4.5 3 C 3.125 3 2 4.125 2 5.5 C 2 6.441406 2.535156 7.253906 3.304688 7.679688 C 1.40625 8.210938 0 9.9375 0 12 L 1 12 C 1 10.0625 2.5625 8.5 4.5 8.5 C 5.65625 8.5 6.664063 9.0625 7.296875 9.929688 C 7.113281 10.421875 7 10.945313 7 11.5 C 7 13.980469 9.019531 16 11.5 16 C 13.980469 16 16 13.980469 16 11.5 C 16 9.617188 14.832031 8.003906 13.183594 7.335938 C 13.679688 6.875 14 6.226563 14 5.5 C 14 4.125 12.875 3 11.5 3 C 10.125 3 9 4.125 9 5.5 C 9 6.226563 9.320313 6.875 9.816406 7.335938 C 8.988281 7.671875 8.28125 8.242188 7.78125 8.96875 C 7.230469 8.367188 6.527344 7.902344 5.71875 7.671875 C 6.476563 7.238281 7 6.429688 7 5.5 C 7 4.125 5.875 3 4.5 3 Z M 4.5 4 C 5.335938 4 6 4.664063 6 5.5 C 6 6.335938 5.335938 7 4.5 7 C 3.664063 7 3 6.335938 3 5.5 C 3 4.664063 3.664063 4 4.5 4 Z M 11.5 4 C 12.335938 4 13 4.664063 13 5.5 C 13 6.335938 12.335938 7 11.5 7 C 10.664063 7 10 6.335938 10 5.5 C 10 4.664063 10.664063 4 11.5 4 Z M 11.5 8 C 13.4375 8 15 9.5625 15 11.5 C 15 13.4375 13.4375 15 11.5 15 C 9.5625 15 8 13.4375 8 11.5 C 8 10.910156 8.15625 10.363281 8.414063 9.875 L 8.4375 9.859375 C 8.4375 9.855469 8.433594 9.851563 8.429688 9.847656 C 9.019531 8.75 10.164063 8 11.5 8 Z M 11 9 L 11 11 L 9 11 L 9 12 L 11 12 L 11 14 L 12 14 L 12 12 L 14 12 L 14 11 L 12 11 L 12 9 Z"></path></svg>',
	chat:'<svg viewBox="0 0 16 16"><path d="M 2.5 2 C 1.675781 2 1 2.675781 1 3.5 L 1 8.5 C 1 9.324219 1.675781 10 2.5 10 L 3.992188 10 L 3.992188 12 L 6.664063 10 L 9.5 10 C 10.324219 10 11 9.324219 11 8.5 L 11 3.5 C 11 2.675781 10.324219 2 9.5 2 Z M 2.5 3 L 9.5 3 C 9.78125 3 10 3.21875 10 3.5 L 10 8.5 C 10 8.78125 9.78125 9 9.5 9 L 6.328125 9 L 4.992188 10 L 4.992188 9 L 2.5 9 C 2.21875 9 2 8.78125 2 8.5 L 2 3.5 C 2 3.21875 2.21875 3 2.5 3 Z M 12 5 L 12 6 L 13.5 6 C 13.78125 6 14 6.21875 14 6.5 L 14 11.5 C 14 11.78125 13.78125 12 13.5 12 L 11.003906 12 L 11.003906 13 L 9.671875 12 L 6.5 12 C 6.300781 12 6.128906 11.878906 6.046875 11.707031 L 5.242188 12.3125 C 5.511719 12.726563 5.972656 13 6.5 13 L 9.335938 13 L 12.003906 15 L 12.003906 13 L 13.5 13 C 14.324219 13 15 12.324219 15 11.5 L 15 6.5 C 15 5.675781 14.324219 5 13.5 5 Z"></path></svg>',
	checkbox: {
		off:'<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>',
		on:'<svg viewBox="0 0 24 24"><path d="M11.707,15.707C11.512,15.902,11.256,16,11,16s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L11,13.586l8.35-8.35C17.523,3.251,14.911,2,12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10 c0-1.885-0.531-3.642-1.438-5.148L11.707,15.707z"></path></svg>'
	}
}

// start
export default class ContactInfoScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			groups:[],
			groupid:0,
			data:this.props.navigation.getParam('data'),
			user:this.props.navigation.getParam('user'),
			item:null,
			overlayshow:false
		}
		this.animPanel = new Animated.Value(panelHide)
	}
	componentDidMount = () => {
		Clients.get(this.state.data.id, (res) => this.setState({item:res.data[0]}))
		MessagesGroups.parentsGet(this.state.user.id, (res) => {
			let groups = [], messages = res.data
			MessagesGroupsUsers.byUserGet(this.state.user.id, (res) => {
				messages.forEach((v) => {
					let msg = res.data.filter(f => (f.parentId === 0 && f.id === v.messagesGroupId) || (f.parentId !== 0 && f.parentId === v.messagesGroupId))
					if (msg.length > 0) groups.push(v)
				})
				groups.sort((a, b) => a.dateCreate > b.dateCreate ? -1 : 1)
				this.setState({groups})
			})
		})
	}
	avatarGet = (item) => {
		const avatar = item.imageAvatar ? `${API.assets}clients/${item.imageAvatar}` : item.avatar
		return avatar ? <Image source={{uri:avatar}} style={s.avatar} /> : <View style={[s.avatar,s.placeholder]}><Text style={[styles.text,styles.avatartext,styles.white,styles.upper]}>{Utils.initialsGet(item.firstName,item.lastName)}</Text></View>
	}
	avatarGroupGet = (item) => {
		return item.imageAvatar ? <Image source={{uri:`${API.assets}groups/${item.imageAvatar}`}} style={s.avatargroup} /> :
			<View style={[s.avatargroup,s.placeholder,{backgroundColor:Utils.colorGet()}]}><Text style={[styles.text,styles.white,styles.upper]}>{Utils.initialsGet(item.title)}</Text></View>
	}
	modalShow = (visible) => this.setState({modalVisible:visible})
	panelShow = (isshow) => {
		const go = (callback) => Animated.timing(this.animPanel,{toValue:isshow?panelY:panelHide,duration:200,easing:Easing.ease}).start(() => callback ? callback() : () => {})
		if (isshow) this.setState({overlayshow:isshow}, () => go())
		else go(() => this.setState({overlayshow:isshow,groupid:0}))
	}
	groupSelect = (id) => this.setState({groupid:this.state.groupid === id ? 0 : id})
	gotoMessage = () => this.setState({loading:true}, () => setTimeout(() => this.props.navigation.navigate('MessageInfo', {item:this.state.item,type:chatType.MESSAGE}), 500))
	invite = () => {
		const group = this.state.groups.filter(f => f.id === this.state.groupid)[0]
		const name = `${this.state.data.firstName} ${this.state.data.lastName}`
		const data = {
			parentId:group.id,
			authorId:this.state.data.id,
			authorName:name,
			message:`${name} вступил(а) в группу «${group.title}»`,
			type:mediaType.INFO
		}
		MessagesGroups.add(data)
		MessagesGroupsUsers.add({messagesGroupId:group.id,clientId:this.state.data.id,status:messagesGroupsUserStatus.ACTIVE})
		Alert.alert('Успех!','Пользователь был добавлен в группу',[{text:'Хорошо',onPress:() => this.panelShow(false)}],{cancelable:false})
	}
	render() {
		return <View style={styles.wrapper}>
			{this.state.loading ? <Loader styles={styles} />
			:
			<View style={s.container}>
				{this.avatarGet(this.state.data)}
				<View style={s.nameblock}>
					<Text style={[styles.text,styles.titlebig,styles.bold,styles.center]}>{this.state.data.firstName} {this.state.data.lastName}</Text>
					<Text style={[styles.text,styles.grey,styles.center,styles.mt10]}>{Utils.phoneFormatter(this.state.data.phone)}</Text>
					<Text style={[styles.text,styles.middle,styles.grey,styles.center,styles.mt10]}>{Dates.get(this.state.data.birthDay, {showMonthFullName:true,yearLetter:'г.'})}</Text>
				</View>
				<View style={s.panelblock}>
					<TouchableOpacity onPress={() => this.gotoMessage()} style={[s.panellink,s.panellinkone]}>
						<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.chat} />
						<Text style={[styles.text,styles.blue]}>Перейти в чат</Text>
					</TouchableOpacity>
					{this.state.item && this.state.item.isGroupInvite ?
						<TouchableOpacity onPress={() => this.panelShow(true)} style={s.panellink}>
							<SvgXml width={26} height={26} style={s.panelicon} fill={'#007aff'} xml={icons.groupadd} />
							<Text style={[styles.text,styles.blue]}>Пригласить в группу</Text>
						</TouchableOpacity>
					: null}
				</View>
			</View>
			}
			<View style={s.back}>
				<GoBack navigation={this.props.navigation} noheader={true} />
			</View>
			{this.state.overlayshow && <View style={s.overlay}>
				<Animated.View style={[s.panel,{top:this.animPanel}]}>
					<View style={s.panelblock}>
						<Text style={[styles.text,styles.title,styles.bold,styles.center]}>Группы</Text>
						<TouchableOpacity onPress={() => this.panelShow(false)} style={s.cancel}>
							<Text style={[styles.text,styles.blue]}>Закрыть</Text>
						</TouchableOpacity>
						{this.state.groupid ? <TouchableOpacity onPress={() => this.invite()} style={s.invite}>
							<Text style={[styles.text,styles.bold,styles.blue]}>Пригласить</Text>
							</TouchableOpacity> : <Text style={[styles.text,styles.bold,styles.light,s.invite]}>Пригласить</Text>}
						{this.state.groups.length > 0 ?
							<FlatList
								style={s.panellist}
								data={this.state.groups}
								renderItem={({item}) => <TouchableOpacity onPress={() => this.groupSelect(item.id)} style={s.item}>
									{this.avatarGroupGet(item)}
									<Text style={[styles.text,s.panelname]} numberOfLines={1}>{item.title}</Text>
									{this.state.groupid === item.id ? <SvgXml width={24} height={24} fill={'#007aff'} style={s.checkbox} xml={icons.checkbox.on} /> :
									<SvgXml width={24} height={24} fill={'#ccc'} style={s.checkbox} xml={icons.checkbox.off} />}
								</TouchableOpacity>}
								keyExtractor={(item, index) => index.toString()} />
							:
							<View style={s.panelnotfound}>
								<Text style={styles.text}>У вас нет созданных групп</Text>
							</View>
						}
					</View>
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
	back: {
		position:'absolute',
		top:0,
		left:0
	},
	avatar: {
		alignSelf:'center',
		width:100,
		height:100,
		borderRadius:50,
		marginTop:60,
		marginBottom:20
	},
	placeholder: {
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#ccc'
	},
	avatargroup: {
		width:40,
		height:40,
		borderRadius:20,
		marginRight:15
	},
	nameblock: {
		width:width-60,
		alignSelf:'center'
	},
	oneline: {
		justifyContent:'space-between',
		flexDirection:'row'
	},
	panelblock: {
		width:width-10,
		marginTop:20
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
	panelicon: {
		marginRight:20,
		marginLeft:5
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
	panellist: {
		height:height-270,
		paddingTop:10,
		marginTop:10
	},
	panelname: {
		width:(width-15-15-40-20-40)
	},
	cancel: {
		position:'absolute',
		top:2,
		left:15
	},
	invite: {
		position:'absolute',
		top:2,
		right:15
	},
	item: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	checkbox: {
		position:'absolute',
		right:15
	},
	panelnotfound: {
		padding:15,
		marginTop:10
	}
})