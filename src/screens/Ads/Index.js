/*
 * adsme
 * (c) pavit.design, 2020
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// plug-ins
import Geolocation from '@react-native-community/geolocation';
import OneSignal from 'react-native-onesignal';

// components
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import Forbidden from '../../components/Forbidden';

// models
import {Partners} from '../../models/Index';

// helpers
import {Utils, Storage} from '../../helpers/Index';

// globals
import {API} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';
import {AdsTag} from './components/AdsTag';
import {AdsPartner} from './components/AdsPartner';
import {SearchBar} from '../../components/SearchBar';
import {MessageCount} from '../../components/MessageCount';
import store from '../../store';

const tagsCollect = (data) => {
  let all = [];
  data.forEach((v) => {
    (v.tags ? v.tags.split(',') : []).forEach((t) => {
      let tag = all.filter((f) => f.title === t);
      if (tag.length === 0) all.push({title: t.trim(), ids: [v.id]});
      else tag[0].ids.push(v.id);
    });
  });

  all.sort((a, b) => {
    const titleA = a.title.toLowerCase(),
      titleB = b.title.toLowerCase();
    return titleA.localeCompare(titleB);
  });
  return all;
};

const AdsScreen = (props) => {
  const watchId = React.useRef(null);

  const [unreadMessages, setUnreadMessages] = React.useState([]);
  const [partnersAll, setPartnersAll] = React.useState([]);
  const [partners, setPartners] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  const [user, setUser] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [tagSelected, setTagSelected] = React.useState(null);
  const [isfavorites, setIsfavorites] = React.useState(false);
  const [forbidden, setForbidden] = React.useState(undefined);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const geoPermissionsCheck = () =>
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((res) => setForbidden(res !== 'granted'));
  const gotoActions = (item) =>
    props.navigation.navigate('AdsInfo', {data: item});

  const messageCountGet = (id) => {
    let offers = partners.filter((partner) => partner.id === id)[0].offers,
      count = offers.length;
    if (count !== 0) {
      const lastDate = unreadMessages ? unreadMessages[`ads_${id}`] : 0;
      offers = offers.filter((f) => f.dateCreate > (lastDate || 0));
      count = offers.length;
    }
    return <MessageCount count={count} />;
  };

  const favoritesShow = () => {
    if (isfavorites) {
      setPartners(partnersAll);
    } else {
      const filteredPartners = partnersAll.filter(
        (partner) =>
          clients.filter((client) => client.partnerId === partner.id).length >
          0,
      );
      setPartners(filteredPartners);
    }
    setIsfavorites(!isfavorites);
  };
  const partnerFind = (item, text) => {
    const name = item.name.toLowerCase(),
      tags = Utils.empty(item.tags) ? null : item.tags.toLowerCase();
    text = text.toLowerCase();
    if (name.indexOf(text) !== -1) return true;
    if (tags) {
      if (tags.indexOf(text) !== -1) return true;
    }

    if (item.offers)
      return (
        item.offers.filter(
          (offer) => offer.title.toLowerCase().indexOf(text) !== -1,
        ).length > 0
      );
    return false;
  };
  const onSearch = (text = '') => {
    if (text.length > 0) {
      const partners = partnersAll.filter((f) => partnerFind(f, text));
      setPartners(partners);
    } else {
      setPartners(partnersAll);
    }

    setSearch(text);
  };

  const tagSelect = (item) => {
    if (item === null) {
      setPartners(partnersAll);
      setTagSelected(null);
    } else {
      const partners = partnersAll.filter((partner) =>
        item.ids.includes(partner.id),
      );
      setPartners(partners);
      setTagSelected(item.title);
    }
  };

  const dataGet = () => {
    Storage.get('currentPosition', (currentPosition) => {
      unreadMessagesGet();
      currentPosition = JSON.parse(currentPosition);
      if (currentPosition === null)
        currentPosition = {latitude: 0, longitude: 0};
      partnersGet(currentPosition.latitude, currentPosition.longitude);
    });
  };
  const refresh = () => {
    setRefreshing(true);
    dataGet();
  };
  const locationSave = (coords) =>
    Storage.set(
      'currentPosition',
      JSON.stringify({latitude: coords.latitude, longitude: coords.longitude}),
    );

  const unreadMessagesGet = () =>
    Storage.get('unreadMessages', (unreadMessages) =>
      setUnreadMessages(JSON.parse(unreadMessages)),
    );
  const partnersGet = (latitude, longitude) => {
    console.log('store', store);
    Partners.nearGet(latitude, longitude, store.userStore.user.id, (res) => {
      const partnerList = res.data.partners,
        clientList = res.data.clients,
        tagList = tagsCollect(partnerList);

      setPartners(partnerList);
      setPartnersAll(partnerList);
      setClients(clientList);
      setTags(tagList);

      setLoading(false);
      setRefreshing(false);
    });
  };
  const locationWatch = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        locationSave(coords);
        partnersGet(coords.latitude, coords.longitude);
      },
      (error) => console.log('watch error', error),
      Platform.OS === 'android'
        ? {}
        : {
            enableHighAccuracy: true,
            distanceFilter: 1,
            useSignificantChanges: true,
            maximumAge: 0,
            timeout: 1000,
          },
    );
  };

  const androidGeoCheck = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Местоположение',
          message: 'Вы сможете видеть информацию о скидках и акциях около вас.',
        },
      ).then((res) => {
        const isGranted = res !== 'granted';

        setForbidden(isGranted);

        if (isGranted) {
          partnersGet(0, 0);
        }
      });
    }
  };
  React.useEffect(() => {
    unreadMessagesGet();
    let focusListener = props.navigation.addListener('didFocus', () => {
      dataGet();
    });
    Geolocation.getCurrentPosition(
      ({coords}) => {
        setForbidden(false);
        locationSave(coords);
        partnersGet(coords.latitude, coords.longitude);
        locationWatch();
      },
      (error) => {
        console.log('current error', error);
        if (Platform.OS === 'android') {
          androidGeoCheck();
        } else {
          setForbidden(true);
          partnersGet(0, 0);
        }
      },
      Platform.OS === 'android' ? {timeout: 15000} : {enableHighAccuracy: true},
    );
    androidGeoCheck();
    return () => {
      focusListener && focusListener.remove();
      watchId.current != null && Geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <Header
        title={isfavorites ? 'Избранное' : 'Предложения рядом'}
        styles={styles}
        context={{
          icon: `<svg viewBox="0 0 24 24"><path fill="${
            isfavorites ? '#c00' : '#ddd'
          }" d="M16.5,3C13.605,3,12,5.09,12,5.09S10.395,3,7.5,3C4.462,3,2,5.462,2,8.5c0,4.171,4.912,8.213,6.281,9.49 C9.858,19.46,12,21.35,12,21.35s2.142-1.89,3.719-3.36C17.088,16.713,22,12.671,22,8.5C22,5.462,19.538,3,16.5,3z"></path></svg>`,
          callback: () => favoritesShow(),
        }}
      />
      {loading ? (
        <Loader styles={styles} />
      ) : (
        <View style={s.container}>
          {forbidden && isfavorites ? (
            <Forbidden
              styles={styles}
              title={`Вы запретили доступ к${'\n'}определению местоположения`}
              comment={
                'Разрешите доступ в настройках, чтобы иметь возможность получать предложения о скидках и акциях по близости с вашим местоположением'
              }
              refresh={() =>
                Platform.OS === 'android' ? geoPermissionsCheck() : null
              }
              refreshText={Platform.OS === 'android' ? 'Обновить данные' : null}
            />
          ) : forbidden === undefined ? null : (
            <View style={s.inner}>
              <SearchBar search={search} onSearch={onSearch} />
              <ScrollView
                style={s.filter}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <AdsTag
                  onPress={() => tagSelect(null)}
                  title="все"
                  isActive={tagSelected === null}
                />
                {tags.map((tag, i) => (
                  <AdsTag
                    key={i}
                    onPress={() => tagSelect(tag)}
                    title={tag.title}
                    isActive={tagSelected === tag.title}
                  />
                ))}
              </ScrollView>
              <KeyboardAvoidingView
                behavior={Platform.select({android: undefined, ios: 'padding'})}
                enabled>
                <FlatList
                  style={s.list}
                  data={partners}
                  renderItem={({item}) => {
                    const avatar = item.imageAvatar
                      ? `${API.assets}partners/${
                          item.imageAvatar
                        }${Utils.uniqueLink()}`
                      : null;
                    return (
                      <AdsPartner
                        onPress={() => gotoActions(item)}
                        imageAvatar={avatar}
                        name={item.name}
                        offers={item.offers}
                        area={item.area}
                        messageCount={messageCountGet(item.id)}
                      />
                    );
                  }}
                  ListEmptyComponent={
                    isfavorites ? (
                      <View style={s.notfound}>
                        <Text style={styles.text}>
                          В Избранном нет ни одной записи
                        </Text>
                      </View>
                    ) : (
                      <View style={s.notfound}>
                        <Text style={styles.text}>
                          Ничего не найдено в выбранной области поиска
                        </Text>
                        {partnersAll.length === 0 ? (
                          <Text
                            style={[
                              styles.text,
                              styles.small,
                              styles.grey,
                              styles.mt10,
                            ]}>
                            Около вас не найдено ни одной акции
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.text,
                              styles.small,
                              styles.grey,
                              styles.mt10,
                            ]}>
                            Смягчите условия поиска или фильтра — задайте запрос
                            по другому или установите более мягкие ограничения.
                          </Text>
                        )}
                      </View>
                    )
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => refresh()}
                    />
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </KeyboardAvoidingView>
            </View>
          )}
        </View>
      )}
      <Tabs styles={styles} page={'ads'} navigation={props.navigation} />
    </View>
  );
};

// start

const {width, height} = Dimensions.get('window');
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

  filter: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  list: {
    width: '100%',
    height: height - (Platform.OS === 'ios' ? 230 : 265),
  },
});

export default AdsScreen;
