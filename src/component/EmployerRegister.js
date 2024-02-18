import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserAuthContext'
import { db, auth } from '../firebase';
import { collection, where, getDocs, query, doc, setDoc } from 'firebase/firestore';
import { AuthErrorCodes } from 'firebase/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style2.css';
import logo from '../asset/images/TA-logo.png';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function EmployerRegister() {
    const navigate=useNavigate();
    const { EmployerSignUp } = useAuth();
    const [ error, setError] = useState();
    const [show, setShow] = useState(false);
    const termsCheckboxRef = useRef(null);
        
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
            const formData = {   // Extract form data
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                email: e.target.email.value,
                number: e.target.number.value,
                companyName: e.target.companyName.value,
                employerUID: e.target.employerUID.value,
                password: e.target.password.value,
                confirmPassword: e.target.confirmPassword.value,
            };

            if (!termsCheckboxRef.current.checked) {
                setError("Please accept the terms and conditions to proceed.");
                return;
              }

                if (formData.firstName === "" || 
                formData.lastName === "" || 
                formData.email === "" || 
                formData.number === "" || 
                formData.companyName === "" ||
                formData.employerUID === "" || 
                formData.password === "" || 
                formData.confirmPassword === "") {
                    setInterval(() => {
                        setError("")
                    }, 5000)
                    return setError("Please fill all the fields*")
            } else if (formData.password !== formData.confirmPassword) {
                setInterval(() => {
                    setError("")
                }, 5000)
            return setError("Password does not match")
            } else if (!formData.password.length >= 6 || !formData.confirmPassword.length >= 6) {
                setInterval(() => {
                    setError("")
                }, 5000)
            return setError("Password Must be Greater then 6 Length")
            } else {
                try {
                    const sisQuery = query(collection(db, 'EmployerProfiles'), where('employerUID', '==', formData.employerUID));
                    const sisQuerySnapshot = await getDocs(sisQuery);
      
                if (!sisQuerySnapshot.empty) {
                setInterval(() => {
                    setError("");
                }, 5000);
                 return setError("Duplicate employer UID found. Please use a different UID.");
                } await EmployerSignUp(formData.email, formData.password, formData);
                    const userCredential = auth.currentUser;
                    const uid = userCredential.uid;

                    await storeEmployerInfo(uid, formData);

                    alert("New User Created successfully")
                    navigate('/Login')
                } catch (error) {
                    if (error.code === "auth/email-already-in-use") {
                    setInterval(() => {
                        setError("")
                    }, 5000)
                    setError("Email already in use try another email")
                } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                    setInterval(() => {
                        setError("")
                    }, 5000)
                    setError("Password Must be 6 charecter")
              } else{
            console.error('Error signing up:', error);
           }}}
        };
        
         //Created date
        const storeEmployerInfo = async (uid, formData) => {
            const employerDocRef = doc(db, 'EmployerProfiles', uid);
            try {
            await setDoc(employerDocRef, {
                ...formData,
                createdAt: new Date().toISOString(), 
            });
            } catch (error) {
            console.error('Error storing Employer info:', error);
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





        <div className="container register">
        <div className="row">
            <div className="col-md-3 register-left">
                <img src={logo} alt=""/>
                <h3><span className="register-left-heading">Welcome</span></h3>
                <p>You are 30 seconds away from hiring your people!</p>
                <input className="login-left-btn" type="submit" name="login-left-btn" value="Login" onClick={()=>navigate('/Login')}/><br/>
            </div>

            <div className="col-md-9 register-right">

             
                        <div className='navbar-switch'>
                        <button className='btn-option' onClick = {() => navigate ('/EmployeeRegister')}> Employee </button>
                            <button  className='btn-active'> Employer </button>
                            
                        </div>
              

                <div className="tab-content" id="myTabContent">
                        <h3 className="register-heading">Apply as an Employer</h3>

                        <form onSubmit={handleSubmit} >
                        <div className="row register-form">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter your First Name *" id="firstName" name="firstName" />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter your Last Name *" id="lastName" name="lastName" />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control" placeholder=" Company Email *" id="email" name="email" />
                                </div>
                                <div className="form-group">
                                    <input type="text" maxlength="11" minlength="11" className="form-control" placeholder="Company Tel/Phone number *" id="number" name="number" />
                                </div>

                                <div class="form-group">
                                            <div class="maxl">
                                                <label class="radio inline"> 
                                                    <input type="checkbox" size='lg' className="terms-c" name="terms" value="" ref={termsCheckboxRef} id="termsCheckbox"/>
                                                    <span className='terms_1'> I accept the Terms and Condition </span>
                                                </label>

                                            </div>
                                         </div>
                                <div class="form-group">
                                            <div class="maxl">
                                                
                                              <a className='terms_2' onClick={handleShow}>Terms and Condition of TechnoAid </a>
                                               
                                            <Modal show={show} onHide={handleClose} size="lg">
                                            <Modal.Header closeButton>
                                            <Modal.Title style={{ fontSize: '25px', fontWeight: 'bold', color: '#40798C' }}>Terms and Condition</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                    
                                            <div  style={{ display: 'flex', paddingLeft:'50px', paddingRight:'50px', textAlign: 'justify', marginBottom: '20px', fontSize: '20px', color:'#40798C'}}>Your data privacy is important to us. We will handle your personal data in compliance with the Data Privacy Act of 2012 (“DPA Act”). With this Statement, we would like to explain to you how we will use your information when you transact business with us.

                                                                Personal Data refers to all types of personal information relating to you. Personal Information (on its own or when put together with other information) allows the holder of the information to identify you. It includes both recorded in material form and not.

                                                                

                                                                Who is responsible for personal data?

                                                                We, TechnoAid, Inc., are the responsible controller for any personal data you provide us.

                                                                

                                                                What categories or types of personal data do we collect?
                                                                We will only collect only the basic personal data required to conduct business with you.

                                                                This may include the following:

                                                                - Your name and job title, residential and office address, telephone number, email address and other contact details, government-issued identification details;
                                                                - Your mobile device unique identifier and the IP address of your computer when you access our website or other online platforms;
                                                                - For job applicants or employees, your educational background and professional certifications, and employment experience information.
                                            </div>

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="success" onClick={handleClose}>
                                                    Okay, I understand
                                                </Button>
                                            </Modal.Footer>
                                            </Modal>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password *" id="password" name="password"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Confirm Password *" id="confirmPassword" name="confirmPassword" />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder= "Company Name *" id="companyName" name="companyName" />
                                </div>

                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="UID *" id="employerUID" name="employerUID" />
                                </div>
                                {error && <div className="error-alert">{error}</div>} 
                                <input type="submit" class="btnRegister_2"  value="Register"/>
                            </div>
                        </div>

                        </form>


                    </div>

                </div>
            </div>
        </div>

        </div>
  )
}

export default EmployerRegister