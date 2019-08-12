import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import api from '../services/api';
import logo from "../assets/logo.png";

export default function Login({ navigation }) {

    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user })
            }
        })
    }, [])

    async function handleLogin() {
        const response = await api.post('/devs', { username: user });
        const { _id } = response.data;
        await AsyncStorage.setItem('user', _id)
        navigation.navigate('Main', { user: _id });
    }

    return (
        <View style={styles.container}>
            <Image source={logo} />
            <TextInput
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor='#999'
                placeholder="Digite seu usuário do Github"
                onChangeText={setUser}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    text: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 20

    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    }

})
