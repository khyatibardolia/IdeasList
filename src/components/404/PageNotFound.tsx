import React from 'react';
import pageNotFound from '../../assets/page-not-found.png';
import * as routes from "../../constants/routes";
import {useHistory} from "react-router";
import './PageNotFound.scss';

const PageNotFound = () => {

    const history = useHistory();

    return <div className='page-not-found d-flex align-items-center justify-content-center
    flex-column px-4 text-center vh-100'>
        <img src={pageNotFound} alt="pageNotFound" className="img-fluid" width={400}/>
        <h1 className="my-2">404 - Page Not Found!</h1>
        <p className="text-center mb-1">
            The page you are looking for might have been removed,
            had it's name changed, or is temporarily unavailable.
        </p>
        <button className="btn btn-back" onClick={() => history.push(routes.LOGIN)}>
            Back
        </button>
    </div>;
};

export default (PageNotFound);
