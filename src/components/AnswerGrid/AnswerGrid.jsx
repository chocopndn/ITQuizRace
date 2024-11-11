import React from "react";
import "./AnswerGrid.css";

export default function AnswerGrid({ options, onSelectAnswer }) {
  return (
    <div className="answer-grid">
      {options.map((option, index) => (
        <button
          key={index}
          className="answer-button"
          onClick={() => onSelectAnswer(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
