import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import styles from '../../../styles/Styles';

export const AdsTag = ({isActive, onPress, title}) => {
  return (
    <TouchableOpacity
      style={[s.filteritem, isActive ? s.filteritemselected : null]}
      onPress={onPress}>
      <Text style={[styles.text, isActive ? styles.white : styles.grey]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  filteritem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filteritemselected: {
    backgroundColor: '#007aff',
  },
});
