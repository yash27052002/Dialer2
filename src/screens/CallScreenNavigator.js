import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CallScreen from './CallScreen';

const Stack = createStackNavigator();

function CallScreenNavigtor() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CallScreen" component={CallScreen} />
        </Stack.Navigator>
    );
}

export default CallScreenNavigtor;
