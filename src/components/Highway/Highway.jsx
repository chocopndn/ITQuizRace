import React, { useState, useEffect } from "react";
import "./Highway.css";
import BlueCar from "../../assets/blue.svg";
import GreenCar from "../../assets/green.svg";
import Scoreboard from "../Scoreboard/Scoreboard";

const Highway = ({
  correctAnswers,
  playerScore,
  onWinner,
  playerName,
  aiName,
}) => {
  const highwayWidth = 800;
  const carWidth = 120;
  const maxPosition = highwayWidth - carWidth;

  const [blueCarPosition, setBlueCarPosition] = useState(0);
  const [greenCarPosition, setGreenCarPosition] = useState(0);
  const steps = 10;
  const stepSize = maxPosition / steps;
  const [greenCarStep, setGreenCarStep] = useState(0);

  const getRandomDelay = () => {
    const delays = [1500, 2000, 2500, 3000, 3500, 4000];
    const randomIndex = Math.floor(Math.random() * delays.length);
    return delays[randomIndex];
  };

  const moveGreenCar = () => {
    if (greenCarStep < steps) {
      setGreenCarStep((prevStep) => Math.min(prevStep + 1, steps));
    }
  };

  useEffect(() => {
    const bluePosition = Math.min(correctAnswers * stepSize, maxPosition);
    setBlueCarPosition(bluePosition);
    if (correctAnswers === steps) onWinner("Player");
  }, [correctAnswers, stepSize, maxPosition, onWinner]);

  useEffect(() => {
    if (greenCarStep < steps) {
      const aiMovementInterval = setInterval(() => {
        moveGreenCar();
      }, getRandomDelay());

      return () => clearInterval(aiMovementInterval);
    }
  }, [greenCarStep]);

  useEffect(() => {
    setGreenCarPosition(greenCarStep * stepSize);
    if (greenCarStep === steps) onWinner("AI");
  }, [greenCarStep, stepSize, onWinner]);

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
      <div className="scoreboard-container">
        <Scoreboard
          playerName={playerName}
          playerScore={playerScore}
          aiScore={aiScore}
          aiName={aiName}
        />
      </div>
    </div>
  );
};

export default Highway;
