/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
  FlatList,
  RefreshControl,
  Share,
  Platform,
} from 'react-native';

// plug-ins
import {SvgXml} from 'react-native-svg';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import OneSignal from 'react-native-onesignal';

// components
import Loader from '../../components/Loader';
import GoBack from '../../components/GoBack';
import MessagePopup from '../../components/MessagePopup';
import ClosePopup from '../../components/ClosePopup';

// models
import {
  PartnerClients,
  PartnerClientOrders,
  Statistics,
} from '../../models/Index';

// helpers
import {Geo, Dates, Utils} from '../../helpers/Index';

// globals
import {API, MAPS, orderTypeName, statisticType} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';
import store from '../../store';

// icons
const icons = {
  message:
    '<svg viewBox="0 0 16 16"><path d="M 2.5 2 C 1.675781 2 1 2.675781 1 3.5 L 1 11.5 C 1 12.324219 1.675781 13 2.5 13 L 4 13 L 4 15.433594 L 7.652344 13 L 12.5 13 C 13.324219 13 14 12.324219 14 11.5 L 14 3.5 C 14 2.675781 13.324219 2 12.5 2 Z M 2.5 3 L 12.5 3 C 12.78125 3 13 3.21875 13 3.5 L 13 11.5 C 13 11.78125 12.78125 12 12.5 12 L 7.347656 12 L 5 13.566406 L 5 12 L 2.5 12 C 2.21875 12 2 11.78125 2 11.5 L 2 3.5 C 2 3.21875 2.21875 3 2.5 3 Z"></path></svg>',
  plus:
    '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 7 L 4 7 L 4 8 L 7 8 L 7 11 L 8 11 L 8 8 L 11 8 L 11 7 L 8 7 L 8 4 Z"></path></svg>',
  minus:
    '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 4 7 L 4 8 L 11 8 L 11 7 Z"></path></svg>',
  navigate:
    '<svg width="10" height="8" viewBox="0 0 10 8"><path d="M6 7V4.5H2V7.5H0V4.5C0 3.39844 0.898438 2.5 2 2.5H6V0L9.5 3.5L6 7Z" /></svg>',
  share:
    '<svg viewBox="0 0 16 16"><path d="M 12.5 1 C 11.125 1 10 2.125 10 3.5 C 10 3.671875 10.019531 3.835938 10.050781 4 L 5.519531 6.039063 C 5.0625 5.414063 4.328125 5 3.5 5 C 2.125 5 1 6.125 1 7.5 C 1 8.875 2.125 10 3.5 10 C 4.332031 10 5.074219 9.582031 5.527344 8.949219 L 10.0625 10.964844 C 10.023438 11.136719 10 11.316406 10 11.5 C 10 12.875 11.125 14 12.5 14 C 13.875 14 15 12.875 15 11.5 C 15 10.125 13.875 9 12.5 9 C 11.667969 9 10.925781 9.417969 10.472656 10.050781 L 5.9375 8.039063 C 5.976563 7.863281 6 7.683594 6 7.5 C 6 7.3125 5.976563 7.128906 5.9375 6.953125 L 10.445313 4.914063 C 10.898438 5.570313 11.652344 6 12.5 6 C 13.875 6 15 4.875 15 3.5 C 15 2.125 13.875 1 12.5 1 Z M 12.5 2 C 13.335938 2 14 2.664063 14 3.5 C 14 4.335938 13.335938 5 12.5 5 C 11.664063 5 11 4.335938 11 3.5 C 11 2.664063 11.664063 2 12.5 2 Z M 3.5 6 C 4.335938 6 5 6.664063 5 7.5 C 5 8.335938 4.335938 9 3.5 9 C 2.664063 9 2 8.335938 2 7.5 C 2 6.664063 2.664063 6 3.5 6 Z M 12.5 10 C 13.335938 10 14 10.664063 14 11.5 C 14 12.335938 13.335938 13 12.5 13 C 11.664063 13 11 12.335938 11 11.5 C 11 10.664063 11.664063 10 12.5 10 Z"></path></svg>',
  order:
    '<svg viewBox="0 0 128 128"><path d="M 33.5 11 C 26.3 11 20.5 16.8 20.5 24 L 20.5 104 C 20.5 111.2 26.3 117 33.5 117 L 94.5 117 C 101.7 117 107.5 111.2 107.5 104 L 107.5 24 C 107.5 16.8 101.7 11 94.5 11 L 33.5 11 z M 33.5 17 L 94.5 17 C 98.4 17 101.5 20.1 101.5 24 L 101.5 104 C 101.5 107.9 98.4 111 94.5 111 L 33.5 111 C 29.6 111 26.5 107.9 26.5 104 L 26.5 24 C 26.5 20.1 29.6 17 33.5 17 z M 40.5 33 C 38.8 33 37.5 34.3 37.5 36 C 37.5 37.7 38.8 39 40.5 39 L 85.5 39 C 87.2 39 88.5 37.7 88.5 36 C 88.5 34.3 87.2 33 85.5 33 L 40.5 33 z M 40.5 48 C 38.8 48 37.5 49.3 37.5 51 C 37.5 52.7 38.8 54 40.5 54 L 85.5 54 C 87.2 54 88.5 52.7 88.5 51 C 88.5 49.3 87.2 48 85.5 48 L 40.5 48 z M 40.5 63 C 38.8 63 37.5 64.3 37.5 66 C 37.5 67.7 38.8 69 40.5 69 L 61 69 C 62.7 69 64 67.7 64 66 C 64 64.3 62.7 63 61 63 L 40.5 63 z M 81 93.074219 C 80.225 93.074219 79.450391 93.350391 78.900391 93.900391 C 78.300391 94.400391 78 95.2 78 96 C 78 96.8 78.300391 97.599609 78.900391 98.099609 C 79.500391 98.699609 80.2 99 81 99 C 81.8 99 82.599609 98.699609 83.099609 98.099609 C 83.699609 97.499609 84 96.8 84 96 C 84 95.2 83.699609 94.400391 83.099609 93.900391 C 82.549609 93.350391 81.775 93.074219 81 93.074219 z"></path></svg>',
  sn: {
    web:
      '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 4.800781 1 2.484375 2.652344 1.5 5 L 2.609375 5 C 3.179688 3.882813 4.121094 2.988281 5.269531 2.476563 C 4.832031 3.144531 4.480469 4 4.261719 5 L 5.296875 5 C 5.75 3.164063 6.65625 2 7.5 2 C 8.34375 2 9.25 3.164063 9.703125 5 L 10.738281 5 C 10.519531 4 10.167969 3.144531 9.730469 2.476563 C 10.878906 2.988281 11.820313 3.882813 12.390625 5 L 13.5 5 C 12.515625 2.652344 10.199219 1 7.5 1 Z M 0 6 L 0.976563 10 L 1.921875 10 L 2.5 7.449219 L 3.078125 10 L 4.023438 10 L 5 6 L 4 6 L 3.523438 8.40625 L 3 6 L 2 6 L 1.476563 8.40625 L 1 6 Z M 5 6 L 5.976563 10 L 6.921875 10 L 7.5 7.449219 L 8.078125 10 L 9.023438 10 L 10 6 L 9 6 L 8.523438 8.40625 L 8 6 L 7 6 L 6.476563 8.40625 L 6 6 Z M 10 6 L 10.980469 10 L 11.921875 10 L 12.5 7.449219 L 13.078125 10 L 14.019531 10 L 15 6 L 14 6 L 13.527344 8.40625 L 13 6 L 12 6 L 11.472656 8.40625 L 11 6 Z M 2.03125 11 C 3.1875 12.800781 5.203125 14 7.5 14 C 9.796875 14 11.8125 12.800781 12.96875 11 L 11.738281 11 C 11.199219 11.648438 10.511719 12.167969 9.734375 12.515625 C 10.015625 12.085938 10.265625 11.578125 10.460938 11 L 9.382813 11 C 8.890625 12.242188 8.179688 13 7.5 13 C 6.820313 13 6.109375 12.242188 5.617188 11 L 4.539063 11 C 4.734375 11.578125 4.984375 12.085938 5.265625 12.515625 C 4.488281 12.167969 3.800781 11.648438 3.261719 11 Z"></path></svg>',
    vk:
      '<svg viewBox="0 0 50 50"><path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37.72,33l-3.73-0.01 c0,0-0.08,0.01-0.21,0.01c-0.3,0-0.92-0.08-1.65-0.58c-1.31-0.91-2.56-3.17-3.55-3.17c-0.07,0-0.13,0.01-0.19,0.03 c-0.86,0.27-1.12,1.13-1.12,2.18c0,0.37-0.26,0.54-0.96,0.54h-1.93c-2.16,0-4.25-0.05-6.6-2.62c-3.46-3.79-6.7-10.53-6.7-10.53 s-0.18-0.39,0.01-0.62c0.18-0.21,0.6-0.23,0.76-0.23c0.04,0,0.06,0,0.06,0h4c0,0,0.37,0.07,0.64,0.27c0.23,0.17,0.35,0.48,0.35,0.48 s0.68,1.32,1.53,2.81c1.43,2.46,2.2,3.28,2.75,3.28c0.09,0,0.18-0.02,0.27-0.07c0.82-0.45,0.58-4.09,0.58-4.09s0.01-1.32-0.42-1.9 c-0.33-0.46-0.96-0.59-1.24-0.63c-0.22-0.03,0.14-0.55,0.62-0.79c0.62-0.3,1.65-0.36,2.89-0.36h0.6c1.17,0.02,1.2,0.14,1.66,0.25 c1.38,0.33,0.91,1.62,0.91,4.71c0,0.99-0.18,2.38,0.53,2.85c0.05,0.03,0.12,0.05,0.21,0.05c0.46,0,1.45-0.59,3.03-3.26 c0.88-1.52,1.56-3.03,1.56-3.03s0.15-0.27,0.38-0.41c0.22-0.13,0.22-0.13,0.51-0.13h0.03c0.32,0,3.5-0.03,4.2-0.03h0.08 c0.67,0,1.28,0.01,1.39,0.42c0.16,0.62-0.49,1.73-2.2,4.03c-2.82,3.77-3.14,3.49-0.8,5.67c2.24,2.08,2.7,3.09,2.78,3.22 C39.68,32.88,37.72,33,37.72,33z"></path></svg>',
    ok:
      '<svg viewBox="0 0 50 50"><path d="M 9 4 C 6.24 4 4 6.24 4 9 L 4 41 C 4 43.76 6.24 46 9 46 L 41 46 C 43.76 46 46 43.76 46 41 L 46 9 C 46 6.24 43.76 4 41 4 L 9 4 z M 25 9 C 29.42 9 33 12.58 33 17 C 33 21.42 29.42 25 25 25 C 20.58 25 17 21.42 17 17 C 17 12.58 20.58 9 25 9 z M 25 13 A 4 4 0 0 0 21 17 A 4 4 0 0 0 25 21 A 4 4 0 0 0 29 17 A 4 4 0 0 0 25 13 z M 33 26.490234 C 33.63 26.490234 34.250625 26.789609 34.640625 27.349609 C 35.270625 28.249609 35.050625 29.500859 34.140625 30.130859 C 32.640625 31.180859 30.99 31.939922 29.25 32.419922 L 34.410156 37.589844 C 35.200156 38.369844 35.200156 39.630156 34.410156 40.410156 C 34.020156 40.800156 33.51 41 33 41 C 32.49 41 31.979844 40.800156 31.589844 40.410156 L 25 33.830078 L 18.410156 40.410156 C 18.020156 40.800156 17.51 41 17 41 C 16.49 41 15.979844 40.800156 15.589844 40.410156 C 14.799844 39.630156 14.799844 38.369844 15.589844 37.589844 L 20.75 32.419922 C 19.02 31.939922 17.369141 31.190625 15.869141 30.140625 C 14.969141 29.510625 14.739141 28.269375 15.369141 27.359375 C 15.759141 26.799375 16.379531 26.5 17.019531 26.5 C 17.409531 26.5 17.810156 26.619375 18.160156 26.859375 C 20.170156 28.259375 22.54 29 25 29 C 27.47 29 29.839375 28.259609 31.859375 26.849609 C 32.199375 26.609609 32.6 26.490234 33 26.490234 z"></path></svg>',
    fb:
      '<svg viewBox="0 0 24 24"><path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h7.621v-6.961h-2.343v-2.725h2.343V9.309 c0-2.324,1.421-3.591,3.495-3.591c0.699-0.002,1.397,0.034,2.092,0.105v2.43h-1.428c-1.13,0-1.35,0.534-1.35,1.322v1.735h2.7 l-0.351,2.725h-2.365V21H19c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z"></path></svg>',
    instagram:
      '<svg viewBox="0 0 50 50"><path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path></svg>',
    telegram:
      '<svg viewBox="0 0 30 30"><path d="M 25.154297 3.984375 C 24.829241 3.998716 24.526384 4.0933979 24.259766 4.2011719 C 24.010014 4.3016357 23.055766 4.7109106 21.552734 5.3554688 C 20.048394 6.0005882 18.056479 6.855779 15.931641 7.7695312 C 11.681964 9.5970359 6.9042108 11.654169 4.4570312 12.707031 C 4.3650097 12.746607 4.0439208 12.849183 3.703125 13.115234 C 3.3623292 13.381286 3 13.932585 3 14.546875 C 3 15.042215 3.2360676 15.534319 3.5332031 15.828125 C 3.8303386 16.121931 4.144747 16.267067 4.4140625 16.376953 C 5.3912284 16.775666 8.4218473 18.015862 8.9941406 18.25 C 9.195546 18.866983 10.29249 22.222526 10.546875 23.044922 C 10.714568 23.587626 10.874198 23.927519 11.082031 24.197266 C 11.185948 24.332139 11.306743 24.45034 11.453125 24.542969 C 11.511635 24.579989 11.575789 24.608506 11.640625 24.634766 L 11.644531 24.636719 C 11.659471 24.642719 11.67235 24.652903 11.6875 24.658203 C 11.716082 24.668202 11.735202 24.669403 11.773438 24.677734 C 11.925762 24.726927 12.079549 24.757812 12.216797 24.757812 C 12.80196 24.757814 13.160156 24.435547 13.160156 24.435547 L 13.181641 24.419922 L 16.191406 21.816406 L 19.841797 25.269531 C 19.893193 25.342209 20.372542 26 21.429688 26 C 22.057386 26 22.555319 25.685026 22.875 25.349609 C 23.194681 25.014192 23.393848 24.661807 23.478516 24.21875 L 23.478516 24.216797 C 23.557706 23.798129 26.921875 6.5273437 26.921875 6.5273438 L 26.916016 6.5507812 C 27.014496 6.1012683 27.040303 5.6826405 26.931641 5.2695312 C 26.822973 4.8564222 26.536648 4.4608905 26.181641 4.2480469 C 25.826669 4.0352506 25.479353 3.9700339 25.154297 3.984375 z M 24.966797 6.0742188 C 24.961997 6.1034038 24.970391 6.0887279 24.962891 6.1230469 L 24.960938 6.1347656 L 24.958984 6.1464844 C 24.958984 6.1464844 21.636486 23.196371 21.513672 23.845703 C 21.522658 23.796665 21.481573 23.894167 21.439453 23.953125 C 21.379901 23.91208 21.257812 23.859375 21.257812 23.859375 L 21.238281 23.837891 L 16.251953 19.121094 L 12.726562 22.167969 L 13.775391 17.96875 C 13.775391 17.96875 20.331562 11.182109 20.726562 10.787109 C 21.044563 10.471109 21.111328 10.360953 21.111328 10.251953 C 21.111328 10.105953 21.035234 10 20.865234 10 C 20.712234 10 20.506484 10.14875 20.396484 10.21875 C 18.963383 11.132295 12.671823 14.799141 9.8515625 16.439453 C 9.4033769 16.256034 6.2896636 14.981472 5.234375 14.550781 C 5.242365 14.547281 5.2397349 14.548522 5.2480469 14.544922 C 7.6958673 13.491784 12.47163 11.434667 16.720703 9.6074219 C 18.84524 8.6937992 20.838669 7.8379587 22.341797 7.1933594 C 23.821781 6.5586849 24.850125 6.1218894 24.966797 6.0742188 z"></path></svg>',
  },
};

