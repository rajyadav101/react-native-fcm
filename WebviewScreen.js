import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class WebviewScreen extends Component {
    constructor(props){
        super(props);
    }
  render() {
    console.log('recived parms', this.props.navigation.state.params);
    let url = this.props.navigation.state.params.parm;
    return (
      <WebView
        source={{uri: url}}
        style={{marginTop: 20}}
      />
    );
  }
}