import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './component/Landing'
import Login from './component/Login';
import LoginEmployee from './component/LoginEmployee';
import LoginEmployer from './component/LoginEmployer';
import Home from './component/Home';
import UserAuthContext from './context/UserAuthContext';
import EmployeeRegister from './component/EmployeeRegister';
import EmployerRegister from './component/EmployerRegister'
import EmployeeProfile from './component/EmployeeProfile'
import EmployeeProfileEdit from './component/EmployeeProfileEdit'
import EmployerProfile from './component/EmployerProfile'
import EmployerProfileEdit from './component/EmployerProfileEdit'
import EmployeeResume from './component/EmployeeResume'
import EmployerDashboard from './component/EmployerDashboard'
import EmployerPostJob_1 from './component/EmployerPostJob_1'
import AboutUs from './component/AboutUs';
import Resume from './component/Resume';
import ApplyNow from './component/ApplyNow';
import Admindashboard from './component/Admindashboard';
import Admin from './component/Admin';


function App() {
  return (
    <div>
      <Router>
        <UserAuthContext>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="Login" element={<Login/>}/>
          <Route path="LoginEmployee" element={<LoginEmployee/>}/>
          <Route path="LoginEmployer" element={<LoginEmployer/>}/>
          <Route path="Home" element={<Home/>}/>
          <Route path="EmployeeRegister" element={<EmployeeRegister/>}/>+-
          <Route path="EmployerRegister" element={<EmployerRegister/>}/>
          <Route path="EmployeeProfile" element={<EmployeeProfile/>}/>
          <Route path="EmployeeProfileEdit" element={<EmployeeProfileEdit/>}/>
          <Route path="EmployerProfile" element={<EmployerProfile/>}/>
          <Route path="EmployerProfileEdit" element={<EmployerProfileEdit/>}/>
          <Route path="EmployeeResume" element={<EmployeeResume/>}/>
          <Route path="EmployerDashboard" element={<EmployerDashboard/>}/>
          <Route path="EmployerPostJob_1" element={<EmployerPostJob_1/>}/>
          <Route path="AboutUs" element={<AboutUs/>}/>
          <Route path="Resume" element={<Resume/>}/>
          <Route path="/ApplyNow/:selectedJobPostUid/:employerJobPostsDocId" element={<ApplyNow />} />
          <Route path="Admindashboard" element={<Admindashboard/>}/>
          <Route path="Admin" element={<Admin/>}/>
        </Routes>
        </UserAuthContext>
      </Router>
    </div>
  );
}

export default App;






// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   createRoutesFromElements,
// } from "react-router-dom";
// // import Layout from './component/Layout';
// const router = createBrowserRouter(createRoutesFromElements(
//   <Route path='/' element={<Landing />}>
//     <Route index element={<Login />}></Route>
//     <Route path= "Signup" element={<Signup />}></Route>
//   </Route>
// ));
// function App() {
//   return (
//       <UserAuthContext>
//     <RouterProvider router={router} >
//     </RouterProvider>
//       </UserAuthContext>
//   );
// }

// export default App;
