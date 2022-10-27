import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from '../../../styles/Styles';
import {SvgXml} from 'react-native-svg';
import {Utils} from '../../../helpers/Index';

export const SettingsUserEdit = ({
  code,
  imagePickerShow,
  image,
  imageErrorHandler,
  name,
  changeName,
  date,
  dateSet,
  save,
  noavatar,
  initials,
}) => {
  return (
    <View style={s.modalcontainer}>
      <Text>{JSON.stringify(date)}</Text>
      <KeyboardAvoidingView
        behavior={Platform.select({
          android: undefined,
          ios: 'padding',
        })}
        enabled>
        <ScrollView>
          <Text style={[styles.text, styles.bold, styles.title, s.subtitle]}>
            Редактирование профиля
          </Text>
          <View style={s.avatarcontainer}>
            {noavatar ? (
              <View style={[s.avatar, s.placeholder]}>
                <Text style={[styles.text, styles.avatartext, styles.white]}>
                  {initials}
                </Text>
              </View>
            ) : (
              <Image
                source={{
                  uri: `${image}${Utils.uniqueLink()}`,
                }}
                style={s.avatar}
                onError={imageErrorHandler}
              />
            )}
            <TouchableOpacity onPress={() => imagePickerShow()} style={s.edit}>
              <SvgXml
                width={40}
                height={40}
                fill={'#000'}
                xml={
                  '<svg width="35" height="35" viewBox="0 0 35 35"><circle cx="17.5" cy="17.5" r="17.5" fill="#fefefe"/><path d="M23.727 10.7189C22.8283 9.76037 21.3713 9.76037 20.4726 10.7189L11.3496 20.4493C11.2871 20.5159 11.2419 20.5986 11.2184 20.6894L10.0187 25.3089C9.96932 25.4983 10.0195 25.7011 10.1497 25.8403C10.2801 25.9792 10.4703 26.0326 10.6479 25.9802L14.9791 24.7004C15.0642 24.6753 15.1417 24.6271 15.2042 24.5605L24.327 14.8299C25.2243 13.8707 25.2243 12.318 24.327 11.3589L23.727 10.7189Z" fill="#007aff"/></svg>'
                }
              />
            </TouchableOpacity>
          </View>
          <View style={s.code}>
            <Text style={[styles.text, styles.grey]}>
              Код клиента <Text style={[styles.bold]}>{code}</Text>
            </Text>
          </View>
          <View style={s.search}>
            <TextInput
              style={[styles.text, s.input]}
              value={name}
              onChangeText={changeName}
              autoCorrect={false}
              placeholder={'Имя'}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <DatePicker
            style={s.search}
            date={date || new Date()}
            mode={'date'}
            placeholder={'Дата окончания предложения'}
            format={'DD.MM.YYYY'}
            confirmBtnText={'Готово'}
            cancelBtnText={'Отмена'}
            customStyles={{
              dateTouchBody: s.datepickertouch,
              dateText: styles.text,
              dateInput: s.input,
              placeholderText: [styles.text, styles.light],
              btnTextConfirm: [styles.text, styles.bold],
              btnTextCancel: [styles.text, styles.light],
            }}
            showIcon={false}
            onDateChange={dateSet}
          />
          <TouchableOpacity style={s.button} onPress={save}>
            <Text style={[styles.text, styles.upper]}>Обновить</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const {width} = Dimensions.get('window');
const s = StyleSheet.create({
  modalcontainer: {
    paddingTop: 40,
  },
  code: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    width: width - 30,
    padding: 15,
    marginTop: 20,
    backgroundColor: '#ffd93e',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  subtitle: {
    marginBottom: 15,
    paddingLeft: 15,
  },
  search: {
    width: width - 30,
    marginLeft: 15,
    marginBottom: 10,
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
  },
  input: {
    alignItems: 'flex-start',
    borderWidth: 0,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  datepicker: {
    width: width - 30,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  datepickertouch: {
    height: 20,
  },
  avatarcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  avatar: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  edit: {
    position: 'absolute',
    opacity: 0.7,
  },
});
