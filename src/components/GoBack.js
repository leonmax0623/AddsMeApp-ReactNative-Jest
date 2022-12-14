import React from 'react'
import { TouchableOpacity } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

export default GoBack = (props) => {
	const { navigation, noheader, color }  = props
	return (
		<TouchableOpacity onPress={() => navigation.goBack()} style={noheader?{marginLeft:10,marginTop:30}:{position:'absolute',top:-2,marginLeft:10}}>
			<SvgXml width={32} height={32} fill={color||'#000'} xml={'<svg viewBox="0 0 50 50"><path d="M 19.8125 13.09375 C 19.59375 13.132813 19.398438 13.242188 19.25 13.40625 L 8.34375 24.28125 L 7.65625 25 L 8.34375 25.71875 L 19.25 36.59375 C 19.492188 36.890625 19.878906 37.027344 20.253906 36.941406 C 20.625 36.855469 20.917969 36.5625 21.003906 36.191406 C 21.089844 35.816406 20.953125 35.429688 20.65625 35.1875 L 11.46875 26 L 41 26 C 41.359375 26.003906 41.695313 25.816406 41.878906 25.503906 C 42.058594 25.191406 42.058594 24.808594 41.878906 24.496094 C 41.695313 24.183594 41.359375 23.996094 41 24 L 11.46875 24 L 20.65625 14.8125 C 20.980469 14.511719 21.066406 14.035156 20.871094 13.640625 C 20.679688 13.242188 20.246094 13.023438 19.8125 13.09375 Z"></path></svg>'} />
		</TouchableOpacity>
	)
}