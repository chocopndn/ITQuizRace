import { useState, useEffect } from "react";
import Highway from "./components/Highway/Highway";
import DisplayCode from "./components/CodeDisplay/DisplayCode";
import AnswerGrid from "./components/AnswerGrid/AnswerGrid";
import questions from "./questions.json";
import StopLight from "./components/StopLight/StopLight";
import "./App.css";

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0); // Player score
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [readyClicked, setReadyClicked] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
  };

  const handleCountdownComplete = () => {
    setGameStarted(true);
  };

  const handleReadyClick = () => {
    setReadyClicked(true);
  };

  return (
    <div className="app-container">
      {!gameStarted ? (
        <>
          {!readyClicked && (
            <div className="ready-button-container">
              <button className="ready-button" onClick={handleReadyClick}>
                Ready
              </button>
            </div>
          )}
          {readyClicked && (
            <StopLight onCountdownComplete={handleCountdownComplete} />
          )}
        </>
      ) : (
        <>
          <Highway correctAnswers={correctAnswers} playerScore={score} />{" "}
          <div className="content-container">
            <DisplayCode
              codeString={currentQuestion.codeSnippet}
              options={currentQuestion.options}
            />
            <AnswerGrid
              options={currentQuestion.options}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>
          {selectedAnswer && (
            <div style={{ marginTop: "20px", color: "#ffffff" }}>
              You selected: {selectedAnswer}
            </div>
          )}
          <div style={{ marginTop: "20px", color: "#ffffff" }}>
            Score: {score} / {questions.length}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
