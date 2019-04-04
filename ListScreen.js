import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';

// Dummy data to show in list
const data = [
    {
        title : 'Title 1 goes here',
        desc : 'lorem ipsum sit dela dfgh qwjhjk',
        date : 'jan 2nd 2019',
        url : 'https://www.google.com/',
    },
    {
        title : 'Title 2 goes here',
        desc : 'lorem ipsum sit dela dfgh qwjhjk',
        date : 'jan 2nd 2019',
        url : 'https://www.google.com/',
    },
    {
        title : 'Title 3 goes here',
        desc : 'lorem ipsum sit dela dfgh qwjhjk',
        date : 'jan 2nd 2019',
        url : 'https://www.google.com/',
    },
    {
        title : 'Title 4 goes here',
        desc : 'lorem ipsum sit dela dfgh qwjhjk',
        date : 'jan 2nd 2019',
        url : 'https://www.google.com/',
    },

];

export default class ListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.showList = this.showList.bind(this);
    }
     
    showList() {
        return data.map(function(list, i){
          return(
            <View key={i} style={styles.list}>
            <TouchableOpacity onPress={()=>{Linking.openURL(list.url)}} style={styles.touchable}>
              <View style={styles.title}>
                <Text style={styles.heading}>{list.title}</Text>
                <Text style={styles.subhead}>{list.desc}</Text>
              </View>
              <View style={styles.dateSection}>
                  <Text style={styles.subhead}>
                      {list.date}
                  </Text>
              </View>
              </TouchableOpacity>
            </View>
          );
        });
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