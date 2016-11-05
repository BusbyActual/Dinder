# DinDin
DinDin gives you personalized dining recommendations provided by machine learning integrated with a cross-platform mobile app.

## Team
  - __Product Owner__: Graham Wimbrow
  - __Scrum Master__: Ryan Busby
  - __Lead Engineers__: Daniel Chang, Esther Oh
  
## Table of Contents
1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    a. [Installing Dependencies](#installing-dependencies)
    b. [Tasks](#tasks)
4. [Team](#team)
5. [Contributing](#contributing)

## Usage
Once you have installed the app on your emulator or device, log in and start swiping! DinDin taps into your phone's GPS signal and the Yelp API to deliver photos from restaurants near you. Swiping photos left and right helps train the DinDin AI to recognize your tastes - once you've swiped about ten cards, the app is capable of generating personalized recommendations.

![swipe demo](/sequence.gif?raw=true)

If you like a photo and want to return to view it later, press the star included in the swipe card interface - view your favorite photos in the 'favorites' tab accessible via the star navigation button.

Once you're ready to make a decision, press the magnifing glass icon in the navigation menu to load recommendations. On this view you'll see information about specific restaurants and eateries, links to call their phone number, or to schedule an Uber to their address.

Once you're enjoying a nice meal, why not snap a couple photos of your own? DinDin provides a built-in camera feature that allows seamless integration with your device's camera and storage so you'll never miss another shot.

## Requirements

### Installing Dependencies
From within the root directory:
```
npm install
```
Then link the required npm packages with react-native link:
```
react-native link
```

### Development
This app is built in Javascript using React-Native. Before contributing please consider taking some time to familiarize yourself with [React-Native](https://facebook.github.io/react-native/).

### Database
DinDin relies on a PostgreSQL database that can be running either locally or on the cloud - _the choice is yours._

#### Running a Local API Server
Start a local API server instance using nodemon, and watch for changes in the `./server` directory:
```
npm run server
```
The secrets.json file is the location for API keys required for full application functionality. A sample file with required key placeholders is provided in the root directory. Contributors are expected to acquire their own API keys for local development. API keys current sign on server instance and are called when referenced.

#### Compiling and Deploying with the React-Native Package Manager
This project targets both Android and iOS devices, and as such requires slightly different methods for compiling and installing. Follow the [recommended guidelines](https://facebook.github.io/react-native/releases/0.21/docs/getting-started.html) to setup your dev environment.

See the file `config.js` for a complete listing of environment variables required by this project. In development, local variables may be sourced from within a `secrets.json` in the root directory.

##### iOS
The project can be run through Xcode on a local simulator or attached device. Build files are not included in the repo code and the following steps/permissions are needed to get app up and running.

1. Enable non https calls to production server (when/if connecting to production server)
[here](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33)

2. MANUAL linking libraries to allow app access to camera, camera roll and location
[here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html)

3. Enable external linking, in this case for uber.
[here](https://developer.uber.com/docs/rides/deep-linking)

Outside of those build specific items, to build and install the application, run:
```
react-native run-ios
```

##### Android
The following steps are consistent regardless of whether you're running an emulator (using the Android SDK is recommended) or testing with a physical device. From the project root directory, to build and install the application, run:
```
react-native run-android
```
Once the build has completed, enter the following command to start the React-Native package manager (appending with ---reset-cache helps avoid errors from stale build files):
```
react-native start --reset-cache
```

#### Testing
Server-side tests provide coverage for interacting with the API server and PostgreSQL database:
```
npm test
```
Additionally logging can be done with either:
```
react-native log-ios
```
OR
```
react-native log-android
```

#### Linting with ESLint and the Hack Reactor style guide:
This assumes you have a global installation of ESLint; if not, `npm install -g eslint` or replace with your preferred linter.
```
npm run lint
```
Note that this project initiates linting with a pre-commit script.

### Tasks & Contributing
View the waffle.io issues [here](https://waffle.io/Scrumbledore/Dinder)

Please make sure to follow our [style guide](STYLE-GUIDE.md) and [contibution guide](CONTRIBUTING.md).
