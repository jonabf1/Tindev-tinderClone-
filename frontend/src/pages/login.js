import React, { useState } from 'react';
import api from '../services/api';
import './login.css';
import logo from '../assets/logo.svg';

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await api.post('/devs', { username });

        const { _id } = response.data;
        history.push(`/main/${_id}`);
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <img src={logo} className='logo' alt='tindev' />
                <input type="text"
                    placeholder="Digite seu usuário do Github"
                    value={username} onChange={e =>
                      setUsername(e.target.value)}></input>
                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}