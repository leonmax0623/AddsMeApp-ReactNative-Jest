import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Utils} from '../../../helpers/Index';
import styles from '../../../styles/Styles';
import QRCode from 'react-native-qrcode-svg';

export const QrInfo = ({code}) => {
  return (
    <View style={s.qrcontainer}>
      <QRCode value={code} size={200} />
      <Text style={[styles.text, styles.bold, styles.center, styles.mt20]}>
        {Utils.codeFormatter(code)}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  qrcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
