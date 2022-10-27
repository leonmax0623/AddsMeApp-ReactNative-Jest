import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from '../../../styles/Styles';
import {SvgXml} from 'react-native-svg';
import {Utils} from '../../../helpers/Index';
import {ContactAvatar} from './ContactAvatar';

export const ContactsOverlay = ({
  userSelect,
  panelShow,
  animPanel,
  contactsOthers = [],
  users,
  invite,
}) => {
  return (
    <View style={s.overlay}>
      <Animated.View style={[s.panel, {top: animPanel}]}>
        <View style={s.panelblock}>
          <Text style={[styles.text, styles.title, styles.bold, styles.center]}>
            Пригласить
          </Text>
          <TouchableOpacity onPress={() => panelShow(false)} style={s.cancel}>
            <Text style={[styles.text, styles.blue]}>Закрыть</Text>
          </TouchableOpacity>
        </View>
        {contactsOthers.length > 0 ? (
          <View>
            <FlatList
              style={users.length > 0 ? s.panellist : s.panellistfull}
              data={contactsOthers}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => userSelect(index)}
                  style={s.item}>
                  <ContactAvatar
                    imageAvatar={item.imageAvatar}
                    avatar={item.avatar}
                    firstName={item.firstName}
                    lastName={item.lastName}
                  />
                  <View>
                    <Text style={[styles.text, s.panelname]} numberOfLines={1}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={[styles.text, styles.small, styles.grey]}>
                      {Utils.phoneFormatter(item.phone)}
                    </Text>
                  </View>
                  {users.includes(index) ? (
                    <SvgXml
                      width={24}
                      height={24}
                      fill={'#007aff'}
                      style={s.checkbox}
                      xml={
                        '<svg viewBox="0 0 24 24"><path d="M11.707,15.707C11.512,15.902,11.256,16,11,16s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L11,13.586l8.35-8.35C17.523,3.251,14.911,2,12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10 c0-1.885-0.531-3.642-1.438-5.148L11.707,15.707z"></path></svg>'
                      }
                    />
                  ) : (
                    <SvgXml
                      width={24}
                      height={24}
                      fill={'#ccc'}
                      style={s.checkbox}
                      xml={
                        '<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>'
                      }
                    />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {users.length > 0 && (
              <TouchableOpacity style={s.button} onPress={invite}>
                <Text style={[styles.text, styles.upper]}>
                  Пригласить: {users.length}{' '}
                  <Text style={styles.lower}>чел.</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={s.notfound}>
            <Text style={styles.text}>Не найдено</Text>
            <Text style={[styles.text, styles.small, styles.grey, styles.mt10]}>
              У вас ни одной записи в адресной книге для приглашения в
              приложение.
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const panelY = 100,
  panelHide = height + 10;

const s = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000030',
  },
  panel: {
    position: 'relative',
    height: height - panelY,
    paddingTop: 20,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  panelblock: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  panellist: {
    height: height - 220,
  },
  panellistfull: {
    height: height - 150,
  },
  panelname: {
    width: width - 15 - 15 - 40 - 20 - 40,
  },
  cancel: {
    position: 'absolute',
    top: 2,
    left: 15,
  },
  notfound: {
    width: width - 30,
    marginLeft: 15,
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffd93e',
    borderRadius: 10,
    alignItems: 'center',
  },
  checkbox: {
    position: 'absolute',
    right: 15,
  },
});
