/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TextInput, Button} from 'react-native';
import uuid from 'uuid/v4'
const CLIENTID = uuid()

// imports from Amplify library
import { API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import { Auth } from 'aws-amplify'
// import the query
import { listRestaurants } from './src/graphql/queries'
import { createRestaurant } from './src/graphql/mutations'
import { onCreateRestaurant } from './src/graphql/subscriptions'


// type Props = {}; <Props>
class App extends Component {

  state = {
    name: '', description: '', city: '', restaurants: []
  }

  subscription = {}

// execute the query in componentDidMount
async componentDidMount() {
  
  const user = await Auth.currentAuthenticatedUser()
  console.log('user:', user)
  console.log('username:', user.username)

  try {
    const restaurantData = await API.graphql(graphqlOperation(listRestaurants))
    console.log('restaurantData:', restaurantData)
    this.setState({
      restaurants: restaurantData.data.listRestaurants.items
    })
  } catch (err) {
    console.log('error fetching restaurants...', err)
  }

  this.subscription = API.graphql(
    graphqlOperation(onCreateRestaurant)
  ).subscribe({
      next: eventData => {
        console.log('eventData', eventData)
        const restaurant = eventData.value.data.onCreateRestaurant
        if(CLIENTID === restaurant.clientId) return
        const restaurants = [...this.state.restaurants, restaurant]
        this.setState({ restaurants })
      }
  });
}


// remove the subscription in componentWillUnmount
componentWillUnmount() {
  this.subscription.unsubscribe()
}

createRestaurant = async() => {
  const { name, description, city  } = this.state
  const restaurant = {
    name, description, city, clientId: CLIENTID
  }
  
  const updatedRestaurantArray = [...this.state.restaurants, restaurant]
  this.setState({
    restaurants: updatedRestaurantArray,
    name: '', description: '', city: ''
    })
  try {
    await API.graphql(graphqlOperation(createRestaurant, {
      input: restaurant
    }))
    console.log('item created!')
  } catch (err) {
    console.log('error creating restaurant...', err)
  }
}

// add a sign out method
signOut = async () => {
  await Auth.signOut()
  this.props.onStateChange('signedOut', null);
}

// change state then user types into input
onChange = (key, value) => {
  this.setState({ [key]: value })
}

  render() {
    return (
      <View>
        <Button onPress={this.signOut} title='Sign Out' />
        <TextInput
          onChangeText={v => this.onChange('name', v)}
          value={this.state.name}
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
        />
        <TextInput
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={v => this.onChange('description', v)}
          value={this.state.description}
        />
        <TextInput
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={v => this.onChange('city', v)}
          value={this.state.city}
        />
        <Button onPress={this.createRestaurant} title='Create Restaurant' />
        <ScrollView>
    {this.state.restaurants.map((restaurant, index) => (
      <View style={styles.restaurant} key={index}>
        <Text style={styles.instructions}>{restaurant.name}</Text>
        <Text style={styles.instructions}>{restaurant.description}</Text>
        <Text style={styles.instructions}>{restaurant.city}</Text>
        </View>
        ))}
        </ScrollView>
      </View>
    )
  }
}
export default withAuthenticator(App, { includeGreetings: true });

const styles = StyleSheet.create({
  restaurant: {
    padding: 15,
    borderBottomWidth: 2
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
