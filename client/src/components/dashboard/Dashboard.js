import React, { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import {DashboardAction} from './DashboardAction'
import Experience from './Experience'
import Education from './Education'
const Dashboard = ({ getCurrentProfile,auth: { user }, profile: { profile, loading }, deleteAccount}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    

    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome { user && user.name }
        </p>
        {profile !== null ? (<Fragment>
            <DashboardAction />
            <Experience experience={profile.experience} /> 
            <Education education={profile.education} />
            <div className="my-2">
            <Link to={`/profile/${user._id}`} className='btn btn-primary'>
                    View Profile
                </Link>
                <button className="btn btn-danger" onClick={() => deleteAccount()}>
                    Delete Account
                </button>
            </div>
        </Fragment>
        ) : (
        <Fragment>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to='create-profile' className='btn btn-primary my-1'>
                Create Profile
            </Link>
        </Fragment> )}
    </Fragment> 
}

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
