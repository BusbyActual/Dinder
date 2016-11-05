import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';
import Camera from 'react-native-camera';

import styles from '../styles/styles';
import config from '../../config';

const photourl = '';

export default class RNCamera extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      }
    }
  };

  componentDidMount () {
    AsyncStorage.getItem('jwt')
    .then((token) => {
      this.setState({
        token: token
      }, this.getPhotos);
    }).done();
  }

  takePicture() {
    const timestamp = new Date().getTime().toString();
    this.camera.capture()
      .then((data) => {
        const file = {
          uri: data.path, 
          name:  timestamp + '.jpg',
          type: 'image/jpeg'
        };

        //get s3 signed url on server
        fetch(`${this.props.apiRoot}/api/s3upload`, {
          method: 'POST',
          headers: {
            authorization: this.state.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: file.name,
            contentType: 'image/jpeg'
          })
        })//fetch
        .then(response => response.json())

        // upload image to s3 using signed url from server
        .then(options =>{
          photourl = options.url;
        RNS3.put(file, options)
          .then(response => {
            if (response.status !== 201) {
              throw new Error('Failed to upload image to S3', response);
            } 

        //post url and info to photo database
            fetch(`${this.props.apiRoot}/api/images`, {
              method: 'POST',
              headers: {
                authorization: this.state.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                url: response.body.postResponse.location,
              })
            })//fetch userimages   
          }).then(() => Actions.phototaken({url: photourl}))
        })//thenoptions
      })//thendata
      .catch(err => console.error(err));
  }

  switchType() {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }
    this.setState({
      camera: {
        ...this.state.camera,
        type: newType
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;
    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }
    return icon;
  }

  switchFlash() {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;
    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }
    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;
    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }
    return icon;
  }


  render() {
    return (
      <View style={styles.camContainer}>
        <StatusBar animated hidden />
        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          captureAudio={false}
          defaultTouchtoFocus
          mirrorImage={false} />
        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity style={styles.typeButton} onPress={this.switchType.bind(this)} >
            <Image source={this.typeIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flashButton} onPress={this.switchFlash.bind(this)} >
            <Image source={this.flashIcon} />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableOpacity style={styles.captureButton} onPress={this.takePicture.bind(this)} >
              <Image source={require('./assets/ic_photo_camera_36pt.png')} />
            </TouchableOpacity>
        </View>

        {this.props.nav()}
      </View>
    );
  }
}
