const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const {check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth');

router.get('/',auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }
});

//@route   POST api/auth
//@desc    Authenticate user and get token
//@access  Public


router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password} = req.body; 
    try {
        // See if user exists
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials or User does not exists' }]})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            if(!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials or User does not exists' }]})
            }
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn: 360000
        },
        (err, token) => {
            if(err) throw err;
            res.json({ token })
        });

    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;