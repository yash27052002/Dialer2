// CallScreen.js
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CallScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params || {};

    useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                {
                    title: "Call Permission",
                    message: "This app needs access to make calls.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            ).then(result => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission granted
                } else {
                    ToastAndroid.show("Call permission denied", ToastAndroid.SHORT);
                }
            });
        }
    }, []);

    const handleEndCall = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.phoneNumber}>Calling: {phoneNumber}</Text>
            <Button title="End Call" onPress={handleEndCall} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    phoneNumber: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default CallScreen;
