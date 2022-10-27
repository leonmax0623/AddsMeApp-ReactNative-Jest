/*
 * adsme
 * (с) pavit.design, 2020
 */

import { AppRegistry, Text } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

if (Text.defaultProps == null) Text.defaultProps = {}
Text.defaultProps.allowFontScaling = false

AppRegistry.registerComponent(appName, () => App)