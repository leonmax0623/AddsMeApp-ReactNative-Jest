/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {Linking} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// plug-ins
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';

// global
import {API} from './src/globals/Сonstants';

// screen
import Loading from './src/screens/Loading/Index';
import PushesScreen from './src/screens/Pushes/Index';
import LinksScreen from './src/screens/Links/Index';
import NoInternetScreen from './src/screens/NoInternet/Index';
import StartScreen from './src/screens/Start/Index';
import StartLoginScreen from './src/screens/StartLogin/Index';
import LoginScreen from './src/screens/Login/Index';
import SmsScreen from './src/screens/Sms/Index';
import RegisterScreen from './src/screens/Register/Index';
import StopScreen from './src/screens/Stop/Index';
import ChatScreen from './src/screens/Chat/Index';
import AdsScreen from './src/screens/Ads/Index';
import AdsInfoScreen from './src/screens/AdsInfo/Index';
import PartnerInfoScreen from './src/screens/PartnerInfo/Index';
import PartnerNotfoundScreen from './src/screens/PartnerNotfound/Index';
import PartnerScreen from './src/screens/Partner/Index';
import PartnerProfileScreen from './src/screens/PartnerProfile/Index';
import PartnerAdsScreen from './src/screens/PartnerAds/Index';
import PartnerAdsInfoScreen from './src/screens/PartnerAdsInfo/Index';
import PartnerStatisticsScreen from './src/screens/PartnerStatistics/Index';
import PartnerStatisticsInfoScreen from './src/screens/PartnerStatisticsInfo/Index';
import PartnerOrdersScreen from './src/screens/PartnerOrders/Index';
import PartnerClientsScreen from './src/screens/PartnerClients/Index';
import PartnerClientInfoScreen from './src/screens/PartnerClientInfo/Index';
import PartnerMessagesScreen from './src/screens/PartnerMessages/Index';
import PartnerMessageInfoScreen from './src/screens/PartnerMessageInfo/Index';
import PartnerBalanceScreen from './src/screens/PartnerBalance/Index';
import PartnerLoyalityScreen from './src/screens/PartnerLoyality/Index';
import PartnerBonusesScreen from './src/screens/PartnerBonuses/Index';
import PartnerDiscountsScreen from './src/screens/PartnerDiscounts/Index';
import PartnerDiscountInfoScreen from './src/screens/PartnerDiscountInfo/Index';
import PartnerRemoveScreen from './src/screens/PartnerRemove/Index';
import PartnerSettingsScreen from './src/screens/PartnerSettings/Index';
import MessagesScreen from './src/screens/Messages/Index';
import MessageInfoScreen from './src/screens/MessageInfo/Index';
import SettingsScreen from './src/screens/Settings/Index';
import SettingsPermissionsScreen from './src/screens/SettingsPermissions/Index';
import SettingsRemoveScreen from './src/screens/SettingsRemove/Index';
import ContactsScreen from './src/screens/Contacts/Index';
import ContactInfoScreen from './src/screens/ContactInfo/Index';

// helpers
import {Storage, Utils} from './src/helpers/Index';
import {Provider} from 'mobx-react';
import store from './src/store';
// options
const options = {
  headerMode: 'none',
  mode: 'card',
  cardStack: {gesturesEnabled: false},
};

