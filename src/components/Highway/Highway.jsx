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
}) => {
  const highwayRef = useRef(null);
  const intervalRef = useRef(null);

  const steps = 10;

  const getStepSize = () => {
    const highwayWidth = highwayRef.current?.offsetWidth || 800;
    const carWidth = 120;
    const stepSize = (highwayWidth - carWidth) / steps;
    console.log(`Highway Width: ${highwayWidth}, Step Size: ${stepSize}`);
    return stepSize;
  };

  const getRandomDelay = () => {
    const delays = [1500, 2000, 2500, 3000, 3500, 4000];
    return delays[Math.floor(Math.random() * delays.length)];
  };

  const moveGreenCar = () => {
    setAiStep((prevStep) => {
      const nextStep = Math.min(prevStep + 1, steps);
      if (nextStep === steps) {
        console.log("AI has won the game!");
        onWinner(aiName);
      }
      console.log(`AI Step Updated: ${nextStep}`);
      return nextStep;
    });
  };

  useEffect(() => {
    if (!isPaused && aiStep < steps) {
      console.log("Starting AI movement...");
      intervalRef.current = setInterval(() => {
        moveGreenCar();
      }, getRandomDelay());
    } else {
      console.log("Clearing AI movement...");
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPaused, aiStep]);

  useEffect(() => {
    if (highwayRef.current) {
      console.log(
        `Highway dimensions: Width=${highwayRef.current.offsetWidth}`
      );
    }
  }, [highwayRef.current]);

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
          aiScore={aiStep}
          aiName={aiName}
        />
      </div>
    </div>
  );
};

export default Highway;
