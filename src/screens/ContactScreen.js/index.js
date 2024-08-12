import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { NativeModules } from 'react-native';

const { MyCallModule } = NativeModules;

const ContactsScreen = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    // Function to request contacts permission
    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts Permission',
                    message: 'This app needs access to your contacts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    // Function to fetch contacts
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                Contacts.getAll()
                    .then(contacts => {
                        setContacts(contacts);
                        setLoading(false);
                    })
                    .catch(e => {
                        setError(e.message);
                        setLoading(false);
                    });
            } else {
                setError('Permission denied');
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Function to request call permission
    const requestCallPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                    {
                        title: 'Phone Call Permission',
                        message: 'This app needs access to make phone calls.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            // For iOS, handle permissions differently if necessary
            return true;
        }
    };

    const triggerCall = async (phoneNumber) => {
        const hasPermission = await requestCallPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'You need to grant phone call permission to use this feature.');
            return;
        }

        // if (!/^\d{10}$/.test(phoneNumber)) {
        //     Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
        //     console.log(phoneNumber);
        //     return;
        // }

        MyCallModule.makeCall(phoneNumber);
    };

    // Render item for FlatList
    const renderItem = ({ item }) => {
        const phoneNumber = item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : '';

        return (
            <View style={styles.contactContainer}>
                <Text style={styles.contactName}>{item.displayName}</Text>
                {phoneNumber ? (
                    <Text style={styles.contactPhone}>{phoneNumber}</Text>
                ) : (
                    <Text style={styles.contactPhone}>No phone number available</Text>
                )}
                <TouchableOpacity onPress={() => phoneNumber && triggerCall(phoneNumber)}>
                    <Image style={styles.callButton} source={require('../../assets/phone.png')} />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Retry" onPress={fetchContacts} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.recordID.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    contactContainer: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    callButton: {
        backgroundColor: '#007BFF',
        borderRadius: 30,
        padding: 15,
        width: 30,
        alignItems: 'center',
        height: 20,
        left: 270,
        bottom: 25
    },
    contactPhone: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
});

export default ContactsScreen;
