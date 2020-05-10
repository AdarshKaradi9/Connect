const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator')
const gravatar = require('gravatar');
const User = require('../../models/User');

//@route   POST api/users
//@desc    Register User
//@access  Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    
    const {name, email, password} = req.body; 

    try {
        // See if user exists
        let user = await User.findOne({ email });
        
        if(user) {
            res.status(400).json({ errors: [{ msg: 'User already exists' }]})
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            
        })

        // Encrypt password

        // Return jsonwebtoken
        res.send('User route');
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});



module.exports = router;