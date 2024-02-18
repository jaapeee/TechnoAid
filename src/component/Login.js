import React from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate=useNavigate();



    
  return (
    <div>
    <div className="nav_border_container">

<div className="nav_border border-top"></div>
<nav className="navbar navbar-expand-lg">
  <div className="container container-fluid">
      <a onClick={()=>navigate('/')} className="navbar-brand">TECHNOAID</a>    
    </div>
  </nav>

</div>
    
<div className='login-main-heading'>Select which type of user you are</div>

<div className="login-main-container"> 

  <div className='employee-login-image-container'>
    <div className='employee-login-image' ></div>
    <div className='employee-login-image-overlay' onClick={()=>navigate('/LoginEmployee')}>
      <div className='employee-text'>Employee Login</div>
    </div>
  </div>

  <div className='employer-login-image-container'>
    <div className='employer-login-image'></div>
    <div className='employer-login-image-overlay' onClick={()=>navigate('/LoginEmployer')}>
      <div className='employer-text'>Employer Login</div>
    </div>
  </div>



  </div>
</div>

  )
}

export default Login