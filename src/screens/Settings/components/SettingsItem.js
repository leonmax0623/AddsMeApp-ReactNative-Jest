import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {IconsData} from '../../../resources/IconsData';
import styles from '../../../styles/Styles';

export const SettingsItem = ({onPress, text}) => {
  return (
    <TouchableOpacity style={[s.oneline, s.item]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      <SvgXml width={22} height={22} fill={'#9a9a9b'} xml={IconsData.next} />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
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
