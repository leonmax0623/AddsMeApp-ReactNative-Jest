/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

// components
import Header from '../../components/Header'
import Loader from '../../components/Loader'

// helpers
import { Offers, OfferLikes } from '../../models/Index'

// helpers
import { Storage, Utils, Dates } from '../../helpers/Index'

// styles
import styles from '../../styles/Styles'

// start
export default class PartnerAdsScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user:null,
			offers:[],
			likes:[],
			loading:true,
			refreshing:false
		}
	}
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				this.focusListener = this.props.navigation.addListener('didFocus', () => this.refresh(false))
				this.setState({user:JSON.parse(user)}, () => this.refresh(true))
			}
		})
	}
	componentWillUnmount = () => this.focusListener.remove()
	refresh = (refreshing) => this.setState({refreshing}, () => {
		Offers.get(this.state.user.id, (res) => {
			const offers = res.data
			offers.forEach((v, i) => this.offerLikesGet(v.id))
			this.setState({offers,refreshing:false,loading:false})
		})
	})
	gotoInfo = (item) => this.props.navigation.navigate('PartnerAdsInfo', {data:item})
	offerLikesGet = (id) => {
		OfferLikes.get(id, (res) => {
			const {likes} = this.state
			likes[id] = res.data
			this.setState({likes})
		})
	}
	likeCountGet = (id) => {
		let {likes} = this.state
		likes = likes[id]
		return (likes === undefined || likes.length === 0) ? 0 : likes.length
	}
	render() {
		return <View style={styles.wrapper}>
			<Header
				title={'Предложения'}
				styles={styles}
				navigation={this.props.navigation} 
				context={{
					icon:'<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 7 L 4 7 L 4 8 L 7 8 L 7 11 L 8 11 L 8 8 L 11 8 L 11 7 L 8 7 L 8 4 Z"></path></svg>',
					callback:() => this.gotoInfo(null)
				}} />
			{this.state.loading ? <Loader styles={styles} /> :
				this.state.offers.length === 0 ?
				<View style={s.notfound}>
					<Text style={styles.text}>Предложения не найдены{'\r\r'}Для добавления нового предложения или акции нажмите на "Плюс" в правом верхнем углу.</Text>
				</View>
				:
				<FlatList
					style={s.list}
					data={this.state.offers}
					renderItem={({item}) => <TouchableOpacity onPress={() => this.gotoInfo(item)} style={s.item}>
						<Text style={[styles.text,styles.middle,styles.grey]}>{Dates.get(item.dateCreate, {showMonthShortName:true,neerCheck:true})}{item.dateTill ? <Text style={styles.red}>  Закончится {Dates.get(item.dateTill, {showMonthShortName:true})}</Text> : null}</Text>
						<Text style={styles.text} numberOfLines={2}>{item.title}</Text>
						<View style={s.oneline}>
							<SvgXml width={20} height={20} fill={'#ddd'} xml={'<svg viewBox="0 0 24 24"><path d="M16.5,3C13.605,3,12,5.09,12,5.09S10.395,3,7.5,3C4.462,3,2,5.462,2,8.5c0,4.171,4.912,8.213,6.281,9.49 C9.858,19.46,12,21.35,12,21.35s2.142-1.89,3.719-3.36C17.088,16.713,22,12.671,22,8.5C22,5.462,19.538,3,16.5,3z"></path></svg>'} />
							<Text style={[styles.text,styles.small,styles.bold,styles.grey,styles.ml5]}>{this.likeCountGet(item.id)}</Text>
						</View>
					</TouchableOpacity>}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.refresh(true)} />
					}
					keyExtractor={(item, index) => index.toString()} />
			}
		</View>
	}
}

const s = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:'#fff'
	},
	list: {
		width:'100%'
	},
	item: {
		padding:10,
		paddingHorizontal:15,
		borderBottomColor:'#ddd',
		borderBottomWidth:.5
	},
	oneline: {
		flexDirection:'row',
		alignItems:'center',
		marginTop:5
	},
	notfound: {
		marginHorizontal:15,
		marginTop:20
	}
})