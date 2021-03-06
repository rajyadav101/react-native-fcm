/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Alert, TextInput, Button} from 'react-native';
import firebase from 'react-native-firebase';
// import Navigation from './navigation/Navigation';
import DeviceInfo from 'react-native-device-info';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import ListScreen from './ListScreen';
import AWSSignature from 'react-native-aws-signature';
import Loader from './Loader';
import WebviewScreen from './WebviewScreen';
import axios from 'axios';

Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
class HomeScreen extends Component<Props> {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      loginStatus: false,
      loader: false
    };
    this.validate = this.validate.bind(this);
    this.validateGuid = this.validateGuid.bind(this);
   // AsyncStorage.clear(async function(){
      
    //});
    
    //Alert.alert(JSON.stringify(userToken));
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
   
   

    



  }
  static navigationOptions = {
    header: null
}


validateGuid = async () => {
  var thisobj = this;
  var loginToken = await AsyncStorage.getItem("loginToken");
  await Alert.alert("login token "+JSON.stringify(loginToken));
//console.log('login token', loginToken);
if(loginToken != ""){
  DeviceInfo.getMACAddress().then(mac => {
    //Alert.alert("mac "+mac);

    axios.get('https://mdev.humaxdigital.com/HumaxMobile/NonAuth/AuthMobileApp.aspx?AppID=Mobile&MacAddress='+mac+'&AuthKey=' +loginToken )
  .then(async function(responseData){
    await Alert.alert("login token "+responseData.data);
      //console.log('verify res', responseData);
      if(responseData.data){
        thisobj.props.navigation.navigate('List');
      }else {
       
        AsyncStorage.removeItem("loginToken");
        thisobj.props.navigation.navigate('App');
      }
  });

    // "E5:12:D8:E5:69:97"
    
  });
  
   
}else{
  
  this.props.navigation.navigate('App');
}
}
  _bootstrapAsync = async () => {
    this.setState({
      loader:true
    })
    const dname = DeviceInfo.getDeviceName();
    //const mac = DeviceInfo.getMACAddress();
    const appName = DeviceInfo.getApplicationName();
    DeviceInfo.getMACAddress().then(mac => {


      // "E5:12:D8:E5:69:97"
      console.log('mac', mac);
      var payload = {
        AppID: 'android',
        MacAddress: mac,
        DeviceName: appName,
        ID: this.state.username,
        PASS: this.state.password,
      };
       var thisobj = this;
      // fetch('https://mdev.humaxdigital.com/HumaxMobile/NonAuth/Login.aspx?AppID=Mobile&MacAddress='+mac+'&DeviceName='+appName+'&ID='+this.state.username+'&PASS='+this.state.password,{
      //   headers: {
      //     'Accept':'application/json'
      //   }, 
      // })
      axios.get('https://mdev.humaxdigital.com/HumaxMobile/NonAuth/Login.aspx?AppID=Mobile&MacAddress='+mac+'&DeviceName='+appName+'&ID='+this.state.username+'&PASS='+this.state.password )
     .then(async function(responseData){
        
        var token = responseData.data;
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log("guid", token);
        const path = '/production';
        const url = 'https://5q6xg017b6.execute-api.us-east-1.amazonaws.com'+ path;
        const credentials = {
          AccessKeyId: '48pbeVmxzJ8Ubgr3ocQhg85gNlqIF4Z6iRNP1A8k',
          SecretKey: 'AKIAJ4FEQP7TFAA6A6CA'
        }
        // code to save token to AWS
        let auth_date = new Date();

    let auth_header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'dataType': 'json',
      'X-Amz-Date': auth_date.toISOString(),
      'host': '5q6xg017b6.execute-api.us-east-1.amazonaws.com'
    }

    let auth_options = {
      path: path,
      method: 'POST',
      service: 'execute-api',
      headers: auth_header,
      region: 'us-east-1',
      body: '',
      credentials
    };

    let awsSignature = new AWSSignature();
    awsSignature.setParams(auth_options);

    const authorization = awsSignature.getAuthorizationHeader();

    // Add the authorization to the header
    auth_header['Authorization'] = authorization['Authorization']

    let options = Object.assign({
      method: 'POST',
      headers: auth_header,
      body: JSON.stringify({
        "username": thisobj.state.username,
        "tokenID": fcmToken,
        "guid": token,
        "deviceType": "android",
        "deviceModel": appName,
        "macAddress": mac

       })
    });
    
    //const url = 'https://' + '5q6xg017b6.execute-api.us-east-1.amazonaws.com/production';
    console.log(options);
    fetch(url, options).then(async function(resp){
      console.log("second hit");
      const responseData = await resp.json();
      
      await thisobj.setState({loginStatus: true});
      //let resObj = JSON.stringify(responseData);
      //console.log("AWS "+ JSON.stringify(responseData));
      console.log(responseData.body);
      if(responseData.body == 'Success'){
        console.log('for setting instorage', token);
        await AsyncStorage.setItem('loginToken', token);
        var getting = await AsyncStorage.getItem('loginToken');
        console.log('from loacl storage', getting);
        thisobj.props.navigation.navigate('List');
      }

    })
        //code end
      }
        
    
        
    
      )
    
    });
    
  
   
  };
