import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserAuthContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import './style4.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLessThan} from '@fortawesome/free-solid-svg-icons';
import jp from '../asset/images/jp.jpg';
import lems from '../asset/images/lems.jpg';
import mark from '../asset/images/mark.jpg';
import clyde from '../asset/images/clyde.jpg';
import erlyn from '../asset/images/erlyn.jpg';


function AboutUs() {
      
        const navigate = useNavigate();
  return (
    <div>
        

<a onClick={()=>navigate('/')}> <button className='aboutus-back'><FontAwesomeIcon icon={faLessThan} className='less-than-btn' size='lg'/>Back</button></a>

<section id="team" class="pb-5">
    <div class="container">
        <h5 class="section-title h1">OUR TEAM</h5>
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" >
                    <div class="mainflip flip-0">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src={jp} alt='JP' style={{ width: '150px', height: '150px', marginBottom: '20px'}} />                                    <h4 class="card-title"> Software Developer/Programmer</h4>
                                    <p class="card-text"> Jan Paolo Ocubillo </p>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">TechnoAid</h4>
                                    <p class="card-text"> One of the programmers for this project, he is responsible for the programming backend  and implementing routes. He is also tasked in handling the online database for data</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src={lems} alt='Lemuel' style={{ width: '150px', height: '150px', marginBottom: '20px'}} />                                    <h4 class="card-title"> Software Developer/Programmer </h4>
                                    <p class="card-text"> John Lemuel Gomez </p>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">TechnoAid</h4>
                                    <p class="card-text"> Also one of the programmers of the site, he is responsible for the implementation of the frontend design and basic functionalities of the site.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src={mark} alt='Mark' style={{ width: '150px', height: '150px', marginBottom: '20px'}} /> <h4 class="card-title"> Project Manager </h4>
                                    <p class="card-text"> Mark Christhoper Gunting </p>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">TechnoAid</h4>
                                    <p class="card-text"> Responsible for the compiling and editing of documents for the site, that contains important information and user manual. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-2"></div>

            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src={clyde} alt='Clyde' style={{ width: '150px', height: '150px', marginBottom: '20px'}} /> <h4 class="card-title"> Documentation Specialist </h4>
                                    <p class="card-text"> Clyde Quiambao </p>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">TechnoAid</h4>
                                    <p class="card-text"> He is responsible for the thorough documentation and the designing of user manual for future users of the system and for better user experience. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src={erlyn} alt='Erlyn' style={{ width: '150px', height: '150px', marginBottom: '20px'}} />
                                    <h4 class="card-title"> Designer </h4>
                                    <p class="card-text"> Erlyn Lainne Vila </p>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">TechnoAid</h4>
                                    <p class="card-text"> Responsible for the contents and design blueprint for the site, work in collaboration with the frontend programmer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>








</div>
  )
}

export default AboutUs