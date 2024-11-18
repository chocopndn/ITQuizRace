import React from "react";
import "./Scoreboard.css";

const Scoreboard = ({ playerName, playerScore, aiScore, aiName }) => {
  return (
    <div className="scoreboard">
      <h3>Scoreboard</h3>
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

export default Scoreboard;
