import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

// components
import GoBack from '../components/GoBack'
import { SvgXml } from 'react-native-svg'

export default Header = (props) => {
	const { navigation, title, context, styles }  = props
	return (
		<View style={[styles.header,title === '' ? null : styles.border]}>
			{context && <TouchableOpacity onPress={() => context.callback()}>
				{context.icon && <SvgXml width={26} height={26} style={{alignSelf:'flex-end',marginRight:10}} fill={'#333'} xml={context.icon} />}
				{context.component}
			</TouchableOpacity>}
			<Text style={[styles.text,styles.bold,styles.title,styles.center,{marginHorizontal:44,marginTop:context?-24:0}]} numberOfLines={1}>{title}</Text>
			{navigation && <GoBack navigation={navigation} />}
		</View>
	)
}