// blocks
const startBlock = createStackNavigator(
  {
    Start: StartScreen,
    StartLogin: StartLoginScreen,
    Login: LoginScreen,
    Sms: SmsScreen,
    Register: RegisterScreen,
  },
  options,
  (options.initialRouteName = 'Start'),
);
const adsBlock = createStackNavigator(
  {
    Ads: AdsScreen,
    AdsInfo: AdsInfoScreen,
    PartnerInfo: PartnerInfoScreen,
    PartnerNotfound: PartnerNotfoundScreen,
  },
  options,
  (options.initialRouteName = 'Ads'),
);
const chatBlock = createStackNavigator(
  {
    Chat: ChatScreen,
  },
  options,
  (options.initialRouteName = 'Chat'),
);
const messagesBlock = createStackNavigator(
  {
    Messages: MessagesScreen,
    MessageInfo: MessageInfoScreen,
  },
  options,
  (options.initialRouteName = 'Messages'),
);
const settingsBlock = createStackNavigator(
  {
    Settings: SettingsScreen,
    SettingsPermissions: SettingsPermissionsScreen,
    SettingsRemove: SettingsRemoveScreen,
  },
  options,
  (options.initialRouteName = 'Settings'),
);
const contactsBlock = createStackNavigator(
  {
    Contacts: ContactsScreen,
    ContactInfo: ContactInfoScreen,
  },
  options,
  (options.initialRouteName = 'Contacts'),
);
const partnerBlock = createStackNavigator(
  {
    Partner: PartnerScreen,
    PartnerAds: PartnerAdsScreen,
    PartnerAdsInfo: PartnerAdsInfoScreen,
    PartnerProfile: PartnerProfileScreen,
    PartnerStatistics: PartnerStatisticsScreen,
    PartnerStatisticsInfo: PartnerStatisticsInfoScreen,
    PartnerOrders: PartnerOrdersScreen,
    PartnerClients: PartnerClientsScreen,
    PartnerClientInfo: PartnerClientInfoScreen,
    PartnerMessages: PartnerMessagesScreen,
    PartnerMessageInfo: PartnerMessageInfoScreen,
    PartnerBalance: PartnerBalanceScreen,
    PartnerLoyality: PartnerLoyalityScreen,
    PartnerBonuses: PartnerBonusesScreen,
    PartnerDiscounts: PartnerDiscountsScreen,
    PartnerDiscountInfo: PartnerDiscountInfoScreen,
    PartnerRemove: PartnerRemoveScreen,
    PartnerSettings: PartnerSettingsScreen,
  },
  options,
  (options.initialRouteName = 'Partner'),
);

// routes
const AppNavigator = (screen) =>
  createSwitchNavigator(
    {
      Loading: Loading,
      Pushes: PushesScreen,
      Links: LinksScreen,
      Stop: StopScreen,
      NoInternet: NoInternetScreen,
      Start: startBlock,
      Ads: adsBlock,
      Chat: chatBlock,
      Messages: messagesBlock,
      Contacts: contactsBlock,
      Settings: settingsBlock,
      Partner: partnerBlock,
    },
    options,
    (options.initialRouteName = screen),
  );

const stores = {
  rootStore: store,
  userStore: store.userStore,
};

// start
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Loading',
    };
    OneSignal.init(API.pushKey, {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onOpened);
    Linking.addEventListener('url', this.onOpenURL);
    NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) this.setState({screen: 'NoInternet'});
    });
  }
  componentWillUnmount = () => {
    OneSignal.removeEventListener('opened', this.onOpened);
    Linking.removeEventListener('url', this.onOpenURL);
  };
  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    if (openResult) {
      Storage.set(
        'pushdata',
        JSON.stringify(openResult.notification.payload.additionalData),
      );
      this.setState({screen: 'Pushes'});
    }
  };
  onOpenURL = (event) => {
    console.log('Link: ', event);
    const route = event.url.replace(/.*?:\/\//g, '');
    if (!Utils.empty(route)) {
      Storage.set('linkdata', route);
      this.setState({screen: 'Links'});
    }
  };
  componentDidMount = () => {
    Storage.get('deviceId', (value) => {
      if (value == null) Storage.set('deviceId', Utils.uuidv4());
    });
    Storage.get('startScreen', (value) => {
      this.setState({screen: value || 'Start'}),
        Storage.get('user', (userData) => {
          if (Utils.empty(userData)) {
            Storage.set('startScreen', 'Start');
            props.navigation.navigate('Start');
          } else {
            userData = JSON.parse(userData);
            store.userStore.setUser(userData);

            OneSignal.sendTag('user_id', userData.id.toString());
          }
        });
    });
  };
  render() {
    //Storage.clear()
    const AppContainer = createAppContainer(AppNavigator(this.state.screen));
    return (
      <Provider {...stores}>
        <AppContainer />
      </Provider>
    );
  }
}
