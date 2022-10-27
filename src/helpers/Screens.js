/*
 * adsme
 * (c) pavit.design, 2020
 */

import { StackActions, NavigationActions } from 'react-navigation'

const resetTo = (navigation, screen) => navigation.dispatch(StackActions.reset({index:0,key:null,actions:[NavigationActions.navigate({routeName:screen})]}))

export {
	resetTo
}