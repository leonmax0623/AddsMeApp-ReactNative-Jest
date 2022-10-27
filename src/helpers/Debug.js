/*
 * adsme
 * (c) pavit.design, 2020
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

 // helpers
 import { Http } from './Index'

function show() {
	let texts = []
	for (var i = 0; i < arguments.length; i++) texts.push(<Text key={i} style={styles.text}>{arguments[i] || '--'}</Text>)
	return <View style={styles.container}>{texts}</View>
}

const add = (data) => Http.post('logs', data)

export {
	show,
	add
}

const styles = StyleSheet.create({
	container: {
		position:'absolute',
		top:0,
		left:0,
		backgroundColor:'#000',
		padding:10,
		zIndex:1000
	},
	text: {
        fontSize:10,
		color:'#fff'
	}
})