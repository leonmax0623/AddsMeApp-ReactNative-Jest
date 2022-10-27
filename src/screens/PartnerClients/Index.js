/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// helpers
import { PartnerClients } from '../../models/Index'

// helpers
import { Storage, Utils } from '../../helpers/Index'

// globals
import { API } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerClientsScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			data:[],
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
				this.setState({user})
				PartnerClients.byPartnerGet(user.id, (res) => this.setState({data:res.data,loading:false}))
			}
		})
	}
	initialsGet = (name) => {
		name = name.split(' ')
		return Utils.initialsGet(name[0],name[1])
	}
	avatarGet = (item) => {
		const avatar = item.imageAvatar ? `${API.assets}clients/${item.imageAvatar}` : item.avatar
		return avatar ? <Image source={{uri:avatar}} style={s.avatar} /> : <View style={[s.avatar,s.placeholder]}><Text style={[styles.text,styles.white,styles.upper]}>{this.initialsGet(item.name)}</Text></View>
	}
	gotoInfo = (data) => this.props.navigation.navigate('PartnerClientInfo', {data})
	render() {
		return <View style={styles.wrapper}>
			<Header title={'Клиенты'} navigation={this.props.navigation} styles={styles} />
			{this.state.loading ? <Loader styles={styles} /> :
				this.state.data.length === 0 ?
				<View style={s.notfound}>
					<Text style={styles.text}>У вас пока нет клиентов</Text>
				</View>
				:
				<View style={s.container}>
					<FlatList
						style={s.list}
						data={this.state.data}
						renderItem={({item}) => <TouchableOpacity onPress={() => this.gotoInfo(item)} style={s.item}>
							{this.avatarGet(item.client)}
							<Text style={styles.text}>{item.client.name}</Text>
						</TouchableOpacity>}
						keyExtractor={(item, index) => index.toString()} />
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
	item: {
		flexDirection:'row',
		alignItems:'center',
		padding:10,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	avatar: {
		width:40,
		height:40,
		borderRadius:20,
		marginRight:15
	},
	placeholder: {
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#ccc'
	},
	list: {
		marginTop:10,
		paddingTop:10
	},
	notfound: {
		marginHorizontal:15,
		marginTop:20
	}
})