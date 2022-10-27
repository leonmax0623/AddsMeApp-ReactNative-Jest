import React from 'react';
import {StyleSheet, View, Text, Switch} from 'react-native';
import styles from '../../../styles/Styles';

export const PermissionItem = ({value, onValueChange, text}) => {
  return (
    <View style={[s.oneline, s.item]}>
      <Text style={[styles.text]}>{text}</Text>
      <Switch onValueChange={onValueChange} value={value} />
    </View>
  );
};

const s = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  oneline: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
