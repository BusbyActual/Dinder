import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  ListView,
  Text,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../styles/styles.js';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

export default class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faves: undefined,
      token: ''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('jwt')
    .then((token) => {
      this.setState({
        token: token
      }, this.fetchFavs);
    }).done();
  }

  fetchFavs() {
    fetch(`${this.props.apiRoot}/api/favorites/`,
      {
        method: 'GET',
        headers: {
          authorization: this.state.token
        }
      }
    )
    .then((data) => data.json())
    .then((favorites) => {
      this.setState({
        faves: ds.cloneWithRowsAndSections({
          list: favorites
        })
      });
    })
    .catch((err) => console.error(err));
  }

  randomQuote() {
    var quotes = [
      'OMG SO YUMMY!',
      'I can\'t wait to try this!',
      'This looks so awesome!',
      'Gotta try this someday',
      'Nom nom nom!'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  unFavorite (id) {
    fetch(`${this.props.apiRoot}/api/unfavorite/${id}`,
      {
        method: 'POST',
        headers: {
          authorization: this.state.token
        }
      }
    )
    .then(() => this.fetchFavs())
    .catch((err) => console.log(err));
  }

  renderEmpty() {
    return (
      <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <Icon name='cutlery' size={60}/>
        <Text >You haven't favorited anything yet.</Text>
      </View>
    );
  }
  favoriteEntry(favorite) {
    return (
      <View style={styles.foodCard} >
        <Image source={{uri: favorite.url}} resizeMode='cover' style={styles.foodImg}>
          <TouchableOpacity onPress={ () => Linking.openURL('http://www.yelp.com/').catch(err => console.error('An error occurred', err)) }>
            <Image source={require('./assets/yelp-sm.png')} style={styles.yelpLogo} />
          </TouchableOpacity>
        </Image>
        <View style={[styles.cardRowStyle, {alignItems: 'center'}]} >
          <Text style={{fontSize: 20, fontFamily: 'Noteworthy'}}>{this.randomQuote()}</Text>
          <TouchableOpacity style={styles.foodIcon} onPress = {() => this.unFavorite(favorite.id)}>
            <Icon name='trash' color='hsl(0,0%,60%)' size={23} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {

    return (
      <View style={{flex: 1}}>
        <Text style={styles.welcome}>My Favorite Photos</Text>
        <View style={styles.container}>
          {!this.state.faves ?
            <Image source={require('./assets/loadingRed.gif')} resizeMode="cover" style={styles.menuLoading}/>
            : this.state.faves.getRowCount() === 0 ? this.renderEmpty()
              : <ListView dataSource={this.state.faves} renderRow={(favorite) => this.favoriteEntry(favorite)} />}
        </View>
        {this.props.nav()}
      </View>
    );
  }
}