/*
 * adsme
 * (c) pavit.design, 2020
 */

import React, {Component, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  FlatList,
  Alert,
  Linking,
  Animated,
  Easing,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import RNVideo from 'react-native-audio';
// plug-ins
import {SvgXml} from 'react-native-svg';
import Lightbox from 'react-native-lightbox';
import Sound from 'react-native-sound';
import Video from 'react-native-video';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import ImagePicker from 'react-native-image-picker';
import Contacts from 'react-native-contacts';
import ParsedText from 'react-native-parsed-text';
import Clipboard from '@react-native-community/clipboard';

// components
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Stickers from '../../components/Stickers';
import Forbidden from '../../components/Forbidden';
import ComplaintPopup from '../../components/ComplaintPopup';
import ClosePopup from '../../components/ClosePopup';
import {GiftedChat} from 'react-native-gifted-chat';

// modeles
import {
  Messages,
  MessagesGroups,
  MessagesGroupsUsers,
  Clients,
  Partners,
  PartnerClientMessages,
  DeletedMessages,
  Pushes,
} from '../../models/Index';

// helpers
import {Dates, Http, Utils, Storage, Files} from '../../helpers/Index';

// globals
import {
  API,
  mediaType,
  chatType,
  messagesGroupsUserStatus,
  messageStatus,
  pushType,
} from '../../globals/Сonstants';

// styles
import styles from '../../styles/Styles';

// icons
const icons = {
  plus:
    '<svg viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"></path></svg>',
  //smile:'<svg viewBox="0 0 50 50"><path d="M 25 2 A 1.0001 1.0001 0 0 0 24.845703 2.015625 C 12.227069 2.100968 2 12.361472 2 25 C 2 37.691367 12.308633 48 25 48 C 37.691367 48 48 37.691367 48 25 C 48 12.362796 37.775013 2.1030941 25.158203 2.015625 A 1.0001 1.0001 0 0 0 25 2 z M 25 4 C 36.610633 4 46 13.389367 46 25 C 46 36.610633 36.610633 46 25 46 C 13.389367 46 4 36.610633 4 25 C 4 13.389367 13.389367 4 25 4 z M 17 18 A 3 3 0 0 0 14 21 A 3 3 0 0 0 17 24 A 3 3 0 0 0 20 21 A 3 3 0 0 0 17 18 z M 33 18 A 3 3 0 0 0 30 21 A 3 3 0 0 0 33 24 A 3 3 0 0 0 36 21 A 3 3 0 0 0 33 18 z M 11.957031 28.988281 A 1.0001 1.0001 0 0 0 11.185547 30.582031 C 11.185547 30.582031 16.416667 38 25 38 C 33.583333 38 38.814453 30.582031 38.814453 30.582031 A 1.0010463 1.0010463 0 0 0 37.185547 29.417969 C 37.185547 29.417969 32.416667 36 25 36 C 17.583333 36 12.814453 29.417969 12.814453 29.417969 A 1.0001 1.0001 0 0 0 11.957031 28.988281 z"></path></svg>',
  send:
    '<svg viewBox="0 0 24 24"><path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M14.586,12L13,10.414V16c0,0.552-0.448,1-1,1h0 c-0.552,0-1-0.448-1-1v-5.586L9.414,12C9.024,12.39,8.39,12.39,8,12l0,0c-0.39-0.39-0.39-1.024,0-1.414l3.293-3.293 c0.39-0.39,1.024-0.39,1.414,0L16,10.586c0.39,0.39,0.39,1.024,0,1.414l0,0C15.61,12.39,14.976,12.39,14.586,12z"></path></svg>',
  play:
    '<svg viewBox="0 0 50 50"><path d="M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 19 35 L 19 15 L 36 25 Z"></path></svg>',
  pause:
    '<svg viewBox="0 0 50 50"><path d="M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 22 34 L 17 34 L 17 16 L 22 16 Z M 33 34 L 28 34 L 28 16 L 33 16 Z"></path></svg>',
  mic:
    '<svg viewBox="0 0 24 24"><path d="M 12 0 C 9.800781 0 8 1.800781 8 4 L 8 11 C 8 13.199219 9.800781 15 12 15 C 14.199219 15 16 13.199219 16 11 L 16 4 C 16 1.800781 14.199219 0 12 0 Z M 3 11 C 3 15.605469 6.523438 19.429688 11 19.9375 L 11 24 L 13 24 L 13 19.9375 C 17.476563 19.429688 21 15.605469 21 11 L 19 11 C 19 14.855469 15.855469 18 12 18 C 8.144531 18 5 14.855469 5 11 Z"></path></svg>',
  checkbox: {
    off:
      '<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>',
    on:
      '<svg viewBox="0 0 24 24"><path d="M11.707,15.707C11.512,15.902,11.256,16,11,16s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L11,13.586l8.35-8.35C17.523,3.251,14.911,2,12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10 c0-1.885-0.531-3.642-1.438-5.148L11.707,15.707z"></path></svg>',
  },
  down:
    '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 4.71875 6.015625 L 4.03125 6.734375 L 7.5 10.066406 L 10.96875 6.734375 L 10.28125 6.015625 L 7.5 8.679688 Z"></path></svg>',
};
const MessageInfo = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'My message',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        image: 'https://facebook.github.io/react/img/logo_og.png',
        // You can also add a video prop:
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,
        // Any additional custom parameters are passed through
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
  return (
    <View style={styles.wrapper}>
      <Header
        title={'123123'}
        navigation={props.navigation}
        styles={styles}
        context={{
          component: null,
          callback: () => {},
        }}
      />
      <GiftedChat
        messages={messages}
        locale={require('dayjs/locale/ru')}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Сообщение"
        videoProps
        alwaysShowSend
        scrollToBottom
      />
    </View>
  );
};

