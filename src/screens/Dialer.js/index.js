import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, NativeModules, Platform, PermissionsAndroid, Image, Alert
} from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from '../../../ThemeContext';
import { useNavigation } from '@react-navigation/native';

const DialerScreen = () => {
    const navigation = useNavigation();
    const [numberSelected, setNumberSelected] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();
    const { MyCallModule } = NativeModules;

    // Request permissions
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ];

                const granted = await PermissionsAndroid.requestMultiple(permissions, {
                    title: 'Permissions Required',
                    message: 'This app needs access to make phone calls and record audio.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });

                // Check if all permissions are granted
                return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            // For iOS, handle permissions differently if necessary
            return true;
        }
    };

    // Handle call
    const triggerCall = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'You need to grant all required permissions to use this feature.');
            return;
        }

        if (!/^\d{10}$/.test(numberSelected)) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
            return;
        }

        // Trigger recording and make the call
        try {
            await MyCallModule.startRecording(); // Ensure startRecording is correctly implemented in the native module
            await MyCallModule.makeCall(numberSelected); // Ensure makeCall is correctly implemented in the native module
            navigation.navigate('CallScreen', { phoneNumber: numberSelected });
        } catch (error) {
            console.error('Error starting recording or making call:', error);
            Alert.alert('Error', 'There was an issue starting the recording or making the call.');
        }
    };

    // Handle input change
    const handleInputChange = () => {
        setIsEditing(true);
        Keyboard.dismiss();
    };

    // Handle button press
    const handlePress = (number) => {
        setNumberSelected(prevNumbers => prevNumbers + number);
    };

    // Open default dialer settings
    const openDefaultDialerSettings = () => {
        MyCallModule.openDefaultDialerSettings();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={handleInputChange}>
                <TextInput
                    style={[styles.selectedNumber, { color: theme.text }]}
                    onChangeText={setNumberSelected}
                    value={numberSelected} // Ensure the value prop is set
                    editable={isEditing}
                />
            </TouchableOpacity>
            <View style={styles.numPad}>
                {/* Row 1 */}
                <View style={styles.numPadRow}>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('1')}>1</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('2')}>2</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('3')}>3</Button>
                </View>
                {/* Row 2 */}
                <View style={styles.numPadRow}>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('4')}>4</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('5')}>5</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('6')}>6</Button>
                </View>
                {/* Row 3 */}
                <View style={styles.numPadRow}>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('7')}>7</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('8')}>8</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('9')}>9</Button>
                </View>
                {/* Row 4 */}
                <View style={styles.numPadRow}>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('*')}>*</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('0')}>0</Button>
                    <Button mode="contained" style={styles.numButton} onPress={() => handlePress('#')}>#</Button>
                </View>
            </View>
            <TouchableOpacity onPress={triggerCall}>
                <Image style={styles.callButton} source={require('../../assets/phone.png')} />
            </TouchableOpacity>
            <Button
                mode="contained"
                style={styles.settingsButton}
                onPress={openDefaultDialerSettings}
            >
                Open Default Dialer Settings
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numPad: {
        marginBottom: 100,
    },
    numPadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    numButton: {
        width: 60,
        height: 50,
        margin: 9,
        borderRadius: 100,
        backgroundColor: '#adadad'
    },
    callButton: {
        backgroundColor: '#007BFF',
        borderRadius: 30,
        padding: 15,
        width: 70,
        height: 40,
        alignItems: 'center',
    },
    selectedNumber: {
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 2,
        width: 300,
    },
    settingsButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        color: '#fff',
    },
});

export default DialerScreen;
