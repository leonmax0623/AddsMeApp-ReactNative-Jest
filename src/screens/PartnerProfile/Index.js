/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  Keyboard,
  Platform,
} from 'react-native';

// plug-ins
import {SvgXml} from 'react-native-svg';
import {TextInputMask} from 'react-native-masked-text';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import DatePicker from 'react-native-datepicker';

// components
import Header from '../../components/Header';
import ClosePopup from '../../components/ClosePopup';
import Loader from '../../components/Loader';

// helpers
import {Areas, Partners} from '../../models/Index';

// helpers
import {Storage, Utils, Geo} from '../../helpers/Index';

// globals
import {API, MAPS} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';

// icons
const icons = {
  check: {
    on:
      '<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#999"/><path d="M6.02155 10.8403L3.03042 7.84918C2.98986 7.80862 2.98986 7.74778 3.03042 7.70722L3.89227 6.84537C3.93283 6.80482 3.99366 6.80482 4.03422 6.84537L6.09252 8.90367L9.96578 5.03042C10.0063 4.98986 10.0672 4.98986 10.1077 5.03042L10.9696 5.89227C11.0101 5.93283 11.0101 5.99366 10.9696 6.03422L6.1635 10.8403C6.12294 10.8809 6.0621 10.8809 6.02155 10.8403Z" fill="white"/></svg>',
    off:
      '<svg viewBox="0 0 15 15"><rect width="15" height="15" rx="2" fill="#999"/></svg>',
  },
};

