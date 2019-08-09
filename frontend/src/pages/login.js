import React, { useState } from 'react';
import api from '../services/api';
import './login.css';
import logo from '../assets/logo.svg';

export default function Login({ history }) {
    const [username, setUsername] = useState('');
    var erro;

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const response = await api.post('/devs', { username });
            const { _id } = response.data;
            history.push(`/main/${_id}`);
        } catch (err) {
           return err;
        }
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
            {erro !== 'error' ? ('') : (<p>deu erro</p>)}
            </form>
        </div >
    )
}