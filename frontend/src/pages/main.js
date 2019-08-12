import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './main.css';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import deslike from '../assets/dislike.svg';
import itsmatch from '../assets/itsamatch.png';

export default function Main({ match, history }) {
    const [data, setData] = useState([]); //CONTEM TODOS OS DEVS
    const [avatar, setAvatar] = useState('');
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function devAvatar() {
            const responseUser = await api.get(`/devs/${match.params.id}`);
            setAvatar(responseUser.data.avatar);
        }

        async function usersData() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            });
            setData(response.data);
        }
        usersData();
        devAvatar();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id },
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [match.params.id]);

    async function handleLike(devId) {
        await api.post(`/devs/${devId}/likes`, null, {
            headers: { user: match.params.id },
        })
        setData(data.filter(user => user._id !== devId));
    }

    async function handleDislike(devId) {
        await api.post(`/devs/${devId}/deslikes`, null, {
            headers: { user: match.params.id },
        })
        setData(data.filter(user => user._id !== devId));
    }

    async function handleAccount(devId) {
        history.push(`/main/${devId}`);

    }

    return (
        <div className="main-container">
            <Link to='/'>
                <img src={logo} alt="tindev" />
            </Link>
            <img src={avatar} alt='' className="dev-avatar" />
            {data.length > 0 ? (
                <ul>
                    {data.map(item => (
                        <li>
                            <footer>
                                <img onClick={() => { handleAccount(item._id) }} src={item.avatar} alt='' />
                                <strong>{item.name}</strong>
                                <p>{item.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button onClick={() => { handleLike(item._id) }} type="buttons">
                                    <img src={like} alt="like" />
                                </button>
                                <button onClick={() => { handleDislike(item._id) }} type="buttons">
                                    <img src={deslike} alt="deslike" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (<h1>Acabou :(</h1>)}

            {matchDev && (
                <div className="match-container">
                    <img src={itsmatch} alt="It's a match" />
                    <img className="avatar-match" src={matchDev.avatar} alt="Avatar" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button type="button" onClick={() => setMatchDev(null)}>
                        FECHAR</button>
                </div>
            )}
        </div>

    )

}