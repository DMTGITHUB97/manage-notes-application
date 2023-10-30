import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


const Navbar = () => {
  let history = useHistory();
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    history.push('/login');
  }
  let location = useLocation();
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-fixed-top bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/">iNotebook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={`nav-link text-white ${location.pathname === "/" ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link text-white ${location.pathname === "/about" ? 'active' : ''}`} to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link text-white ${location.pathname === "/notestab" ? 'active' : ''}`} to="/notestab">Notes</Link>
              </li>
            </ul>
            {!localStorage.getItem("token")}?<form className="d-flex">
              <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
              <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
            </form>:<button onClick={handleLogout} className='btn btn-primary'>Logout</button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;
