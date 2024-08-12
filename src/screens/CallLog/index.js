import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { MyCallModule } = NativeModules;

const CALL_TYPES = {
    INCOMING: 1,
    OUTGOING: 2,
    MISSED: 3,
};

const CallLogsScreen = () => {
    const [callLogs, setCallLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to request permissions
    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Call Logs Permission',
                    message: 'This app needs access to your call logs',
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

    // Function to fetch call logs
    const fetchCallLogs = async () => {
        setLoading(true);
        try {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                MyCallModule.getCallLogs()
                    .then(logs => {
                        setCallLogs(JSON.parse(logs));  // Ensure logs are parsed from JSON string
                        setLoading(false);
                    })
                    .catch(err => {
                        setError('Failed to fetch call logs');
                        console.error(err);
                        setLoading(false);
                    });
            } else {
                setError('Permission denied');
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCallLogs();
    }, []);

    // Render item for FlatList using switch case
    const renderItem = ({ item }) => {
        let callTypeText;
        let backgroundColor;

        switch (item.type) {
            case CALL_TYPES.INCOMING:
                callTypeText = 'Incoming Call';
                backgroundColor = '#e0f7fa'; // Light blue for incoming calls
                break;
            case CALL_TYPES.OUTGOING:
                callTypeText = 'Outgoing Call';
                backgroundColor = '#fff3e0'; // Light orange for outgoing calls
                break;
            case CALL_TYPES.MISSED:
                callTypeText = 'Missed Call';
                backgroundColor = '#fce4ec'; // Light pink for missed calls
                break;
            default:
                callTypeText = 'Unknown Call Type';
                backgroundColor = '#ffffff'; // Default background
        }

        return (
            <View style={[styles.item, { backgroundColor }]}>
                <Text style={styles.text}>Number: {item.number}</Text>
                <Text style={styles.text}>Name: {item.name || 'Unknown'}</Text>
                <Text style={styles.text}>Type: {callTypeText}</Text>
                <Text style={styles.text}>Date: {new Date(item.date).toLocaleString()}</Text>
                <Text style={styles.text}>Duration: {item.duration} seconds</Text>
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
                <Button title="Retry" onPress={fetchCallLogs} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={callLogs}
                keyExtractor={(item) => item.date.toString()}
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
    item: {
        padding: 10,
        marginVertical: 8,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
});

export default CallLogsScreen;
