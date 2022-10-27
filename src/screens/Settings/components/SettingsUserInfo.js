import React from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import {Dates, Utils} from '../../../helpers/Index';
import styles from '../../../styles/Styles';

export const SettingsUserInfo = ({
  noavatar,
  name,
  phone,
  birthday,
  image,
  imageErrorHandler,
  initials,
}) => {
  return (
    <>
      <View style={s.avatarcontainer}>
        {noavatar ? (
          <View style={[s.avatar, s.placeholder]}>
            <Text style={[styles.text, styles.avatartext, styles.white]}>
              {initials}
            </Text>
          </View>
        ) : (
          <Image
            source={{uri: image}}
            style={s.avatar}
            onError={imageErrorHandler}
          />
        )}
      </View>
      <View style={s.nameblock}>
        <Text
          style={[styles.text, styles.titlebig, styles.bold, styles.center]}>
          {name}
        </Text>
        <Text
          style={[
            styles.text,
            styles.middle,
            styles.grey,
            styles.center,
            styles.mt10,
          ]}>
          {Utils.phoneFormatter(phone)}
        </Text>
        <Text
          style={[
            styles.text,
            styles.middle,
            styles.grey,
            styles.center,
            styles.mt10,
          ]}>
          {birthday
            ? Dates.get(birthday, {
                showMonthFullName: true,
                yearLetter: 'г.',
              })
            : '-'}
        </Text>
      </View>
    </>
  );
};

const {width} = Dimensions.get('window');

const s = StyleSheet.create({
  oneline: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  nameblock: {
    width: width - 60,
    alignSelf: 'center',
  },
  clientcode: {
    marginLeft: 100,
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 15,
    paddingLeft: 15,
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
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
});