// start
export default class MessageInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unreadMessages: [],
      id: 0,
      data: this.props.navigation.getParam('data'),
      item: this.props.navigation.getParam('item'),
      type: this.props.navigation.getParam('type'),
      title: 'Сообщение',
      info: null,
      idx: 0,
      inputHeight: 0,
      message: null,
      audioIdx: 0,
      audioIsPlay: false,
      audioPlaySeconds: 0,
      audioDuration: [],
      audioRecordCancel: false,
      audioRecordShow: false,
      audioRecordSeconds: 0,
      audioRecordFilename: null,
      videoPlay: [],
      stickerShow: false,
      loading: true,
      overlayshow: false,
      forbidden: false,
      user: null,
      groups: [],
      groupuserShow: false,
      groupaddShow: false,
      groupid: 0,
      groupname: null,
      groupimage: null,
      groupimagedata: null,
      groupimagetype: null,
      groupadmin: false,
      users: [],
      groupusers: [],
      groupusersids: [],
      contacts: [],
      contactaddShow: false,
      usercontacts: [],
      selecteduser: null,
      isshowdown: false,
      complaintContent: null,
      modalVisible: false,
    };
    this.animPanel = new Animated.Value(panelHide);
  }
  audios = [];
  videos = [];
  audioTimer = null;
  messageTimer = null;
  scrollY = 0;
  componentWillReceiveProps = (props) => {
    let item = props.navigation.state.params.item;
    if (item === null || item === undefined) return;
    this.panelShow(false);
    this.setState({item, type: chatType.MESSAGE}, () => {
      const title = item.name,
        {user} = this.state;
      const info = item.imageAvatar ? (
        <Image
          source={{uri: `${API.assets}clients/${item.imageAvatar}`}}
          style={s.avatar}
        />
      ) : (
        <View
          style={[
            s.avatar,
            s.placeholder,
            {backgroundColor: Utils.colorGet()},
          ]}>
          <Text style={[styles.text, styles.white, styles.upper]}>
            {Utils.initialsGet(item.name)}
          </Text>
        </View>
      );
      this.setState({title, info});
      Messages.byUserGet(user.id, item.id, (res) => {
        let data = res.data;
        const parent =
          data.length > 0
            ? data[0]
            : {
                authorId: user.id,
                authorName: user.name,
                clientId: item.id,
                clientName: item.name,
                type: mediaType.EMPTY,
                isAuthor: 1,
                parentId: 0,
                statusAuthor: messageStatus.READED,
                statusClient: messageStatus.READED,
                message: null,
                dateCreate: Dates.now(),
              };
        data.sort((a, b) => (a.id > b.id ? 1 : -1));
        if (data.length > 0) this.setState({id: data[data.length - 1].id});
        this.setState(
          {parent, data: this.dataPrepare(data), loading: false},
          () => this.messagesTimerStart(),
        );
        this.unreadMessageSet(parent.parentId || parent.id, chatType.MESSAGE);
      });
      MessagesGroups.parentsGet(user.id, (res) => {
        let groups = [],
          messages = res.data;
        MessagesGroupsUsers.byUserGet(user.id, (res) => {
          messages.forEach((v) => {
            let msg = res.data.filter(
              (f) =>
                (f.parentId === 0 && f.id === v.messagesGroupId) ||
                (f.parentId !== 0 && f.parentId === v.messagesGroupId),
            );
            if (msg.length > 0) groups.push(v);
          });
          groups.sort((a, b) => (a.dateCreate > b.dateCreate ? -1 : 1));
          this.setState({groups});
        });
      });
    });
  };
  componentDidMount = () => {
    Storage.get('unreadMessages', (unreadMessages) => {
      const {data, type} = this.state;
      if (data && data.length > 0) {
        unreadMessages = JSON.parse(unreadMessages) || {};
        unreadMessages[
          `message_${type}_${data[0].parentId || data[0].id}`
        ] = Dates.now();
        Storage.set('unreadMessages', JSON.stringify(unreadMessages));
      }
    });
    Storage.get('user', (user) => {
      if (Utils.empty(user)) {
        Storage.set('startScreen', 'Start');
        this.props.navigation.navigate('Start');
      } else {
        user = JSON.parse(user);
        this.setState({user});
        const {item, data, type} = this.state;
        let {title, videoPlay} = this.state;
        if (this.state.type === chatType.MESSAGE) {
          MessagesGroups.parentsGet(user.id, (res) => {
            let groups = [],
              messages = res.data;
            MessagesGroupsUsers.byUserGet(user.id, (res) => {
              messages.forEach((v) => {
                let msg = res.data.filter(
                  (f) =>
                    (f.parentId === 0 && f.id === v.messagesGroupId) ||
                    (f.parentId !== 0 && f.parentId === v.messagesGroupId),
                );
                if (msg.length > 0) groups.push(v);
              });
              groups.sort((a, b) => (a.dateCreate > b.dateCreate ? -1 : 1));
              this.setState({groups});
            });
          });
        }
        if (this.state.type === chatType.GROUP) {
          if (Platform.OS === 'ios') this.contactsGet();
          else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            ).then((res) => {
              if (res !== 'granted') {
                this.setState({forbidden: true});
                return;
              }
              this.contactsGet();
            });
          }
        }
        if (item) {
          if (type === chatType.MESSAGE) {
            title = item.name;
            const info = item.imageAvatar ? (
              <Image
                source={{uri: `${API.assets}clients/${item.imageAvatar}`}}
                style={s.avatar}
              />
            ) : (
              <View
                style={[
                  s.avatar,
                  s.placeholder,
                  {backgroundColor: Utils.colorGet()},
                ]}>
                <Text style={[styles.text, styles.white, styles.upper]}>
                  {Utils.initialsGet(item.name)}
                </Text>
              </View>
            );
            this.setState({title, info});
            Messages.byUserGet(user.id, item.id, (res) => {
              let data = res.data;
              const parent =
                data.length > 0
                  ? data[0]
                  : {
                      authorId: user.id,
                      authorName: user.name,
                      clientId: item.id,
                      clientName: item.name,
                      type: mediaType.EMPTY,
                      isAuthor: 1,
                      parentId: 0,
                      statusAuthor: messageStatus.READED,
                      statusClient: messageStatus.READED,
                      message: null,
                      dateCreate: Dates.now(),
                    };
              data.sort((a, b) => (a.id > b.id ? 1 : -1));
              if (data.length > 0)
                this.setState({id: data[data.length - 1].id});
              this.setState(
                {parent, data: this.dataPrepare(data), loading: false},
                () => this.messagesTimerStart(),
              );
              this.unreadMessageSet(
                parent.parentId || parent.id,
                this.state.type,
              );
            });
          }
          if (type === chatType.GROUP) {
            title = item.title;
            const info = item.imageAvatar ? (
              <Image
                source={{uri: `${API.assets}groups/${item.imageAvatar}`}}
                style={s.avatar}
              />
            ) : (
              <View
                style={[
                  s.avatar,
                  s.placeholder,
                  {backgroundColor: Utils.colorGet()},
                ]}>
                <Text style={[styles.text, styles.white, styles.upper]}>
                  {Utils.initialsGet(item.title)}
                </Text>
              </View>
            );
            this.setState({title, info});
            MessagesGroups.lastChatMessagesGet(item.id, (res) => {
              let data = res.data;
              const parent =
                data.length > 0
                  ? data[0]
                  : {
                      authorId: user.id,
                      authorName: user.name,
                      type: mediaType.EMPTY,
                      parentId: 0,
                      title: 'Группа',
                      message: null,
                      dateCreate: Dates.now(),
                    };
              data.sort((a, b) => (a.id > b.id ? 1 : -1));
              if (data.length > 0)
                this.setState({id: data[data.length - 1].id});
              this.setState({parent, data: this.dataPrepare(data)}, () =>
                this.messagesTimerStart(),
              );
              this.unreadMessageSet(
                parent.parentId || parent.id,
                this.state.type,
              );
              MessagesGroupsUsers.allGet(item.id, (res) => {
                const ids = [],
                  groupusersids = [];
                res.data.forEach((v) => {
                  if (v.clientId !== user.id) {
                    if (v.status === messagesGroupsUserStatus.ACTIVE)
                      groupusersids.push(v.clientId);
                    ids.push(v.clientId);
                  }
                });
                if (ids.length > 0) {
                  Clients.byIdsGet(ids, (res) =>
                    this.setState({
                      groupusers: res.data,
                      groupusersids,
                      loading: false,
                    }),
                  );
                } else this.setState({loading: false});
              });
            });
          }
          if (type === chatType.PARTNER) {
            title = item.name;
            const info = (
              <Image
                source={{
                  uri: `${API.assets}partners/${
                    item.imageAvatar
                  }${Utils.uniqueLink()}`,
                }}
                style={s.avatar}
              />
            );
            this.setState({title, info});
            PartnerClientMessages.byClientGet(user.id, item.id, (res) => {
              let data = res.data;
              const parent =
                data.length > 0
                  ? data[0]
                  : {
                      parentId: 0,
                      clientId: user.id,
                      clientName: user.name,
                      partnerId: item.id,
                      partnerName: item.name,
                      type: mediaType.EMPTY,
                      isClient: true,
                      statusPartner: messageStatus.READED,
                      statusClient: messageStatus.READED,
                      message: null,
                      dateCreate: Dates.now(),
                    };
              data.sort((a, b) => (a.id > b.id ? 1 : -1));
              if (data.length > 0)
                this.setState({id: data[data.length - 1].id});
              this.setState(
                {
                  parent,
                  data: this.dataPrepare(data),
                  loading: false,
                  partner: item,
                },
                () => this.messagesTimerStart(),
              );
              this.unreadMessageSet(
                parent.parentId || parent.id,
                this.state.type,
              );
            });
          }
          return;
        }
        data.forEach((v, i) => {
          if (v.type === mediaType.VIDEO) videoPlay[i] = true;
          if (v.type === mediaType.AUDIO) {
            const audio = `${API.chats}audios/${v.message}`;
            Http.download(audio);
          }
        });
        const parent = data.filter(
          (f) =>
            f.parentId === null || f.parentId === undefined || f.parentId === 0,
        )[0];
        switch (type) {
          case chatType.MESSAGE:
            title =
              parent.clientId === user.id
                ? parent.authorName
                : parent.clientName;
            const id =
              parent.clientId === user.id ? parent.authorId : parent.clientId;
            Clients.get(id, (res) => {
              const client = res.data[0],
                info =
                  client && client.imageAvatar ? (
                    <Image
                      source={{
                        uri: `${API.assets}clients/${client.imageAvatar}`,
                      }}
                      style={s.avatar}
                    />
                  ) : (
                    <View
                      style={[
                        s.avatar,
                        s.placeholder,
                        {backgroundColor: Utils.colorGet()},
                      ]}>
                      <Text style={[styles.text, styles.white, styles.upper]}>
                        {Utils.initialsGet(client.name)}
                      </Text>
                    </View>
                  );
              this.setState({parent, info, item: client});
            });
            break;
          case chatType.GROUP:
            title = parent.title;
            const info = parent.imageAvatar ? (
              <Image
                source={{uri: `${API.assets}groups/${parent.imageAvatar}`}}
                style={s.avatar}
              />
            ) : (
              <View
                style={[
                  s.avatar,
                  s.placeholder,
                  {backgroundColor: Utils.colorGet()},
                ]}>
                <Text style={[styles.text, styles.white, styles.upper]}>
                  {Utils.initialsGet(title)}
                </Text>
              </View>
            );
            this.setState({info, item: parent, parent, groupname: title});
            MessagesGroupsUsers.allGet(parent.id, (res) => {
              const ids = [],
                groupusersids = [];
              res.data.forEach((v) => {
                if (v.clientId !== user.id) {
                  if (v.status === messagesGroupsUserStatus.ACTIVE)
                    groupusersids.push(v.clientId);
                  ids.push(v.clientId);
                }
              });
              if (ids.length > 0) {
                Clients.byIdsGet(ids, (res) =>
                  this.setState({
                    groupusers: res.data,
                    groupusersids,
                    loading: false,
                  }),
                );
              } else this.setState({loading: false});
            });
            break;
          case chatType.PARTNER:
            title = parent.partnerName;
            Partners.get(parent.partnerId, (res) => {
              const partner = res.data[0],
                info = (
                  <Image
                    source={{
                      uri: `${API.assets}partners/${
                        partner.imageAvatar
                      }${Utils.uniqueLink()}`,
                    }}
                    style={s.avatar}
                  />
                );
              this.setState({parent, info, item: partner});
            });
            break;
          default:
            break;
        }
        data.sort((a, b) => (a.id > b.id ? 1 : -1));
        if (data.length > 0) this.setState({id: data[data.length - 1].id});
        this.setState({videoPlay, title, data: this.dataPrepare(data)});
        if (type !== chatType.GROUP) this.setState({loading: false});
        this.messagesTimerStart();
      }
    });
  };
  componentWillUnmount = () => {
    this.audios.forEach((v) => v.release());
    clearInterval(this.audioTimer);
    clearInterval(this.messageTimer);
  };
  dataPrepare = (data) => {
    return data.reduce((r, a) => {
      const d = Math.floor(a.dateCreate / Dates.tsDay);
      r[d] = [...(r[d] || []), a];
      return r;
    }, {});
  };
  unreadMessageSet = (id, type) => {
    Storage.get('unreadMessages', (unreadMessages) => {
      unreadMessages = JSON.parse(unreadMessages) || {};
      unreadMessages[`message_${type}_${id}`] = Dates.now();
      Storage.set('unreadMessages', JSON.stringify(unreadMessages));
    });
  };
  messagesTimerStart = () => {
    if (this.messageTimer === null && this.state.parent && this.state.user)
      this.messageTimer = setInterval(this.messagesUpdate, 1000);
  };
  messagesUpdate = () => {
    const {id, user, parent, data, type} = this.state;
    switch (type) {
      case chatType.MESSAGE:
        Messages.lastGet(id, parent.id, user.id, (res) =>
          savestate(res.data, data),
        );
        break;
      case chatType.GROUP:
        MessagesGroups.lastGet(id, parent.id, user.id, (res) =>
          savestate(res.data, data),
        );
        break;
      case chatType.PARTNER:
        PartnerClientMessages.lastGet(id, parent.id, true, (res) =>
          savestate(res.data, data),
        );
        break;
      default:
        return;
    }
    const savestate = (messages, data) => {
      if (messages.length > 0) {
        const id = messages[messages.length - 1].id;
        const day = Dates.nowDay();
        data[day] = data[day] || [];
        data[day] = [...data[day], ...messages];
        this.setState({data, id});
      }
    };
  };
  contactsGet = () => {
    Contacts.getAll((error, contacts) => {
      if (error) this.setState({forbidden: true});
      else {
        if (contacts.length === 0) return;
        let c = [],
          phones = [],
          contactsOut = [];
        contacts.forEach((v) => {
          let phone =
            v.phoneNumbers.length > 0 ? v.phoneNumbers[0].number : null;
          if (Utils.empty(v.givenName) && Utils.empty(v.familyName))
            v.givenName = v.company;
          if (!Utils.empty(v.givenName) && !Utils.empty(phone)) {
            phone = Utils.phoneFormatter(Utils.phoneNormalize(phone));
            if (Utils.empty(phone)) phone = v.phoneNumbers[0].number;
            if (!Utils.empty(phone)) {
              phone = Utils.phoneClear(phone);
              if (phone.length === 11) {
                c.push({
                  firstName: v.givenName,
                  lastName: v.familyName,
                  avatar: v.hasThumbnail ? v.thumbnailPath : null,
                  phone,
                });
                phones.push(phone);
              }
            }
          }
          c.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
        });
        if (phones.length === 0) return;
        Clients.byPhonesGet(phones, (res) => {
          res.data.forEach((v) => {
            let item = c.filter((f) => Utils.phoneClear(f.phone) === v.phone);
            if (item.length > 0) {
              item = item[0];
              item.id = v.id;
              item.imageAvatar = v.imageAvatar;
              contactsOut.push(item);
            }
          });
          this.setState({contacts: contactsOut});
        });
      }
    });
  };
  stickerToggle = () => {
    Keyboard.dismiss();
    this.setState({stickerShow: !this.state.stickerShow, inputHeight: 0});
  };
  messageParse = (item, i) => {
    let {audioIsPlay, audioIdx} = this.state;
    switch (item.type) {
      /*
			case mediaType.STICKER:
				let arr = item.message.split('-')
				if (arr.length === 2) {
					const stickers = Stickers.filter(f => f.code === arr[0])[0]
					if (stickers) {
						const sticker = stickers.stickers[arr[1]]
						if (sticker) return <Image source={sticker} style={s.stickerImage} />
					}
				}
				break
			*/
      case mediaType.IMAGE:
        return (
          <Lightbox
            renderContent={() => (
              <Image
                style={s.imageFullScreen}
                source={{
                  uri: item.messagetemp || `${API.chats}images/${item.message}`,
                }}
              />
            )}>
            <Image
              source={{
                uri: item.messagetemp || `${API.chats}images/${item.message}`,
              }}
              style={s.stickerImage}
            />
          </Lightbox>
        );
      case mediaType.VIDEO:
        return (
          <TouchableOpacity onPress={() => this.videoPlay(i)}>
            <Video
              ref={(v) => (this.videos[i] = v)}
              source={{
                uri: item.messagetemp || `${API.chats}videos/${item.message}`,
              }}
              paused={this.state.videoPlay[i]}
              isBuffering={true}
              resizeMode={'cover'}
              style={s.videoPlaceholder}
              onFullscreenPlayerWillDismiss={() => this.videosStop(i)}
            />
          </TouchableOpacity>
        );
      case mediaType.AUDIO:
        if (!this.audios[i]) {
          const audio = new Sound(item.message, Sound.DOCUMENT, () => {
            this.audios[i] = audio;
            let {audioDuration} = this.state;
            audioDuration[i] = {
              duration: audio.getDuration(),
              current: this.audioTimeGet(audio.getDuration()),
              width: 0,
            };
            this.setState({audioDuration});
          });
        }
        return (
          <View style={s.audioBlock}>
            <TouchableOpacity
              onPress={() =>
                audioIsPlay && audioIdx === i
                  ? this.audioPause(i)
                  : this.audioPlay(i)
              }>
              <SvgXml
                width={32}
                height={32}
                xml={audioIsPlay && audioIdx === i ? icons.pause : icons.play}
                fill={'#4a86cc'}
              />
            </TouchableOpacity>
            <View style={s.audioInfo}>
              <View style={s.audioProgress}>
                <View
                  style={{
                    width: `${
                      this.state.audioDuration[i]
                        ? this.state.audioDuration[i].width
                        : 0
                    }%`,
                    height: 3,
                    backgroundColor: '#4a86cc',
                  }}></View>
              </View>
              <Text style={[styles.text, styles.small, styles.grey]}>
                {this.state.audioDuration[i] &&
                  this.state.audioDuration[i].current}
              </Text>
            </View>
          </View>
        );
      case mediaType.TEXT:
        return (
          <ParsedText
            style={styles.text}
            selectable={true}
            parse={[
              {
                type: 'url',
                style: styles.link,
                onPress: (url) => Linking.openURL(url),
              },
            ]}
            childrenProps={{allowFontScaling: false}}>
            {item.message}
          </ParsedText>
        );
      case mediaType.INFO:
        return (
          <Text style={[styles.text, styles.small, styles.italic]}>
            {item.message}
          </Text>
        );
    }
    return null;
  };
  save = (d, filename) => {
    const {user, type, parent} = this.state;
    let message;
    switch (type) {
      case chatType.MESSAGE:
        message = {
          parentId: parent.parentId !== 0 ? parent.parentId : parent.id,
          authorId: user.id,
          authorName: user.name,
          isAuthor: true,
          clientId:
            parent.isAuthor && parent.authorId === user.id
              ? parent.clientId
              : parent.authorId,
          clientName:
            parent.isAuthor && parent.authorId === user.id
              ? parent.clientName
              : parent.authorName,
          statusAuthor: messageStatus.READED,
          statusClient: messageStatus.NOT_READED,
          message: d.message,
          type: d.type,
        };
        Messages.add(message, (res) =>
          this.messageInsert(res.data.id, message, filename),
        );
        break;
      case chatType.GROUP:
        message = {
          parentId: parent.parentId !== 0 ? parent.parentId : parent.id,
          authorId: user.id,
          authorName: user.name,
          message: d.message,
          type: d.type,
        };
        MessagesGroups.add(message, (res) =>
          this.messageInsert(res.data.id, message, filename),
        );
        break;
      case chatType.PARTNER:
        message = {
          parentId: parent.parentId !== 0 ? parent.parentId : parent.id,
          clientId: user.id,
          clientName: user.name,
          partnerId: parent.partnerId,
          partnerName: parent.partnerName,
          statusPartner: messageStatus.NOT_READED,
          statusClient: messageStatus.READED,
          isClient: true,
          message: d.message,
          type: d.type,
        };
        PartnerClientMessages.add(message, (res) =>
          this.messageInsert(res.data.id, message, filename),
        );
        break;
      default:
        return;
    }
  };
  messageInsert = (id, message, filename) => {
    const {data, parent} = this.state,
      day = Dates.nowDay();
    if (parent.id === undefined) {
      parent.id = id;
      message.id = parent.id;
    }
    message.dateCreate = Dates.now();
    message.messagetemp = filename;
    data[day] = data[day] || [];
    data[day].push(message);
    this.setState({data, parent, inputHeight: 0});
    this.unreadMessageSet(parent.id, this.state.type);
    this.pushAndUnDelete(message, parent, this.state.type);
  };
  pushAndUnDelete = (message, parent, type) => {
    const {user, groupusers, groupusersids, groupname, item} = this.state;
    switch (type) {
      case chatType.MESSAGE:
        const clientId =
          parent.isAuthor && parent.authorId === user.id
            ? parent.clientId
            : parent.authorId;
        if (item.isMessages)
          Pushes.add(
            user.name,
            null,
            Messages.messageGet(message.type, message.message),
            clientId,
            pushType.USER,
            {user: user},
          );
        DeletedMessages.remove(clientId, parent.id, type);
        break;
      case chatType.GROUP:
        groupusers.forEach((v) => {
          const isactive = groupusersids.includes(v.id);
          if (isactive) {
            if (v.isGroups === 1)
              Pushes.add(
                groupname,
                null,
                `${user.name}: ${Messages.messageGet(
                  message.type,
                  message.message,
                )}`,
                v.id,
                pushType.USER,
                {group: item},
              );
          }
        });
        break;
      case chatType.PARTNER:
        Pushes.add(
          user.name,
          null,
          Messages.messageGet(message.type, message.message),
          parent.partnerId,
          pushType.PARTNER,
          {partneruser: user},
        );
        DeletedMessages.remove(user.id, parent.id, type);
        break;
    }
  };
  stickerSet = (code, i) =>
    this.save({message: `${code}-${i}`, type: mediaType.STICKER});
  messageSet = () => {
    const {message} = this.state;
    this.save({message, type: mediaType.TEXT});
    this.setState({message: null});
  };
  audioSet = (isCancel) => {
    AudioRecorder.stopRecording();
    this.setState({audioRecordCancel: isCancel});
  };
  audiosStop = () => {
    this.audios.forEach((v) => v.stop());
    let {audioDuration} = this.state;
    audioDuration.forEach((v) => (v.current = this.audioTimeGet(v.duration)));
    audioDuration.forEach((v) => (v.width = 0));
    this.setState({audioDuration, audioIdx: 0, audioIsPlay: false});
    clearInterval(this.audioTimer);
  };
  audioPlay = (i) => {
    if (this.state.audioIdx !== i) this.audiosStop();
    const audio = this.audios[i];
    if (audio) {
      let {audioDuration} = this.state;
      audio.play((success) => {
        if (success) {
          audio.stop();
          audioDuration[i].width = '100%';
          clearInterval(this.audioTimer);
          this.setState({audioIsPlay: false, audioIdx: 0, audioDuration});
        }
      });
      this.audioTimer = setInterval(
        () =>
          audio.getCurrentTime((audioPlaySeconds) => {
            audioDuration[i].current = this.audioTimeGet(audioPlaySeconds);
            audioDuration[i].width = Math.round(
              (audioPlaySeconds * 100) / audioDuration[i].duration,
            );
            this.setState({audioPlaySeconds});
          }),
        100,
      );
      this.setState({audioIdx: i, audioIsPlay: true});
    }
  };
  audioPause = (i) => {
    const audio = this.audios[i];
    if (audio) {
      audio.pause();
      this.setState({audioIsPlay: false});
    }
  };
  audioTimeGet = (seconds) => {
    const m = parseInt((seconds % (60 * 60)) / 60),
      s = parseInt(seconds % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  };
  audioRecord = () => {
    AudioRecorder.requestAuthorization().then((isAuth) => {
      if (!isAuth) {
        Alert.alert(
          'Нет доступа к микрофону',
          'Для того чтобы иметь возможность записывать звуковые сообщения, перейдите в Настройки и разрешите доступ к микрофону',
          [
            {text: 'Закрыть'},
            {
              text: 'Настройки',
              onPress: () => Linking.openSettings(),
              style: 'cancel',
            },
          ],
        );
        return;
      }
      this.audiosStop();
      Keyboard.dismiss();
      this.setState({audioRecordShow: true});
      const audioRecordFilename = `${new Date().valueOf()}.aac`;
      AudioRecorder.prepareRecordingAtPath(
        AudioUtils.DocumentDirectoryPath + '/' + audioRecordFilename,
        {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Low',
          AudioEncoding: 'aac',
          AudioEncodingBitRate: 32000,
          IncludeBase64: true,
        },
      );
      AudioRecorder.startRecording();
      AudioRecorder.onFinished = (res) => {
        this.setState({audioRecordSeconds: 0, audioRecordShow: false});
        const {audioRecordCancel} = this.state;
        if (!audioRecordCancel) {
          this.save(
            {message: audioRecordFilename, type: mediaType.AUDIO},
            res.audioFileURL,
          );
          Files.add(audioRecordFilename, 'audios', res.base64);
        }
      };
      AudioRecorder.onProgress = (data) =>
        this.setState({audioRecordSeconds: data.currentTime});
      this.setState({audioRecordFilename});
    });
  };
  audioRecordCancel = () => this.audioSet(true);
  imagePickerShow = (isgroup) => {
    const options = {
      title: null,
      cancelButtonTitle: 'Отмена',
      takePhotoButtonTitle: 'Открыть камеру',
      chooseFromLibraryButtonTitle: 'Выбрать из галереи',
      mediaType: isgroup ? 'photo' : 'mixed',
      quality: 1,
      videoQuality: 'high',
      durationLimit: 60,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      tintColor: '#4a86cc',
      permissionDenied: {
        title: 'Нет доступа к камере',
        text:
          'Для того чтобы иметь возможность снимать фото или видео, перейдите в Настройки и разрешите доступ к камере',
        reTryTitle: 'Повторить',
        okTitle: 'ОК',
      },
      maxWidth: 500,
      maxHeight: 500,
    };
    if (isgroup) {
      ImagePicker.showImagePicker(options, (response) => {
        if (!response.didCancel && !response.error)
          this.setState({
            groupimage: response.uri,
            groupimagedata: response.data,
            groupimagetype: this.imageExtGet(response.type),
          });
      });
    } else {
      ImagePicker.showImagePicker(options, (response) => {
        if (!response.didCancel && !response.error) {
          const filename = Utils.filenameGet(response.uri).toLowerCase();
          this.save(
            {
              message: filename,
              type: Utils.isVideo(filename) ? mediaType.VIDEO : mediaType.IMAGE,
            },
            response.uri,
          );
          if (Utils.isVideo(filename))
            Files.add(filename, 'videos', response.uri, true);
          else Files.add(filename, 'images', response.data);
        }
      });
    }
  };
  imageExtGet = (ext) => {
    ext = ext.replace('image/', '');
    return ext === 'jpeg' ? 'jpg' : ext;
  };
  videoPlay = (i) => {
    this.audiosStop();
    const video = this.videos[i];
    if (video) {
      let {videoPlay} = this.state;
      videoPlay[i] = false;
      this.setState({videoPlay});
      video.presentFullscreenPlayer();
    }
  };
  videosStop = () => {
    let videoPlay = [];
    this.state.videoPlay.forEach((v, i) => (videoPlay[i] = true));
    this.setState({videoPlay});
  };
  addStyleGet = (type) =>
    type == mediaType.STICKER
      ? s.nobg
      : type == mediaType.VIDEO || type == mediaType.IMAGE
      ? [s.nobg, s.nobgImageVideo]
      : null;
  addDateStyleGet = (type) =>
    type == mediaType.IMAGE || type == mediaType.VIDEO ? s.dateOver : s.date;
  panelShow = (isshow) => {
    const go = (callback) =>
      Animated.timing(this.animPanel, {
        toValue: isshow ? this.panelHeightGet() : panelHide,
        duration: 200,
        easing: Easing.ease,
      }).start(() => (callback ? callback() : () => {}));
    if (isshow) this.setState({overlayshow: isshow}, () => go());
    else
      go(() =>
        this.setState({overlayshow: isshow, groupid: 0, groupaddShow: false}),
      );
  };
  initialsGet = (name) => {
    name = name.split(' ');
    return Utils.initialsGet(name[0], name[1]);
  };
  inviteGroupShow = (isshow) => {
    if (isshow)
      this.setState({groupaddShow: isshow}, () => this.panelShow(true));
    else
      Animated.timing(this.animPanel, {
        toValue: panelUserY,
        duration: 200,
        easing: Easing.ease,
      }).start(() => this.setState({groupaddShow: isshow}));
  };
  groupSelect = (id) =>
    this.setState({groupid: this.state.groupid === id ? 0 : id});
  userSelect = (id) => {
    let {users} = this.state,
      selected = users.includes(id);
    if (selected) users = users.filter((f) => f !== id);
    else users.push(id);
    this.setState({users});
  };
  contactSelect = (id) => {
    let {usercontacts} = this.state,
      selected = usercontacts.includes(id);
    if (selected) usercontacts = usercontacts.filter((f) => f !== id);
    else usercontacts.push(id);
    this.setState({usercontacts});
  };
  invite = () => {
    const group = this.state.groups.filter(
      (f) => f.id === this.state.groupid,
    )[0];
    const data = {
      parentId: group.id,
      authorId: this.state.item.id,
      authorName: this.state.item.name,
      message: `${this.state.item.name} вступил(а) в группу «${group.title}»`,
      type: mediaType.INFO,
    };
    MessagesGroups.add(data);
    MessagesGroupsUsers.add({
      messagesGroupId: group.id,
      clientId: this.state.item.id,
      status: messagesGroupsUserStatus.ACTIVE,
    });
    Alert.alert(
      'Успех!',
      'Пользователь был добавлен в группу',
      [{text: 'Хорошо', onPress: () => this.panelShow(false)}],
      {cancelable: false},
    );
  };
  gotoPartnerActions = () =>
    setTimeout(
      () =>
        this.props.navigation.navigate('AdsInfo', {
          data: this.state.item,
          user: this.state.user,
        }),
      500,
    );
  gotoPartnerInfo = () =>
    setTimeout(
      () =>
        this.props.navigation.navigate('PartnerInfo', {
          data: this.state.item,
          user: this.state.user,
        }),
      500,
    );
  gotoUserMessages = (item) => {
    if (item.id === this.state.user.id) {
      this.props.navigation.navigate('Settings');
      return;
    }
    this.props.navigation.navigate('MessageInfo', {
      item,
      type: chatType.MESSAGE,
    });
  };
  leave = () => {
    Alert.alert(
      'Внимание!',
      'Вы уверены, что хотите покинуть группу?',
      [
        {text: 'Нет', style: 'cancel'},
        {
          text: 'Да',
          onPress: () => {
            MessagesGroupsUsers.remove(this.state.user.id);
            this.props.navigation.navigate('Messages');
          },
        },
      ],
      {cancelable: false},
    );
  };
  groupUpdate = () => {
    const id = this.state.item.id;
    let data = {
      title: this.state.groupname,
    };
    if (this.state.groupimagedata) {
      data.imageAvatar = `group_${id}.${this.state.groupimagetype}`;
      MessagesGroups.imageAdd(
        id,
        this.state.groupimagetype,
        this.state.groupimagedata,
      );
    }
    MessagesGroups.update(id, data);
    this.state.users.forEach((v) => {
      let client = this.state.groupusers.filter((f) => f.id === v)[0];
      MessagesGroupsUsers.fromGroupRemove(client.id, id);
      const {data} = this.state,
        day = Dates.nowDay();
      const message = {
        parentId: id,
        authorId: client.id,
        authorName: client.name,
        message: `${client.name} удален(а) из группы`,
        type: mediaType.INFO,
      };
      MessagesGroups.add(message);
      message.dateCreate = Dates.now();
      data[day] = data[day] || [];
      data[day].push(message);
      this.setState({data});
    });
    Alert.alert(
      'Успех!',
      'Группа была успешно обновлена',
      [{text: 'Хорошо', onPress: () => {}}],
      {cancelable: false},
    );
  };
  contactInviteShow = (isshow) =>
    this.setState({contactaddShow: isshow, usercontacts: []});
  contactsInvite = () => {
    const id = this.state.item.id;
    this.state.usercontacts.forEach((v) => {
      let client = this.state.contacts.filter((f) => f.id === v)[0];
      MessagesGroupsUsers.add(
        {
          messagesGroupId: id,
          clientId: client.id,
          status: messagesGroupsUserStatus.ACTIVE,
        },
        (res) => {
          if (res.code !== 0)
            MessagesGroupsUsers.toGroupRegister(client.id, id);
        },
      );
      const {data} = this.state,
        day = Dates.nowDay(),
        name = `${client.firstName} ${client.lastName}`;
      const message = {
        parentId: id,
        authorId: client.id,
        authorName: name,
        message: `${name} вступил(а) в группу`,
        type: mediaType.INFO,
      };
      MessagesGroups.add(message);
      message.dateCreate = Dates.now();
      data[day] = data[day] || [];
      data[day].push(message);
      this.setState({data});
    });
    Alert.alert(
      'Успех!',
      'Пользователи был добавлены в группу',
      [{text: 'Хорошо', onPress: () => this.contactInviteShow(false)}],
      {cancelable: false},
    );
  };
  isme = (item) => {
    const {user, type} = this.state;
    switch (type) {
      case chatType.MESSAGE:
        return item.isAuthor ? item.authorId === user.id : item.clientId;
      case chatType.GROUP:
        return item.authorId === user.id;
      case chatType.PARTNER:
        return item.isClient && item.clientId === user.id;
      default:
        return false;
    }
  };
  groupUserGet = (id) => {
    let user = this.state.groupusers.filter((f) => f.id === id);
    return user ? user[0] : {};
  };
  groupUserActiveGet = () =>
    this.state.groupusers.filter((f) =>
      this.state.groupusersids.includes(f.id),
    );
  groupUserPanelShow = (user) =>
    this.setState({groupuserShow: user !== undefined, selecteduser: user}, () =>
      this.panelShow(user !== undefined),
    );
  panelHeightGet = () =>
    this.state.type === chatType.PARTNER ||
    (this.state.type === chatType.GROUP && this.state.groupuserShow) ||
    (this.state.type === chatType.MESSAGE && !this.state.groupaddShow)
      ? panelUserY
      : panelY;
  panelStyleGet = () =>
    this.state.type === chatType.PARTNER ||
    (this.state.type === chatType.GROUP && this.state.groupuserShow) ||
    (this.state.type === chatType.MESSAGE && !this.state.groupaddShow)
      ? s.panelUser
      : null;
  scrollDown = () =>
    this.setState({isshowdown: false}, this.s.scrollToEnd({animated: true}));
  complaint = (isuser) => {
    this.panelShow(false);
    const complaintContent = (
      <ComplaintPopup
        styles={styles}
        client={this.state.user}
        user={isuser ? this.state.item : null}
        partner={isuser ? null : this.state.item}
        callback={() => {
          this.modalShow(false);
          this.setState({complaintContent: null});
        }}
      />
    );
    this.setState({complaintContent}, () => this.modalShow(true));
  };
  modalShow = (visible) => this.setState({modalVisible: visible});
  groupLinkCopy = () => {
    const clipboard = `groupcopy:${this.state.item.id}:${this.state.item.title}`;
    Clipboard.setString(clipboard);
    this.setState({clipboard}, () =>
      Alert.alert(
        'Успех!',
        'Ссылка на группу была скопирована успешно!',
        [{text: 'Хорошо', onPress: () => {}}],
        {cancelable: false},
      ),
    );
  };
  render() {
    const {data, idx, inputHeight} = this.state;
    return (
      <View style={styles.wrapper}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          {this.state.complaintContent}
          <ClosePopup callback={() => this.modalShow(false)} />
        </Modal>
        <Header
          title={this.state.title}
          navigation={this.props.navigation}
          styles={styles}
          context={{
            component: this.state.info || (
              <View style={[s.avatar, s.placeholder]}>
                <Text style={[styles.text, styles.white, styles.upper]}>
                  {Utils.initialsGet('?')}
                </Text>
              </View>
            ),
            callback: () => this.panelShow(true),
          }}
        />
        {this.state.loading ? (
          <Loader styles={styles} />
        ) : (
          <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.select({android: undefined, ios: 'padding'})}
            enabled>
            <ScrollView
              ref={(ref) => (this.s = ref)}
              scrollEventThrottle={1}
              onContentSizeChange={(width, height) => {
                this.scrollY = height;
                this.s.scrollToEnd({animated: true});
              }}
              onScroll={(event) => {
                const y = event.nativeEvent.contentOffset.y;
                this.setState({isshowdown: this.scrollY - y > 1000});
              }}>
              {Object.entries(data).map((entry, i) => (
                <View key={i}>
                  <Text
                    style={[
                      styles.text,
                      styles.mini,
                      styles.grey,
                      styles.center,
                      s.separator,
                    ]}>
                    {Dates.get(entry[0] * Dates.tsDay, {
                      neerCheck: true,
                      showMonthFullName: true,
                    })}
                  </Text>
                  {entry[1].map((v, i) =>
                    this.isme(v) ? (
                      <View
                        key={i}
                        style={[s.message, s.me, this.addStyleGet(v.type)]}>
                        {this.messageParse(v, i)}
                        <Text
                          style={[
                            styles.text,
                            styles.mini,
                            styles.grey,
                            this.addDateStyleGet(v.type),
                          ]}>
                          {Dates.get(v.dateCreate, {
                            showMonthShortName: true,
                            neerCheck: true,
                          })}
                        </Text>
                      </View>
                    ) : (
                      <View key={i} style={s.item}>
                        {this.state.type === chatType.GROUP ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.groupUserPanelShow(
                                this.groupUserGet(v.authorId),
                              )
                            }>
                            {this.groupUserGet(v.authorId).imageAvatar ? (
                              <Image
                                source={{
                                  uri: `${API.assets}clients/${
                                    this.groupUserGet(v.authorId).imageAvatar
                                  }`,
                                }}
                                style={s.image}
                              />
                            ) : (
                              <View
                                style={[
                                  s.image,
                                  s.placeholder,
                                  {backgroundColor: Utils.colorGet()},
                                ]}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.white,
                                    styles.upper,
                                  ]}>
                                  {this.initialsGet(
                                    this.groupUserGet(v.authorId).name,
                                  )}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ) : null}
                        <View style={[s.message, this.addStyleGet(v.type)]}>
                          {this.state.type === chatType.GROUP ? (
                            <Text
                              style={[styles.text, styles.small, styles.mb5]}>
                              {v.authorName}
                            </Text>
                          ) : null}
                          {this.messageParse(v, i)}
                          <Text
                            style={[
                              styles.text,
                              styles.mini,
                              styles.grey,
                              this.addDateStyleGet(v.type),
                            ]}>
                            {Dates.get(v.dateCreate, {
                              showMonthShortName: true,
                              neerCheck: true,
                            })}
                          </Text>
                        </View>
                      </View>
                    ),
                  )}
                </View>
              ))}
            </ScrollView>
            {this.state.isshowdown ? (
              <TouchableOpacity
                style={s.arrowdown}
                onPress={() => this.scrollDown()}>
                <SvgXml
                  width={32}
                  height={32}
                  xml={icons.down}
                  fill={'#2979ff'}
                />
              </TouchableOpacity>
            ) : null}
            {this.state.item ? (
              this.state.item.isPersonalMessages === 0 ? (
                <View style={s.messageBlockNoMessages}>
                  <Text style={[styles.text, styles.middle, styles.grey]}>
                    Пользователь запретил отправлять ему личные сообщения
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    s.messageBlock,
                    s.messageBlockInner,
                    inputHeight > 40 ? s.messageBlockTop : null,
                  ]}>
                  {this.state.audioRecordShow ? (
                    <View style={s.recordBlock}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('./images/rec.gif')}
                          style={s.rec}
                        />
                        <Text style={[styles.text, styles.small, styles.grey]}>
                          {this.audioTimeGet(this.state.audioRecordSeconds)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.text,
                          styles.small,
                          styles.grey,
                          {marginRight: 20, color: '#4a86cc'},
                        ]}
                        onPress={() => this.audioRecordCancel()}>
                        Отмена
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={[
                          s.messageBlockInner,
                          inputHeight > 40 ? s.messageBlockTop : null,
                        ]}>
                        <TouchableOpacity
                          onPress={() => this.imagePickerShow(false)}>
                          <SvgXml
                            width={26}
                            height={26}
                            xml={icons.plus}
                            fill={'#9c9fa8'}
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={[styles.text, s.input]}
                          value={this.state.message}
                          onChangeText={(message) => this.setState({message})}
                          onFocus={() =>
                            this.setState({stickerShow: false, inputHeight: 0})
                          }
                          onBlur={() => this.setState({inputHeight: 0})}
                          onContentSizeChange={(event) =>
                            this.setState({
                              inputHeight: event.nativeEvent.contentSize.height,
                            })
                          }
                          multiline={true}
                          placeholder={'Сообщение'}
                          underlineColorAndroid={'transparent'}
                        />
                        {/*
										<TouchableOpacity onPress={() => this.stickerToggle()} style={s.smileIcon}><SvgXml width={22} height={22} xml={icons.smile} fill={this.state.stickerShow?'#4a86cc':'#9c9fa8'} /></TouchableOpacity>
										*/}
                      </View>
                    </View>
                  )}
                  {this.state.message ? (
                    <TouchableOpacity onPress={() => this.messageSet()}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.send}
                        fill={'#2979ff'}
                      />
                    </TouchableOpacity>
                  ) : this.state.audioRecordShow ? (
                    <TouchableOpacity onPress={() => this.audioSet()}>
                      <SvgXml
                        width={32}
                        height={32}
                        xml={icons.send}
                        fill={'#2979ff'}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.audioRecord()}>
                      <SvgXml
                        width={22}
                        height={22}
                        xml={icons.mic}
                        style={{marginLeft: 4}}
                        fill={'#9c9fa8'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )
            ) : null}
            {this.state.stickerShow && (
              <View style={s.stickersBlock}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={s.stickerHeadBlock}>
                  {Stickers.map((v, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[s.thumbBlock, idx === i ? s.thumbSelected : null]}
                      onPress={() => this.setState({idx: i})}>
                      <Image source={v.cover} style={s.thumb} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <FlatList
                  data={Stickers[idx].stickers}
                  style={s.stickerBlock}
                  contentContainerStyle={s.stickerBlockContent}
                  numColumns={4}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.stickerSet(Stickers[idx].code, index)
                      }>
                      <Image source={item} style={s.sticker} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </KeyboardAvoidingView>
        )}
        {this.state.overlayshow && (
          <View style={s.overlay}>
            <Animated.View
              style={[s.panel, this.panelStyleGet(), {top: this.animPanel}]}>
              {this.state.type === chatType.MESSAGE &&
                (this.state.groupaddShow ? (
                  <View style={s.panelblock}>
                    <Text
                      style={[
                        styles.text,
                        styles.title,
                        styles.bold,
                        styles.center,
                      ]}>
                      Группы
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.inviteGroupShow(false)}
                      style={s.cancel}>
                      <Text style={[styles.text, styles.blue]}>Назад</Text>
                    </TouchableOpacity>
                    {this.state.groupid ? (
                      <TouchableOpacity
                        onPress={() => this.invite()}
                        style={s.invite}>
                        <Text style={[styles.text, styles.bold, styles.blue]}>
                          Пригласить
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={[
                          styles.text,
                          styles.bold,
                          styles.light,
                          s.invite,
                        ]}>
                        Пригласить
                      </Text>
                    )}
                    {this.state.groups.length > 0 ? (
                      <FlatList
                        style={s.panellist}
                        data={this.state.groups}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => this.groupSelect(item.id)}
                            style={s.itemgroup}>
                            {item.imageAvatar ? (
                              <Image
                                source={{
                                  uri: `${API.assets}groups/${item.imageAvatar}`,
                                }}
                                style={s.avatargroup}
                              />
                            ) : (
                              <View
                                style={[
                                  s.avatargroup,
                                  s.placeholder,
                                  {backgroundColor: Utils.colorGet()},
                                ]}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.white,
                                    styles.upper,
                                  ]}>
                                  {Utils.initialsGet(item.title)}
                                </Text>
                              </View>
                            )}
                            <Text
                              style={[styles.text, s.panelname]}
                              numberOfLines={1}>
                              {item.title}
                            </Text>
                            {this.state.groupid === item.id ? (
                              <SvgXml
                                width={24}
                                height={24}
                                fill={'#007aff'}
                                style={s.checkbox}
                                xml={icons.checkbox.on}
                              />
                            ) : (
                              <SvgXml
                                width={24}
                                height={24}
                                fill={'#ccc'}
                                style={s.checkbox}
                                xml={icons.checkbox.off}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    ) : (
                      <View style={s.panelnotfound}>
                        <Text style={styles.text}>
                          У вас нет созданных групп
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={s.panelblock}>
                    <TouchableOpacity
                      onPress={() => this.panelShow(false)}
                      style={s.cancel}>
                      <Text style={[styles.text, styles.blue]}>Закрыть</Text>
                    </TouchableOpacity>
                    {this.state.item ? (
                      <View style={s.contactinfo}>
                        {this.state.item.imageAvatar ? (
                          <Image
                            source={{
                              uri: `${API.assets}clients/${this.state.item.imageAvatar}`,
                            }}
                            style={s.avatarinfo}
                          />
                        ) : (
                          <View
                            style={[
                              s.avatarinfo,
                              s.placeholder,
                              {backgroundColor: Utils.colorGet()},
                            ]}>
                            <Text
                              style={[
                                styles.text,
                                styles.avatartext,
                                styles.white,
                                styles.upper,
                              ]}>
                              {this.initialsGet(this.state.item.name)}
                            </Text>
                          </View>
                        )}
                        <Text
                          style={[
                            styles.text,
                            styles.title,
                            styles.bold,
                            styles.center,
                          ]}>
                          {this.state.item.name}
                        </Text>
                        {this.state.item.isGroupInvite ? (
                          <TouchableOpacity
                            onPress={() => this.inviteGroupShow(true)}
                            style={[s.panellink, s.panellinkone]}>
                            <SvgXml
                              width={26}
                              height={26}
                              style={s.panelicon}
                              fill={'#007aff'}
                              xml={
                                '<svg viewBox="0 0 16 16"><path d="M 4.5 3 C 3.125 3 2 4.125 2 5.5 C 2 6.441406 2.535156 7.253906 3.304688 7.679688 C 1.40625 8.210938 0 9.9375 0 12 L 1 12 C 1 10.0625 2.5625 8.5 4.5 8.5 C 5.65625 8.5 6.664063 9.0625 7.296875 9.929688 C 7.113281 10.421875 7 10.945313 7 11.5 C 7 13.980469 9.019531 16 11.5 16 C 13.980469 16 16 13.980469 16 11.5 C 16 9.617188 14.832031 8.003906 13.183594 7.335938 C 13.679688 6.875 14 6.226563 14 5.5 C 14 4.125 12.875 3 11.5 3 C 10.125 3 9 4.125 9 5.5 C 9 6.226563 9.320313 6.875 9.816406 7.335938 C 8.988281 7.671875 8.28125 8.242188 7.78125 8.96875 C 7.230469 8.367188 6.527344 7.902344 5.71875 7.671875 C 6.476563 7.238281 7 6.429688 7 5.5 C 7 4.125 5.875 3 4.5 3 Z M 4.5 4 C 5.335938 4 6 4.664063 6 5.5 C 6 6.335938 5.335938 7 4.5 7 C 3.664063 7 3 6.335938 3 5.5 C 3 4.664063 3.664063 4 4.5 4 Z M 11.5 4 C 12.335938 4 13 4.664063 13 5.5 C 13 6.335938 12.335938 7 11.5 7 C 10.664063 7 10 6.335938 10 5.5 C 10 4.664063 10.664063 4 11.5 4 Z M 11.5 8 C 13.4375 8 15 9.5625 15 11.5 C 15 13.4375 13.4375 15 11.5 15 C 9.5625 15 8 13.4375 8 11.5 C 8 10.910156 8.15625 10.363281 8.414063 9.875 L 8.4375 9.859375 C 8.4375 9.855469 8.433594 9.851563 8.429688 9.847656 C 9.019531 8.75 10.164063 8 11.5 8 Z M 11 9 L 11 11 L 9 11 L 9 12 L 11 12 L 11 14 L 12 14 L 12 12 L 14 12 L 14 11 L 12 11 L 12 9 Z"></path></svg>'
                              }
                            />
                            <Text style={[styles.text, styles.blue]}>
                              Пригласить в группу
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.complaint(true)}
                          style={s.panellink}>
                          <SvgXml
                            width={26}
                            height={26}
                            style={s.panelicon}
                            fill={'#c00'}
                            xml={
                              '<svg viewBox="0 0 32 32"><path d="M 24 0 C 19.593562 0 16 3.593562 16 8 C 16 9.6613873 16.568267 11.171408 17.4375 12.449219 L 16.791016 17.605469 L 21.599609 15.544922 C 22.363813 15.790484 23.151145 16 24 16 C 28.406438 16 32 12.406438 32 8 C 32 3.593562 28.406438 0 24 0 z M 24 2 C 27.325562 2 30 4.674438 30 8 C 30 11.325562 27.325562 14 24 14 C 23.233063 14 22.503407 13.851407 21.824219 13.585938 L 21.443359 13.435547 L 19.208984 14.392578 L 19.509766 11.990234 L 19.255859 11.662109 C 18.468407 10.645126 18 9.3845393 18 8 C 18 4.674438 20.674438 2 24 2 z M 23 4 L 23 9 L 25 9 L 25 4 L 23 4 z M 8 9 C 6.0833339 9 4.5185588 9.7547551 3.5019531 10.898438 C 2.4853474 12.042118 2 13.527778 2 15 C 2 16.472222 2.4853474 17.957881 3.5019531 19.101562 C 3.7812921 19.41582 4.1947617 19.61147 4.5527344 19.859375 C 1.8843013 21.158567 5.9211895e-16 23.841626 0 27 L 2 27 C 2 23.674438 4.674438 21 8 21 C 11.325562 21 14 23.674438 14 27 L 16 27 C 16 23.841626 14.115699 21.158567 11.447266 19.859375 C 11.805238 19.61147 12.218708 19.415819 12.498047 19.101562 C 13.514653 17.957881 14 16.472222 14 15 C 14 13.527778 13.514653 12.042119 12.498047 10.898438 C 11.481441 9.7547551 9.9166661 9 8 9 z M 23 10 L 23 12 L 25 12 L 25 10 L 23 10 z M 8 11 C 9.4166658 11 10.351893 11.495244 11.001953 12.226562 C 11.652013 12.957882 12 13.972222 12 15 C 12 16.027778 11.652013 17.042119 11.001953 17.773438 C 10.351893 18.504756 9.4166658 19 8 19 C 6.5833342 19 5.6481071 18.504756 4.9980469 17.773438 C 4.3479866 17.042119 4 16.027778 4 15 C 4 13.972222 4.3479866 12.957881 4.9980469 12.226562 C 5.6481071 11.495245 6.5833342 11 8 11 z"></path></svg>'
                            }
                          />
                          <Text style={[styles.text, styles.red]}>
                            Пожаловаться
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                ))}
              {this.state.type === chatType.PARTNER && (
                <View style={s.panelblock}>
                  <TouchableOpacity
                    onPress={() => this.panelShow(false)}
                    style={s.cancel}>
                    <Text style={[styles.text, styles.blue]}>Закрыть</Text>
                  </TouchableOpacity>
                  {this.state.item ? (
                    <View style={s.contactinfo}>
                      <Image
                        source={{
                          uri: `${API.assets}partners/${
                            this.state.item.imageAvatar
                          }${Utils.uniqueLink()}`,
                        }}
                        style={s.avatarinfo}
                      />
                      <Text
                        style={[
                          styles.text,
                          styles.title,
                          styles.bold,
                          styles.center,
                        ]}>
                        {this.state.item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.gotoPartnerActions()}
                        style={[s.panellink, s.panellinkone]}>
                        <SvgXml
                          width={26}
                          height={26}
                          style={s.panelicon}
                          fill={'#007aff'}
                          xml={
                            '<svg viewBox="0 0 16 16"><path d="M 5 3 C 3.902344 3 3 3.902344 3 5 C 3 6.097656 3.902344 7 5 7 C 6.097656 7 7 6.097656 7 5 C 7 3.902344 6.097656 3 5 3 Z M 12.269531 3.023438 L 3.023438 12.269531 L 3.726563 12.980469 L 12.980469 3.726563 Z M 5 4 C 5.558594 4 6 4.441406 6 5 C 6 5.558594 5.558594 6 5 6 C 4.441406 6 4 5.558594 4 5 C 4 4.441406 4.441406 4 5 4 Z M 11 9 C 9.902344 9 9 9.902344 9 11 C 9 12.097656 9.902344 13 11 13 C 12.097656 13 13 12.097656 13 11 C 13 9.902344 12.097656 9 11 9 Z M 11 10 C 11.558594 10 12 10.441406 12 11 C 12 11.558594 11.558594 12 11 12 C 10.441406 12 10 11.558594 10 11 C 10 10.441406 10.441406 10 11 10 Z"></path></svg>'
                          }
                        />
                        <Text style={[styles.text, styles.blue]}>
                          Текущие акции
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.gotoPartnerInfo()}
                        style={s.panellink}>
                        <SvgXml
                          width={26}
                          height={26}
                          style={s.panelicon}
                          fill={'#007aff'}
                          xml={
                            '<svg viewBox="0 0 16 16"><path d="M 7.5 1 C 3.917969 1 1 3.917969 1 7.5 C 1 11.082031 3.917969 14 7.5 14 C 11.082031 14 14 11.082031 14 7.5 C 14 3.917969 11.082031 1 7.5 1 Z M 7.5 2 C 10.542969 2 13 4.457031 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 4.457031 13 2 10.542969 2 7.5 C 2 4.457031 4.457031 2 7.5 2 Z M 7 4 L 7 5 L 8 5 L 8 4 Z M 7 6 L 7 11 L 8 11 L 8 6 Z"></path></svg>'
                          }
                        />
                        <Text style={[styles.text, styles.blue]}>
                          Подробная информация
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.complaint(this.state.item.id, false)
                        }
                        style={s.panellink}>
                        <SvgXml
                          width={26}
                          height={26}
                          style={s.panelicon}
                          fill={'#c00'}
                          xml={
                            '<svg viewBox="0 0 32 32"><path d="M 24 0 C 19.593562 0 16 3.593562 16 8 C 16 9.6613873 16.568267 11.171408 17.4375 12.449219 L 16.791016 17.605469 L 21.599609 15.544922 C 22.363813 15.790484 23.151145 16 24 16 C 28.406438 16 32 12.406438 32 8 C 32 3.593562 28.406438 0 24 0 z M 24 2 C 27.325562 2 30 4.674438 30 8 C 30 11.325562 27.325562 14 24 14 C 23.233063 14 22.503407 13.851407 21.824219 13.585938 L 21.443359 13.435547 L 19.208984 14.392578 L 19.509766 11.990234 L 19.255859 11.662109 C 18.468407 10.645126 18 9.3845393 18 8 C 18 4.674438 20.674438 2 24 2 z M 23 4 L 23 9 L 25 9 L 25 4 L 23 4 z M 8 9 C 6.0833339 9 4.5185588 9.7547551 3.5019531 10.898438 C 2.4853474 12.042118 2 13.527778 2 15 C 2 16.472222 2.4853474 17.957881 3.5019531 19.101562 C 3.7812921 19.41582 4.1947617 19.61147 4.5527344 19.859375 C 1.8843013 21.158567 5.9211895e-16 23.841626 0 27 L 2 27 C 2 23.674438 4.674438 21 8 21 C 11.325562 21 14 23.674438 14 27 L 16 27 C 16 23.841626 14.115699 21.158567 11.447266 19.859375 C 11.805238 19.61147 12.218708 19.415819 12.498047 19.101562 C 13.514653 17.957881 14 16.472222 14 15 C 14 13.527778 13.514653 12.042119 12.498047 10.898438 C 11.481441 9.7547551 9.9166661 9 8 9 z M 23 10 L 23 12 L 25 12 L 25 10 L 23 10 z M 8 11 C 9.4166658 11 10.351893 11.495244 11.001953 12.226562 C 11.652013 12.957882 12 13.972222 12 15 C 12 16.027778 11.652013 17.042119 11.001953 17.773438 C 10.351893 18.504756 9.4166658 19 8 19 C 6.5833342 19 5.6481071 18.504756 4.9980469 17.773438 C 4.3479866 17.042119 4 16.027778 4 15 C 4 13.972222 4.3479866 12.957881 4.9980469 12.226562 C 5.6481071 11.495245 6.5833342 11 8 11 z"></path></svg>'
                          }
                        />
                        <Text style={[styles.text, styles.red]}>
                          Пожаловаться
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
              {this.state.type === chatType.GROUP &&
                (this.state.groupuserShow ? (
                  <View style={s.panelblock}>
                    <TouchableOpacity
                      onPress={() => this.groupUserPanelShow()}
                      style={s.cancel}>
                      <Text style={[styles.text, styles.blue]}>Закрыть</Text>
                    </TouchableOpacity>
                    {this.state.selecteduser ? (
                      <View style={s.contactinfo}>
                        {this.state.selecteduser.imageAvatar ? (
                          <Image
                            source={{
                              uri: `${API.assets}clients/${this.state.selecteduser.imageAvatar}`,
                            }}
                            style={s.avatarinfo}
                          />
                        ) : (
                          <View
                            style={[
                              s.avatarinfo,
                              s.placeholder,
                              {backgroundColor: Utils.colorGet()},
                            ]}>
                            <Text
                              style={[
                                styles.text,
                                styles.avatartext,
                                styles.white,
                                styles.upper,
                              ]}>
                              {this.initialsGet(this.state.selecteduser.name)}
                            </Text>
                          </View>
                        )}
                        <Text
                          style={[
                            styles.text,
                            styles.title,
                            styles.bold,
                            styles.center,
                          ]}>
                          {this.state.selecteduser.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.gotoUserMessages(this.state.selecteduser)
                          }
                          style={[s.panellink, s.panellinkone]}>
                          <SvgXml
                            width={26}
                            height={26}
                            style={[s.panelicon, s.paneliconmessage]}
                            fill={'#007aff'}
                            xml={
                              '<svg viewBox="0 0 16 16"><path d="M 2.5 2 C 1.675781 2 1 2.675781 1 3.5 L 1 11.5 C 1 12.324219 1.675781 13 2.5 13 L 4 13 L 4 15.433594 L 7.652344 13 L 12.5 13 C 13.324219 13 14 12.324219 14 11.5 L 14 3.5 C 14 2.675781 13.324219 2 12.5 2 Z M 2.5 3 L 12.5 3 C 12.78125 3 13 3.21875 13 3.5 L 13 11.5 C 13 11.78125 12.78125 12 12.5 12 L 7.347656 12 L 5 13.566406 L 5 12 L 2.5 12 C 2.21875 12 2 11.78125 2 11.5 L 2 3.5 C 2 3.21875 2.21875 3 2.5 3 Z"></path></svg>'
                            }
                          />
                          <Text style={[styles.text, styles.blue]}>
                            Написать сообщение
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.complaint(true)}
                          style={s.panellink}>
                          <SvgXml
                            width={26}
                            height={26}
                            style={[s.panelicon, s.paneliconmessage]}
                            fill={'#c00'}
                            xml={
                              '<svg viewBox="0 0 32 32"><path d="M 24 0 C 19.593562 0 16 3.593562 16 8 C 16 9.6613873 16.568267 11.171408 17.4375 12.449219 L 16.791016 17.605469 L 21.599609 15.544922 C 22.363813 15.790484 23.151145 16 24 16 C 28.406438 16 32 12.406438 32 8 C 32 3.593562 28.406438 0 24 0 z M 24 2 C 27.325562 2 30 4.674438 30 8 C 30 11.325562 27.325562 14 24 14 C 23.233063 14 22.503407 13.851407 21.824219 13.585938 L 21.443359 13.435547 L 19.208984 14.392578 L 19.509766 11.990234 L 19.255859 11.662109 C 18.468407 10.645126 18 9.3845393 18 8 C 18 4.674438 20.674438 2 24 2 z M 23 4 L 23 9 L 25 9 L 25 4 L 23 4 z M 8 9 C 6.0833339 9 4.5185588 9.7547551 3.5019531 10.898438 C 2.4853474 12.042118 2 13.527778 2 15 C 2 16.472222 2.4853474 17.957881 3.5019531 19.101562 C 3.7812921 19.41582 4.1947617 19.61147 4.5527344 19.859375 C 1.8843013 21.158567 5.9211895e-16 23.841626 0 27 L 2 27 C 2 23.674438 4.674438 21 8 21 C 11.325562 21 14 23.674438 14 27 L 16 27 C 16 23.841626 14.115699 21.158567 11.447266 19.859375 C 11.805238 19.61147 12.218708 19.415819 12.498047 19.101562 C 13.514653 17.957881 14 16.472222 14 15 C 14 13.527778 13.514653 12.042119 12.498047 10.898438 C 11.481441 9.7547551 9.9166661 9 8 9 z M 23 10 L 23 12 L 25 12 L 25 10 L 23 10 z M 8 11 C 9.4166658 11 10.351893 11.495244 11.001953 12.226562 C 11.652013 12.957882 12 13.972222 12 15 C 12 16.027778 11.652013 17.042119 11.001953 17.773438 C 10.351893 18.504756 9.4166658 19 8 19 C 6.5833342 19 5.6481071 18.504756 4.9980469 17.773438 C 4.3479866 17.042119 4 16.027778 4 15 C 4 13.972222 4.3479866 12.957881 4.9980469 12.226562 C 5.6481071 11.495245 6.5833342 11 8 11 z"></path></svg>'
                            }
                          />
                          <Text style={[styles.text, styles.red]}>
                            Пожаловаться
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                ) : this.state.item ? (
                  this.state.item.authorId !== this.state.user.id ? (
                    <View style={s.panelblock}>
                      <TouchableOpacity
                        onPress={() => this.panelShow(false)}
                        style={s.cancel}>
                        <Text style={[styles.text, styles.blue]}>Закрыть</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.leave()}
                        style={s.invite}>
                        <Text style={[styles.text, styles.red]}>Выйти</Text>
                      </TouchableOpacity>
                      <View style={s.contactinfo}>
                        {this.state.item.imageAvatar ? (
                          <Image
                            source={{
                              uri: `${API.assets}groups/${this.state.item.imageAvatar}`,
                            }}
                            style={s.avatarinfo}
                          />
                        ) : (
                          <View
                            style={[
                              s.avatarinfo,
                              s.placeholder,
                              {backgroundColor: Utils.colorGet()},
                            ]}>
                            <Text
                              style={[
                                styles.text,
                                styles.avatartext,
                                styles.white,
                                styles.upper,
                              ]}>
                              {this.initialsGet(this.state.item.title)}
                            </Text>
                          </View>
                        )}
                        <Text
                          style={[
                            styles.text,
                            styles.title,
                            styles.bold,
                            styles.center,
                          ]}>
                          {this.state.item.title}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => this.groupLinkCopy()}
                        style={s.copyiconother}>
                        <SvgXml
                          width={24}
                          height={24}
                          fill={'#ccc'}
                          xml={
                            '<svg viewBox="0 0 16 16"><path d="M 1.5 0 C 0.675781 0 0 0.675781 0 1.5 L 0 10.5 C 0 11.324219 0.675781 12 1.5 12 L 2 12 L 2 12.5 C 2 13.324219 2.675781 14 3.5 14 L 12.5 14 C 13.324219 14 14 13.324219 14 12.5 L 14 3.5 C 14 2.675781 13.324219 2 12.5 2 L 12 2 L 12 1.5 C 12 0.675781 11.324219 0 10.5 0 Z M 1.5 1 L 10.5 1 C 10.78125 1 11 1.21875 11 1.5 L 11 2 L 3.5 2 C 2.675781 2 2 2.675781 2 3.5 L 2 11 L 1.5 11 C 1.21875 11 1 10.78125 1 10.5 L 1 1.5 C 1 1.21875 1.21875 1 1.5 1 Z M 3.5 3 L 12.5 3 C 12.78125 3 13 3.21875 13 3.5 L 13 12.5 C 13 12.78125 12.78125 13 12.5 13 L 3.5 13 C 3.21875 13 3 12.78125 3 12.5 L 3 3.5 C 3 3.21875 3.21875 3 3.5 3 Z M 10.5 4 C 10.117188 4 9.730469 4.148438 9.4375 4.4375 L 8.4375 5.4375 C 7.980469 5.898438 7.894531 6.578125 8.15625 7.132813 C 8.152344 7.136719 8.148438 7.140625 8.148438 7.148438 L 7.148438 8.148438 C 7.144531 8.148438 7.140625 8.152344 7.136719 8.15625 C 7.136719 8.15625 7.136719 8.160156 7.132813 8.15625 C 6.578125 7.898438 5.898438 7.980469 5.4375 8.4375 L 4.4375 9.4375 C 3.855469 10.023438 3.855469 10.976563 4.4375 11.5625 C 4.722656 11.84375 5.101563 12 5.5 12 C 5.898438 12 6.277344 11.84375 6.5625 11.5625 L 7.5625 10.5625 C 8.019531 10.101563 8.105469 9.421875 7.84375 8.867188 C 7.847656 8.863281 7.851563 8.859375 7.851563 8.851563 L 8.851563 7.851563 C 8.855469 7.851563 8.855469 7.851563 8.859375 7.851563 C 9.003906 7.703125 9.042969 7.488281 8.964844 7.296875 C 8.882813 7.109375 8.695313 6.992188 8.492188 6.996094 C 8.371094 7 8.257813 7.042969 8.171875 7.125 L 9.148438 6.148438 L 10.144531 5.148438 C 10.242188 5.050781 10.371094 5 10.5 5 C 10.628906 5 10.753906 5.050781 10.855469 5.148438 C 11.046875 5.339844 11.046875 5.660156 10.855469 5.851563 L 9.851563 6.851563 L 8.859375 7.851563 C 9.054688 7.945313 9.273438 8 9.5 8 C 9.898438 8 10.277344 7.84375 10.5625 7.5625 L 11.5625 6.5625 C 12.144531 5.976563 12.144531 5.023438 11.5625 4.4375 C 11.269531 4.148438 10.882813 4 10.5 4 Z M 7.109375 8.183594 C 6.9375 8.382813 6.949219 8.683594 7.136719 8.871094 C 7.328125 9.054688 7.628906 9.0625 7.824219 8.882813 L 6.851563 9.851563 L 5.851563 10.855469 C 5.664063 11.042969 5.335938 11.042969 5.148438 10.855469 C 4.953125 10.660156 4.953125 10.339844 5.148438 10.144531 L 6.148438 9.148438 Z"></path></svg>'
                          }
                        />
                      </TouchableOpacity>
                      <FlatList
                        style={[s.panellist, s.panellistclients]}
                        data={this.groupUserActiveGet()}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => this.gotoUserMessages(item)}
                            style={s.itemgroup}>
                            {item.imageAvatar ? (
                              <Image
                                source={{
                                  uri: `${API.assets}clients/${item.imageAvatar}`,
                                }}
                                style={s.avatargroup}
                              />
                            ) : (
                              <View
                                style={[
                                  s.avatargroup,
                                  s.placeholder,
                                  {backgroundColor: Utils.colorGet()},
                                ]}>
                                <Text
                                  style={[
                                    styles.text,
                                    styles.white,
                                    styles.upper,
                                  ]}>
                                  {Utils.initialsGet(item.name)}
                                </Text>
                              </View>
                            )}
                            <Text
                              style={[styles.text, s.panelname]}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  ) : this.state.contactaddShow ? (
                    <View>
                      <View style={s.panelblock}>
                        <Text
                          style={[
                            styles.text,
                            styles.title,
                            styles.bold,
                            styles.center,
                          ]}>
                          {this.state.forbidden ? '      ' : 'Пользователи'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.contactInviteShow(false)}
                          style={s.cancel}>
                          <Text style={[styles.text, styles.blue]}>Назад</Text>
                        </TouchableOpacity>
                        {this.state.forbidden ? null : this.state.usercontacts
                            .length > 0 ? (
                          <TouchableOpacity
                            onPress={() => this.contactsInvite()}
                            style={s.save}>
                            <Text
                              style={[styles.text, styles.bold, styles.blue]}>
                              Добавить
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={[
                              styles.text,
                              styles.bold,
                              styles.light,
                              s.save,
                            ]}>
                            Добавить
                          </Text>
                        )}
                      </View>
                      {this.state.forbidden ? (
                        <Forbidden
                          styles={styles}
                          title={`Вы запретили доступ к${'\n'}адресной книге`}
                          comment={
                            'Разрешите доступ в настройках чтобы получить список контактов телефона'
                          }
                        />
                      ) : (
                        <KeyboardAvoidingView
                          behavior={Platform.select({
                            android: undefined,
                            ios: 'padding',
                          })}
                          enabled>
                          <FlatList
                            style={[s.panellist, s.panellistclientsadmin]}
                            data={this.state.contacts}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                onPress={() => this.contactSelect(item.id)}
                                style={s.itemgroup}>
                                {item.avatar ? (
                                  <Image
                                    source={{uri: item.avatar}}
                                    style={s.avatargroup}
                                  />
                                ) : item.imageAvatar ? (
                                  <Image
                                    source={{
                                      uri: `${API.assets}clients/${item.imageAvatar}`,
                                    }}
                                    style={s.avatargroup}
                                  />
                                ) : (
                                  <View
                                    style={[
                                      s.avatargroup,
                                      s.placeholder,
                                      {backgroundColor: Utils.colorGet()},
                                    ]}>
                                    <Text
                                      style={[
                                        styles.text,
                                        styles.white,
                                        styles.upper,
                                      ]}>
                                      {Utils.initialsGet(
                                        item.firstName,
                                        item.lastName,
                                      )}
                                    </Text>
                                  </View>
                                )}
                                <View>
                                  <Text style={styles.text}>
                                    {item.firstName} {item.lastName}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.text,
                                      styles.small,
                                      styles.grey,
                                    ]}>
                                    {item.phone}
                                  </Text>
                                </View>
                                <Text
                                  style={[styles.text, s.panelname]}
                                  numberOfLines={1}>
                                  {item.name}
                                </Text>
                                {this.state.usercontacts.includes(item.id) ? (
                                  <SvgXml
                                    width={24}
                                    height={24}
                                    style={s.checkbox}
                                    fill={'#007aff'}
                                    xml={
                                      '<svg viewBox="0 0 24 24"><path d="M11.707,15.707C11.512,15.902,11.256,16,11,16s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L11,13.586l8.35-8.35C17.523,3.251,14.911,2,12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10 c0-1.885-0.531-3.642-1.438-5.148L11.707,15.707z"></path></svg>'
                                    }
                                  />
                                ) : (
                                  <SvgXml
                                    width={24}
                                    height={24}
                                    fill={'#ccc'}
                                    style={s.checkbox}
                                    xml={
                                      '<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>'
                                    }
                                  />
                                )}
                              </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </KeyboardAvoidingView>
                      )}
                    </View>
                  ) : (
                    <View>
                      <View style={s.panelblock}>
                        <Text
                          style={[
                            styles.text,
                            styles.title,
                            styles.bold,
                            styles.center,
                          ]}>
                          Группа
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.panelShow(false)}
                          style={s.cancel}>
                          <Text style={[styles.text, styles.blue]}>
                            Закрыть
                          </Text>
                        </TouchableOpacity>
                        {!Utils.empty(this.state.groupname) ? (
                          <TouchableOpacity
                            onPress={() => this.groupUpdate()}
                            style={s.save}>
                            <Text
                              style={[styles.text, styles.bold, styles.blue]}>
                              Сохранить
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={[
                              styles.text,
                              styles.bold,
                              styles.light,
                              s.save,
                            ]}>
                            Сохранить
                          </Text>
                        )}
                      </View>
                      <View style={s.groupname}>
                        <TouchableOpacity
                          onPress={() => this.imagePickerShow(true)}
                          style={s.addphoto}>
                          {this.state.groupimage ||
                          this.state.item.imageAvatar ? (
                            <Image
                              source={{
                                uri: this.state.groupimage
                                  ? this.state.groupimage
                                  : `${API.assets}groups/${this.state.item.imageAvatar}`,
                              }}
                              style={s.groupavatar}
                            />
                          ) : (
                            <SvgXml
                              width={26}
                              height={26}
                              fill={'#999'}
                              xml={
                                '<svg viewBox="0 0 24 24"><path d="M 14.119141 1.9980469 L 9.8769531 2.0019531 C 9.3179531 2.0019531 8.7832969 2.2364375 8.4042969 2.6484375 L 7.1640625 4 L 4 4 C 2.9 4 2 4.9 2 6 L 2 18 C 2 19.1 2.9 20 4 20 L 20 20 C 21.1 20 22 19.1 22 18 L 22 6 C 22 4.9 21.1 4 20 4 L 16.841797 4 L 15.59375 2.6445312 C 15.21475 2.2325313 14.679141 1.9980469 14.119141 1.9980469 z M 12 7 C 14.8 7 17 9.2 17 12 C 17 14.8 14.8 17 12 17 C 9.2 17 7 14.8 7 12 C 7 9.2 9.2 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path></svg>'
                              }
                            />
                          )}
                        </TouchableOpacity>
                        <TextInput
                          style={[styles.text, s.groupnameinput]}
                          value={this.state.groupname}
                          onChangeText={(groupname) =>
                            this.setState({groupname})
                          }
                          autoCorrect={false}
                          placeholder={'Название группы'}
                          underlineColorAndroid={'transparent'}
                        />
                        <TouchableOpacity
                          onPress={() => this.groupLinkCopy()}
                          style={s.copyicon}>
                          <SvgXml
                            width={24}
                            height={24}
                            fill={'#ccc'}
                            xml={
                              '<svg viewBox="0 0 16 16"><path d="M 1.5 0 C 0.675781 0 0 0.675781 0 1.5 L 0 10.5 C 0 11.324219 0.675781 12 1.5 12 L 2 12 L 2 12.5 C 2 13.324219 2.675781 14 3.5 14 L 12.5 14 C 13.324219 14 14 13.324219 14 12.5 L 14 3.5 C 14 2.675781 13.324219 2 12.5 2 L 12 2 L 12 1.5 C 12 0.675781 11.324219 0 10.5 0 Z M 1.5 1 L 10.5 1 C 10.78125 1 11 1.21875 11 1.5 L 11 2 L 3.5 2 C 2.675781 2 2 2.675781 2 3.5 L 2 11 L 1.5 11 C 1.21875 11 1 10.78125 1 10.5 L 1 1.5 C 1 1.21875 1.21875 1 1.5 1 Z M 3.5 3 L 12.5 3 C 12.78125 3 13 3.21875 13 3.5 L 13 12.5 C 13 12.78125 12.78125 13 12.5 13 L 3.5 13 C 3.21875 13 3 12.78125 3 12.5 L 3 3.5 C 3 3.21875 3.21875 3 3.5 3 Z M 10.5 4 C 10.117188 4 9.730469 4.148438 9.4375 4.4375 L 8.4375 5.4375 C 7.980469 5.898438 7.894531 6.578125 8.15625 7.132813 C 8.152344 7.136719 8.148438 7.140625 8.148438 7.148438 L 7.148438 8.148438 C 7.144531 8.148438 7.140625 8.152344 7.136719 8.15625 C 7.136719 8.15625 7.136719 8.160156 7.132813 8.15625 C 6.578125 7.898438 5.898438 7.980469 5.4375 8.4375 L 4.4375 9.4375 C 3.855469 10.023438 3.855469 10.976563 4.4375 11.5625 C 4.722656 11.84375 5.101563 12 5.5 12 C 5.898438 12 6.277344 11.84375 6.5625 11.5625 L 7.5625 10.5625 C 8.019531 10.101563 8.105469 9.421875 7.84375 8.867188 C 7.847656 8.863281 7.851563 8.859375 7.851563 8.851563 L 8.851563 7.851563 C 8.855469 7.851563 8.855469 7.851563 8.859375 7.851563 C 9.003906 7.703125 9.042969 7.488281 8.964844 7.296875 C 8.882813 7.109375 8.695313 6.992188 8.492188 6.996094 C 8.371094 7 8.257813 7.042969 8.171875 7.125 L 9.148438 6.148438 L 10.144531 5.148438 C 10.242188 5.050781 10.371094 5 10.5 5 C 10.628906 5 10.753906 5.050781 10.855469 5.148438 C 11.046875 5.339844 11.046875 5.660156 10.855469 5.851563 L 9.851563 6.851563 L 8.859375 7.851563 C 9.054688 7.945313 9.273438 8 9.5 8 C 9.898438 8 10.277344 7.84375 10.5625 7.5625 L 11.5625 6.5625 C 12.144531 5.976563 12.144531 5.023438 11.5625 4.4375 C 11.269531 4.148438 10.882813 4 10.5 4 Z M 7.109375 8.183594 C 6.9375 8.382813 6.949219 8.683594 7.136719 8.871094 C 7.328125 9.054688 7.628906 9.0625 7.824219 8.882813 L 6.851563 9.851563 L 5.851563 10.855469 C 5.664063 11.042969 5.335938 11.042969 5.148438 10.855469 C 4.953125 10.660156 4.953125 10.339844 5.148438 10.144531 L 6.148438 9.148438 Z"></path></svg>'
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <KeyboardAvoidingView
                        behavior={Platform.select({
                          android: undefined,
                          ios: 'padding',
                        })}
                        enabled>
                        <TouchableOpacity
                          onPress={() => this.contactInviteShow(true)}
                          style={[s.panellink, s.panellinkinvite]}>
                          <SvgXml
                            width={26}
                            height={26}
                            style={s.panelicon}
                            fill={'#007aff'}
                            xml={
                              '<svg viewBox="0 0 16 16"><path d="M 4.5 3 C 3.125 3 2 4.125 2 5.5 C 2 6.441406 2.535156 7.253906 3.304688 7.679688 C 1.40625 8.210938 0 9.9375 0 12 L 1 12 C 1 10.0625 2.5625 8.5 4.5 8.5 C 5.65625 8.5 6.664063 9.0625 7.296875 9.929688 C 7.113281 10.421875 7 10.945313 7 11.5 C 7 13.980469 9.019531 16 11.5 16 C 13.980469 16 16 13.980469 16 11.5 C 16 9.617188 14.832031 8.003906 13.183594 7.335938 C 13.679688 6.875 14 6.226563 14 5.5 C 14 4.125 12.875 3 11.5 3 C 10.125 3 9 4.125 9 5.5 C 9 6.226563 9.320313 6.875 9.816406 7.335938 C 8.988281 7.671875 8.28125 8.242188 7.78125 8.96875 C 7.230469 8.367188 6.527344 7.902344 5.71875 7.671875 C 6.476563 7.238281 7 6.429688 7 5.5 C 7 4.125 5.875 3 4.5 3 Z M 4.5 4 C 5.335938 4 6 4.664063 6 5.5 C 6 6.335938 5.335938 7 4.5 7 C 3.664063 7 3 6.335938 3 5.5 C 3 4.664063 3.664063 4 4.5 4 Z M 11.5 4 C 12.335938 4 13 4.664063 13 5.5 C 13 6.335938 12.335938 7 11.5 7 C 10.664063 7 10 6.335938 10 5.5 C 10 4.664063 10.664063 4 11.5 4 Z M 11.5 8 C 13.4375 8 15 9.5625 15 11.5 C 15 13.4375 13.4375 15 11.5 15 C 9.5625 15 8 13.4375 8 11.5 C 8 10.910156 8.15625 10.363281 8.414063 9.875 L 8.4375 9.859375 C 8.4375 9.855469 8.433594 9.851563 8.429688 9.847656 C 9.019531 8.75 10.164063 8 11.5 8 Z M 11 9 L 11 11 L 9 11 L 9 12 L 11 12 L 11 14 L 12 14 L 12 12 L 14 12 L 14 11 L 12 11 L 12 9 Z"></path></svg>'
                            }
                          />
                          <Text style={[styles.text, styles.blue]}>
                            Добавить пользователей
                          </Text>
                        </TouchableOpacity>
                        <FlatList
                          style={[s.panellist, s.panellistclientsadmin]}
                          data={this.groupUserActiveGet()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              onPress={() => this.userSelect(item.id)}
                              style={s.itemgroup}>
                              {item.imageAvatar ? (
                                <Image
                                  source={{
                                    uri: `${API.assets}clients/${item.imageAvatar}`,
                                  }}
                                  style={s.avatargroup}
                                />
                              ) : (
                                <View
                                  style={[
                                    s.avatargroup,
                                    s.placeholder,
                                    {backgroundColor: Utils.colorGet()},
                                  ]}>
                                  <Text
                                    style={[
                                      styles.text,
                                      styles.white,
                                      styles.upper,
                                    ]}>
                                    {Utils.initialsGet(item.name)}
                                  </Text>
                                </View>
                              )}
                              <Text
                                style={[styles.text, s.panelname]}
                                numberOfLines={1}>
                                {item.name}
                              </Text>
                              {this.state.users.includes(item.id) ? (
                                <SvgXml
                                  width={24}
                                  height={24}
                                  style={s.checkbox}
                                  xml={
                                    '<svg viewBox="0 0 48 48"><path fill="#c00" d="M24,44C12.972,44,4,35.028,4,24S12.972,4,24,4s20,8.972,20,20S35.028,44,24,44z"></path><path fill="#fff" d="M14,21h20v6H14V21z"></path></svg>'
                                  }
                                />
                              ) : (
                                <SvgXml
                                  width={24}
                                  height={24}
                                  fill={'#ccc'}
                                  style={s.checkbox}
                                  xml={
                                    '<svg viewBox="0 0 24 24"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z"></path></svg>'
                                  }
                                />
                              )}
                            </TouchableOpacity>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </KeyboardAvoidingView>
                    </View>
                  )
                ) : null)}
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');
const panelY = 100,
  panelUserY = 300,
  panelHide = height + 10;
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  message: {
    maxWidth: width - 80 - 20,
    minWidth: 120,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 15,
    backgroundColor: '#ecedf1',
    margin: 5,
    marginLeft: 10,
  },
  me: {
    backgroundColor: '#cce4ff',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  separator: {
    marginVertical: 20,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  nobg: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  nobgImageVideo: {
    paddingBottom: 0,
  },
  date: {
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  dateOver: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    color: '#fff',
    backgroundColor: '#00000080',
    padding: 4,
  },
  messageBlock: {
    marginHorizontal: 5,
    padding: 5,
  },
  messageBlockTop: {
    alignItems: 'flex-start',
  },
  messageBlockInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageBlockNoMessages: {
    padding: 30,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  recordBlock: {
    width: width - 44,
    height: 36,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rec: {
    top: 4,
    marginRight: 6,
    width: 10,
    height: 10,
  },
  input: {
    width: width - 80,
    marginHorizontal: 5,
    borderRadius: 20,
    borderColor: '#e1e2e6',
    borderWidth: 1,
    padding: Platform.OS === 'ios' ? 8 : 0,
    paddingLeft: 15,
    paddingRight: 35,
    backgroundColor: '#f2f3f5',
  },
  smileIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 13 : 9,
    top: Platform.OS === 'ios' ? 7 : 4,
  },
  stickersBlock: {
    backgroundColor: '#fff',
  },
  stickerHeadBlock: {
    width: width - 20,
    height: 46,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  thumbBlock: {
    margin: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: 36,
    height: 36,
  },
  thumbSelected: {
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  stickerBlock: {
    width: width - 20,
    marginLeft: 10,
    height: 210,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stickerBlockContent: {
    justifyContent: 'space-between',
  },
  sticker: {
    width: width / 4 - 10,
    height: width / 4 - 10,
    marginRight: 5,
    marginVertical: 5,
  },
  stickerImage: {
    width: 120,
    height: 120,
  },
  audioBlock: {
    flexDirection: 'row',
  },
  audioInfo: {
    width: width - 80 - 20 - 70,
    marginLeft: 10,
  },
  audioProgress: {
    height: 4,
    marginTop: 14,
    marginBottom: 3,
    backgroundColor: '#ccc',
  },
  imageFullScreen: {
    flex: 1,
    resizeMode: 'contain',
  },
  videoPlaceholder: {
    width: 196,
    height: 110,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000030',
  },
  panel: {
    position: 'relative',
    height: height - panelY,
    paddingTop: 20,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  panelUser: {
    height: height - panelUserY,
  },
  panellink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#007aff30',
    borderBottomWidth: 0.5,
  },
  panellinkone: {
    marginTop: 20,
    borderTopColor: '#007aff30',
    borderTopWidth: 0.5,
  },
  panellinkinvite: {
    marginTop: 0,
    paddingTop: 0,
  },
  panelicon: {
    marginRight: 20,
    marginLeft: 5,
  },
  paneliconmessage: {
    marginRight: 10,
  },
  panelblock: {
    padding: 0,
  },
  cancel: {
    position: 'absolute',
    top: 2,
    left: 15,
  },
  contactinfo: {
    marginTop: 20,
  },
  avatarinfo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  avatargroup: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  invite: {
    position: 'absolute',
    top: 2,
    right: 15,
  },
  panellist: {
    height: height - 270,
    paddingTop: 10,
    marginTop: 10,
  },
  panellistclients: {
    height: height - 320,
    marginTop: 20,
    borderTopColor: '#007aff30',
    borderTopWidth: 0.5,
  },
  panellistclientsadmin: {
    height: height - 280,
  },
  panelname: {
    width: width - 15 - 15 - 40 - 20 - 40,
  },
  itemgroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  checkbox: {
    position: 'absolute',
    right: 15,
  },
  panelnotfound: {
    padding: 15,
    marginTop: 10,
  },
  save: {
    position: 'absolute',
    top: 2,
    right: 15,
  },
  groupname: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addphoto: {
    backgroundColor: '#eee',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupavatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupnameinput: {
    width: width - 50 - 10 - 20 - 20 - 40,
  },
  copyicon: {
    paddingLeft: 10,
  },
  copyiconother: {
    position: 'absolute',
    top: 60,
    right: 15,
  },
  arrowdown: {
    position: 'absolute',
    right: 0,
    bottom: 60,
    width: 50,
    backgroundColor: '#fff',
    paddingLeft: 7,
    paddingTop: 5,
    paddingBottom: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
