/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, { Component } from 'react'

// components
import Loader from '../../components/Loader'

// styles
import styles from '../../styles/Styles'

// start
export default class LoadingScreen extends Component {
	render() {
		return <Loader styles={styles} />
	}
}