import newDatabase from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isPersistent = true;
const database = newDatabase({ isPersistent });

const SECRET_KEY = 'secret-key';  

// Register middleware
export const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };

    const storedUser = database.create(newUser);
    return res.status(201).json({ id: storedUser.id, username: storedUser.username });
};

// Login middleware
export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const users = database.getById(); 
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token });
};

// Get Profile middleware
export const getProfile = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = database.getById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ username: user.username });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Logout middleware
export const logout = (req, res) => {
    return res.status(204).send();
};
