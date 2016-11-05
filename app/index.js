import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Actions,
  Router,
  Scene
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/styles.js';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Food from './components/Food';
import Favorites from './components/Favorites';
import Recs from './components/Recs';
import Menu from './components/Menu';
import RNCamera from './components/Camera';
import PhotoTaken from './components/PhotoTaken';
import ViewUserPhoto from './components/ViewUserPhoto';

const Dimensions = require('Dimensions');
const config = require('../config.js');

console.disableYellowBox = true;

export default class DinDin extends Component {
  constructor(props) {
    super(props);

    var apiRoot = config.apiRoot;

    // for testing locally with npm run server
    if (process.env.NODE_ENV !== 'production') {
      apiRoot = Platform.OS === 'android'
              ? config.androidLocalRoot
              : config.iosLocalRoot;
    }

    apiRoot += ':'
            + config.port;

    this.state = {
      apiRoot: apiRoot
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('jwt')
    .then((token) => {
      if (token) {
        console.log(token);
        Actions.food();
      }
    }).done();
  }

  renderNav() {
    let color = 'hsl(0.9,100%,96%)';
    let size = 30;
    return (
      <View style={styles.navBar}>
        <TouchableOpacity onPress={Actions.photos}>
          <Icon name='camera-retro' style={{textAlign: 'center'}} color={color} size={size} />
        </TouchableOpacity>
        <TouchableOpacity onPress={Actions.favorites}>
          <Icon name='star' style={{textAlign: 'center'}} color={color} size={size} />
        </TouchableOpacity>
        <TouchableOpacity onPress={Actions.food}>
          <Icon name='cutlery' style={{textAlign: 'center'}} color={color} size={size} />
        </TouchableOpacity>
        <TouchableOpacity onPress={Actions.recs}>
          <Icon name='search' style={{textAlign: 'center'}} color={color} size={size} />
        </TouchableOpacity>
        <TouchableOpacity onPress={Actions.menu}>
          <Icon name='bars' style={{textAlign: 'center'}} color={color} size={size} />
        </TouchableOpacity>
      </View>
    );
  }

  renderBackdrop() {
    const {width, height} = Dimensions.get('window');
    let scale = 32;
    let tiles = [];
    for (let r = 0; r < Math.ceil(height / scale); r ++) {
      for (let c = 0; c < Math.ceil(width / scale); c ++) {
        tiles.push({
          row: r,
          col: c
        });
      }
    }
    return (
      tiles.map((pos) => {
        let tileStyle = {
          width: scale,
          height: scale,
          top: pos.row * scale,
          left: pos.col * scale,
          position: 'absolute'
        };
        return (
          <Image source={require('./components/assets/stripe.png')} style={tileStyle} />
        );
      })
    );
  }

  render() {
    return (
      <Router hideNavBar={true} nav={this.renderNav} backdrop={this.renderBackdrop} apiRoot={this.state.apiRoot} >
        <Scene key='root' >
          <Scene key='signin' type='replace' component={SignIn} initial={true} />
          <Scene key='signup' type='replace' component={SignUp} />
          <Scene key='photos' type='replace' component={RNCamera} />
          <Scene key='favorites' type='replace' component={Favorites} />
          <Scene key='food' type='replace' component={Food} />
          <Scene key='recs' type='replace' component={Recs} />
          <Scene key='menu' type='replace' component={Menu} />
          <Scene key='phototaken' type='replace' component={PhotoTaken} />
          <Scene key='viewuserphoto' type='replace' component={ViewUserPhoto} />
        </Scene>
      </Router>
    );
  }
}
