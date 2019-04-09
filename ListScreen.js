import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, WebView} from 'react-native';

// Dummy data to show in list

export default class ListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
          data : []
        }
       this.showList = this.showList.bind(this);
       this._onPressButton = this._onPressButton.bind(this);
    }
    componentDidMount(){
      var thisobj = this;
      fetch('https://phpq09tvz7.execute-api.us-east-1.amazonaws.com/prod',{
        headers: {
          'Accept':'application/json'
        },
      }).then(async function(resp){
        const responseData = await resp.json();
          console.log('msg list'+JSON.stringify(responseData.body));
          var temp = JSON.stringify(responseData.body.Items);
          var parseData = JSON.parse(temp);
          thisobj.setState({data:parseData});
          console.log('response data'+ JSON.parse(temp));
      });
    }
    _onPressButton(parm){
      this.props.navigation.navigate(
        'UrlPage',
        { parm },
      );
    }
    showList() {
      console.log('showlist called', this.state.data);
      var data = this.state.data;
      let a = [];
      console.log('type of', typeof data);
      console.log('type of', typeof a);
      if(data.length>0){
        return data.map((list, i) => {
          //<TouchableOpacity onPress={()=>{Linking.openURL('https://'+list.message.S)}} style={styles.touchable}></TouchableOpacity>
          return(
            <View key={i} style={styles.list}>
             <TouchableOpacity onPress={() => {this._onPressButton(list.message.S)}} style={styles.touchable}>
              <View style={styles.title}>
                <Text style={styles.heading}>{list.message.S}</Text>
                <Text style={styles.subhead}>{list.createdAt.S}</Text>
              </View>
              <View style={styles.dateSection}>
                  <Text style={styles.subhead}>
                      
                  </Text>
              </View>
              </TouchableOpacity> 
            </View>
          );
        });
      }
        
      }

    render() {
        return (
          
            <View style={styles.main}>
                {this.showList()}
            </View>
           
          
        )}
}

const styles = StyleSheet.create({
    list: {
        padding:5,       
        alignItems: 'stretch',
        backgroundColor: '#fff',
        justifyContent: 'center',
        margin:10,
        marginBottom: 5,       
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
      },
    title: {
          marginRight:30,
          alignSelf: 'stretch',
      },
    heading: {
          fontSize: 18,
      },
    main: {
          width:'100%',
          backgroundColor:'#DDDDDD',
          flex:1,
      },
    touchable: {
          width:'100%',
          flexDirection: 'row',
          display:'flex',
          justifyContent: 'space-between',
          padding:5,
      },
    subhead: {
          color:'#afafaf',
          fontSize:12,
      },
    dateSection: {
          right:0,
      }
})