import React from "react";
import "./Leaderboard.css";

const Leaderboard = ({ playerScore, aiScore }) => {
  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <div className="score-container">
        <div className="score">
          <span className="label">Player:</span>{" "}
          <span className="value">{playerScore}</span>
        </div>
        <div className="score">
          <span className="label">AI:</span>{" "}
          <span className="value">{aiScore}</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