const PartnerInfoScreen = (props) => {
  const user = store.userStore.user;
  const data = props.navigation.getParam('data');
  const map = React.useRef(null);

  const [position, setPosition] = React.useState(null);
  const [region, setRegion] = React.useState(null);

  const [orders, setOrders] = React.useState([]);
  const [client, setClient] = React.useState(null);
  const [orderSelected, setOrderSelected] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState(null);

  const [registred, setRegistred] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showRoute, setShowRoute] = React.useState(false);
  const [showOrders, setShowOrders] = React.useState(false);
  const [showMessages, setShowMessages] = React.useState(false);

  const refresh = () => {
    setRefreshing(true);

    PartnerClientOrders.get(user.id, data.id, (res) => {
      setOrders(res.data);
      setRefreshing(false);
    });
  };
  const modalShow = (visible) => {
    setModalVisible(visible);
    setOrderSelected(null);
    if (!visible) {
      setShowRoute(false);
      setShowOrders(false);
      setShowMessages(false);
    }
  };

  const like = (id) => {
    setRegistred(!registred);
    if (registred) {
      PartnerClients.unregister(user.id, id);
      OneSignal.deleteTag(`ads_partner_id_${id}`, id.toString());
    } else {
      PartnerClients.register(user.id, id);
      OneSignal.sendTag(`ads_partner_id_${id}`, id.toString());
    }
  };

  const share = async () => {
    try {
      const result = await Share.share({
        message: `Посмотри предложения от «${data.name}» на adsme:${'\r\r'}${
          API.partner
        }${data.id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (err) {}
  };
  const link = (url) => Linking.openURL(url);

  const routeShow = () => {
    setModalVisible(true);
    setShowRoute(true);
  };
  const messagesShow = () => {
    setModalVisible(true);
    setShowMessages(true);
  };
  const ordersShow = () => {
    setModalVisible(true);
    setShowOrders(true);
  };

  const workTimeGet = (item) => {
    let day = new Date().getDay(),
      hours = new Date().getHours(),
      minutes = new Date().getMinutes();
    day = day === 0 ? 6 : day;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let start = item[`workTime${day}`],
      end = item[`workTime${day}End`];
    if (Utils.empty(start))
      return (
        <Text style={[styles.text, styles.grey]}>
          <Text style={s.statusClose}>Закрыто, выходной</Text>
        </Text>
      );
    if (start === '00:00' && end === '00:00')
      return (
        <Text style={[styles.text, styles.grey]}>
          <Text style={[s.statusOpen]}>Круглосуточно</Text>
        </Text>
      );
    start = parseInt(start.replace(':', ''));
    end = parseInt(end.replace(':', ''));
    let time = parseInt(`${hours}${minutes}`);
    return time >= start && time <= end ? (
      <Text style={[styles.text, styles.grey]}>
        <Text style={s.statusOpen}>Открыто</Text>, закроется в{' '}
        {item[`workTime${day}End`]}
      </Text>
    ) : (
      <Text style={[styles.text, styles.grey]}>
        <Text style={s.statusClose}>Закрыто</Text>, откроется в{' '}
        {item[`workTime${day}`]}
      </Text>
    );
  };

  const scheduleGet = (item) => {
    let days = [];
    const week = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ],
      today = new Date().getDay();
    week.forEach((v, i) => {
      const time = Utils.empty(item[`workTime${i + 1}`])
        ? 'Выходной'
        : item[`workTime${i + 1}`] === item[`workTime${i + 1}End`] &&
          item[`workTime${i + 1}`] === '00:00'
        ? 'Круглосуточно'
        : `${item[`workTime${i + 1}`]} - ${item[`workTime${i + 1}End`]}`;
      days.push(
        <View
          key={i}
          style={[
            s.oneline,
            s.dayrow,
            i === (today === 0 ? 6 : today - 1) ? s.dayrowtoday : null,
          ]}>
          <Text style={styles.text}>{v}</Text>
          <Text style={styles.text}>{time}</Text>
        </View>,
      );
    });
    return (
      <View style={[s.highlightblock, s.worktimeblock]}>
        <Text style={[styles.text, styles.bold, s.subtitle]}>Время работы</Text>
        <View>{days}</View>
      </View>
    );
  };
  const orderSelect = (idx) => {
    setOrderSelected(idx);
  };
  const orderPriceGet = (item) => {
    if (item.priceDiscount) return item.priceDiscount;
    if (item.priceBonuses) return item.priceBonuses;
    return item.price;
  };
  React.useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        const {latitude, longitude} = coords;

        setPosition(coords);
        setRegion({
          ...coords,
          latitudeDelta: MAPS.deltas.latitude,
          longitudeDelta: MAPS.deltas.longitude,
        });
      },
      (error) => {},
      Platform.OS === 'android' ? {timeout: 15000} : {enableHighAccuracy: true},
    );
    PartnerClients.get(user.id, data.id, (res) => {
      setLoading(false);
      setRegistred(res.data.length > 0);

      if (res.data.length) {
        setClient(res.data[0]);
      }
    });
    refresh();
    Statistics.add(data.id, user.id, statisticType.VIEW_PROFILE);
  }, []);

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <Loader styles={styles} />
      ) : (
        <View style={s.container}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}>
            {showRoute ? (
              <View style={s.container}>
                <MapView
                  ref={map}
                  provider={PROVIDER_GOOGLE}
                  style={s.map}
                  initialRegion={region}
                  showsMyLocationButton={false}
                  showsCompass={false}
                  zoomControlEnabled={false}
                  toolbarEnabled={false}
                  showsUserLocation={true}>
                  <MapViewDirections
                    origin={region}
                    destination={{
                      latitude: parseFloat(data.latitude),
                      longitude: parseFloat(data.longitude),
                    }}
                    apikey={MAPS.key}
                    strokeWidth={3}
                    language={'ru'}
                    optimizeWaypoints={true}
                    mode={'WALKING'}
                    strokeColor="#6dcc3d"
                    onReady={(result) => {
                      const {distance, duration, coordinates} = result;
                      setDistance(distance);
                      setDuration(duration);
                      setCoordinates(coordinates);

                      map.current.fitToCoordinates(coordinates, {
                        edgePadding: {
                          right: 80,
                          bottom: 80,
                          left: 80,
                          top: 80,
                        },
                      });
                    }}>
                    <View style={s.mapaddress}>
                      <Text style={styles.text}>{data.address}</Text>
                      <Text style={[styles.text, styles.small]}>
                        {Geo.routeGet(distance)} от вас,{' '}
                        {Geo.durationGet(duration)}
                      </Text>
                    </View>
                  </MapViewDirections>
                  <MapView.Marker
                    coordinate={{
                      latitude: parseFloat(data.latitude),
                      longitude: parseFloat(data.longitude),
                    }}>
                    <View style={s.markerShadow}>
                      <View style={s.marker}></View>
                    </View>
                  </MapView.Marker>
                </MapView>
              </View>
            ) : null}
            {showOrders ? (
              <View style={[s.container, s.modalcontainer]}>
                <Text
                  style={[
                    styles.text,
                    styles.bold,
                    styles.title,
                    s.subtitle,
                    s.subtitleorders,
                  ]}>
                  Покупки
                </Text>
                <Text style={[styles.text, styles.grey, s.subtitle]}>
                  {data.name}
                </Text>
                <View style={s.ordersummary}>
                  <Text style={[styles.text, styles.grey]}>
                    Сумма покупок{' '}
                    <Text style={[styles.bold, styles.black]}>
                      {Utils.moneyFormat(client.total)} ₽
                    </Text>
                  </Text>
                  <Text style={[styles.text, styles.grey]}>
                    Доступно бонусов{' '}
                    <Text style={[styles.bold, styles.black]}>
                      {client.bonuses ? `${client.bonuses} шт.` : '0'}
                    </Text>
                  </Text>
                  <Text style={[styles.text, styles.grey]}>
                    Накопительная скидка{' '}
                    <Text style={[styles.bold, styles.black]}>
                      {client.discount ? `${client.discount} %` : 'нет'}
                    </Text>
                  </Text>
                  <Text style={[styles.text, styles.grey]}>
                    Персональная скидка{' '}
                    <Text style={[styles.bold, styles.black]}>
                      {client.discountPersonal
                        ? `${client.discountPersonal} %`
                        : 'нет'}
                    </Text>
                  </Text>
                </View>
                {orders.length === 0 ? (
                  <View style={s.notfound}>
                    <Text style={styles.text}>
                      Покупки не найдены. Вероятно вы еще ничего не покупали у
                      этого продавца.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={orders}
                    style={s.list}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={[s.listitem, index % 2 ? s.listitemodd : null]}
                        onPress={() => orderSelect(index)}>
                        <View style={s.oneline}>
                          <Text style={[styles.text, s.orderdate]}>
                            {orderTypeName[item.type]} от{' '}
                            {Dates.get(item.dateCreate, {
                              showMonthShortName: true,
                            })}
                          </Text>
                          <Text style={styles.text}>
                            {Utils.moneyFormat(orderPriceGet(item))} ₽
                          </Text>
                        </View>
                        {orderSelected === index ? (
                          <View style={s.orderdetails}>
                            <Text style={[styles.text, styles.small]}>
                              {item.comment}
                            </Text>
                            <View style={s.orderdetails}>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Полная сумма
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {Utils.moneyFormat(item.price)} ₽
                                </Text>
                              </View>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Сумма со скидкой
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {item.priceDiscount
                                    ? `${Utils.moneyFormat(
                                        item.priceDiscount,
                                      )} ₽`
                                    : '—'}
                                </Text>
                              </View>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Сумма с бонусами
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {item.priceBonuses
                                    ? `${Utils.moneyFormat(
                                        item.priceBonuses,
                                      )} ₽`
                                    : '—'}
                                </Text>
                              </View>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Скидка
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {item.discount ? `${item.discount} %` : '—'}
                                </Text>
                              </View>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Потрачено бонусов
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {item.bonuses ? `${item.bonuses} шт.` : '—'}
                                </Text>
                              </View>
                              <View style={s.onelinelist}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.small,
                                    s.detailstitle,
                                  ]}>
                                  Получено бонусов
                                </Text>
                                <Text style={[styles.text, styles.small]}>
                                  {item.bonusesAdded
                                    ? `${item.bonusesAdded} шт.`
                                    : '—'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    )}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => efresh()}
                      />
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>
            ) : null}
            {showMessages ? (
              <MessagePopup
                styles={styles}
                navigation={props.navigation}
                user={user}
                partner={data}
                callback={() => modalShow(false)}
              />
            ) : null}
            <ClosePopup callback={() => modalShow(false)} />
          </Modal>
          <ScrollView>
            {data.imageCover ? (
              <Image
                source={{
                  uri: `${API.assets}partners/${
                    data.imageCover
                  }${Utils.uniqueLink()}`,
                }}
                style={s.cover}
              />
            ) : null}
            <View
              style={[s.textsfull, data.imageCover ? null : s.textfullnocover]}>
              <View>
                <Text style={[styles.title, styles.bold]}>{data.name}</Text>
                <Text style={[styles.text, s.area]}>{data.area}</Text>
              </View>
              <View style={s.oneline}>
                {workTimeGet(data)}
                <Text style={[styles.text, styles.grey]}>
                  {parseInt(data.distance)} м
                </Text>
              </View>
              <View style={[s.oneline, s.icons]}>
                <TouchableOpacity onPress={() => like(data.id)} style={s.icon}>
                  <SvgXml
                    width={26}
                    height={26}
                    xml={registred ? icons.minus : icons.plus}
                    fill={'#007aff'}
                  />
                  <Text
                    style={[styles.text, styles.tabs, styles.blue, s.icontext]}>
                    {registred ? 'Отписаться' : 'Подписаться'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => messagesShow()} style={s.icon}>
                  <SvgXml
                    width={26}
                    height={26}
                    xml={icons.message}
                    fill={'#007aff'}
                  />
                  <Text
                    style={[styles.text, styles.tabs, styles.blue, s.icontext]}>
                    Написать
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => ordersShow()} style={s.icon}>
                  <SvgXml
                    width={26}
                    height={26}
                    xml={icons.order}
                    fill={'#007aff'}
                  />
                  <Text
                    style={[styles.text, styles.tabs, styles.blue, s.icontext]}>
                    Покупки
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => share()} style={s.icon}>
                  <SvgXml
                    width={26}
                    height={26}
                    xml={icons.share}
                    fill={'#007aff'}
                  />
                  <Text
                    style={[styles.text, styles.tabs, styles.blue, s.icontext]}>
                    Поделиться
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {data.address ? (
              <View style={[s.oneline, s.highlightblock]}>
                <View style={s.address}>
                  <Text style={[styles.text, styles.title]}>
                    {data.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => routeShow()}
                  style={s.navigate}>
                  <SvgXml
                    width={16}
                    height={16}
                    xml={icons.navigate}
                    style={s.navigateicon}
                    fill={'#000'}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {data.tags ? (
              <View style={s.row}>
                <Text style={[styles.text, styles.small]}>
                  теги: {data.tags.replace(/,/gi, ', ')}
                </Text>
              </View>
            ) : null}
            {data.info ? (
              <View style={s.row}>
                <Text style={styles.text}>{data.info}</Text>
              </View>
            ) : null}
            {data.web ||
            data.webVK ||
            data.webFB ||
            data.webOK ||
            data.webInstagram ||
            data.webTelegram ? (
              <View style={s.row}>
                <View style={[s.oneline, s.links]}>
                  {data.web ? (
                    <TouchableOpacity
                      onPress={() => link(Utils.linkNormalize(data.web))}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.web}
                        fill={'#007aff'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {data.webVK ? (
                    <TouchableOpacity
                      onPress={() => link(`https://vk.com/${data.webVK}`)}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.vk}
                        fill={'#45668e'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {data.webFB ? (
                    <TouchableOpacity
                      onPress={() => link(`https://fb.com/${data.webFB}`)}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.fb}
                        fill={'#3b5998'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {data.webOK ? (
                    <TouchableOpacity
                      onPress={() => link(`https://ok.ru/${data.webOK}`)}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.ok}
                        fill={'#ee8208'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {data.webInstagram ? (
                    <TouchableOpacity
                      onPress={() =>
                        link(`https://instagram.com/${data.webInstagram}`)
                      }>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.instagram}
                        fill={'#c13584'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {data.webTelegram ? (
                    <TouchableOpacity
                      onPress={() => link(`https://t.me/${data.webTelegram}`)}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.sn.telegram}
                        fill={'#08c'}
                        style={s.link}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}
            {scheduleGet(data)}
          </ScrollView>
          <View style={s.back}>
            <GoBack navigation={props.navigation} noheader={true} />
          </View>
        </View>
      )}
    </View>
  );
};

export default PartnerInfoScreen;

const {width, height} = Dimensions.get('window');
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cover: {
    width: width,
    height: 160,
    resizeMode: 'cover',
  },
  textsfull: {
    paddingBottom: 15,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  textfullnocover: {
    marginTop: 60,
  },
  area: {
    marginVertical: 5,
  },
  statusOpen: {
    color: 'green',
  },
  statusClose: {
    color: '#c00',
  },
  oneline: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  onelinelist: {
    flexDirection: 'row',
  },
  icons: {
    marginTop: 30,
  },
  icon: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  icontext: {
    marginTop: 4,
  },
  highlightblock: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: '#ffd93e',
    borderRadius: 10,
  },
  worktimeblock: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#eee',
  },
  row: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  subtitle: {
    marginBottom: 15,
    paddingLeft: 15,
  },
  subtitleorders: {
    marginBottom: 5,
  },
  dayrow: {
    padding: 3,
    paddingHorizontal: 15,
  },
  dayrowtoday: {
    backgroundColor: '#ffffff80',
  },
  weekday: {
    width: 150,
  },
  links: {
    justifyContent: 'flex-start',
  },
  link: {
    marginRight: 15,
  },
  address: {
    width: width - 120,
    justifyContent: 'center',
  },
  navigate: {
    width: 42,
    height: 42,
    backgroundColor: '#f8f8f860',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateicon: {
    marginLeft: 4,
  },
  mapaddress: {
    top: height - 60,
    width: width,
    height: 60,
    bottom: 0,
    padding: 15,
    backgroundColor: '#fff',
  },
  modalcontainer: {
    paddingTop: 40,
  },
  list: {
    marginTop: 20,
  },
  listitem: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: '#f2f2f2',
  },
  listitemodd: {
    backgroundColor: 'transparent',
  },
  notfound: {
    width: width - 30,
    marginLeft: 15,
    marginTop: 10,
  },
  orderdetails: {
    marginTop: 10,
  },
  detailstitle: {
    width: 130,
  },
  ordersummary: {
    paddingLeft: 15,
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#c00',
    borderColor: '#fff',
    borderWidth: 2,
  },
  markerShadow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00000010',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
