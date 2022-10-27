/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

// components
import GoBack from '../../components/GoBack';

// models
import {Partners, Clients} from '../../models/Index';

// helpers
import {Utils, Storage, Dates} from '../../helpers/Index';

// styles
import styles from '../../styles/Styles';
import store from '../../store';

// start
export default class SmsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: this.props.navigation.getParam('phone'),
      ismerchant: this.props.navigation.getParam('ismerchant'),
      data: this.props.navigation.getParam('data'),
      sms: null,
    };
  }
  smsCheck = () => {
    let {code, data, ismerchant} = this.state,
      phone = Utils.phoneNormalize(this.state.phone);
    if (Utils.empty(code) || code.length !== 4) return;
    if (ismerchant) {
      Partners.smsCheck(phone, code, (res) => {
        if (!res) {
          this.smsError();
          return;
        }
        if (data === null)
          this.props.navigation.navigate('Register', {phone, ismerchant});
        else {
          Storage.set('user', JSON.stringify(data));
          store.userStore.setUser(data);

          const screen =
            data.dateTill && data.dateTill < Dates.now() ? 'Stop' : 'Partner';
          Storage.set('startScreen', screen);
          this.props.navigation.navigate(screen);
        }
      });
    } else {
      Clients.smsCheck(phone, code, (res) => {
        if (!res) {
          this.smsError();
          return;
        }
        if (data === null)
          this.props.navigation.navigate('Register', {phone, ismerchant});
        else {
          Storage.set('user', JSON.stringify(data));
          store.userStore.setUser(data);

          Storage.set('startScreen', 'Ads');
          this.props.navigation.navigate('Ads');
        }
      });
    }
  };
  smsError = () =>
    Alert.alert(
      'Ошибка!',
      'Вы ввели неправильный код из СМС',
      [{text: 'Понятно', onPress: () => {}}],
      {cancelable: false},
    );
  render() {
    return (
      <View style={styles.wrapper}>
        <GoBack navigation={this.props.navigation} noheader={true} />
        <View style={s.container}>
          <View style={s.title}>
            <Text
              style={[styles.text, styles.bold, styles.title, styles.center]}>
              Код из СМС
            </Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={[styles.text, s.input]}
              value={this.state.code}
              onChangeText={(code) => this.setState({code})}
              autoCorrect={false}
              maxLength={4}
              placeholder={'4 цифры'}
              keyboardType="numeric"
              autoFocus={true}
              underlineColorAndroid={'transparent'}
            />
            <View style={styles.mt10}>
              <Text style={[styles.text, styles.grey, styles.small]}>
                На номер{' '}
                <Text style={styles.bold}>
                  {Utils.phoneFormatter(this.state.phone)}
                </Text>{' '}
                был отправлен код подтверждения, если вы не получили СМС с
                кодом, то вернитесь назад и снова введите номер телефона.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.smsCheck()}
              style={styles.mt20}>
              <View style={[styles.button]}>
                <Text style={[styles.text, styles.white, styles.upper]}>
                  Войти
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#3b3b3b',
    borderBottomWidth: 1,
  },
});
