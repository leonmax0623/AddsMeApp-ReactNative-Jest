import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import styles from '../../../styles/Styles';
import {Utils} from '../../../helpers/Index';
import {API} from '../../../globals/Сonstants';

export const ContactAvatar = ({
  imageAvatar,
  image,
  firstName,
  lastName,
  avatar,
}) => {
  const avatarUrl = imageAvatar
    ? `${API.assets}clients/${imageAvatar}`
    : avatar;
  return avatarUrl ? (
    <Image source={{uri: avatarUrl}} style={s.avatar} />
  ) : (
    <View style={[s.avatar, s.placeholder]}>
      <Text style={[styles.text, styles.white, styles.upper]}>
        {Utils.initialsGet(firstName, lastName)}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
});
