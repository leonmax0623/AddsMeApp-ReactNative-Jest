import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {ContactAvatar} from './ContactAvatar';
import styles from '../../../styles/Styles';
import {Utils} from '../../../helpers/Index';

export const ContactItem = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={s.item}>
      <ContactAvatar
        imageAvatar={item.imageAvatar}
        avatar={item.avatar}
        firstName={item.firstName}
        lastName={item.lastName}
      />
      <View>
        <Text style={styles.text}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={[styles.text, styles.small, styles.grey]}>
          {Utils.phoneFormatter(item.phone)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
});
