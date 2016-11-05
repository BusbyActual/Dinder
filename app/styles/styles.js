import { StyleSheet, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({

//++++++++++++++++++++++++++++++
//+++++ COMPONENT SPECIFIC +++++
//++++++++++++++++++++++++++++++

////+++++ Camera Roll +++++

  CRcontainer: {
    flex: 1,
    backgroundColor: '#F6AE2D'
  },
  CRcontent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  CRtext: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  CRbold: {
    fontWeight: 'bold',
  },
  CRinfo: {
    fontSize: 12,
  },

////+++++ Camera +++++

  camContainer: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 50,
    //backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
  phototaken: {
    fontSize: 24
  },

////+++++ Favorites +++++

  foodFavCardOuter: {
    padding: 10,
    //alignItems: 'right',
    alignSelf: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 4
  },
  foodFavCardInner: {
    padding: 0,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#000000',
    marginBottom: 10
  },
  foodFavCardComment: {
    padding: 5,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fafafa'
  },

////+++++ Recs +++++

  recContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
  },
  foodRecCardOuter: {
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 4,
  },
  foodRecCardInner: {
    padding: 0,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#000000',
  },
  foodRecCardComment: {
    flex: 1,
    padding: 2,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    height: 70
  },
  foodRecCardBottomComment: {
    flex: 1,
    padding: 10,
    paddingBottom: 1,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    height: 60
  },
  foodRecName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    color: '#444',
    flex: 1,
    flexDirection: 'column'
  },
  phone: {
    color: '#1da1f2'
  },

////+++++ Food +++++

  foodCard: {
    width: width - 8,
    height: width - 8,
    marginVertical: 5,
    padding: 8,
    backgroundColor: 'hsl(0,0%,100%)',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: 'hsl(240.9,24%,80%)',
    borderStyle: 'solid',
    alignSelf: 'center',
  },
  foodImg: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    borderRadius: 3
  },
  touchBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    width: null,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 8
  },
  cardRowStyle: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingVertical: 8
  },
  pop: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    top: height * 0.25,
    borderRadius: width * 0.5,
    justifyContent: 'center'
  },
  yup: {
    backgroundColor: 'hsl(120.9,92.1%,59.6%)',
    right: -(width * 0.25)
  },
  nope: {
    backgroundColor: 'hsl(0.9,92.1%,59.6%)',
    left: -(width * 0.25)
  },
  popText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'hsl(0,0%,100%)'
  },
  yupText: {
    textAlign: 'left',
    marginLeft: width * 0.0625
  },
  nopeText: {
    textAlign: 'right',
    marginRight: width * 0.0625
  },
  menuLoading: {
    height: 200,
    width: 200,
  },

////+++++ Menu +++++

  menuContainer: {
    top: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profile: {
    height: 100,
    width: 100,
    borderRadius: 50,
    margin: 16
  },

//++++++++++++++++++++++++++
//+++++ GENERAL STYLES +++++
//++++++++++++++++++++++++++

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hsl(0,0%,94%)'
  },
  welcome: {
    flexDirection: 'row',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir-Book',
    fontWeight: 'bold',
    alignSelf: 'stretch',
    width: null,
    fontSize: 24,
    paddingTop: Platform.OS === 'android' ? 3 : 15,
    paddingBottom: 5,
    paddingHorizontal: 8,
    color: 'hsl(0,0%,100%)',
    backgroundColor: 'hsla(202.8,89.1%,53.1%,0.75)',
    textShadowColor: 'hsl(202.8,89.1%,40%)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  textInputBox: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    marginRight: 5,
    marginLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 3,
    borderColor: 'grey',
    borderWidth: 1
  },
  inputLabel: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  inputContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  coverImage: {
    height: 300,
    width: 400,
    opacity: 0.5,
    position: 'absolute',
    top: -200,
    right: -5,
    bottom: 0,
    alignSelf: 'stretch',
    left: -100,
  },
  yelpLogo: {
    height: 30,
    margin: 8
  },
  yelpLogoCenter: {
    height: 30,
    alignSelf: 'center'
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'hsl(215,24%,40%)',
    alignSelf: 'stretch',
    width: null,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderColor: 'hsl(215,24%,35%)',
    borderStyle: 'solid'
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'hsl(0.9,100%,59.6%)',
    alignSelf: 'stretch',
    alignItems: 'center',
    width: null,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderColor: 'hsl(355.5,100%,74.7%)',
    borderStyle: 'solid'
  },

////+++++ Buttons +++++

  buttonBlue: {
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 6,
    backgroundColor: '#1da1f2'
  }
});
