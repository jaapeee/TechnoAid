import React, {useState, useEffect} from 'react';
import { auth, db } from "../firebase";
import { getDoc, doc, getDocs, collection, query, where, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationDot, faMagnifyingGlass, faUser, faBell, faEnvelope} from '@fortawesome/free-solid-svg-icons';


function Home() {
  const navigate=useNavigate();
  const [ employeeInfo, setEmployeeInfo ] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [isJobPostClicked, setIsJobPostClicked] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [selectedJobPostUid, setSelectedJobPostUid] = useState(null);

  const [isFollowing, setIsFollowing] = useState(true);

  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const getJobPostClass = (jobPost) => {
    return jobPost.jobPostStatus ? 'disabled-job-post' : '';
  };


  const handleSearchChange = (field, value) => {
    if (field === 'title') {
      setSearchTitle(value);
    } else if (field === 'location') {
      setSearchLocation(value);
    }
  };

  const handleSearch = () => {
    // Check if both search fields are empty, then display all job posts
    if (!searchTitle && !searchLocation) {
      setJobPosts(jobPosts); // Reset to original job posts
      return;
    }

    const filteredJobPosts = jobPosts.filter((jobPost) => {
      const titleMatch = !searchTitle || jobPost.jobTitle.toLowerCase().includes(searchTitle.toLowerCase());
      const locationMatch = !searchLocation || jobPost.location.toLowerCase().includes(searchLocation.toLowerCase());
      return titleMatch && locationMatch;
    });

    // Update the job posts based on the search result
    setJobPosts(filteredJobPosts);
  };

  // Reset job posts when both search fields are empty
  useEffect(() => {
    if (!searchTitle && !searchLocation) {
      setJobPosts(jobPosts);
    }
  }, [searchTitle, searchLocation, jobPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


    
    
  const fetchEmployeeInfo = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
        const docSnapshot = await getDoc(userDocRef);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setEmployeeInfo(data);
  
          // Store user information in localStorage
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          console.log('Document does not exist!');
        }
      }
    } catch (error) {
      console.error('Error fetching company information from Firestore:', error);
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

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

      let updatedJobPosts = [];

      // Iterate through each employer job post and get the job posts
      for (const employerJobPost of employerJobPostsData) {
        const jobPostsQuery = query(collection(db, `EmployerJobPosts/${employerJobPost.id}/JobPosts`));
        const jobPostsSnapshot = await getDocs(jobPostsQuery);
        const jobPostsData = jobPostsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          uid: employerJobPost.id,
        }));

        updatedJobPosts = [...updatedJobPosts, ...jobPostsData];
      }
      setJobPosts(updatedJobPosts);
    };

    fetchData();
  }, []);

  const handleApplyNowClick = async (uid) => {
    try {
      const db = getFirestore();
      const jobPostDocRef = doc(db, 'EmployerJobPosts', uid, 'JobPosts', selectedJobPostUid);
      const jobPostDocSnapshot = await getDoc(jobPostDocRef);
  
      if (jobPostDocSnapshot.exists()) {
        const jobPostDocId = jobPostDocSnapshot.id;
        // Redirect to ApplyNow.js with the selected UID and document ID as route parameters
        navigate(`/ApplyNow/${uid}/${jobPostDocId}`);
      } else {
        console.log('Job post document does not exist!');
      }
    } catch (error) {
      console.error('Error fetching job post document from Firestore:', error);
    }
  };
      
  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setEmployeeInfo(JSON.parse(storedUser));
      setIsLoading(false);
    } 
    
    else {
      fetchEmployeeInfo();
    }
  }, [user]);
  
  const SignOutHandler = () => {
    // Clear stored credentials on sign out
    localStorage.removeItem('user');
    auth.signOut()
    .then(() => {
      navigate('/'); // Redirect to Landing.js after signout
    })
    .catch(error => {
      console.error('Error signing out:', error);
    });
};
  console.log(employeeInfo, employeeInfo);

  return (
    
    <div>
        <div className="nav_border_container">

    <div className="nav_border border-top"></div>
    <nav className="navbar navbar-expand-lg">
      <div className="container container-fluid">
          <a onClick={()=>navigate('/Home')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                         <a className="nav-filler" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link nav-active link_hover" onClick={()=>navigate('/Home')}>Home</a>
                      </li>

                      <li className="nav">
                         <a className="nav-filler-home_1" href="#"></a>
                      </li>

                      <li className="nav-item2">
                        
                        <a> Employer / Admin Login admin </a> 
                        </li>

                      <li className="nav">
                        <a className="nav-filler-home_2"></a>
                      </li>


                      <div className='divider'>
                      <li className="nav">
                        <a className="nav-filler-profile4" href="#"></a>
                      </li>
                      </div>

                      <div className="nav-user-name">Hello, {employeeInfo && employeeInfo.firstName}</div>

                      <div className='dropdown-container'>

                      <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic-button" className='dropdown-button'>
                            User
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item onClick={()=>navigate('/EmployeeProfile')}>My Profile</Dropdown.Item>
                              <Dropdown.Item onClick={SignOutHandler} >Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                
                      </div>

                    </ul>
          </div>
        </div>
      </nav>

  </div>
  <div className='home-search-textbox'>

    <div className="textbox_1">
      <FontAwesomeIcon icon={faMagnifyingGlass} className='search-magnifying' size='xl'/>
        <input type="text" className="main-textbox_1" placeholder="Job title, keywords, or company" value={searchTitle} onChange={(e) => handleSearchChange('title', e.target.value)}/>
      </div>
    <div className='home-search-filler'></div>
    <div className="textbox_2">
        <FontAwesomeIcon icon={faLocationDot} className='search-location' size='xl'/>
          <input type="text" className="main-textbox_2" placeholder="Select location" value={searchLocation} onChange={(e) => handleSearchChange('location', e.target.value)}/>
          <button className='home-text-btn' onClick={handleSearch}>Find Job</button>
      </div>

    <div className='posting-nav'>
      <button className='job-feed'>Job Feed</button>
    </div>
  </div>


  


<div className='job-post-left'>
{jobPosts
    .filter(jobPost => !jobPost.jobPostStatus) // Filter out job posts with jobPostStatus set to true
    .map((jobPost) => (
    <div key={jobPost.id} className='job-post-container' onClick={() => {setIsJobPostClicked(true); setSelectedJobPost(jobPost); setSelectedJobPostUid(jobPost.id);}}  style={{ borderTop: jobPost !== 0 ? '3px solid #ccc' : 'none' }}>
      <div className='posting'>
        <div className='job-post'>
          {/* <p className='p-l-logo'>*Logo*</p> */}
          <p className='p-l-title'>{jobPost.jobTitle}</p>
          <p className='p-l-loc'>{jobPost.location}</p>
          <p> 
            <span className='p-l-type'>{jobPost.employmentType}</span> 
            <span className='p-l-salary'>{jobPost.salaryRangeTo}/{jobPost.frequency}</span> 
          </p>
          <p className='p-l-quali'>{jobPost.minQualifications}</p>
        </div>
      </div>
    </div>
  ))}
</div>


{isJobPostClicked && selectedJobPost && (
<div className={`job-post-right ${isFollowing ? 'following' : ''}`}>
        <div key={selectedJobPost.id} className='job-post-container_2'>
          {/* <p className='p-r-logo'>*Logo*</p> */}
          <div className='job-details'>
            <p className='p-r-title'>{selectedJobPost.jobTitle}</p>
            <p className='p-r-loc'>{selectedJobPost.location}</p>
            <button className='p-r-applybtn' onClick={() => handleApplyNowClick(selectedJobPost.uid)}>Apply Now</button>
            <p className='p-r-summ'>{selectedJobPost.summary}</p>
          </div>
        </div>
    </div>
    )}






  </div>
  )
}

export default Home