//On click of login btn
onLogin() {
    if(this.validate()){
        const { username, password } = this.state;
        this._bootstrapAsync();
    }
    else{
        Alert.alert('Both fields are required');
    }
}


//Validate input field
validate() {
    const { username, password } = this.state;
    if(username === '' || password === ''){
        return false;
    }
    else{
        return true;
    }
}
async componentDidMount(){
  
    this.checkLogin();
    this.checkPermission();
    this.createNotificationListeners();
    
    
}

  ////////////////////// Add these methods //////////////////////
  
  //Remove listeners allocated in createNotificationListeners()
componentWillUnmount() {

  this.notificationListener();
  this.notificationOpenedListener();

}

async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  // const notificationOpen = await firebase.notifications().getInitialNotification();
  // if (notificationOpen) {
  //     const { title, body } = notificationOpen.notification;
  //     this.showAlert(title, body);
  // }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert(title, body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
       // Alert.alert("Device Token",fcmToken);
        console.log('token', fcmToken);
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            
        }
    }
    else{
     // Alert.alert("Device Token",fcmToken);
            console.log('token', fcmToken);
    }
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  _list = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  async checkLogin() {
    let loginToken = await AsyncStorage.getItem('loginToken');
    if(loginToken){
      this.validateGuid();
      this.setState({loginStatus : true});
    }
    else{
      this.setState({loginStatus : false});
    }
  }
  render() {
    const {loader} = this.state;
      return (
        <View style={styles.main}>
        <Text style={styles.heading}>
        Welcome to Humax Security</Text>
        <View style={{alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        <View style={[{width:250}]}>
        <Button
          title={'Login'}
          style={styles.btn}
          onPress={this.onLogin.bind(this)}
        />
        </View>
        {loader && <Loader/>}
      </View>
      </View>
      );
  }
}
const styles = StyleSheet.create({
  input: {
      width: 250,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 5,
      backgroundColor:'#fff'
    },
  heading:{
      fontSize:24,
      textAlign:'center',
      marginBottom:5,
      marginTop:0,
      color:'#fff'
  },
  btn:{
      display:'flex',
      width: 250,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginTop: 50,
      paddingLeft:75,
      paddingRight:75,
      backgroundColor:'#000'
  },
  main:{
      backgroundColor:'#275faa',
      flex:1,
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignItems: 'stretch',
  }
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
const ListStack = createStackNavigator({ List: ListScreen, UrlPage: WebviewScreen});
const AppStack = createStackNavigator({ Home: HomeScreen });
// const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
    List: ListStack
  }
));