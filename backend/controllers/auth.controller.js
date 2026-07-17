const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudant, DB_USERS } = require('../config/cloudant');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const findResponse = await cloudant.postFind({
            db: DB_USERS,
            selector: { email: email }
        });

        if (findResponse.result.docs.length > 0) {
            return res.status(400).json({ message: 'User structural allocation conflicts: Email exists.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = uuidv4();
        const newUserDoc = {
            _id: userId,
            type: 'user',
            name,
            email,
            password: hashedPassword,
            preferences: { theme: 'dark', notifications: true },
            createdAt: new Date().toISOString()
        };

        await cloudant.postDocument({ db: DB_USERS, document: newUserDoc });

        const payload = { user: { id: userId } };
        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: { id: userId, name, email } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal SaaS Authentication System Fault.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const findResponse = await cloudant.postFind({
            db: DB_USERS,
            selector: { email: email }
        });

        if (findResponse.result.docs.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials array.' });
        }

        const userDoc = findResponse.result.docs[0];
        const isMatch = await bcrypt.compare(password, userDoc.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials array.' });
        }

        const payload = { user: { id: userDoc._id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: userDoc._id, name: userDoc.name, email: userDoc.email, preferences: userDoc.preferences } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Engine Validation Routine Failure.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userResponse = await cloudant.getDocument({ db: DB_USERS, docId: req.user.id });
        const userDoc = userResponse.result;
        delete userDoc.password;
        res.json(userDoc);
    } catch (err) {
        res.status(404).json({ message: 'Profile node matrix unreachable.' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, preferences, currentPassword, newPassword } = req.body;
    try {
        const userResponse = await cloudant.getDocument({ db: DB_USERS, docId: req.user.id });
        const userDoc = userResponse.result;

        if (name) userDoc.name = name;
        if (preferences) userDoc.preferences = { ...userDoc.preferences, ...preferences };

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, userDoc.password);
            if (!isMatch) return res.status(400).json({ message: 'Current password match signature rejected.' });
            const salt = await bcrypt.genSalt(12);
            userDoc.password = await bcrypt.hash(newPassword, salt);
        }

        await cloudant.postDocument({ db: DB_USERS, document: userDoc });
        delete userDoc.password;
        res.json({ message: 'Profile update synchronized.', user: userDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Profile write structural commit error.' });
    }
};