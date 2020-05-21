const express = require('express');
const router = express.Router();
const axios = require('axios')
const request = require('request');
const config = require('config')
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route   GET api/profile/me
//@desc    Get current users profile
//@access  Private

router.get('/me',auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   POST api/profile/me
//@desc    Create or update profile
//@access  Private
router.post('/',[auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin - linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            // Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id}, {$set: profileFields}, {new: true});
            return res.json(profile);
        }
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route   GET api/profile
//@desc    Get All users profile
//@access  Private

router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user',
        ['name', 'avatar']);

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   GET api/profile/user/:user_id
//@desc    Get users profile by id
//@access  Pubilc

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user',
        ['name', 'avatar']);

        if(!profile)
            return res.status(400).json({ msg: 'Profile not found' })

        res.json(profile);
    } catch(err) {
        console.error(err);
        if(err.kind == undefined) {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error');
    }
});

//@route   GET api/profile
//@desc    Get All users profile
//@access  Private

router.delete('/',auth ,async (req, res) => {
    try {
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id});
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({ msg: 'User deleted'});
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route   Put api/profile/experience
//@desc    Add profile experience
//@access  Private

router.put('/experience',[auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
})

//@route   Delete api/profile/experience/:exp_id
//@desc    Delete profile experience
//@access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id })

        // Get index of the experience
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        console.log(removeIndex);
        if(removeIndex==-1) {
            return res.status(400).json({ msg: 'Experience not found'})
        }
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile); 

    } catch(err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

//@route   Put api/profile/education
//@desc    Add profile education
//@access  Private

router.put('/education',[ auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),  
]],
async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const edu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        if(!profile) {
            return res.status(400).send({ msg: 'Profile not found' });
        }

        profile.education.unshift(edu);
        await profile.save();
        res.json(profile);
        
    } catch(err) {
        console.error(err.message);
        return res.status(500).send('Server Error')
    }
});

//@route   Delete api/profile/education/:edu_id
//@desc    Delete profile education
//@access  Private

router.delete('/education/:exp_id', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id })

        // Get index of the experience
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id);
        console.log(removeIndex);
        if(removeIndex==-1) {
            return res.status(400).json({ msg: 'Education not found'})
        }
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile); 

    } catch(err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

//@route   GET api/profile/github/:username
//@desc    get user repo from github
//@access  Public
router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        SAuthorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });

module.exports = router;