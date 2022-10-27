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
  Switch,
  TextInput,
} from 'react-native';

// plug-ins
import {SvgXml} from 'react-native-svg';

// components
import Header from '../../components/Header';

// modeles
import {Partners} from '../../models/Index';

// helpers
import {Storage, Utils} from '../../helpers/Index';

// styles
import styles from '../../styles/Styles';
import store from '../../store';

// icons
const icons = {
  next:
    '<svg viewBox="0 0 16 16"><path d="M 5.710938 2.007813 L 5.039063 2.742188 L 10.761719 8 L 5.039063 13.253906 L 5.710938 13.996094 L 11.839844 8.367188 C 11.941406 8.273438 12 8.140625 12 8 C 12 7.859375 11.941406 7.726563 11.839844 7.632813 Z"></path></svg>',
};

// start
export default class PartnerLoyalityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      bonus: false,
      discount: 0,
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
        this.setState({
          loading: false,
          user,
          bonus: user.bonus === 1,
          discount: user.discount,
        });
      }
    });
  };
  bonusActiveSet = () => {
    let {user} = this.state;
    user.bonus = this.state.bonus ? 0 : 1;
    this.setState({bonus: !this.state.bonus});
    Partners.update(user.id, {bonus: user.bonus});
    Storage.set('user', JSON.stringify(user));
    store.userStore.setUser(user);
  };
  discountUpdate = (discount) => {
    let {user} = this.state;
    user.discount = discount;
    this.setState({discount});
    Partners.update(user.id, {discount});
    Storage.set('user', JSON.stringify(user));
  };
  gotoDiscounts = () => this.props.navigation.navigate('PartnerDiscounts');
  gotoBonuses = () => this.props.navigation.navigate('PartnerBonuses');
  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title={'Программы лояльности'}
          styles={styles}
          navigation={this.props.navigation}
        />
        <View style={s.lists}>
          <TouchableOpacity
            style={[s.oneline, s.item]}
            onPress={() => this.gotoDiscounts()}>
            <Text style={styles.text}>Скидочная программа</Text>
            <SvgXml width={22} height={22} fill={'#9a9a9b'} xml={icons.next} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.oneline, s.item]}
            onPress={() => this.gotoBonuses()}>
            <Text style={styles.text}>Бонусная программа</Text>
            <SvgXml width={22} height={22} fill={'#9a9a9b'} xml={icons.next} />
          </TouchableOpacity>
          <View style={[s.oneline, s.item]}>
            <View>
              <Text style={styles.text}>Включить бонусную программу</Text>
              <Text style={[styles.text, styles.small, styles.mt5, s.message]}>
                При включении бонусной программы скидочная программа будет
                отключена
              </Text>
            </View>
            <Switch
              onValueChange={this.bonusActiveSet}
              value={this.state.bonus}
            />
          </View>
          <View style={[s.oneline, s.onelineinput, s.item, s.iteminput]}>
            <Text style={styles.text}>Скидка по умолчанию, %</Text>
            <TextInput
              style={[styles.text, s.input]}
              value={this.state.discount}
              onChangeText={(discount) => this.discountUpdate(discount)}
              maxLength={2}
              placeholder={'5%'}
              keyboardType="numeric"
              underlineColorAndroid={'transparent'}
            />
          </View>
          <Text style={[styles.text, styles.middle, s.notice, styles.grey]}>
            Для привлечения клиентов вы можете использовать одну из программ
            лояльности.{'\r\r'}Бонусная программ — начисление клиентам бонусных
            баллов при пркупке и приема баллов в качестве оплаты в при следующей
            продаже.{'\r\r'}Скидочная программа — продажа товаров\услуг со
            скидкой.{'\r\r'}Обратите внимание, что эти программы
            взаимоисключающие!
          </Text>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  onelineinput: {
    alignItems: 'center',
  },
  notice: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  input: {
    width: 50,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#3b3b3b',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    alignItems: 'flex-start',
    textAlign: 'right',
  },
  iteminput: {
    padding: 10,
  },
});
