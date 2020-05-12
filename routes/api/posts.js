const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

//@route   POST api/posts
//@desc    Test route
//@access  Private

router.get('/', (req, res) => res.send('Post route'));

module.exports = router;