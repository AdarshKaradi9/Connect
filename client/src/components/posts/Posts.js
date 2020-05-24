import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../../actions/post'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import PostForm from '../posts/PostForm'

const Posts = ({ getPosts, post: { posts, loading }}) => {
    useEffect(() => {
        getPosts();
    }, [getPosts])

    return loading ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">See posts</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome to the community
        </p>
        <PostForm />
        <div className="posts">
            {posts.length > 0 ? (posts.map(post => (
                <PostItem key={post._id} post={post} />
            ))) : (<div className='text' >No Posts show</div>)}
        </div>
    </Fragment>
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts)
