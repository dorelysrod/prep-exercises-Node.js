import express from 'express';
import { register, login, getProfile, logout } from './users.js'; 

let app = express();

app.use(express.json());

app.post('/auth/register', register);  
app.post('/auth/login', login);        
app.get('/auth/profile', getProfile);  
app.post('/auth/logout', logout);     

app.use(express.static('client'));

app.listen(3000);
