/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'

// components
import Loader from '../../components/Loader'

// helpers
import { Utils, Storage, Debug } from '../../helpers/Index'

// globals
import { chatType } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class PushesScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading:true,
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
				Storage.get('pushdata', (data) => {
					if (Utils.empty(user)) {
						Storage.get('startScreen', (screen) => this.props.navigation.navigate(screen||'Start'))
						return
					}
					Storage.remove('pushdata')
					data = JSON.parse(data)
					if (data) {
						try {
							if (data.partner !== undefined) {
								this.props.navigation.navigate('MessageInfo', {item:data.partner,type:chatType.PARTNER})
								return
							}
							if (data.user !== undefined) {
								this.props.navigation.navigate('MessageInfo', {item:data.user,type:chatType.MESSAGE})
								return
							}
							if (data.group !== undefined) {
								this.props.navigation.navigate('MessageInfo', {item:data.group,type:chatType.GROUP})
								return
							}
							if (data.partneruser !== undefined) {
								this.props.navigation.navigate('PartnerMessageInfo', {item:data.partneruser})
								return
							}
							if (data.ads !== undefined) {
								this.props.navigation.navigate('AdsInfo', {data:data.ads})
								return
							}
							if (data.chat !== undefined) {
								this.props.navigation.navigate('Chat')
								return
							}
						} catch (ex) {
							Debug.add(ex)
						}
					}
					Storage.get('startScreen', (screen) => this.props.navigation.navigate(screen||'Start'))
				})
			}
		})
	}
	render() {
		return <Loader styles={styles} />
	}
}