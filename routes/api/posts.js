const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route   POST api/posts
//@desc    Create a post
//@access  Private

router.post('/',[ auth, [
    check('text', 'Text is required').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id             
        }
        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch(err) {
        console.error(err.message);
        return res.status(400).send('Server Error')
    }
});

//@route   GET api/posts
//@desc    Get all posts
//@access  Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        if(!posts) {
            return res.status(400).send('No posts available')
        }
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server Error'});
    }
})

//@route   GET api/posts/:post_id
//@desc    Get posts by id
//@access  Private

router.get('/:post_id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err);
        if(err.kind == undefined) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
        
    }
});

//@route   DELETE api/posts/:post_id
//@desc    Delete posts by id
//@access  Private

router.delete('/:post_id', auth, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.post_id);
        
        if(!posts) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        if(posts.user.toString() !== req.user.id ) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await posts.remove();

        res.json(posts);
    } catch(err) {
        if(err.kind == undefined) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/posts/like/:post_id
//@desc    Like a post
//@access  Private

router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if(post.likes.filter( like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post you have already liked'});
        }
        
        post.likes.unshift({ user: req.user.id });
        await post.save();
        
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == undefined) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
})

//@route   PUT api/posts/unlike/:post_id
//@desc    Unlike a post
//@access  Private

router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
    
        if(post.likes.filter( like => like.user.toString() === req.user.id).length == 0) {
            return res.status(400).json({ msg: 'Post you have\'nt liked yet'});
        }
        
        const removeInd = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeInd, 1);
        await post.save();
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == undefined) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

//@route   POST api/posts/comment/:post_id
//@desc    Comment on a post  
//@access  Private

router.post('/comment/:post_id',[ auth, [
    check('text', 'Text is required').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id             
        }
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch(err) {
        console.error(err.message);
        return res.status(400).send('Server Error')
    }
});

//@route   DELETE api/posts/comment/:com_id/:post_id
//@desc    Delete a comment on a post  
//@access  Private

router.delete('/comment/:post_id/:com_id', auth,
async (req, res) => {
    try {
        
        const post = await Post.findById(req.params.post_id);
        
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        const removeInd = post.comments.map(comment => comment.id).indexOf(req.params.com_id);
        if(removeInd==-1) {
            return res.status(400).json({ msg: 'Comment does not exists'})
        }
        
        post.comments.splice(removeInd, 1);
        await post.save();
        res.json(post);
    } catch(err) {
        console.error(err.message);
        return res.status(400).send('Server Error')
    }
});


module.exports = router;