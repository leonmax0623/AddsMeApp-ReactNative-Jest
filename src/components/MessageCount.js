import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text} from 'react-native';
import CommonStyles from '../styles/Styles';

export const MessageCount = ({count}) => {
  return (
    <View style={s.messagesblock}>
      {count > 0 ? (
        <View style={s.count}>
          <Text
            style={[
              CommonStyles.text,
              count > 99 ? CommonStyles.mini : CommonStyles.small,
              CommonStyles.bold,
              CommonStyles.white,
            ]}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const s = StyleSheet.create({
  messagesblock: {
    width: 30,
  },
  count: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

MessageCount.defaultProps = {
  count: PropTypes.number,
};
