import React, { Component } from 'react';
import { Icon, Button } from 'react-native-elements';
import { Text, View, TextInput, AsyncStorage, Navigator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/styles.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }

  userSignUp() {
    return fetch(`${this.props.apiRoot}/api/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((res) => {
      if (!res.error) {
        //AsyncStorage.removeItem;
        AsyncStorage.setItem('jwt', res.token);
        console.log('jwt', res.token);
        Actions.food();

      } else {
        return res.error;
      }
    })
    .catch((error) => {
      this.setState({error: 'Error Setting Up Account'});
    })
    .done();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.welcome}>
          Welcome to DinDin! Sign Up here!
        </Text>

        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>email:</Text>

            <TextInput
              placeholder='user@dinderdore.com'
              autoCorrect={false}
              autoCapitalize='none'
              style={styles.textInputBox}
              value={this.state.email}
              onChangeText={email => this.setState({ email })} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>password:</Text>
            <TextInput
              placeholder="password"
              secureTextEntry={true}
              autoCorrect={false}
              style={styles.textInputBox}
              value={this.state.password}
              onChangeText={password => this.setState({ password })} />
          </View>

          <Button
            onPress={this.userSignUp.bind(this)}
            buttonStyle={styles.buttonBlue}
            title='Sign Up'/>

          <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          <Text onPress={Actions.signin}>Already have an account? Sign in here!</Text>

        </View>

      </View>
    );
  }
}