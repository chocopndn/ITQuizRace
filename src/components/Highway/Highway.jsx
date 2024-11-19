import React, { useEffect, useRef } from "react";
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
  isPaused,
  aiStep,
  setAiStep,
  isResuming,
  setIsResuming,
}) => {
  const highwayRef = useRef(null);
  const intervalRef = useRef(null);

  const steps = 10;

  const getStepSize = () => {
    const highwayWidth = highwayRef.current?.offsetWidth || 800;
    const carWidth = 120;
    return (highwayWidth - carWidth) / steps;
  };

  const getRandomDelay = () => {
    const delays = [
      10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500,
      15000,
    ];
    return delays[Math.floor(Math.random() * delays.length)];
  };

  const moveGreenCar = () => {
    setAiStep((prevStep) => {
      const nextStep = Math.min(prevStep + 1, steps);
      if (nextStep === steps) {
        onWinner("AI");
      }
      return nextStep;
    });
  };

  useEffect(() => {
    if (!isPaused && !isResuming && aiStep < steps) {
      intervalRef.current = setInterval(() => {
        moveGreenCar();
      }, getRandomDelay());
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPaused, isResuming, aiStep]);

  useEffect(() => {
    if (isResuming) {
      setTimeout(() => setIsResuming(false), 300);
    }
  }, [isResuming]);

  const greenCarPosition = aiStep * getStepSize();
  const blueCarPosition = correctAnswers * getStepSize();

  return (
    <div className="game-container">
      <div className="highway-container" ref={highwayRef}>
        <div className="highway">
          <div className="lane top">
            <img
              src={BlueCar}
              alt="Blue Car"
              className="car"
              style={{
                left: `${blueCarPosition}px`,
                visibility: isResuming ? "hidden" : "visible",
              }}
            />
          </div>
          <div className="center-line"></div>
          <div className="lane bottom">
            <img
              src={GreenCar}
              alt="Green Car"
              className="car ai-car"
              style={{
                left: `${greenCarPosition}px`,
                visibility: isResuming ? "hidden" : "visible",
              }}
            />
          </div>
        </div>
      </div>
      <div className="scoreboard-container">
        <Scoreboard
          playerName={playerName}
          playerScore={playerScore}
          aiScore={aiStep}
          aiName={aiName}
        />
      </div>
    </div>
  );
};

export default Highway;
