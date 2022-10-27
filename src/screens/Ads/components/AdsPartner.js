import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import styles from '../../../styles/Styles';

export const AdsPartner = ({
  imageAvatar,
  onPress,
  offers,
  area,
  name,
  messageCount,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={s.item}>
      {imageAvatar ? (
        <Image
          source={{
            uri: imageAvatar,
          }}
          style={s.avatar}
        />
      ) : (
        <View style={[s.avatar, s.avatarblank]}></View>
      )}
      <View style={s.nameblock}>
        <Text style={[styles.text, styles.boldlight]} numberOfLines={1}>
          {name}
        </Text>
        {offers.length === 0 ? (
          <Text
            style={[styles.text, styles.small, styles.grey]}
            numberOfLines={1}>
            {area}
          </Text>
        ) : (
          <Text
            style={[styles.text, styles.small, styles.grey]}
            numberOfLines={2}>
            {offers[0].title}
          </Text>
        )}
      </View>
      {messageCount}
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarblank: {
    backgroundColor: '#aaa',
    opacity: 0.2,
  },
  nameblock: {
    width: width - 15 - 15 - 40 - 50,
  },
 
});
