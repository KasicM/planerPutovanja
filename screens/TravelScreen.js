import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Button } from 'react-native';
import { ListItem, Image } from 'react-native-elements';
import firebase from '../database/firebaseDb';

function TravelScreen({ navigation }) {
  const firestoreRef = firebase.firestore().collection('travels');
  const [isLoading, setIsLoading] = useState(true);
  const [travelArr, setTravelArr] = useState([]);

  useEffect(() => {
   navigation.setOptions({
    headerRight: () => (
      <Button title='Add new' onPress={() => navigation.navigate('AddTravelScreen')}></Button>
    )
   }) 
  })

  useEffect(() => {
    const unsubscribe = firestoreRef.onSnapshot((querySnapshot) => {
      const updatedTravelArr = [];
      querySnapshot.forEach((res) => {
        const { destination, budget, dateFrom, dateTo } = res.data();
        updatedTravelArr.push({
          key: res.id,
          destination,
          budget,
          dateFrom: dateFrom,
          dateTo: dateTo,
        });
      });
      setTravelArr(updatedTravelArr);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {travelArr.map((item) => (
        <ListItem
          key={item.key}
          containerStyle={styles.listItem}
          bottomDivider
          onPress={() => {
            navigation.navigate('TravelDetailScreen', {
              userkey: item.key,
            });
          }}
        >
          <Image
            source={require('../assets/placeholder.png')}
            style={styles.profileImage}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>{item.destination}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{`${new Date(item?.dateFrom?.seconds*1000).toDateString()} - ${new Date(item?.dateTo?.seconds*1000).toDateString()}`}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  preloader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
});

export default TravelScreen;
