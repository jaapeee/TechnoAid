import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { getDoc, doc, getDocs, collection, query, where, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faDiagramProject, faHeadset, faLaptopCode, faList, faLocation, faLocationDot, faMagnifyingGlass, faMoneyCheckDollar, faPaperclip, faPenRuler, faPeopleGroup, faShop, faTowerCell, faUserTie} from '@fortawesome/free-solid-svg-icons';


function Landing() {
    const navigate=useNavigate();
    const [user, setUser] = useState(null);
    const [jobCount, setJobCount] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
  
        const db = getFirestore();
  
        // Get the list of employer job posts
        const employerJobPostsQuery = query(collection(db, 'EmployerJobPosts'));
        const employerJobPostsSnapshot = await getDocs(employerJobPostsQuery);
        const employerJobPostsData = employerJobPostsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
  
        let totalJobCount = 0;
  
        // Iterate through each employer job post and count the job posts
        for (const employerJobPost of employerJobPostsData) {
          const jobPostsQuery = query(collection(db, `EmployerJobPosts/${employerJobPost.id}/JobPosts`));
          const jobPostsSnapshot = await getDocs(jobPostsQuery);
          const jobPostsData = jobPostsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
  
          totalJobCount += jobPostsData.length;
        }
  
        // Set the total job count
        setJobCount(totalJobCount);
      }; 
  
      fetchData();
    }, [navigate]);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
        if (authUser) {
          localStorage.setItem('userAuthenticated', 'true');
        } else {
          localStorage.removeItem('userAuthenticated');
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    useEffect(() => {
      const isUserAuthenticated = localStorage.getItem('userAuthenticated');
      if (isUserAuthenticated === 'true') {
        navigate('/EmployerDashboard');
      }
    }, [navigate, user]);

  //   useEffect(() => {
  //     const isUserAuthenticated = localStorage.getItem('userAuthenticated');
  
  //     if (isUserAuthenticated === 'true') {
  //         const checkUserProfile = async () => {
  //             const db = getFirestore();
  
  //             if (user) {
  //                 // Check if user is an employee
  //                 const employeeProfileRef = doc(db, 'EmployeeProfiles', user.uid);
  //                 const employeeProfileDoc = await getDoc(employeeProfileRef);
  
  //                 if (employeeProfileDoc.exists() && employeeProfileDoc.data().sis) {
  //                     // User is an employee with sis field
  //                     navigate('/Home');
  //                 }
  //             } else {
  //                 // Check if user is an employer
  //                 const employerProfileRef = doc(db, 'EmployerProfiles', user.uid);
  //                 const employerProfileDoc = await getDoc(employerProfileRef);
  
  //                 if (employerProfileDoc.exists() && employerProfileDoc.data().employerUID) {
  //                     // User is an employer with employerUID field
  //                     navigate('/EmployerDashboard');
  //                 }
  //             }
  //         };
  
  //         checkUserProfile();
  //     }
  // }, [navigate, user]);
    

  return (
    <div>
        <div className="nav_border_container">

    <div className="nav_border border-top"></div>
    <nav className="navbar navbar-expand-lg">
      <div className="container container-fluid">
          <a onClick={()=>navigate('/Admin')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                         <a className="nav-filler" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link link_hover"onClick={()=>navigate('/')}>Find Jobs</a>
                      </li>
                      <li className="nav-item">
                         <a className="nav-link link_hover" onClick={()=>navigate('/AboutUs')}>About Us</a>
                      </li>

                      <li className="nav">
                        <a className="nav-filler2" href="#"></a>
                      </li>


                      <div className="dashed-border">
                        <FontAwesomeIcon icon={faPaperclip} className='paperclip' size='lg'/>

                          <li className="create-button">
                            <a className="nav-link resume_link" onClick={()=>navigate('/Login')}>Create Resume/CV</a>
                          </li>
                      </div>

                      
                      <li className="nav">
                        <a className="nav-filler3" href="#"></a>
                      </li>

                      

                      {/* <li className="login-button">
                      {user ? '': 
                      <a className="nav-link login_link" onClick={()=>navigate('/Login')}>Login</a>}    
                      </li> */}

                      <li className="login-button">
                        {!user && (
                        <a className="nav-link link_hover" onClick={() => navigate('/Login')}> Login </a>
                        )}
                        
                        {user && (
                        <span className="nav-link link_hover-disabled"> Login </span>
                        )}
                      </li>


                      <li className="nav">
                        <a className="nav-filler4" href="#"></a>
                      </li>

                      {/* <li className="signup-button">
                        {user ? '':
                        <a onClick={()=>navigate('/EmployeeRegister')}><button className="signup-btn">Sign Up</button></a>}
                      </li> */}

                      <li className="signup-button">
                        {!user && (
                          <a onClick={() => navigate('/EmployeeRegister')}>
                            <button className="signup-btn">Sign Up</button></a>
                        )}
                        
                            {user && (
                            <button className="signup-btn" disabled> Sign up </button>
                          
                        )}
                      </li>

                    </ul>
          </div>
        </div>
      </nav>
  
  </div>

  <div className='bg-container'>

  <div className="text-container">
        <h1><span className="heading_1"> Millions of </span> <span className="heading_2">success stories, </span> <span className="heading_1">starts yours now.</span></h1> 
      </div>

      <div className="p-container">
        <h5 className="paragraph_1"> Make appyling for a job easy with TechnoAid. Find matching vacancies, create impressive applications and keep track of all your activities. All in one place!</h5>
      </div>
      
      <div className="get-started_1">
      <a onClick={()=>navigate('/EmployeeRegister')}>
          <button className="signup-btn2">Get Started Now</button>
        </a>

      </div>

      <div className="get-started_2">
        <h5> <span className="signup-link_1">Already have an account? </span><a className="signup-link_2" onClick={()=>navigate('/Login')}>Login</a></h5>
      </div>

      
        <div className="job-avail">
        <FontAwesomeIcon icon={faBriefcase} className='briefcase' size='xl'/>

          <h6><span className="avail-no">{jobCount}+</span><br></br><span className="avail-no_2">Jobs Available</span> </h6>
        </div>
        <div className="job-image"></div>


        </div>
      <div className="landing-page">
        <div className="landing-image">
          <div className="landing-image-filter"></div>
        </div>
        

        <div className="find-job-heading">Find a job and build your career</div>

        <div className="find-job-container">

          <div className="find-job-textbox">


            <div className="keyword-textbox">
              <FontAwesomeIcon icon={faMagnifyingGlass} className='magnifying' size='xl'/>
                <input type="text" className="key-textbox" placeholder="Enter Keyword"/>
            </div>

            <div className="categories-textbox">
              <FontAwesomeIcon icon={faList} className='category' size='xl'/>
                <input type="text" className="cat-textbox" placeholder="All Categories"/>
            </div>

            <div className="location-textbox">
              <FontAwesomeIcon icon={faLocationDot} className='location' size='xl'/>
                <input type="text" className="loc-textbox" placeholder="Select Location"/>
            </div>
            
            <div className="search-button">
              {user ? <a href="/Home"><button className="search-btn">Search Jobs</button></a>:
              <a href="/Login"><button className="search-btn">Search Jobs</button></a>}
            </div>


          </div>
        </div>
        
      </div>






      <div className="categories-page">
        <div className="categories-heading">
          <h1> <span className="heading_3">Popular Job Categories</span><br></br><span className="sub-heading_1">Great platform for students searching for a new career heights and passionate about startups.</span></h1>
        </div>

        <div className="categories-links">

          <div className="row-1 d-flex align-items-center justify-content-center" >
            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Designer</div>
            <FontAwesomeIcon icon={faPenRuler} className='pen-ruler' size='2xl'/>

            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Programmer</div>
            <FontAwesomeIcon icon={faLaptopCode} className='code' size='2xl'/>

            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Accounting/Finance</div>
            <FontAwesomeIcon icon={faMoneyCheckDollar} className='money' size='2xl'/>
          
          </div>

          <div className="row-2 d-flex align-items-center justify-content-center">
            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Human Resource</div>
            <FontAwesomeIcon icon={faPeopleGroup} className='people' size='2xl'/>

            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Technical Support</div>
            <FontAwesomeIcon icon={faHeadset} className='support' size='2xl'/>
  
            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Telecommunications</div>
            <FontAwesomeIcon icon={faTowerCell} className='cell-tower' size='2xl'/>

          </div>

          <div className="row-3 d-flex align-items-center justify-content-center">
            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Marketing</div>
            <FontAwesomeIcon icon={faShop} className='market' size='2xl'/>

            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Project Management</div>
            <FontAwesomeIcon icon={faDiagramProject} className='project' size='2xl'/>

            <div className="col p-4 m-4 text-white shadow rounded-3 w-100 h-100">Virtual Assistant</div>
            <FontAwesomeIcon icon={faUserTie} className='assistant' size='2xl'/>
          </div>

            </div>
       

        </div>
  </div>
  )
}

export default Landing