import { useState } from "react";
import Highway from "./components/Highway/Highway";
import DisplayCode from "./components/CodeDisplay/DisplayCode";
import AnswerGrid from "./components/AnswerGrid/AnswerGrid";
import questions from "./questions.json";
import StopLight from "./components/StopLight/StopLight";
import "./App.css";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
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
    <>
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
            <Highway correctAnswers={correctAnswers} />
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

            {correctAnswers >= 10 && (
              <div style={{ marginTop: "20px", color: "#ffffff" }}>
                You've completed the quiz! Your score: {score}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
