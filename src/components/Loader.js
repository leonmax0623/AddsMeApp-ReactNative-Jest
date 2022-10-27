import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

export default Loader = (props) => {
	const {styles} = props
	return (
		<View style={styles.loaderContainer}>
			<ActivityIndicator />
			<Text style={styles.loaderText}>загрузка</Text>
		</View>
	)
}