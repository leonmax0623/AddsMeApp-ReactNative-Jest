import React from 'react';
import PropTypes from 'prop-types';
import {View, TextInput, StyleSheet, Dimensions, Platform} from 'react-native';

import {SvgXml} from 'react-native-svg';

import styles from '../styles/Styles';

export const SearchBar = ({onSearch, search}) => {
  return (
    <View style={s.search}>
      <TextInput
        style={styles.text}
        value={search}
        onChangeText={onSearch}
        autoCorrect={false}
        placeholder={'Поиск'}
        underlineColorAndroid={'transparent'}
      />
      <SvgXml
        width={16}
        height={16}
        fill={'#9a9a9b'}
        style={s.searchicon}
        xml={
          '<svg viewBox="0 0 50 50"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>'
        }
      />
    </View>
  );
};

SearchBar.defaultProps = {
  onSearch: PropTypes.func,
  search: PropTypes.string,
};

const {width} = Dimensions.get('window');
const s = StyleSheet.create({
  search: {
    width: width - 20,
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 10 : 0,
    paddingLeft: 35,
    paddingRight: 15,
  },
  searchicon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 17,
    left: 10,
  },
});
