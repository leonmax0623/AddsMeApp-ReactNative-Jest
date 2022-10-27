/*
 * adsme
 * (c) pavit.design, 2020
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// plug-ins
import Contacts from 'react-native-contacts';
import Geolocation from '@react-native-community/geolocation';
import OneSignal from 'react-native-onesignal';

// components
import Header from '../../components/Header';
import Loader from '../../components/Loader';

// modeles
import {Clients, PartnerClients} from '../../models/Index';

// helpers
import {Storage} from '../../helpers/Index';

// styles
import styles from '../../styles/Styles';
import store from '../../store';
import {PermissionItem} from './components/PermissionItem';

const SettingsPermissionsScreen = (props) => {
  const user = store.userStore.user;

  const [geo, setGeo] = React.useState(true);
  const [personalmessages, setPersonalmessages] = React.useState(true);
  const [groupinvite, setGroupinvite] = React.useState(true);
  const [partners, setPartners] = React.useState([]);
  const [ads, setAds] = React.useState(true);
  const [messages, setMessages] = React.useState(true);
  const [groups, setGroups] = React.useState(true);
  const [contacts, setContacts] = React.useState(true);

  const [chat, setChat] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const save = (userData) => {
    store.userStore.setUser(userData);
    Storage.set('user', JSON.stringify(user));
  };

  const contactsCheck = () => {
    Contacts.getAll((error) => {
      if (error) setContacts(false);
    });
  };
  const geoSet = () => {
    setGeo(!geo);
    settingsOpen();
  };
  const contactSet = () => {
    setContacts(!contacts);
    settingsOpen();
  };
  const personalMessagesSet = () => {
    setPersonalmessages(!personalmessages);
    Clients.update(user.id, {isPersonalMessages: !personalmessages});
    let userData = {
      ...user,
    };
    userData.isPersonalMessages = !personalmessages;
    save(userData);
  };
  const groupInviteSet = () => {
    setGroupinvite(!groupinvite);
    Clients.update(user.id, {isGroupInvite: !groupinvite});
    let userData = {
      ...user,
    };
    userData.isGroupInvite = !groupinvite;
    save(userData);
  };
  const adsSet = () => {
    setAds(!ads);
    Clients.update(user.id, {isActions: !ads});
    if (ads)
      partners.forEach((v, i) =>
        OneSignal.deleteTag(
          `ads_partner_id_${v.partnerId}`,
          v.partnerId.toString(),
        ),
      );
    else
      partners.forEach((v) =>
        OneSignal.sendTag(
          `ads_partner_id_${v.partnerId}`,
          v.partnerId.toString(),
        ),
      );
    let userData = {...user};
    userData.isActions = !ads;
    save(userData);
  };
  const messagesSet = () => {
    setMessages(!messages);
    Clients.update(user.id, {isMessages: !messages});
    let userData = {
      ...user,
    };
    userData.isMessages = !messages;
    save(userData);
  };
  const groupsSet = () => {
    setGroups(!groups);
    Clients.update(user.id, {isGroups: !groups});
    let userData = {
      ...user,
    };
    userData.isGroups = !groups;
    save(userData);
  };
  const chatSet = () => {
    setChat(!chat);
    Clients.update(user.id, {isChat: !chat});
    let userData = {
      ...user,
    };
    userData.isChat = !chat;
    save(user);
  };
  const settingsOpen = async () => await Linking.openSettings();

  React.useEffect(() => {
    setLoading(false);
    setPersonalmessages(user.isPersonalMessages === 1);
    setGroupinvite(user.isGroupInvite === 1);
    setAds(user.isActions === 1);
    setMessages(user.isMessages === 1);
    setGroups(user.isGroups === 1);
    setChat(user.isChat === 1);

    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        ({}) => {},
        () => setGeo(false),
        {enableHighAccuracy: true},
      );
      contactsCheck();
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((res) => setGeo(res === 'granted'));
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ).then((res) => {
        if (res !== 'granted') {
          setContacts(false);
          return;
        }
        contactsCheck();
      });
    }
    PartnerClients.byClientActiveGet(user.id, (res) => setPartners(res.data));
  }, []);

  return (
    <View style={styles.wrapper}>
      <Header
        title={'Настройки приватности'}
        navigation={props.navigation}
        styles={styles}
      />
      {loading ? (
        <Loader styles={styles} />
      ) : (
        <View style={s.container}>
          <View style={[s.container, s.lists]}>
            <PermissionItem
              onValueChange={geoSet}
              value={geo}
              text="Доступ к местоположению"
            />
            <PermissionItem
              text="Доступ к адресной книге"
              onValueChange={contactSet}
              value={contacts}
            />
            <PermissionItem
              text="Разрешить личные сообщения"
              onValueChange={personalMessagesSet}
              value={personalmessages}
            />
            <PermissionItem
              text="Разрешить приглашать в группу"
              onValueChange={groupInviteSet}
              value={groupinvite}
            />
            <PermissionItem
              text={`Получать уведомления о${'\n'}новых предложениях`}
              onValueChange={adsSet}
              value={ads}
            />
            <PermissionItem
              text={`Получать уведомления о${'\n'}новых личных сообщениях`}
              onValueChange={messagesSet}
              value={messages}
            />
            <PermissionItem
              text={`Получать уведомления о${'\n'}новых сообщениях в группах`}
              onValueChange={groupsSet}
              value={groups}
            />
            <PermissionItem
              text={`Получать уведомления о${'\n'}новых сообщениях в чате`}
              onValueChange={chatSet}
              value={chat}
            />
          </View>
        </View>
      )}
    </View>
  );
};
// start
export default SettingsPermissionsScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  lists: {
    padding: 6,
    paddingTop: 20,
  },
});
