import React, { useState, useEffect } from "react";
import "./Highway.css";

import BlueCar from "../../assets/blue.svg";
import GreenCar from "../../assets/green.svg";

const Highway = ({ correctAnswers }) => {
  const [blueCarPosition, setBlueCarPosition] = useState(0);
  const [greenCarPosition, setGreenCarPosition] = useState(0);

  useEffect(() => {
    if (correctAnswers <= 10) {
      setBlueCarPosition(correctAnswers * 20);
    }
  }, [correctAnswers]);

  return (
    <div className="highway">
      <div className="lane top">
        <img
          src={BlueCar}
          alt="Blue Car"
          className="car"
          style={{ left: `${blueCarPosition}px` }}
        />
      </div>
      <div className="center-line"></div>
      <div className="lane bottom">
        <img
          src={GreenCar}
          alt="Green Car"
          className="car"
          style={{ left: `${greenCarPosition}px` }}
        />
      </div>
    </div>
  );
};

export default Highway;
