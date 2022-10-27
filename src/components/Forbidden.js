import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

export default Forbidden = (props) => {
	const { styles, title, comment, close, closeText, refresh, refreshText }  = props
	settingsOpen = async () => await Linking.openSettings()
	return (
		<View style={s.forbidden}>
			<SvgXml width={100} height={100} fill={'#c00'} style={s.icon} xml={'<svg viewBox="0 0 50 50"><path d="M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 37 28 C 37 28.601563 36.601563 29 36 29 L 14 29 C 13.398438 29 13 28.601563 13 28 L 13 22 C 13 21.398438 13.398438 21 14 21 L 36 21 C 36.601563 21 37 21.398438 37 22 Z"></path></svg>'} />
			<Text style={[styles.text,styles.title,styles.bold,styles.center]}>{title}</Text>
			<Text style={[styles.text,styles.small,styles.grey,styles.center,styles.mt10]}>{comment}</Text>
			<TouchableOpacity style={s.button} onPress={() => settingsOpen()}>
				<Text style={[styles.text,styles.upper]}>Разрешить доступ</Text>
			</TouchableOpacity>
			{close && closeText ? 
				<TouchableOpacity onPress={() => close()}>
					<Text style={[styles.text,styles.grey,styles.mt30]}>{closeText}</Text>
				</TouchableOpacity> : null}
			{refresh && refreshText ? 
				<TouchableOpacity onPress={() => refresh()}>
					<Text style={[styles.text,styles.grey,styles.mt30]}>{refreshText}</Text>
				</TouchableOpacity> : null}
		</View>
	)
}

const { width, height } = Dimensions.get('window')
const s = StyleSheet.create({
	forbidden: {
		width:width-60,
		alignSelf:'center',
		marginHorizontal:15,
		alignItems:'center'
	},
	icon: {
		marginVertical:40
	},
	button: {
		width:'100%',
		padding:15,
		marginTop:80,
		backgroundColor:'#ffd93e',
		borderRadius:10,
		alignItems:'center'
	}
})