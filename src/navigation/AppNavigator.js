import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import DialerScreen from '../screens/Dialer.js';
import ContactsScreen from '../screens/ContactScreen.js/index.js';
import CallLog from '../screens/CallLog/index.js';
import CallScreenNavigtor from '../screens/CallScreenNavigator.js'; // Ensure import is correct

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Dialer" component={DialerScreen} />
                <Tab.Screen name="Contacts" component={ContactsScreen} />
                <Tab.Screen name="CallLog" component={CallLog} />
                <Tab.Screen name="CallScreenNavigator" component={CallScreenNavigtor} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
