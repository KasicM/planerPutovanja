import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import firebase from '../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider } from 'react-native-elements';

function TravelDetailScreen({ route, navigation }) {
  const [travelData, setUserData] = useState({
    destination: '',
    budget: '',
    dateFrom: '',
    dateTo: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateFromPicker, setDateFromPicker] = useState(false)
  const [dateToPicker, setDateToPicker] = useState(false)



  useEffect(() => {
    const fetchData = async () => {
      const userRef = firebase.firestore().collection('travels').doc(route.params.userkey);

      try {
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const travel = userDoc.data();
          setUserData({
            destination: travel.destination,
            budget: travel.budget,
            dateFrom: travel.dateFrom,
            dateTo: travel.dateTo
          });
          setIsLoading(false);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching travel data: ", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [route.params.userkey]);

  const inputValueUpdate = (val, prop) => {
    setUserData({
      ...travelData,
      [prop]: val,
    });
  };

  const dateValueUpdate = (val, prop) => {
    setUserData({
      ...travelData,
      [prop]: firebase.firestore.Timestamp.fromDate(new Date(val.nativeEvent.timestamp)),
    });
      if(prop=='dateFrom'){
        setDateFromPicker(false)
      }else {
        setDateToPicker(false)
      }
  };

  const updateTravel = async () => {
    setIsLoading(true);

    try {
      const updateDBRef = firebase.firestore().collection('travels').doc(route.params.userkey);
      await updateDBRef.update({
        destination: travelData.destination,
        budget: travelData.budget,
        dateFrom: travelData.dateFrom,
        dateTo: travelData.dateTo
      });

      setUserData({
        destination: '',
        budget: '',
        dateFrom: '',
        dateTo: ''
      });

      setIsLoading(false);
      navigation.navigate('TravelScreen');
    } catch (error) {
      console.error("Error updating travel data: ", error);
      setIsLoading(false);
    }
  };

  const deleteTravel = async () => {
    const userRef = firebase.firestore().collection('travels').doc(route.params.userkey);

    try {
      await userRef.delete();
      console.log('Item removed from database');
      navigation.navigate('TravelScreen');
    } catch (error) {
      console.error("Error deleting travel: ", error);
    }
  };

  const openTwoButtonAlert = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure?',
      [
        { text: 'Yes', onPress: deleteTravel, style: 'destructive' },
        { text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel' },
      ],
      {
        cancelable: true,
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
  const dateFromToggle = ()=> {
    setDateFromPicker(true)
    console.log('DATEFROMCLICKED: ', dateFromPicker)
  }

  const dateToToggle = ()=> {
    setDateToPicker(true)
    console.log('DATETOCLICKED: ', dateToPicker)

  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={'Destination'}
        value={travelData.destination}
        onChangeText={(val) => inputValueUpdate(val, 'destination')}
      />
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder={'Budget'}
        value={travelData.budget}
        onChangeText={(val) => inputValueUpdate(val, 'budget')}
      />
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
      
      <Button title='Update' onPress={updateTravel} color="#19AC52" padding={2}/>
        <Divider width={10} color='#FFFFFF'></Divider>
      <Button title='Delete' onPress={openTwoButtonAlert} color="#E37399" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  preloader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default TravelDetailScreen;
