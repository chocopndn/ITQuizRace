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
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [readyClicked, setReadyClicked] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    const shuffled = shuffleArray(questions);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleWinner = (winner) => {
    setWinner(winner);
  };

  if (isSmallScreen) {
    return (
      <div className="small-screen-warning">
        This game is designed for PC screens only. Please switch to a larger
        screen.
      </div>
    );
  }

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
          <Highway
            correctAnswers={correctAnswers}
            playerScore={score}
            onWinner={handleWinner}
          />
          <div className="content-container">
            {currentQuestion && (
              <>
                <DisplayCode
                  codeString={currentQuestion.codeSnippet}
                  options={currentQuestion.options}
                />
                <AnswerGrid
                  options={currentQuestion.options}
                  onSelectAnswer={handleSelectAnswer}
                />
              </>
            )}
          </div>
          {selectedAnswer && (
            <div className="selected-answer">
              You selected: {selectedAnswer}
            </div>
          )}
          <div className="score-text">
            Score: {score} / {questions.length}
          </div>
        </>
      )}
      {winner && <div className="congratulations-message">{winner} Wins!</div>}
    </div>
  );
}

export default App;
