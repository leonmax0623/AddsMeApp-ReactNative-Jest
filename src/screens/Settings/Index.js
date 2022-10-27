/*
 * adsme
 * (c) pavit.design, 2020
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';

// plug-ins
import {SvgXml} from 'react-native-svg';
import ImagePicker from 'react-native-image-picker';

// components
import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import Loader from '../../components/Loader';
import ClosePopup from '../../components/ClosePopup';
import {QrInfo} from './components/QrInfo';
import {SettingsItem} from './components/SettingsItem';
import {SettingsUserEdit} from './components/SettingsEditUser';

// modeles
import {Clients} from '../../models/Index';

// helpers
import {Utils, Storage} from '../../helpers/Index';

// globals
import {API} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';
import store from '../../store';
import {SettingsUserInfo} from './components/SettingsUserInfo';

// icons

const SettingsScreen = (props) => {
  const user = store.userStore.user;
  const [name, setName] = React.useState('');
  const [birthday, setBirthday] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [noavatar, setNoavatar] = React.useState(false);
  const [imagedata, setImagedata] = React.useState(null);
  const [imagetype, setImagetype] = React.useState(null);
  const [isqr, setIsqr] = React.useState(false);
  const [isedit, setIsedit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const gotoPermissions = () =>
    props.navigation.navigate('SettingsPermissions');
  const gotoRemove = () => props.navigation.navigate('SettingsRemove');
  const modalShow = (visible) => {
    setModalVisible(visible);
    if (!visible) {
      setIsedit(false);
      setIsqr(false);
    }
  };

  const qrShow = () => {
    setIsqr(true);
    modalShow(true);
  };
  const editShow = () => {
    setIsedit(true);
    modalShow(true);
  };
  const imageErrorHandler = () => {
    setNoavatar(true);
  };
  const initialsGet = (name) => {
    name = name.split(' ');
    return Utils.initialsGet(name[0], name[1]);
  };
  const imagePickerShow = () => {
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
        setImage(response.uri);
        setImagedata(response.data);
        setImagetype(imageExtGet(response.type));
        setNoavatar(false);
      }
    });
  };
  const imageExtGet = (ext) => {
    ext = ext.replace('image/', '');
    return ext === 'jpeg' ? 'jpg' : ext;
  };
  const changeName = (value) => {
    setName(value);
  };
  const dateSet = (date) => {
    const d = date.split('.'),
      ts = new Date(`${d[2]}-${d[1]}-${d[0]}`).getTime();
    const roundedTimestamp = Math.round(ts / 1000);
    setBirthday(roundedTimestamp);
    setDate(date);
  };
  const save = () => {
    let data = {
      ...user,
      name,
    };
    if (birthday !== undefined) data.birthDay = birthday;
    if (imagedata) {
      data.imageAvatar = `client_${user.id}.${imagetype}`;
      Clients.imageAdd(user.id, imagetype, imagedata);
    }
    Clients.update(user.id, data);
    Storage.set('user', JSON.stringify(user));
    store.userStore.setUser(data);
    Alert.alert(
      'Успех!',
      'Информация обновлена успешно',
      [{text: 'Хорошо', onPress: () => modalShow(false)}],
      {cancelable: false},
    );
  };
  React.useEffect(() => {
    Clients.get(user.id, (userData) => {
      const imageUrl = `${API.assets}clients/client_${userData.id}.jpg`;

      setLoading(false);
      setImage(imageUrl);
      setName(user.name);
      setBirthday(user.birthDay);
      setDate(new Date(user.birthDay * 1000));
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      <Header
        title={''}
        styles={styles}
        context={{
          icon:
            '<svg viewBox="0 0 16 16"><path d="M 8 2 C 6.347656 2 5 3.347656 5 5 C 5 6.652344 6.347656 8 8 8 C 9.652344 8 11 6.652344 11 5 C 11 3.347656 9.652344 2 8 2 Z M 8 8 C 5.242188 8 3 10.242188 3 13 L 4 13 C 4 10.792969 5.792969 9 8 9 C 8.929688 9 9.773438 9.332031 10.453125 9.859375 L 11.152344 9.148438 C 10.289063 8.445313 9.199219 8 8 8 Z M 8 3 C 9.109375 3 10 3.890625 10 5 C 10 6.109375 9.109375 7 8 7 C 6.890625 7 6 6.109375 6 5 C 6 3.890625 6.890625 3 8 3 Z M 14.203125 8.003906 C 13.878906 8.007813 13.554688 8.132813 13.3125 8.382813 L 8.648438 13.125 L 7.953125 16.046875 L 10.875 15.355469 L 10.972656 15.253906 L 15.621094 10.6875 C 16.117188 10.203125 16.125 9.386719 15.628906 8.894531 L 15.105469 8.367188 C 14.859375 8.121094 14.53125 8 14.203125 8.003906 Z M 14.210938 8.996094 C 14.277344 8.996094 14.34375 9.023438 14.398438 9.078125 L 14.921875 9.601563 C 15.03125 9.707031 15.03125 9.867188 14.921875 9.976563 L 10.375 14.441406 L 9.296875 14.703125 L 9.554688 13.625 L 14.027344 9.078125 C 14.078125 9.023438 14.144531 8.996094 14.210938 8.996094 Z"></path></svg>',
          callback: () => editShow(),
        }}
      />
      {loading ? (
        <Loader styles={styles} />
      ) : (
        <View style={s.container}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}>
            {isedit ? (
              <SettingsUserEdit
                name={name}
                changeName={changeName}
                date={date}
                dateSet={dateSet}
                code={Utils.codeFormatter(user.code)}
                image={image}
                imageErrorHandler={imageErrorHandler}
                imagePickerShow={imagePickerShow}
                noavatar={noavatar}
                initials={initialsGet(user.name)}
                save={save}
              />
            ) : null}
            {isqr ? <QrInfo code={user.code} /> : null}
            <ClosePopup callback={() => modalShow(false)} />
          </Modal>
          <View style={s.container}>
            <SettingsUserInfo
              name={user.name}
              image={image}
              phone={user.phone}
              birthday={birthday}
              noavatar={noavatar}
              imageErrorHandler={imageErrorHandler}
              initials={initialsGet(user.name)}
            />
            <View style={s.lists}>
              <SettingsItem
                onPress={gotoPermissions}
                text="Настройки приватности"
              />

              <TouchableOpacity
                style={[s.oneline, s.item]}
                onPress={() => qrShow()}>
                <Text style={styles.text}>
                  Мой код клиента:{' '}
                  <Text style={styles.bold}>
                    {Utils.codeFormatter(user.code)}
                  </Text>
                </Text>
                <SvgXml
                  width={20}
                  height={20}
                  fill={'#9a9a9b'}
                  xml={
                    '<svg viewBox="0 0 16 16"><path d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 4.5 C 1 5.324219 1.675781 6 2.5 6 L 3 6 L 3 7 L 4 7 L 4 6 L 4.5 6 C 5.324219 6 6 5.324219 6 4.5 L 6 2.5 C 6 1.675781 5.324219 1 4.5 1 Z M 4 7 L 4 8 L 5 8 L 5 7 Z M 4 8 L 3 8 L 3 9 L 4 9 Z M 3 8 L 3 7 L 2 7 L 2 8 Z M 11.5 1 C 10.675781 1 10 1.675781 10 2.5 L 10 4.5 C 10 5.324219 10.675781 6 11.5 6 L 12 6 L 12 7 L 13 7 L 13 6 L 13.5 6 C 14.324219 6 15 5.324219 15 4.5 L 15 2.5 C 15 1.675781 14.324219 1 13.5 1 Z M 13 7 L 13 8 L 14 8 L 14 7 Z M 13 8 L 12 8 L 12 9 L 13 9 Z M 13 9 L 13 10 L 14 10 L 14 9 Z M 13 10 L 12 10 L 12 11 L 13 11 Z M 12 10 L 12 9 L 11 9 L 11 10 Z M 2.5 2 L 4.5 2 C 4.78125 2 5 2.21875 5 2.5 L 5 4.5 C 5 4.78125 4.78125 5 4.5 5 L 2.5 5 C 2.21875 5 2 4.78125 2 4.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 8 2 L 8 3 L 7 3 L 7 4 L 8 4 L 8 5 L 9 5 L 9 2 Z M 11.5 2 L 13.5 2 C 13.78125 2 14 2.21875 14 2.5 L 14 4.5 C 14 4.78125 13.78125 5 13.5 5 L 11.5 5 C 11.21875 5 11 4.78125 11 4.5 L 11 2.5 C 11 2.21875 11.21875 2 11.5 2 Z M 3 3 L 3 4 L 4 4 L 4 3 Z M 12 3 L 12 4 L 13 4 L 13 3 Z M 6 6 L 6 7 L 9 7 L 9 8 L 10 8 L 10 6 Z M 7 8 L 7 9 L 6 9 L 6 10 L 10 10 L 10 9 L 8 9 L 8 8 Z M 2.5 10 C 1.675781 10 1 10.675781 1 11.5 L 1 13.5 C 1 14.324219 1.675781 15 2.5 15 L 4.5 15 C 5.324219 15 6 14.324219 6 13.5 L 6 11.5 C 6 10.675781 5.324219 10 4.5 10 Z M 2.5 11 L 4.5 11 C 4.78125 11 5 11.21875 5 11.5 L 5 13.5 C 5 13.78125 4.78125 14 4.5 14 L 2.5 14 C 2.21875 14 2 13.78125 2 13.5 L 2 11.5 C 2 11.21875 2.21875 11 2.5 11 Z M 7 11 L 7 14 L 8 14 L 8 11 Z M 3 12 L 3 13 L 4 13 L 4 12 Z M 10 12 L 10 13 L 11 13 L 11 12 Z M 11 13 L 11 14 L 12 14 L 12 13 Z M 12 13 L 13 13 L 13 12 L 12 12 Z M 13 13 L 13 14 L 14 14 L 14 13 Z"></path></svg>'
                  }
                />
              </TouchableOpacity>
              <SettingsItem onPress={gotoRemove} text="Выйти из аккаунта" />
            </View>
          </View>
        </View>
      )}
      <Tabs styles={styles} page={'settings'} navigation={props.navigation} />
    </View>
  );
};
export default SettingsScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalcontainer: {
    paddingTop: 40,
  },

  lists: {
    padding: 6,
    marginTop: 10,
  },
  item: {
    padding: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  oneline: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
