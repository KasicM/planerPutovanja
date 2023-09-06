// screens/AddTravelScreen.js
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Alert, Text} from 'react-native';
import firebase from '../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';


function AddTravelScreen({ navigation }) {
  const dbRef = firebase.firestore().collection('travels');
  const [travelData, setTravelData] = useState({
    destination: '',
    budget: '',
    dateFrom: firebase.firestore.Timestamp.fromDate(new Date()),
    dateTo: firebase.firestore.Timestamp.fromDate(new Date()),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dateFromPicker, setDateFromPicker] = useState(false)
  const [dateToPicker, setDateToPicker] = useState(false)

  const inputValueUpdate = (val, prop) => {
    setTravelData({
      ...travelData,
      [prop]: val,
    });
  };

  const storeTravel = () => {
    if (travelData.destination === '') {
      Alert.alert('Warning', 'Please fill in your destination name.');
    } else {
      setIsLoading(true);

      dbRef
        .add({
          destination: travelData.destination,
          budget: travelData.budget,
          dateFrom: travelData.dateFrom,
          dateTo: travelData.dateTo
        })
        .then(() => {
          setTravelData({
            destination: '',
            budget: '',
            dateFrom: '',
            dateTo: '',
          });
          setIsLoading(false);
          navigation.navigate('TravelScreen');
        })
        .catch((error) => {
          console.error('Error found: ', error);
          setIsLoading(false);
        });
    }
  };
  
  const dateValueUpdate = (val, prop) => {
    setTravelData({
      ...travelData,
      [prop]: firebase.firestore.Timestamp.fromDate(new Date(val.nativeEvent.timestamp)),
    });
      if(prop==='dateFrom'){
        setDateFromPicker(false)
      }else {
        setDateToPicker(false)
      }
  };

  const dateFromToggle = ()=> {
    setDateFromPicker(true)
    console.log('DATEFROMCLICKED: ', dateFromPicker)
  }

  const dateToToggle = ()=> {
    setDateToPicker(true)
    console.log('DATETOCLICKED: ', dateToPicker)

  }

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          placeholder={'Destination'}
          value={travelData.destination}
          onChangeText={(val) => inputValueUpdate(val, 'destination')}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          multiline={true}
          numberOfLines={4}
          placeholder={'Budget'}
          value={travelData.budget}
          onChangeText={(val) => inputValueUpdate(val, 'budget')}
        />
      </View>
      <View style={styles.button}>
        <Text>{"From"}</Text>
        <Button color='#0047AB' title={`${new Date(travelData?.dateFrom.seconds*1000).toDateString()}`} onPress={dateFromToggle} />
        <Text>{"To"}</Text>
        <Button color='#0047AB' title={`${new Date(travelData?.dateTo.seconds*1000).toDateString()}`} onPress={dateToToggle}  />

      {dateFromPicker && <DateTimePicker
      value={travelData?.dateFrom.toDate()}
      onChange={(val) => dateValueUpdate(val, 'dateFrom')}
>      </DateTimePicker>}
      {dateToPicker && <DateTimePicker
      value={travelData?.dateTo.toDate()}
      onChange={(val) => dateValueUpdate(val, 'dateTo')}
>      </DateTimePicker>}
      </View>

      <Button title='Add Travel' onPress={storeTravel} color="#19AC52" />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default AddTravelScreen;
