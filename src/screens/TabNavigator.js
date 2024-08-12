// AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CallLog from '../screens/CallLog/index.js'; // Ensure this path is correct
import CallStackNavigator from './../screens/CallScreen/CallStackNavigator';
import DialerScreen from './../screens/Dialer.js/index';
import ContactsScreen from './../screens/ContactScreen.js/index';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
            <Tab.Navigator>
                <Tab.Screen name="Dialer" component={DialerScreen} />
                <Tab.Screen name="Contacts" component={ContactsScreen} />
                <Tab.Screen name="CallLog" component={CallLog} />
<Tab.Screen name="CallScreen" component={CallScreen} />      
          </Tab.Navigator>
    );
};

export default TabNavigator;