// start
export default class PartnerProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      area: null,
      areaname: null,
      areas: [],
      areasAll: [],
      name: null,
      email: null,
      phoneContact: null,
      info: null,
      web: null,
      webVK: null,
      webFB: null,
      webOK: null,
      webInstagram: null,
      webTelegram: null,
      workTime1: null,
      workTime1End: null,
      workTime1Free: false,
      workTime2: null,
      workTime2End: null,
      workTime2Free: false,
      workTime3: null,
      workTime3End: null,
      workTime3Free: false,
      workTime4: null,
      workTime4End: null,
      workTime4Free: false,
      workTime5: null,
      workTime5End: null,
      workTime5Free: false,
      workTime6: null,
      workTime6End: null,
      workTime16Free: false,
      workTime7: null,
      workTime7End: null,
      workTime7Free: false,
      address: null,
      latitude: null,
      longitude: null,
      imageavatar: null,
      imageavatardata: null,
      imageavatartype: null,
      imagecover: null,
      imagecoverdata: null,
      imagecovertype: null,
      modalVisible: false,
      isareas: false,
      ismap: false,
      loading: true,
    };
  }
  componentDidMount = () => {
    Storage.get('user', (user) => {
      if (Utils.empty(user)) {
        Storage.set('startScreen', 'Start');
        this.props.navigation.navigate('Start');
      } else {
        user = JSON.parse(user);
        this.setState({user});
        Storage.get('areas', (areas) => {
          if (areas) {
            areas = JSON.parse(areas);
            this.setState({areas, areasAll: areas});
          } else {
            Areas.get((res) => {
              let areas = this.dataPrepare(res.data);
              this.setState({areas, areasAll: areas});
              Storage.set('areas', JSON.stringify(areas));
            });
          }
        });
        this.setState({
          name: user.name,
          areaId: user.areaId,
          areaname: user.area,
          email: user.email,
          phoneContact: user.phoneContact,
          info: user.info,
          tags: user.tags,
          web: user.web,
          webVK: user.webVK,
          webFB: user.webFB,
          webOK: user.webOK,
          webInstagram: user.webInstagram,
          webTelegram: user.webTelegram,
          workTime1: user.workTime1,
          workTime1End: user.workTime1End,
          workTime1Free: Utils.empty(user.workTime1),
          workTime2: user.workTime2,
          workTime2End: user.workTime2End,
          workTime2Free: Utils.empty(user.workTime2),
          workTime3: user.workTime3,
          workTime3End: user.workTime3End,
          workTime3Free: Utils.empty(user.workTime3),
          workTime4: user.workTime4,
          workTime4End: user.workTime4End,
          workTime4Free: Utils.empty(user.workTime4),
          workTime5: user.workTime5,
          workTime5End: user.workTime5End,
          workTime5Free: Utils.empty(user.workTime5),
          workTime6: user.workTime6,
          workTime6End: user.workTime5End,
          workTime6Free: Utils.empty(user.workTime6),
          workTime7: user.workTime7,
          workTime7End: user.workTime7End,
          workTime7Free: Utils.empty(user.workTime7),
          address: user.address,
          latitude: user.latitude,
          longitude: user.longitude,
          imageavatar: !Utils.empty(user.imageAvatar)
            ? `${API.assets}partners/${user.imageAvatar}${Utils.uniqueLink()}`
            : null,
          imagecover: !Utils.empty(user.imageCover)
            ? `${API.assets}partners/${user.imageCover}${Utils.uniqueLink()}`
            : null,
        });
        if (user.latitude === 0 || user.longitude === 0) {
          Geolocation.getCurrentPosition(
            ({coords}) => {
              const {latitude, longitude} = coords;
              this.setState({
                latitude,
                longitude,
                region: {
                  latitude,
                  longitude,
                  latitudeDelta: MAPS.deltas.latitude,
                  longitudeDelta: MAPS.deltas.longitude,
                },
                loading: false,
              });
            },
            (error) => {},
            Platform.OS === 'android'
              ? {timeout: 15000}
              : {enableHighAccuracy: true},
          );
        } else this.setState({loading: false});
      }
    });
  };
  dataPrepare = (data) => {
    let areas = [];
    data.forEach((v) => {
      if (v.parentId === 0) {
        areas.push(v);
        let childs = data.filter((f) => f.parentId === v.id);
        areas = [...areas, ...childs];
      }
    });
    return areas;
  };
  modalShow = (modalVisible) => {
    Keyboard.dismiss();
    this.setState({modalVisible});
  };
  imagePickerShow = (iscover) => {
    const options = {
      title: null,
      cancelButtonTitle: 'Отмена',
      takePhotoButtonTitle: 'Открыть камеру',
      chooseFromLibraryButtonTitle: 'Выбрать из галереи',
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      tintColor: '#4a86cc',
      permissionDenied: {
        title: 'Нет доступа к камере',
        text:
          'Для того чтобы иметь возможность снимать фото или видео, перейдите в Настройки и разрешите доступ к камере',
        reTryTitle: 'Повторить',
        okTitle: 'ОК',
      },
      maxWidth: 500,
      maxHeight: 500,
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (!response.didCancel && !response.error) {
        if (iscover)
          this.setState({
            imagecover: response.uri,
            imagecoverdata: response.data,
            imagecovertype: this.imageExtGet(response.type),
          });
        else
          this.setState({
            imageavatar: response.uri,
            imageavatardata: response.data,
            imageavatartype: this.imageExtGet(response.type),
          });
      }
    });
  };
  imageExtGet = (ext) => {
    ext = ext.replace('image/', '');
    return ext === 'jpeg' ? 'jpg' : ext;
  };
  imageError = () => this.setState({noimage: true});
  areasShow = () =>
    this.setState({isareas: true, ismap: false}, () => this.modalShow(true));
  mapShow = () =>
    this.setState({isareas: false, ismap: true}, () => this.modalShow(true));
  search = (text) => {
    if (text.length > 0) {
      let data = this.state.areasAll.filter(
          (f) => f.name.toLowerCase().indexOf(text.toLowerCase()) !== -1,
        ),
        areas = [];
      data.forEach((v) => {
        if (v.parentId === 0) areas.push(v);
        else {
          let parent = areas.filter((f) => f.id === v.parentId);
          if (parent.length === 0) {
            parent = this.state.areasAll.filter((f) => f.id === v.parentId);
            areas.push(parent[0]);
          }
          areas.push(v);
        }
      });
      this.setState({areas});
    } else this.setState({areas: this.state.areasAll});
  };
  workTimeCheck = (value) => {
    let parts = value.split(':');
    let hour = parts[0],
      minutes = parts[1];
    if (hour > 23) return null;
    if (minutes > 59) return null;
    return value;
  };
  areaSelect = (area) => {
    let areaname = area.name;
    if (area.parentId !== 0) {
      let parent = this.state.areasAll.filter((f) => f.id === area.parentId);
      if (parent.length > 0) areaname = `${parent[0].name}: ${areaname}`;
    }
    this.setState({area, areaname}, () => this.modalShow(false));
  };
  regionGet = () => {
    const region = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: MAPS.deltas.latitude,
      longitudeDelta: MAPS.deltas.longitude,
    };
    return region;
  };
  regionChange = (region) => this.locationNameGet(region);
  addressSet = () =>
    this.setState(
      {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        address: this.state.region.address,
      },
      () => this.modalShow(false),
    );
  locationNameGet = (coords) =>
    Geo.get(coords.latitude, coords.longitude, (address) => {
      const region = {
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      this.setState({region});
    });
  workTimeFree = (day) =>
    this.setState({[`workTime${day}Free`]: !this.state[`workTime${day}Free`]});
  save = () => {
    const {user} = this.state;
    if (Utils.empty(this.state.name)) return;
    let data = {
      name: this.state.name,
      areaId: this.state.areaId,
      areaname: this.state.area,
      email: this.state.email,
      phoneContact: this.state.phoneContact,
      info: this.state.info,
      tags: this.state.tags,
      web: this.state.web,
      webVK: this.state.webVK,
      webFB: this.state.webFB,
      webOK: this.state.webOK,
      webInstagram: this.state.webInstagram,
      webTelegram: this.state.webTelegram,
      workTime1: this.state.workTime1Free ? '' : this.state.workTime1,
      workTime1End: this.state.workTime1Free ? '' : this.state.workTime1End,
      workTime2: this.state.workTime2ree ? '' : this.state.workTime2,
      workTime2End: this.state.workTime2Free ? '' : this.state.workTime2End,
      workTime3: this.state.workTime3Free ? '' : this.state.workTime3,
      workTime3End: this.state.workTime3Free ? '' : this.state.workTime3End,
      workTime4: this.state.workTime4Free ? '' : this.state.workTime4,
      workTime4End: this.state.workTime4Free ? '' : this.state.workTime4End,
      workTime5: this.state.workTime5Free ? '' : this.state.workTime5,
      workTime5End: this.state.workTime5Free ? '' : this.state.workTime5End,
      workTime6: this.state.workTime6Free ? '' : this.state.workTime6,
      workTime6End: this.state.workTime6Free ? '' : this.state.workTime5End,
      workTime7: this.state.workTime7Free ? '' : this.state.workTime7,
      workTime7End: this.state.workTime7Free ? '' : this.state.workTime7End,
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    if (this.state.imageavatardata) {
      data.imageAvatar = `partner_${user.id}_1.${this.state.imageavatartype}`;
      Partners.imageAdd(
        user.id,
        this.state.imageavatartype,
        1,
        this.state.imageavatardata,
      );
    }
    if (this.state.imagecoverdata) {
      data.imageCover = `partner_${user.id}_2.${this.state.imagecovertype}`;
      Partners.imageAdd(
        user.id,
        this.state.imagecovertype,
        2,
        this.state.imagecoverdata,
      );
    }
    Partners.update(user.id, data, () => {
      Partners.get(user.id, (res) => {
        Storage.set('user', JSON.stringify(res.data[0]));
        Alert.alert(
          'Успех!',
          'Информация обновлена успешно',
          [{text: 'Хорошо', onPress: () => this.props.navigation.goBack()}],
          {cancelable: false},
        );
      });
    });
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title={'Редактирование профиля'}
          navigation={this.props.navigation}
          styles={styles}
        />
        {this.state.loading ? (
          <Loader styles={styles} />
        ) : (
          <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.select({android: undefined, ios: 'padding'})}
            enabled>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}>
              {this.state.ismap && (
                <View style={s.container}>
                  <MapView
                    ref={(map) => (this.map = map)}
                    provider={PROVIDER_GOOGLE}
                    style={s.map}
                    initialRegion={this.regionGet()}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    zoomControlEnabled={false}
                    toolbarEnabled={false}
                    showsUserLocation={false}
                    onRegionChangeComplete={this.regionChange}
                  />
                  <View style={s.marker}>
                    <SvgXml
                      width={36}
                      height={36}
                      xml={
                        '<svg viewBox="0 0 30 38"><ellipse opacity="0.2" cx="15" cy="36.1" rx="8.75" ry="1.9" fill="black"/><ellipse cx="14.75" cy="14.9077" rx="6" ry="6.04102" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 14.6935C0 18.5586 1.49676 21.8986 4.3934 25.7817C7.02217 29.3057 12.3772 33.387 14.4686 34.8364C14.7193 35.0102 14.8447 35.097 14.9997 35.097C15.1547 35.0969 15.2801 35.0099 15.531 34.8358C17.6203 33.3858 22.9841 29.3051 25.6066 25.7817C28.4968 21.8987 30 18.5586 30 14.6935C30 10.8284 28.5355 7.3724 25.6066 4.42344C19.7487 -1.47448 10.2513 -1.47448 4.3934 4.42344C1.46447 7.3724 0 10.8284 0 14.6935ZM14.9999 19C17.071 19 18.7499 17.2987 18.7499 15.2C18.7499 13.1013 17.071 11.4 14.9999 11.4C12.9289 11.4 11.2499 13.1013 11.2499 15.2C11.2499 17.2987 12.9289 19 14.9999 19Z" fill="#D71B39"/></svg>'
                      }
                    />
                  </View>
                  {this.state.region ? (
                    <View style={s.mapaddress}>
                      <Text style={styles.text}>
                        {this.state.region.address}
                      </Text>
                      <TouchableOpacity
                        style={s.mapbutton}
                        onPress={() => this.addressSet()}>
                        <Text style={[styles.text, styles.middle]}>
                          Выбрать
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
              {this.state.isareas && (
                <View style={[s.container, s.modalcontainer]}>
                  <Text
                    style={[
                      styles.text,
                      styles.bold,
                      styles.title,
                      s.subtitle,
                    ]}>
                    Выберите сферу деятельности
                  </Text>
                  <View style={s.search}>
                    <TextInput
                      style={styles.text}
                      onChangeText={this.search}
                      autoCorrect={false}
                      placeholder={'Поиск'}
                      underlineColorAndroid={'transparent'}
                    />
                    <SvgXml
                      width={16}
                      height={16}
                      fill={'#9a9a9b'}
                      style={s.searchicon}
                      xml={
                        '<svg viewBox="0 0 50 50"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>'
                      }
                    />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.select({
                      android: undefined,
                      ios: 'padding',
                    })}
                    enabled>
                    <FlatList
                      style={s.list}
                      data={this.state.areas}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => this.areaSelect(item)}
                          style={s.item}>
                          {item.parentId === 0 ? (
                            <Text
                              style={[styles.text, styles.bold]}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                          ) : (
                            <Text
                              style={[styles.text, {marginLeft: 10}]}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </KeyboardAvoidingView>
                </View>
              )}
              <ClosePopup callback={() => this.modalShow(false)} />
            </Modal>
            <ScrollView style={s.form}>
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Название
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.name}
                onChangeText={(name) => this.setState({name})}
                autoCorrect={false}
                placeholder={'Название вашей организации'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Сфера деятельности
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.areaname}
                placeholder={'Сфера деятельности'}
                onFocus={this.areasShow}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Телефон
              </Text>
              <TextInputMask
                type={'custom'}
                options={{
                  keyboardType: 'cel-phone',
                  mask: '+7 (999) 999-99-99',
                }}
                maxLength={18}
                keyboardType="phone-pad"
                textContentType="username"
                onChangeText={(phoneContact) => this.setState({phoneContact})}
                value={this.state.phoneContact}
                placeholder="Контактный номер телефона"
                style={[styles.text, s.input]}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Адрес электронной почты
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
                autoCorrect={false}
                keyboardType="email-address"
                placeholder={'Адрес электронной почты'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Тэги
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.tags}
                onChangeText={(tags) => this.setState({tags})}
                autoCorrect={false}
                placeholder={'Тэги, через зяпятую'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Описание
              </Text>
              <TextInput
                style={[styles.text, s.input, s.textarea]}
                value={this.state.info}
                onChangeText={(info) => this.setState({info})}
                multiline={true}
                placeholder={'Описание'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Адрес
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.address}
                placeholder={'Адрес организации'}
                onFocus={this.mapShow}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Изображение логотипа
              </Text>
              <View style={s.imagecontainer}>
                {this.state.imageavatar ? (
                  <Lightbox
                    renderContent={() => (
                      <Image
                        style={s.imageFullScreen}
                        source={{uri: this.state.imageavatar}}
                      />
                    )}>
                    <Image
                      source={{uri: this.state.imageavatar}}
                      style={s.image}
                    />
                  </Lightbox>
                ) : (
                  <View style={[s.image, s.placeholder]}></View>
                )}
                <TouchableOpacity
                  onPress={() => this.imagePickerShow(false)}
                  style={s.edit}>
                  <SvgXml
                    width={40}
                    height={40}
                    fill={'#000'}
                    xml={
                      '<svg viewBox="0 0 35 35"><circle cx="17.5" cy="17.5" r="17.5" fill="#fefefe"/><path d="M23.727 10.7189C22.8283 9.76037 21.3713 9.76037 20.4726 10.7189L11.3496 20.4493C11.2871 20.5159 11.2419 20.5986 11.2184 20.6894L10.0187 25.3089C9.96932 25.4983 10.0195 25.7011 10.1497 25.8403C10.2801 25.9792 10.4703 26.0326 10.6479 25.9802L14.9791 24.7004C15.0642 24.6753 15.1417 24.6271 15.2042 24.5605L24.327 14.8299C25.2243 13.8707 25.2243 12.318 24.327 11.3589L23.727 10.7189Z" fill="#007aff"/></svg>'
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Изображение обложки
              </Text>
              <View style={s.imagecontainer}>
                {this.state.imagecover ? (
                  <Lightbox
                    renderContent={() => (
                      <Image
                        style={s.imageFullScreen}
                        source={{uri: this.state.imagecover}}
                      />
                    )}>
                    <Image
                      source={{uri: this.state.imagecover}}
                      style={s.image}
                    />
                  </Lightbox>
                ) : (
                  <View style={[s.image, s.placeholder]}></View>
                )}
                <TouchableOpacity
                  onPress={() => this.imagePickerShow(true)}
                  style={s.edit}>
                  <SvgXml
                    width={40}
                    height={40}
                    fill={'#000'}
                    xml={
                      '<svg viewBox="0 0 35 35"><circle cx="17.5" cy="17.5" r="17.5" fill="#fefefe"/><path d="M23.727 10.7189C22.8283 9.76037 21.3713 9.76037 20.4726 10.7189L11.3496 20.4493C11.2871 20.5159 11.2419 20.5986 11.2184 20.6894L10.0187 25.3089C9.96932 25.4983 10.0195 25.7011 10.1497 25.8403C10.2801 25.9792 10.4703 26.0326 10.6479 25.9802L14.9791 24.7004C15.0642 24.6753 15.1417 24.6271 15.2042 24.5605L24.327 14.8299C25.2243 13.8707 25.2243 12.318 24.327 11.3589L23.727 10.7189Z" fill="#007aff"/></svg>'
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Время работы
              </Text>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Понедельник</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime1Free ? null : this.state.workTime1
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime1) =>
                      this.setState({workTime1: this.workTimeCheck(workTime1)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime1Free ? null : this.state.workTime1End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime1End) =>
                      this.setState({
                        workTime1End: this.workTimeCheck(workTime1End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(1)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime1Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Вторник</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime2Free ? null : this.state.workTime2
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime2) =>
                      this.setState({workTime2: this.workTimeCheck(workTime2)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime2Free ? null : this.state.workTime2End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime2End) =>
                      this.setState({
                        workTime2End: this.workTimeCheck(workTime2End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(2)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime2Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Среда</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime3Free ? null : this.state.workTime3
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime3) =>
                      this.setState({workTime3: this.workTimeCheck(workTime3)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime3Free ? null : this.state.workTime3End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime3End) =>
                      this.setState({
                        workTime3End: this.workTimeCheck(workTime3End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(3)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime3Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Четверг</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime4Free ? null : this.state.workTime4
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime4) =>
                      this.setState({workTime4: this.workTimeCheck(workTime4)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime4Free ? null : this.state.workTime4End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime4End) =>
                      this.setState({
                        workTime4End: this.workTimeCheck(workTime4End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(4)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime4Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Пятница</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime5Free ? null : this.state.workTime5
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime5) =>
                      this.setState({workTime5: this.workTimeCheck(workTime5)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime5Free ? null : this.state.workTime5End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime5End) =>
                      this.setState({
                        workTime5End: this.workTimeCheck(workTime5End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(5)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime5Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Суббота</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime6Free ? null : this.state.workTime6
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime6) =>
                      this.setState({workTime6: this.workTimeCheck(workTime6)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime6Free ? null : this.state.workTime6End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime6End) =>
                      this.setState({
                        workTime6End: this.workTimeCheck(workTime6End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(6)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime6Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.onelinetop}>
                <Text style={[styles.text]}>Воскресенье</Text>
                <View style={[s.onelinetop, s.hours]}>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime7Free ? null : this.state.workTime7
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, s.inputdata],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime7) =>
                      this.setState({workTime7: this.workTimeCheck(workTime7)})
                    }
                  />
                  <Text style={[styles.text]}>— </Text>
                  <DatePicker
                    style={s.worktime}
                    date={
                      this.state.workTime7Free ? null : this.state.workTime7End
                    }
                    mode={'time'}
                    placeholder={'Время'}
                    format={'HH:mm'}
                    confirmBtnText={'Готово'}
                    cancelBtnText={'Отмена'}
                    customStyles={{
                      dateTouchBody: s.datepickertouch,
                      dateText: styles.text,
                      dateInput: [s.input, {marginBottom: 0, paddingBottom: 0}],
                      placeholderText: [styles.text, styles.light],
                      btnTextConfirm: [styles.text, styles.bold],
                      btnTextCancel: [styles.text, styles.light],
                    }}
                    showIcon={false}
                    onDateChange={(workTime7End) =>
                      this.setState({
                        workTime7End: this.workTimeCheck(workTime7End),
                      })
                    }
                  />
                  <TouchableOpacity onPress={() => this.workTimeFree(7)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={
                        this.state.workTime7Free
                          ? icons.check.on
                          : icons.check.off
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={[
                  styles.text,
                  styles.small,
                  styles.grey,
                  styles.mt10,
                  styles.mb10,
                ]}>
                Для установки режима работы "круглосуточно" установите время
                "00:00 - 00:00"
              </Text>
              <Text
                style={[
                  styles.text,
                  styles.small,
                  styles.grey,
                  styles.mt10,
                  styles.mb10,
                ]}>
                Для режима "выходной" поставьте галочку
              </Text>
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                WEB-сайт
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.web}
                onChangeText={(web) => this.setState({web})}
                autoCorrect={false}
                keyboardType="url"
                placeholder={'WEB-сайт'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Группа/страница в Вконтакте
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.webVK}
                onChangeText={(webVK) => this.setState({webVK})}
                autoCorrect={false}
                placeholder={'Группа/страница в Вконтакте'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Группа/страница в Facebook
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.webFB}
                onChangeText={(webFB) => this.setState({webFB})}
                autoCorrect={false}
                placeholder={'Группа/страница в Facebook'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Группа/страница в Одноклассниках
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.webOK}
                onChangeText={(webOK) => this.setState({webOK})}
                autoCorrect={false}
                placeholder={'Группа/страница в Одноклассниках'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Профиль в Instagram
              </Text>
              <TextInput
                style={[styles.text, s.input]}
                value={this.state.webInstagram}
                onChangeText={(webInstagram) => this.setState({webInstagram})}
                autoCorrect={false}
                placeholder={'Профиль в Instagram'}
                underlineColorAndroid={'transparent'}
              />
              <Text style={[styles.text, styles.middle, styles.light, s.label]}>
                Канал/группа в Talegram
              </Text>
              <TextInput
                style={[styles.text, s.input, {marginBottom: 50}]}
                value={this.state.webTelegram}
                onChangeText={(webTelegram) => this.setState({webTelegram})}
                autoCorrect={false}
                placeholder={'Канал/группа в Talegram'}
                underlineColorAndroid={'transparent'}
              />
            </ScrollView>
            <View style={s.buttonblock}>
              <TouchableOpacity style={s.button} onPress={() => this.save()}>
                <Text style={[styles.text, styles.upper]}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalcontainer: {
    paddingTop: 40,
    marginHorizontal: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 10,
    width: '100%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#3b3b3b',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    alignItems: 'flex-start',
  },
  textarea: {
    maxHeight: 200,
  },
  worktime: {
    width: 50,
  },
  buttonblock: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    width: width - 30,
    padding: 15,
    backgroundColor: '#ffd93e',
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
  },
  oneline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onelinetop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hours: {
    width: 160,
  },
  imagecontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    height: 100,
  },
  image: {
    width: width - 40,
    height: 100,
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
  edit: {
    position: 'absolute',
    opacity: 0.7,
  },
  imageFullScreen: {
    flex: 1,
    resizeMode: 'contain',
  },
  subtitle: {
    marginBottom: 20,
  },
  search: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 10 : 0,
    paddingLeft: 35,
    paddingRight: 15,
  },
  searchicon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 17,
    left: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  list: {
    height: height - 140,
  },
  mapaddress: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -18,
    marginTop: -18,
  },
  mapbutton: {
    padding: 10,
    backgroundColor: '#ffd93e',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datepicker: {
    width: 40,
  },
  datepickertouch: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    borderWidth: 0,
  },
  inputdata: {
    marginBottom: 0,
    paddingBottom: 0,
  },
});
