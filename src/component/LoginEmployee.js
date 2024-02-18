import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '../context/UserAuthContext'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function LoginEmployee() {
  const navigate=useNavigate();
  const { EmployeeUserLogin } = useAuth()
  const [err, setError] = useState("")
  const [user, setUser] = useState({
    email: "",
    password: "",
    sis: "",
  })
  const [rememberMe, setRememberMe] = useState(false);

  const [show, setShow] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    const storedSIS = localStorage.getItem('rememberedSIS');

    if (storedEmail && storedPassword && storedSIS) {
      setUser({
        email: storedEmail,
        password: storedPassword,
        sis: storedSIS,
      });
      setRememberMe(true);
    }
  }, []);

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      handleClose();
      // You can add a success message or redirect the user to a confirmation page
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email", error.message);
      // Handle the error and display an appropriate message to the user
    }
  };

  const UserHandler = (e) => {
    const { name, value } = e.target;
    setUser((pre) => {
      return {
        ...pre,
        [name]: value
      }
    })
  }

  const RememberMeHandler = (e) => {
    setRememberMe(e.target.checked);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault()
      const { email, password, sis} = user
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberedSIS', sis);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberedSIS');
        } if (email == "" || password == "" || sis == "") {
          setInterval(() => {
            setError("")
          }, 5000)
          return setError("*Fill All the Field")
        } try {
          await EmployeeUserLogin(email, password, sis);
            const user = auth.currentUser;
            const uid = user.uid;

            const lastSignedInString = new Date().toISOString();
            await updateEmployeeInfo(uid, { lastSignedIn: lastSignedInString});
            
          navigate("/Home")
        } catch (error) {
          if (error.code == "auth/user-not-found") {
            setInterval(() => {
              setError("")
            }, 5000)
            return setError("*User Not Found")
        } if (error.code == "auth/invalid-email") {
          setInterval(() => {
            setError("")
          }, 5000)
          return setError("*Invalid Email")
        } else if (error.code == "auth/invalid-credential") {
          setInterval(() => {
            setError("")
          }, 5000)
          return setError("*Wrong Password")
        } else {
          setInterval(() => {
            setError("")
          }, 5000)
          return setError(`${error.message}`)
        }}
      };

      const updateEmployeeInfo = async (uid, data) => {
        const employeeDocRef = doc(db, 'EmployeeProfiles', uid);
        try {
          await updateDoc(employeeDocRef, data);
        } catch (error) {
          console.error('Error updating Employee info:', error);
        }
      };



    
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
    
<div class="login-page">
<div class="login-image"> </div>
  <div class="login-container_1">
    <form action="login" method="post" onSubmit={SubmitHandler}>
      <span class="heading_3">Welcome Back,</span> <br></br> <span class="paragraph_1">Enter your details to access your account</span>
    <div class="email-container">
        <p class="paragraph_1">Email</p>
        <input type="text" class="email-textbox" placeholder="Enter your email" value={user.email} name='email' onChange={UserHandler}/>
      </div>

    <div class="sis-container">
        <p class="paragraph_1">SIS number</p>
        <input type="text" class="sis-textbox" placeholder="Enter your SIS number" value={user.sis} name='sis' onChange={UserHandler}/>
      </div>

      <div class="password-container">
        <p class="paragraph_1">Password</p>
        <input type="password" class="password-textbox" placeholder="Enter your password" value={user.password} name='password' onChange={UserHandler}/>
      </div>

      <div class="login-link-container_1">
          <label class="login-check-box">Remember me
            <input type="checkbox" checked={rememberMe} onChange={RememberMeHandler}/>{' '}<span class="login-checkmark"/></label>

            <a style={{ background:'none',  fontWeight:'bold',  fontFamily:'Be Vietnam Pro', color:'#40798C',  fontSize:'18px', cursor:'pointer'}} onClick={handleShow}>
            Forgot Password?
          </a>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize:'25px', fontWeight:'Bold', color: '#40798C' }}>Password Reset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class="form-group">
              <label for="emailInput" className='modal-email'>Enter your email:</label>
              <input type='text' class="form" id="emailInput" rows="1" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}></input>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
              <Button variant="success" onClick={handlePasswordReset}>
                Reset my Password
              </Button>
            </Modal.Footer>
          </Modal>
      </div>

      <div className='error-text'> {err} </div>

      <div class="login-page-btn">
        <a href="#">
            <button class="login-btn">Login</button>
        </a>
      </div>

      <div class="login-link-container_2">
          <h5> <span class="register-link_1">New to TechnoAid?</span><a class="register-link_2" onClick={()=>navigate('/EmployeeRegister')}>Register here</a></h5>
      </div>
       
    </form>
  </div>
</div>
</div>
  )
}

export default LoginEmployee