import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import aiNames from "../../assets/json/aiNames.json";

const Leaderboard = ({ playerName, playerScore, aiScore }) => {
  const [aiName, setAiName] = useState("AI");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * aiNames.length);
    setAiName(aiNames[randomIndex]);
  }, []);

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <div className="score-container">
        <div className="score">
          <span className="label">{playerName || "Player"}:</span>
          <span className="value">{playerScore}</span>
        </div>
        <div className="score">
          <span className="label">{aiName}:</span>
          <span className="value">{aiScore}</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
