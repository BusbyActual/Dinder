import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';


import styles from '../styles/styles.js';

export default class PhotoTaken extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.welcome}>Photo Saved!</Text>
        <View style={styles.container}>
          <View style={styles.foodCard}>
            <Image source={{uri: this.props.url}} style={styles.foodImg}/>
          </View>
          <Button
              onPress={Actions.menu}
              buttonStyle={{
                width: 200,
                height: 50,
                borderRadius: 6,
                margin: 16,
                backgroundColor: 'hsl(202.8,89.1%,53.1%)',
              }}
              title='View Your Photos' />
        </View>
        {this.props.nav()}
      </View>
    );
  }
}