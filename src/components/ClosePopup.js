import React from 'react'
import { TouchableOpacity } from 'react-native'

// plug-ins
import { SvgXml } from 'react-native-svg'

export default ClosePopup = (props) => {
	const { callback }  = props
	return (
		<TouchableOpacity onPress={() => callback()} style={{position:'absolute',top:35,right:15}}>
			<SvgXml width={32} height={32} xml={'<svg viewBox="0 0 18 18"><path opacity="0.3" d="M9 0C7.8181 -1.76116e-08 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 0 7.8181 0 9C0 10.1819 0.232792 11.3522 0.685084 12.4442C1.13738 13.5361 1.80031 14.5282 2.63604 15.364C3.47177 16.1997 4.46392 16.8626 5.55585 17.3149C6.64778 17.7672 7.8181 18 9 18C10.1819 18 11.3522 17.7672 12.4442 17.3149C13.5361 16.8626 14.5282 16.1997 15.364 15.364C16.1997 14.5282 16.8626 13.5361 17.3149 12.4442C17.7672 11.3522 18 10.1819 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 -1.76116e-08 9 0Z" fill="#ddd"/><path d="M6.37609 6.00016C6.30162 6.00018 6.22886 6.02241 6.16709 6.064C6.10532 6.10559 6.05736 6.16466 6.02934 6.23365C6.00132 6.30265 5.99451 6.37843 6.00979 6.45131C6.02506 6.52419 6.06172 6.59086 6.11509 6.6428L8.47068 8.99839L6.11509 11.354C6.07916 11.3885 6.05048 11.4298 6.03072 11.4755C6.01096 11.5212 6.00053 11.5704 6.00002 11.6202C5.99951 11.67 6.00895 11.7194 6.02777 11.7655C6.0466 11.8116 6.07443 11.8535 6.10965 11.8887C6.14486 11.924 6.18675 11.9518 6.23286 11.9706C6.27897 11.9894 6.32837 11.9989 6.37817 11.9984C6.42797 11.9979 6.47717 11.9874 6.52288 11.9677C6.5686 11.9479 6.60991 11.9192 6.6444 11.8833L9 9.52771L11.3556 11.8833C11.3901 11.9192 11.4314 11.9479 11.4771 11.9677C11.5228 11.9874 11.572 11.9979 11.6218 11.9984C11.6716 11.9989 11.721 11.9894 11.7671 11.9706C11.8132 11.9518 11.8551 11.924 11.8904 11.8887C11.9256 11.8535 11.9534 11.8116 11.9722 11.7655C11.9911 11.7194 12.0005 11.67 12 11.6202C11.9995 11.5704 11.989 11.5212 11.9693 11.4755C11.9495 11.4298 11.9208 11.3885 11.8849 11.354L9.52931 8.99839L11.8849 6.6428C11.939 6.59022 11.9759 6.52253 11.9909 6.44859C12.0059 6.37465 11.9981 6.29792 11.9687 6.22846C11.9393 6.15899 11.8896 6.10002 11.8261 6.05928C11.7627 6.01855 11.6883 5.99794 11.6129 6.00016C11.5157 6.00306 11.4234 6.0437 11.3556 6.11348L9 8.46908L6.6444 6.11348C6.60952 6.07762 6.5678 6.04912 6.52172 6.02966C6.47563 6.0102 6.42612 6.00017 6.37609 6.00016Z" fill="#9299A2"/></svg>'} />
		</TouchableOpacity>
	)
}