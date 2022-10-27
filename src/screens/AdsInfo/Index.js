/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';

// components
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import ComplaintPopup from '../../components/ComplaintPopup';
import ClosePopup from '../../components/ClosePopup';

// models
import {Offers, OfferLikes, Statistics} from '../../models/Index';

// helpers
import {Storage, Dates, Utils} from '../../helpers/Index';

// globals
import {API, statisticType} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';
import store from '../../store';
import {AdsInfoOffer} from './components/AdsInfoOffer';

// start

const AdsInfoScreen = (props) => {
  const data = props.navigation.getParam('data');
  const user = store.userStore.user;
  const [offers, setOffers] = React.useState([]);
  const [likeList, setLikeList] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [complaintContent, setComplainContent] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  const offerLikesGet = (id) => {
    return new Promise((resolve) => {
      OfferLikes.get(id, (res) => {
        resolve(res.data);
      });
    });
  };

  const partnerShow = () => {
    if (data && user) props.navigation.navigate('PartnerInfo', {data, user});
  };
  const modalShow = (visible) => {
    setModalVisible(visible);
  };

  const complaint = (item) => {
    const complaintContent = (
      <ComplaintPopup
        styles={styles}
        client={user}
        offer={item}
        callback={() => {
          modalShow(false);
          setComplainContent(null);
        }}
      />
    );
    setComplainContent(complaintContent);
    modalShow(true);
  };

  const onLike = async (index, id) => {
    const item = offers[index];

    const newOffers = [...offers];

    if (item.isLike) {
      await OfferLikes.remove(id, user.id);
    } else {
      await OfferLikes.add(id, user.id);
    }

    if (item.isLike) {
      newOffers[index].likeCount--;
    } else {
      newOffers[index].likeCount++;
    }

    newOffers[index].isLike = !item.isLike;

    setOffers(newOffers);
  };

  React.useEffect(() => {
    if (Utils.empty(user)) {
      Storage.set('startScreen', 'Start');
      props.navigation.navigate('Start');
    } else {
      Offers.activeGet(data.id, async (res) => {
        let offersData = res.data;
        for (const v of offersData) {
          const likes = await offerLikesGet(v.id);
          const hasLike = likes.find(
            (item) => item.offerId === v.id && item.clientId === user.id,
          );

          v.likeCount = likes.length;
          v.isLike = !!hasLike;
          v.images = [];
          if (v.image1) v.images.push(`${API.assets}offers/${v.image1}`);
          if (v.image2) v.images.push(`${API.assets}offers/${v.image2}`);
          if (v.image3) v.images.push(`${API.assets}offers/${v.image3}`);
          if (v.image4) v.images.push(`${API.assets}offers/${v.image4}`);
        }
        setOffers(offersData);
        setLoading(false);
      });
      Statistics.add(data.id, user.id, statisticType.VIEW_ADS);
    }
    Storage.get('unreadMessages', (unreadMessages) => {
      unreadMessages = JSON.parse(unreadMessages) || {};
      unreadMessages[`ads_${data.id}`] = Dates.now();
      Storage.set('unreadMessages', JSON.stringify(unreadMessages));
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        {complaintContent}
        <ClosePopup callback={() => modalShow(false)} />
      </Modal>
      <Header
        title={data.name}
        navigation={props.navigation}
        styles={styles}
        context={{
          icon:
            '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 5 L 8 5 L 8 4 Z M 7 6 L 7 11 L 8 11 L 8 6 Z"></path></svg>',
          callback: () => partnerShow(),
        }}
      />
      {loading ? (
        <Loader styles={styles} />
      ) : offers.length === 0 ? (
        <View style={s.notfound}>
          <Text style={styles.text}>
            Акции не найдены или они уже закончились
          </Text>
        </View>
      ) : (
        <ScrollView>
          {offers.map((offer, index) => {
            const likeCounts = offer.likeCount;
            const isLiked = offer.isLike;

            return (
              <AdsInfoOffer
                key={offer.id}
                title={offer.title}
                onLike={() => onLike(index, offer.id)}
                onComplaint={() => complaint(offer)}
                dateCreate={offer.dateCreate}
                dateTill={offer.dateTill}
                isLike={isLiked}
                likeCounts={likeCounts}
                images={offer.images}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notfound: {
    width: width - 30,
    marginLeft: 15,
    marginTop: 30,
  },
});
export default AdsInfoScreen;
