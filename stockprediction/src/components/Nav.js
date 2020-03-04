import React from 'react';
import './Nav.css'
import {Link} from 'react-router-dom';

function Nav() {
    return(
        <nav className='navbar'>
            <h3>
                Stock Predictor
            </h3>
            <ul className='nav-list'>
                <Link to='/' className='nav-links'> 
                    <li>Home</li>
                </Link>
                <Link to='/about' className='nav-links'> 
                    <li>About</li>
                </Link>
                
            </ul>
        </nav>
    )
}
export default Nav;