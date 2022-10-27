/*
 * adsme
 * (c) pavit.design, 2020
 */

import {StyleSheet, Dimensions, Platform, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = width / 320;
export const isX =
  Platform.OS === 'ios' &&
  (height == 812 || width == 812 || height == 896 || width == 896);

normalize = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * ratio)) -
  (Platform.OS === 'ios' ? 0 : 2);
notch = () => (isX ? 20 : 0);

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#fff',
  },
  text: {
    fontSize: this.normalize(14),
    fontWeight: '300',
    color: '#000',
  },
  title: {
    fontSize: this.normalize(16),
  },
  middle: {
    fontSize: this.normalize(12),
  },
  small: {
    fontSize: this.normalize(11),
    fontWeight: '100',
  },
  mini: {
    fontSize: this.normalize(9),
    fontWeight: '300',
  },
  tabs: {
    fontSize: this.normalize(8),
    fontWeight: '400',
  },
  titlebig: {
    fontSize: this.normalize(18),
  },
  slidertext: {
    fontSize: this.normalize(20),
  },
  avatartext: {
    fontSize: this.normalize(40),
  },
  bold: {
    fontWeight: '500',
  },
  boldlight: {
    fontWeight: '400',
  },
  normal: {
    fontWeight: '300',
  },
  thin: {
    fontWeight: '100',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  upper: {
    textTransform: 'uppercase',
  },
  lower: {
    textTransform: 'lowercase',
  },
  center: {
    textAlign: 'center',
  },
  link: {
    color: '#007aff',
    textDecorationColor: '#007aff',
    textDecorationLine: 'underline',
  },
  // colors
  white: {
    color: '#fff',
  },
  black: {
    color: '#000',
  },
  grey: {
    color: '#888',
  },
  light: {
    color: '#bbb',
  },
  blue: {
    color: '#007aff',
  },
  red: {
    color: '#c00',
  },
  green: {
    color: '#28b351',
  },
  // containers
  wrapper: {
    flex: 1,
    margin: 0,
    marginBottom: notch(),
    backgroundColor: '#fff',
  },
  container: {
    width: width,
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 30 + notch(),
    paddingBottom: 10,
  },
  // margins
  mt5: {
    marginTop: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  ml5: {
    marginLeft: 5,
  },
  ml10: {
    marginLeft: 10,
  },
  ml20: {
    marginLeft: 20,
  },
  ml30: {
    marginLeft: 30,
  },
  mr5: {
    marginRight: 5,
  },
  mr10: {
    marginRight: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr30: {
    marginRight: 30,
  },
  // loader
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    color: '#777',
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
    fontSize: this.normalize(9),
  },
  // border
  border: {
    borderBottomColor: '#f1f6fa',
    borderBottomWidth: 1,
  },
  // button
  button: {
    width: width - 80,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#24a0ed',
    borderRadius: 10,
    alignItems: 'center',
  },
  // form
  form: {
    width: width - 80,
    alignSelf: 'center',
  },
  // header item
  headerRightItem: {
    position: 'absolute',
    top: 0,
    right: 15,
  },
});

export default styles;
