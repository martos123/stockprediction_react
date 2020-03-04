import React from "react";
import './About.css'

const About = () => {
  return(
    <div className='header'>
      <h1>
        How to use it!
      </h1>
      <div>
        <ul className="info-list">
          <li className="info">Select a stock from the three example</li>
          <li className="info">Set the epochs, the days that you want to predicting for and the batch size</li>
          <li className="info">Click on the train & predict button to start the simulation</li>
        </ul>
      </div>
    </div>
  )
}

export default About;
