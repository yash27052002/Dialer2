import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DialerScreen from './src/screens/Dialer.js/index';
import CallScreen from './src/screens/CallScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Dialer">
                <Stack.Screen name="Dialer" component={DialerScreen} />
                <Stack.Screen name="CallScreen" component={CallScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
