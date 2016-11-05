// Thank you: https://github.com/brentvatne/react-native-animated-demo-tinder

import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, Animated, PanResponder, AsyncStorage, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/styles.js';

var config = require('../../config.js');
var SWIPE_THRESHOLD = 100;

export default class Food extends Component {
  constructor (props) {
    super(props);
    this.state = {
      swipe: new Animated.ValueXY(),
      enter: new Animated.Value(0),
      cards: [],
      faved: false,
      loaded: false
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx !== 0 && gestureState.dy !== 0;
      },
      onPanResponderGrant: (e, gestureState) => {
        this.state.swipe.setOffset({
          x: this.state.swipe.x._value,
          y: this.state.swipe.y._value
        });
        this.state.swipe.setValue({
          x: 0,
          y: 0
        });
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.swipe.x,
          dy: this.state.swipe.y
        }
      ]),
      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.swipe.flattenOffset();
        if (Math.abs(this.state.swipe.x._value) > SWIPE_THRESHOLD) {
          this.state.swipe.x._value > 0 ? this.judge('yes') : this.judge('no');
        } else {
          Animated.spring(this.state.swipe, {
            toValue: {
              x: 0,
              y: 0
            },
            friction: 3
          }).start();
        }
      }
    });
  }

  componentDidMount () {
    AsyncStorage.getItem('jwt')
    .then((token) => {
      this.setState({
        token: token
      }, this.getPhotos);
    }).done();
  }

  getPhotos () {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      fetch(`${this.props.apiRoot}/api/photo/${lat}/${long}/food`, // fixme: dummy data
        {
          method: 'GET',
          headers: {
            authorization: this.state.token
          }
        }
      )
      .then((data) => data.json())
      .then((photos) => {
        this.setState({
          cards: photos,
          loaded: true
        });
        this.fadeIn();
      })
      .catch((err) => console.log(err));
    }, (error) => {
      alert('Please enable location services.');
    }, {
      enableHighAccurracy: true,
      timeout: 2000,
      maxinumAge: 1000
    });
  }

  shuffle (cards) {
    let c = cards.length;
    while (c > 0) {
      let r = Math.floor(Math.random() * c);
      c--;
      let tmp = cards[c];
      cards[c] = cards[r];
      cards[r] = temp;
    }
    return cards;
  }

  popCard () {
    this.state.swipe.setValue({
      x: 0,
      y: 0
    });
    this.state.enter.setValue(0);
    this.setState({
      faved: false,
      cards: this.state.cards.length > 1 ? this.state.cards.slice(1) : []
    });
    this.fadeIn();
  }

  fadeIn () {
    Animated.spring(this.state.enter, {
      toValue: 1,
      delay: 250,
      tension: 20
    }).start();
  }

  judge (endpoint) {
    this.exchange(endpoint, this.state.cards[0].id);
    this.popCard();
  }

  fave () {
    let endpoint = this.state.faved ? 'unfavorite' : 'favorite';
    this.setState({
      faved: !this.state.faved
    });
    this.exchange(endpoint, this.state.cards[0].id);
  }

  exchange (endpoint, id) {
    fetch(`${this.props.apiRoot}/api/${endpoint}/${id}`,
      {
        method: 'POST',
        headers: {
          authorization: this.state.token
        }
      }
    )
    .catch((err) => console.log(err));
  }

  renderCard () {
    let pan = this.state.swipe;
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-30deg', '0deg', '30deg']
    });
    let scale = this.state.enter;
    let opacity = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: [0, 1, 0]
    });
    let animatedCardstyles = {
      transform: [
        {translateX},
        {translateY},
        {rotate},
        {scale}
      ],
      opacity
    };

    let size = 50;
    let checkColor = 'hsl(95.6,92.5%,46.9%)';
    let crossColor = 'hsl(5.4,92.5%,46.9%)';
    let starColor = this.state.faved ? 'hsl(45.6,92.5%,58.4%)' : 'hsl(0,0%,58.4%)';

    return (
      <Animated.View style={[styles.foodCard, animatedCardstyles]} {...this.panResponder.panHandlers}>
        <Image source={{uri: this.state.cards[0].url}} resizeMode="cover" style={styles.foodImg} >
          <TouchableOpacity onPress={ () => Linking.openURL('http://www.yelp.com/').catch(err => console.error('An error occurred', err)) }>
            <Image source={require('./assets/yelp-sm.png')} style={styles.yelpLogo} />
          </TouchableOpacity>
        </Image>
        <View style={styles.touchBar} >
          <TouchableOpacity onPress={() => this.judge('no')} >
            <Icon style={{textAlign: 'center'}} name='times-circle' color={crossColor} size={size} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.fave()} >
            <Icon style={{textAlign: 'center'}} name='star' color={starColor} size={size} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.judge('yes')} >
            <Icon style={{textAlign: 'center'}} name='check-circle' color={checkColor} size={size} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  renderNoMore () {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name='cutlery' style={{marginRight: 10}} size={40} color='hsl(0,0%,50%)'/>
        <View style={{flexDirection: 'column'}}>
          <Text>No More Cards!</Text>
          <Text>Try searching from a new location</Text>
          </View>
      </View>
    );
  }

  render () {
    let pan = this.state.swipe;
    let yupStyle = {
      opacity: pan.x.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 0.6]
      }),
      transform: [
        {
          scale: pan.x.interpolate({
            inputRange: [0, 120],
            outputRange: [0, 1]
          })
        }
      ]
    };
    let nopeStyle = {
      opacity: pan.x.interpolate({
        inputRange: [-120, 0],
        outputRange: [0.6, 0]
      }),
      transform: [
        {
          scale: pan.x.interpolate({
            inputRange: [-120, 0],
            outputRange: [1, 0]
          })
        }
      ]
    };
    return (
      <View style={{flex: 1}}>
        <Text style={styles.welcome}>Foods Near Me</Text>
        <View style={styles.container}>
          {!this.state.loaded ?
            <Image source={require('./assets/loadingRed.gif')} resizeMode="cover" style={styles.menuLoading}/>
            : (this.state.cards.length ? this.renderCard()
                : this.renderNoMore())}
        </View>
        <Animated.View style={[styles.pop, styles.yup, yupStyle]}>
          <Text style={[styles.popText, styles.yupText]}>Yum!</Text>
        </Animated.View>
        <Animated.View style={[styles.pop, styles.nope, nopeStyle]}>
          <Text style={[styles.popText, styles.nopeText]}>Meh.</Text>
        </Animated.View>
        {this.props.nav()}
      </View>
    );
  }
}
