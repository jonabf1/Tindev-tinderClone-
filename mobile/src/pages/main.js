import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, Image, StyleSheet, Text } from 'react-native';
import { TouchableOpacity} from 'react-native-gesture-handler';
import api from '../services/api';
import logo from '../assets/logo.png';
import dislike from '../assets/dislike.png';
import itsamatch from "../assets/itsamatch.png";
import like from '../assets/like.png';


export default function Main({ navigation }) {
    const id = navigation.getParam('user'); //get do login
    const [data, setData] = useState([]); //CONTEM TODOS OS DEVS
    const [avatar, setAvatar] = useState('');
    const [matchDev, setMatchDev] = useState(null);


    useEffect(() => {
        async function devAvatar() {
            const responseUser = await api.get(`/devs/${id}`);
            setAvatar(responseUser.data.avatar);
        }

        async function usersData() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });
            setData(response.data);
        }
        usersData();
        devAvatar();
    }, [id])

    useEffect(() => {
        const socket = io('http://10.0.2.2:3333', {
            query: { user: id },
        });

        socket.on("match", dev => {
            setMatchDev(dev);
        });
    }, [id]);

    async function handleLike() {
        const [user, ...rest] = data;
        //Pega a posicao exata da iteracao que está o user do card renderizado
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        });

        setData(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = data; //GET NO INDEX exato do USER no card
        //Pega a posicao exata da iteracao que está o user do card renderizado

        await api.post(`/devs/${user._id}/deslikes`, {
            headers: { user: id },
        })

        setData(rest);
    }

    async function handleLoggout() {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLoggout}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>
            <Image style={styles.icon} source={{ uri: avatar }} />
            <View style={styles.cardsContainer}>
                {data.length === 0
                    ? <Text style={styles.empty}>Acabou :(</Text>
                    : (data.map((item, index) => (
                        <View key={item._id} style={[styles.card, { zIndex: data.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: item.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{item.bio}</Text>
                            </View>
                        </View>
                    )))}
            </View>
            {data.length > 0 && (<View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={like} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Image source={dislike} />
                </TouchableOpacity>
            </View>)}
            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchImage} />
                    <Image style={styles.matchAvatar} source={{
                        uri: matchDev.avatar
                    }} />
                    <Text style={styles.matchName}> {matchDev.name} </Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        marginTop: 20
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 15,
        color: '#999',
        marginTop: 2,
        lineHeight: 18,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    icon: {
        right: 0,
        left: 0,
        top: 14,
        bottom: 0,
        alignSelf: 'center',
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },

    matchImage: {
        height: 60,
        resizeMode: "contain"
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: "#fff",
        marginVertical: 30
    },

    matchName: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#fff"
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        lineHeight: 24,
        textAlign: "center",
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
        marginTop: 30,
        fontWeight: "bold"
    }
})