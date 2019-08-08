import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './pages/main';
import Login from './pages/login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Login} />
            <Route path="/main/:id" component={Main} />
        </BrowserRouter>
    );
}