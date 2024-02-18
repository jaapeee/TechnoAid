import React, {useState, useEffect} from 'react';
import { auth, db } from "../firebase";
import { getDoc, doc, getDocs, collection, query, where, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationDot, faMagnifyingGlass, faUser, faBell, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EmployerDashboard() {
    const navigate=useNavigate();
    const [jobCount, setJobCount] = useState(0);
    const [jobBoolCount, setJobBoolCount] = useState(0);
    const [answersCount, setAnswersCount] = useState(0);

    const [jobPosts, setJobPosts] = useState([]);
    const user = auth.currentUser;

    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [employeeAnswers, setEmployeeAnswers] = useState([]);

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const handleClose3 = () => {
      // Close the modal
      setShow2(false);
    };


    const handleClose2 = () => {
      // Increment the click count
      setHiredClickCount((prevCount) => prevCount + 1);
    
      // Close the modal
      setShow2(false);
    };

    const handleShow2 = () => setShow2(true);

    const [joblists, setJoblists] = useState([]);
    const [selectedJob, setSelectedJob] = useState([])

    const [jobPostStatus, setJobPostStatus] = useState({});

    const [hiredClickCount, setHiredClickCount] = useState(0);



    useEffect(() => {
      const saveHiredClickCount = async () => {
        if (user) {
          try {
            const employerProfileDocRef = doc(db, 'EmployerProfiles', user.uid);
            await setDoc(employerProfileDocRef, { hiredClickCount }, { merge: true });
          } catch (error) {
            console.error('Error saving hiredClickCount:', error);
          }
        }
      };
    
      saveHiredClickCount();
    }, [user, hiredClickCount]);



    const handleJobPostStatusChange = (jobPostId) => {
      setJobPostStatus((prevStatus) => ({
        ...prevStatus,
        [jobPostId]: !prevStatus[jobPostId],
      }));
      updateJobPostStatus(jobPostId, !jobPostStatus[jobPostId]);
      // Save the updated jobPostStatus to localStorage
      localStorage.setItem('jobPostStatus', JSON.stringify({
        ...jobPostStatus,
        [jobPostId]: !jobPostStatus[jobPostId],
      }));
    };


    const updateJobPostStatus = async (jobPostId, newStatus) => {
      try {
        const jobPostDocRef = doc(db, 'EmployerJobPosts', user.uid, 'JobPosts', jobPostId);
        await setDoc(jobPostDocRef, { jobPostStatus: newStatus }, { merge: true });
      } catch (error) {
        console.error('Error updating job post status:', error);
      }
    };
    



  

  const handleViewDetails = (joblist) =>{
    setSelectedJob(joblist);
    handleShow2();
  }




  const fetchData = async () => {
    try {
      const employerProfileDocRef = doc(db, 'EmployerProfiles', user.uid);
      const employerProfileDocSnapshot = await getDoc(employerProfileDocRef);
      const isRestricted = employerProfileDocSnapshot.data().isRestricted;

      const querySnapshot = await getDocs(collection(db, 'EmployerJobPosts', user.uid, 'JobPosts'));
      const companyJobPost = querySnapshot.docs.map(async jobPostDoc => {
        const jobPostData = jobPostDoc.data();
        const subCollectionRef = collection(db, 'EmployerJobPosts', user.uid, 'JobPosts', jobPostDoc.id, 'EmployerAnswers');
        const subCollectionSnapshot = await getDocs(subCollectionRef);
        const subCollectionData = subCollectionSnapshot.docs.map(subDoc => subDoc.data());
        return { id: jobPostDoc.id, ...jobPostData, subCollectionData, isRestricted };
      });

      const resolvedCompanyJobPost = await Promise.all(companyJobPost);
      setJoblists(resolvedCompanyJobPost);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() =>{
    fetchData();
  }, []);


useEffect(() => {
  const jobPostDataCount = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const db = getFirestore();

    const userDocRef = doc(db, 'EmployerJobPosts', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const jobPostsQuery = query(collection(userDocRef, 'JobPosts'), where('jobPostStatus', '==', true));
      const jobPostsSnapshot = await getDocs(jobPostsQuery);

      setJobBoolCount(jobPostsSnapshot.size);
    } else {
      setJobBoolCount(0);
    }
  };

  jobPostDataCount();
}, [user, navigate]);



// useEffect(() => {
//   const countAnswers = async () => {
//     if (!user) {
//       navigate('/');
//       return;
//     }

//     const db = getFirestore();

//     const userDocRef = doc(db, 'EmployerJobPosts', user.uid);
//     const userDocSnapshot = await getDoc(userDocRef);

//     if (userDocSnapshot.exists()) {
//       const jobPostsQuery = query(collection(userDocRef, 'JobPosts'));
//       const jobPostsSnapshot = await getDocs(jobPostsQuery);

//       let totalAnswersCount = 0;

//       for (const jobPostDoc of jobPostsSnapshot.docs) {
//         const answersQuery = query(collection(jobPostDoc.ref, 'EmployerAnswers'));
//         const answersSnapshot = await getDocs(answersQuery);

//         totalAnswersCount += answersSnapshot.size;
//       }

//       setAnswersCount(totalAnswersCount);
//     } else {
//       setAnswersCount(0);
//     }
//   };

//   countAnswers();
// }, [user, navigate]);


useEffect(() => {
  const countAnswers = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const db = getFirestore();

    const userDocRef = doc(db, 'EmployerJobPosts', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const jobPostsQuery = query(collection(userDocRef, 'JobPosts'));
      const jobPostsSnapshot = await getDocs(jobPostsQuery);

      const uniqueAnswers = new Set(); // Use Set to store unique document IDs
      let totalAnswersCount = 0;

      for (const jobPostDoc of jobPostsSnapshot.docs) {
        const answersQuery = query(collection(jobPostDoc.ref, 'EmployerAnswers'));
        const answersSnapshot = await getDocs(answersQuery);

        answersSnapshot.forEach((answerDoc) => {
          const answerDocId = answerDoc.id;
          if (!uniqueAnswers.has(answerDocId)) {
            uniqueAnswers.add(answerDocId);
            totalAnswersCount += 1;
          }
        });
      }

      setAnswersCount(totalAnswersCount);
    } else {
      setAnswersCount(0);
    }
  };

  countAnswers();
}, [user, navigate]);



  
    useEffect(() => {
      const countData = async () => {
        if (!user) {
          navigate('/');
          return;
        }
  
        const db = getFirestore();
  
       
        const userDocRef = doc(db, 'EmployerJobPosts', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const jobPostsQuery = query(collection(userDocRef, 'JobPosts'));
          const jobPostsSnapshot = await getDocs(jobPostsQuery);
  
          
          setJobCount(jobPostsSnapshot.size);
        } else {
          setJobCount(0);
        }
      };
  
      countData();
    }, [user, navigate]);




    // Sign Out Employer
    const SignOutHandler = () => {
      localStorage.removeItem('user');
      auth.signOut()
      .then(() => {
        navigate('/'); 
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
    };


    useEffect(() => {
      const storedJobPostStatus = localStorage.getItem('jobPostStatus');
      if (storedJobPostStatus) {
        setJobPostStatus(JSON.parse(storedJobPostStatus));
      }
      fetchData();
    }, []);

    

  return (
    <div>
        <div className="nav_border_container">

    <div className="nav_border border-top"></div>
    <nav className="navbar navbar-expand-lg">
      <div className="container container-fluid">
          <a onClick={()=>navigate('/')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                        <a className="nav-filler-dash_1"></a>
                      </li>

                      <a button className="nav-post-btn" onClick={()=>navigate('/EmployerPostJob_1')}>Post a Job</a>

                      <div className='dropdown-container'>

                      <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic-button" className='dropdown-button'>
                            User
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item onClick={()=>navigate('/EmployerProfile')}>Company</Dropdown.Item>
                              <Dropdown.Item onClick={SignOutHandler}>Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                
                      </div>

                    </ul>
          </div>
        </div>
      </nav>
  
  </div>
  <div className='dashboard-textbox'>

    <div className='dashboard-nav'>
      <button className='dash-feed'>Dashboard</button>
    </div>

  </div>
 
<div className='dash-menu'>
  <div className='menu-rec_1'>
    <div className='rec_1'></div>
    <h6><span className="rec-text_2">Jobs Posted</span><br></br><span className="rec-text_1">{jobCount}</span> </h6>
  </div>

  <div className='menu-rec_2'>
    <div className='rec_2'></div>
    <h6><span className="rec-text_2">Candidates</span><br></br><span className="rec-text_1">{answersCount}</span> </h6>
  </div>

  <div className='menu-rec_3'>
    <div className='rec_3'></div>
    <h6><span className="rec-text_2">Closed Jobs</span><br></br><span className="rec-text_1">{jobBoolCount}</span> </h6>
  </div>

  <div className='menu-rec_4'>
    <div className='rec_4'></div>
    <h6><span className="rec-text_2">Got Hired</span><br></br><span className="rec-text_1">{hiredClickCount}</span> </h6>
  </div>

</div>

<div className='table-dashboard-container'> Recent Hiring

<table className="table-dashboard">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Position</th>
            <th>Industry</th>
            <th>Interviewer</th>
            <th>Shortlisted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        { joblists.map(joblist => ( 
          <tr key={joblist.id}>
            <td> 
              <a style={{ background:'none',  fontWeight:'bold',  fontFamily:'Be Vietnam Pro', color:'#40798C',  fontSize:'18px', cursor:'pointer'}} onClick = {() => handleViewDetails(joblist)}>
              {joblist.jobTitle}
              </a>
            </td>
            <td> {joblist.position} </td>
            <td> {joblist.industry} </td>
            <td> {joblist.interviewer} </td>
            <td>
              <a style={{ background:'none',  fontWeight:'bold',  fontFamily:'Be Vietnam Pro', color:'#40798C',  fontSize:'18px', cursor:'pointer'}} onClick={handleShow1}>
                    32
              </a>
            </td>
            <td>  
              <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault_${joblist.id}`} checked={jobPostStatus[joblist.id]} onChange={() => handleJobPostStatusChange(joblist.id)}/>
                <p> {jobPostStatus[joblist.id] ? 'OFF' : 'ON'}</p>
              </div>
            </td>
          </tr>
          ))}
          {/* Repeat similar structure for other rows */}
        </tbody>
      </table>


      

<Modal show={show2} onHide={handleClose3} size="xl">
  <Modal.Header closeButton>
    <Modal.Title style={{ fontSize: '25px', fontWeight: 'bold', color: '#40798C' }}> Applicants </Modal.Title>
  </Modal.Header>
  <Modal.Body>

  <table className='applicants-table'>
    <thead>
      <tr className='a-t-header_1'>
        <th className=''> Name </th>
        <th className=''> Email </th>
        <th className=''> Resume </th>
        <th className=''> Evaluation </th>
      </tr>
    </thead>

    <tbody>
    { selectedJob.subCollectionData && selectedJob.subCollectionData.map((item, index) => (
        <tr key={item.id} className='a-t-header_2'>
          <td className='a-t-data'>{item.firstName}</td>
          <td className='a-t-data'>{item.email}</td>
          <td className='a-t-data'> {joblists[index] && joblists[index].isRestricted ? <span> Disabled </span> : <a href={item.resumeURL} target="_blank" rel="noopener noreferrer"> Resume </a>}
          </td>
      </tr>
     ))}
    </tbody>

  </table>

  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleClose2}>
     Click if Hired
    </Button>
  </Modal.Footer>
</Modal>
      








  <a className="dashboard-viewmore" onClick={()=>navigate('/')}>View More</a>

</div>






  </div>
  )
}

export default EmployerDashboard