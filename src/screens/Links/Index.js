/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'

// components
import Loader from '../../components/Loader'

// models
import { Partners } from '../../models/Index'

// helpers
import { Utils, Storage, Debug } from '../../helpers/Index'

// globals
import { partnerStatus } from '../../globals/Сonstants'

// styles
import styles from '../../styles/Styles'

// start
export default class LinksScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading:true,
			user:null
		}
	}
	default = () => Storage.get('startScreen', (screen) => this.props.navigation.navigate(screen||'Start'))
	componentDidMount = () => {
		Storage.get('user', (user) => {
			if (Utils.empty(user)) {
				Storage.set('startScreen', 'Start')
				this.props.navigation.navigate('Start')
			}
			else {
				Storage.get('linkdata', (data) => {
					if (Utils.empty(user)) {
						this.default()
						return
					}
					Storage.remove('linkdata')
					if (data) {
						data = data.split('/')
						try {
							if (data[0] === 'partner') {
								const id = parseInt(data[1])
								if (!isNaN(id)) {
									Partners.byIdGet(id, (data) => {
										if (data && data.status === partnerStatus.ACTIVE) {
											this.props.navigation.navigate('AdsInfo', {data})
											return
										}
										this.props.navigation.navigate('PartnerNotfound')
									})
									return
								}
							}
						} catch (ex) {
							Debug.add(ex)
						}
					}
					this.default()
				})
			}
		})
	}
	render() {
		return <Loader styles={styles} />
	}
}