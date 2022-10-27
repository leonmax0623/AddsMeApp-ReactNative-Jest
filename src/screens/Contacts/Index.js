/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
} from 'react-native';

// plug-ins
import Contacts from 'react-native-contacts';
import {SvgXml} from 'react-native-svg';

// components
import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import Loader from '../../components/Loader';
import Forbidden from '../../components/Forbidden';
import {SearchBar} from '../../components/SearchBar';
import {ContactItem} from './components/ContactItem';
import {ContactsOverlay} from './components/ContactsOverlay';

// models
import {Clients} from '../../models/Index';

// helpers
import {Utils, Debug} from '../../helpers/Index';

// globals
import {API} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';
import store from '../../store';

const ContactsScreen = (props) => {
  const user = store.userStore.user;

  const animPanel = React.useRef(new Animated.Value(panelHide)).current;

  const [contacts, setContacts] = React.useState([]);
  const [contactsAll, setContactsAll] = React.useState([]);
  const [contactsOthers, setContactsOthers] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  const [overlayshow, setOverlayshow] = React.useState(null);
  const [forbidden, setForbidden] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);

  const contactsGet = () => {
    try {
      Contacts.getAll((error, contactsData) => {
        if (error) {
          setForbidden(true);
          setLoading(false);
        } else {
          if (!contactsData.length) {
            setForbidden(false);
            setLoading(false);
            return;
          }

          let c = [],
            phones = [],
            contactsOthersData = [],
            contactsInlist = [];
          /**
           * @todo
           * Не смог разобрать
           */
          contactsData.forEach((v) => {
            let phone =
              v.phoneNumbers.length > 0 ? v.phoneNumbers[0].number : null;
            if (Utils.empty(v.givenName)) {
              v.givenName = v.familyName;
              v.familyName = null;
            }
            if (Utils.empty(v.givenName) && Utils.empty(v.familyName))
              v.givenName = v.company;
            if (!Utils.empty(v.givenName) && !Utils.empty(phone)) {
              phone = Utils.phoneFormatter(Utils.phoneNormalize(phone));
              if (!Utils.empty(phone)) {
                phone = Utils.phoneClear(phone);
                if (phone.length === 11) {
                  let firstName = v.givenName,
                    lastName = v.familyName;
                  if (Utils.empty(firstName)) {
                    firstName = lastName;
                    lastName = null;
                  }
                  c.push({
                    firstName,
                    lastName,
                    avatar: v.hasThumbnail ? v.thumbnailPath : null,
                    phone,
                    phones: v.phoneNumbers,
                  });
                  phones.push(phone);
                }
              }
            }
          });
          c.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
          if (phones.length === 0) {
            setForbidden(false);
            setLoading(false);
            return;
          }
          Clients.byPhonesGet(phones, (res) => {
            c.forEach((v) => {
              let item = res.data.filter(
                (f) => f.phone === Utils.phoneClear(v.phone),
              );
              if (item.length > 0) {
                v.id = item[0].id;
                v.imageAvatar = item[0].imageAvatar;
                v.birthDay = item[0].birthDay;
                contactsInlist.push(v);
              } else {
                contactsOthersData.push(v);
              }
            });
            setContacts(contactsInlist);
            setContactsAll(contactsInlist);
            setContactsOthers(contactsOthersData);
            setLoading(false);
            setForbidden(false);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onSearch = (text) => {
    setSearch(text);

    if (text.length > 0) {
      let contactsData = contactsAll.filter((f) => contactFind(f, text));
      setContacts(contactsData);
    } else {
      setContacts(contactsAll);
    }
  };
  const contactFind = (item, text) => {
    const firstName = item.firstName.toLowerCase(),
      lastName = Utils.empty(item.lastName)
        ? null
        : item.lastName.toLowerCase(),
      phone = Utils.phoneClear(item.phone);
    text = text.toLowerCase();
    return (
      firstName.indexOf(text) !== -1 ||
      lastName?.indexOf(text) !== -1 ||
      phone.indexOf(text) !== -1
    );
  };

  const panelShow = (isshow) => {
    const go = (callback) =>
      Animated.timing(animPanel, {
        toValue: isshow ? panelY : panelHide,
        duration: 200,
        easing: Easing.ease,
      }).start(() => (callback ? callback() : () => {}));
    if (isshow) {
      setOverlayshow(isshow);
      go();
    } else {
      go(() => {
        setOverlayshow(isshow);
      });
    }
    setUsers([]);
  };
  const userSelect = (idx) => {
    let usersData = users.slice();
    selected = usersData.includes(idx);
    if (selected) usersData = usersData.filter((f) => f !== idx);
    else usersData.push(idx);
    setUsers(usersData);
  };
  const invite = () => {
    let phones = users.map((item) => item.phone);
    const url = `sms:${phones.join(',')}${
      Platform.OS === 'ios' ? '&' : '?'
    }body=Привет, я использую adsme для мониторинга скидок вокруг меня. Присоединяйся! Скачать его можно здесь: ${
      API.app
    }`;
    Linking.openURL(url);
  };

  const goto = (item) => {
    props.navigation.navigate('ContactInfo', {
      data: item,
      user,
    });
  };

  React.useEffect(() => {
    try {
      if (Platform.OS === 'ios') {
        contactsGet();
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        ).then((res) => {
          if (res !== 'granted') {
            setLoading(false);
            setForbidden(true);
            return;
          }
          contactsGet();
        });
      }
    } catch (ex) {
      Debug.add(`contacts. error:${ex}`);
    }
  }, []);

  return (
    <View style={styles.wrapper}>
      <Header title={'Контакты'} styles={styles} />
      {loading ? (
        <Loader styles={styles} />
      ) : (
        <View style={s.container}>
          {forbidden ? (
            <Forbidden
              styles={styles}
              title={`Вы запретили доступ к${'\n'}адресной книге`}
              comment={
                'Разрешите доступ в настройках чтобы получить список контактов телефона'
              }
            />
          ) : forbidden === undefined ? null : (
            <View style={s.inner}>
              <SearchBar search={search} onSearch={onSearch} />

              <TouchableOpacity
                onPress={() => panelShow(true)}
                style={s.panellink}>
                <SvgXml
                  width={26}
                  height={26}
                  style={s.panelicon}
                  fill={'#007aff'}
                  xml={
                    '<svg viewBox="0 0 16 16"><path d="M 8 2 C 6.347656 2 5 3.347656 5 5 C 5 6.652344 6.347656 8 8 8 C 9.652344 8 11 6.652344 11 5 C 11 3.347656 9.652344 2 8 2 Z M 8 8 C 5.246094 8 3 10.246094 3 13 L 4 13 C 4 10.785156 5.785156 9 8 9 C 10.214844 9 12 10.785156 12 13 L 13 13 C 13 10.246094 10.753906 8 8 8 Z M 8 3 C 9.109375 3 10 3.890625 10 5 C 10 6.109375 9.109375 7 8 7 C 6.890625 7 6 6.109375 6 5 C 6 3.890625 6.890625 3 8 3 Z"></path></svg>'
                  }
                />
                <Text style={[styles.text, styles.blue]}>Пригласить</Text>
              </TouchableOpacity>
              <KeyboardAvoidingView
                behavior={Platform.select({
                  android: undefined,
                  ios: 'padding',
                })}
                enabled>
                {contacts.length > 0 ? (
                  <FlatList
                    style={s.list}
                    data={contacts}
                    renderItem={({item}) => (
                      <ContactItem item={item} onPress={() => goto(item)} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                  />
                ) : (
                  <View style={s.notfound}>
                    <Text style={styles.text}>Не найдено</Text>
                    {contactsAll.length === 0 ? (
                      <Text
                        style={[
                          styles.text,
                          styles.small,
                          styles.grey,
                          styles.mt10,
                        ]}>
                        У вас нет ни одной записи в адресной книге.
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.text,
                          styles.small,
                          styles.grey,
                          styles.mt10,
                        ]}>
                        По заданым условиям поиска не найдено ни одного контакта
                        из адресной книги.
                      </Text>
                    )}
                  </View>
                )}
              </KeyboardAvoidingView>
            </View>
          )}
        </View>
      )}
      <Tabs styles={styles} page={'contacts'} navigation={props.navigation} />
      {overlayshow && (
        <ContactsOverlay
          userSelect={userSelect}
          panelShow={panelShow}
          invite={invite}
          contactsOthers={contactsOthers}
          users={users}
          animPanel={animPanel}
        />
      )}
    </View>
  );
};
// start
export default ContactsScreen;

const {width, height} = Dimensions.get('window');
const panelY = 100,
  panelHide = height + 10;
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    marginTop: 10,
  },
  notfound: {
    width: width - 30,
    marginLeft: 15,
    marginTop: 10,
  },

  list: {
    height: height - 170,
  },

  panellink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 20,
  },
  panelicon: {
    marginRight: 20,
  },
});
