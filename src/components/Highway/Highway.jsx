import React, { useState, useEffect } from "react";
import "./Highway.css";
import BlueCar from "../../assets/blue.svg";
import GreenCar from "../../assets/green.svg";
import Leaderboard from "../Leaderboard/Leaderboard";

const Highway = ({ correctAnswers, playerScore }) => {
  const highwayWidth = 800;
  const carWidth = 120;
  const maxPosition = highwayWidth - carWidth;

  const [blueCarPosition, setBlueCarPosition] = useState(0);
  const [greenCarPosition, setGreenCarPosition] = useState(0);

  const steps = 10;
  const stepSize = maxPosition / steps;

  const [greenCarStep, setGreenCarStep] = useState(0);

  useEffect(() => {
    const bluePosition = Math.min(correctAnswers * stepSize, maxPosition);
    setBlueCarPosition(bluePosition);
  }, [correctAnswers, stepSize, maxPosition]);

  useEffect(() => {
    const moveGreenCar = () => {
      const willMove = Math.random() > 0.5;
      if (willMove && greenCarStep < steps) {
        setGreenCarStep((prevStep) => Math.min(prevStep + 1, steps));
      }
    };

    const interval = setInterval(moveGreenCar, 1000);
    return () => clearInterval(interval);
  }, [greenCarStep, stepSize, maxPosition]);

  useEffect(() => {
    setGreenCarPosition(greenCarStep * stepSize);
  }, [greenCarStep, stepSize]);

  const aiScore = Math.floor(greenCarPosition / stepSize);

  return (
    <div className="game-container">
      <div className="highway-container">
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
              className="car ai-car"
              style={{ left: `${greenCarPosition}px` }}
            />
          </div>
        </div>
      </div>
      <div className="leaderboard-container">
        <Leaderboard playerScore={playerScore} aiScore={aiScore} />{" "}
      </div>
    </div>
  );
};

export default Highway;
