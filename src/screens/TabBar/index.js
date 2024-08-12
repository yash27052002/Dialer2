import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import DialerScreen from './../Dialer.js/index';
import ContactsScreen from './../ContactScreen.js/index';
import CallLogsScreen from './../CallLog/index';
import CallScreen from './../CallScreen/index';

const TabBar = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Dialer" component={DialerScreen} />
                <Tab.Screen name="Contacts" component={ContactsScreen} />
                <Tab.Screen name="CallLog" component={CallLogsScreen} />
                <Tab.Screen name="CallScreen" component={CallScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({})

export default TabBar;
