import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import styles from '../../../styles/Styles';
import {Dates} from '../../../helpers/Index';
import {SvgXml} from 'react-native-svg';
import ImageCarousel from 'react-native-image-carousel';

export const AdsInfoOffer = ({
  onLike,
  images = [],
  title,
  dateTill,
  dateCreate,
  isLike,
  likeCounts,
  onComplaint,
}) => {
  return (
    <View style={s.list}>
      <View style={[s.listtext, s.oneline]}>
        <Text style={[styles.text, styles.small, styles.grey, s.date]}>
          {Dates.get(dateCreate, {
            showMonthShortName: true,
            neerCheck: true,
          })}
          {dateTill ? (
            <Text style={styles.red}>
              {' '}
              Закончится{' '}
              {Dates.get(dateTill, {
                showMonthShortName: true,
                neerCheck: true,
              })}
            </Text>
          ) : null}
        </Text>
        <View style={s.oneline}>
          <TouchableOpacity onPress={onLike} style={s.oneline}>
            <SvgXml
              width={20}
              height={20}
              fill={isLike ? '#c00' : '#ddd'}
              xml={
                '<svg viewBox="0 0 24 24"><path d="M16.5,3C13.605,3,12,5.09,12,5.09S10.395,3,7.5,3C4.462,3,2,5.462,2,8.5c0,4.171,4.912,8.213,6.281,9.49 C9.858,19.46,12,21.35,12,21.35s2.142-1.89,3.719-3.36C17.088,16.713,22,12.671,22,8.5C22,5.462,19.538,3,16.5,3z"></path></svg>'
              }
            />
            <Text
              style={[
                styles.text,
                styles.small,
                styles.bold,
                styles.ml5,
                isLike ? styles.red : '#ddd',
              ]}>
              {likeCounts}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onComplaint} style={styles.ml20}>
            <SvgXml
              width={22}
              height={22}
              fill={'#cc000050'}
              xml={
                '<svg viewBox="0 0 32 32"><path d="M 24 0 C 19.593562 0 16 3.593562 16 8 C 16 9.6613873 16.568267 11.171408 17.4375 12.449219 L 16.791016 17.605469 L 21.599609 15.544922 C 22.363813 15.790484 23.151145 16 24 16 C 28.406438 16 32 12.406438 32 8 C 32 3.593562 28.406438 0 24 0 z M 24 2 C 27.325562 2 30 4.674438 30 8 C 30 11.325562 27.325562 14 24 14 C 23.233063 14 22.503407 13.851407 21.824219 13.585938 L 21.443359 13.435547 L 19.208984 14.392578 L 19.509766 11.990234 L 19.255859 11.662109 C 18.468407 10.645126 18 9.3845393 18 8 C 18 4.674438 20.674438 2 24 2 z M 23 4 L 23 9 L 25 9 L 25 4 L 23 4 z M 8 9 C 6.0833339 9 4.5185588 9.7547551 3.5019531 10.898438 C 2.4853474 12.042118 2 13.527778 2 15 C 2 16.472222 2.4853474 17.957881 3.5019531 19.101562 C 3.7812921 19.41582 4.1947617 19.61147 4.5527344 19.859375 C 1.8843013 21.158567 5.9211895e-16 23.841626 0 27 L 2 27 C 2 23.674438 4.674438 21 8 21 C 11.325562 21 14 23.674438 14 27 L 16 27 C 16 23.841626 14.115699 21.158567 11.447266 19.859375 C 11.805238 19.61147 12.218708 19.415819 12.498047 19.101562 C 13.514653 17.957881 14 16.472222 14 15 C 14 13.527778 13.514653 12.042119 12.498047 10.898438 C 11.481441 9.7547551 9.9166661 9 8 9 z M 23 10 L 23 12 L 25 12 L 25 10 L 23 10 z M 8 11 C 9.4166658 11 10.351893 11.495244 11.001953 12.226562 C 11.652013 12.957882 12 13.972222 12 15 C 12 16.027778 11.652013 17.042119 11.001953 17.773438 C 10.351893 18.504756 9.4166658 19 8 19 C 6.5833342 19 5.6481071 18.504756 4.9980469 17.773438 C 4.3479866 17.042119 4 16.027778 4 15 C 4 13.972222 4.3479866 12.957881 4.9980469 12.226562 C 5.6481071 11.495245 6.5833342 11 8 11 z"></path></svg>'
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      {images ? (
        <ImageCarousel
          renderHeader={() => <View></View>}
          renderContent={(i) => (
            <Image style={s.imagefull} source={{uri: images[i]}} />
          )}>
          {images.map((v, i) => (
            <Image key={i} source={{uri: v}} style={s.cover} />
          ))}
        </ImageCarousel>
      ) : null}
      <View style={s.listtext}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const s = StyleSheet.create({
  list: {
    marginTop: 20,
    marginBottom: 20,
  },
  listtext: {
    marginHorizontal: 15,
  },
  oneline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    marginBottom: 4,
  },
  cover: {
    width: width - width / 3,
    height: 160,
    resizeMode: 'cover',
    marginBottom: 10,
    marginTop: 5,
    borderWidth: 4,
    borderColor: '#fff',
  },
  imagefull: {
    flex: 1,
    resizeMode: 'contain',
  },
});
