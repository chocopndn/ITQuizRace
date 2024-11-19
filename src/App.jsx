import { useState, useEffect } from "react";
import Highway from "./components/Highway/Highway";
import DisplayCode from "./components/DisplayCode/DisplayCode";
import AnswerGrid from "./components/AnswerGrid/AnswerGrid";
import questions from "./assets/json/questions.json";
import aiNames from "./assets/json/aiNames.json";
import StopLight from "./components/StopLight/StopLight";
import "./App.css";

import HomeIcon from "./assets/icons/home.svg";
import PauseIcon from "./assets/icons/pause.svg";
import RestartIcon from "./assets/icons/restart.svg";

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
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
  const [playerName, setPlayerName] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isStopLightActive, setIsStopLightActive] = useState(false);
  const [onHomeScreen, setOnHomeScreen] = useState(true);
  const [aiName, setAiName] = useState("");
  const [showError, setShowError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [aiStep, setAiStep] = useState(0);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const initializeGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectAnswers(0);
    setWinner(null);
    setGameStarted(false);
    setReadyClicked(false);
    setIsStopLightActive(false);
    setIsPaused(false);
    setAiStep(0);

    const shuffled = shuffleArray(questions);
    setShuffledQuestions(shuffled);

    const randomIndex = Math.floor(Math.random() * aiNames.length);
    setAiName(aiNames[randomIndex]);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null || winner || isPaused) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setCorrectAnswers((prevCorrect) => {
        const updatedCorrectAnswers = prevCorrect + 1;
        if (updatedCorrectAnswers === 10) {
          handleWinner("Player");
        }
        return updatedCorrectAnswers;
      });
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
  };

  const handleCountdownComplete = () => {
    setGameStarted(true);
    setIsStopLightActive(false);
  };

  const handleReadyClick = () => {
    if (playerName.trim() === "") {
      setShowError(true);
      return;
    }
    setShowError(false);
    setReadyClicked(true);
    setIsStopLightActive(true);
    setOnHomeScreen(false);
  };

  const handleWinner = (winnerName) => {
    if (winnerName === "Player") {
      setWinner(playerName);
    } else if (winnerName === "AI") {
      setWinner(aiName);
    }
  };

  const handleRestart = () => {
    initializeGame();
    setIsStopLightActive(true);
    setOnHomeScreen(false);
  };

  const handleRestartWithSameAI = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectAnswers(0);
    setWinner(null);
    setGameStarted(false);
    setReadyClicked(true);
    setIsStopLightActive(true);
    setIsPaused(false);
    setAiStep(0);

    const shuffled = shuffleArray(questions);
    setShuffledQuestions(shuffled);
  };

  const handleHomeClick = () => {
    setOnHomeScreen(true);
    initializeGame();
    setPlayerName("");
  };

  const handlePauseClick = () => {
    if (isPaused) {
      setIsResuming(true);
    }
    setIsPaused((prev) => !prev);
  };

  if (isSmallScreen) {
    return (
      <div className="small-screen-warning">
        This game is designed for PC screens only. Please switch to a larger
        screen.
      </div>
    );
  }

  if (winner) {
    return (
      <div className="winner-message">
        <p>{winner} wins the game!</p>
        <div className="winner-button">
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
          <button className="home-button" onClick={handleHomeClick}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {onHomeScreen ? (
        <div className="ready-button-container">
          <h1 className="title">ITQuiz Race</h1>
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (showError) setShowError(false);
                }}
                className={`name-input ${showError ? "input-error" : ""}`}
                spellCheck="false"
              />
              <button className="ready-button" onClick={handleReadyClick}>
                Start Game
              </button>
            </div>
            {showError && (
              <span className="error-message">Name is required!</span>
            )}
          </div>
        </div>
      ) : (
        <>
          {isStopLightActive && !gameStarted ? (
            <StopLight onCountdownComplete={handleCountdownComplete} />
          ) : isPaused ? (
            <div className="pause-overlay">
              <h2>Game Paused</h2>
              <button onClick={handlePauseClick} className="resume-button">
                Resume
              </button>
            </div>
          ) : (
            gameStarted && (
              <>
                <div className="game-area">
                  <Highway
                    correctAnswers={correctAnswers}
                    playerScore={score}
                    onWinner={handleWinner}
                    playerName={playerName}
                    aiName={aiName}
                    isPaused={isPaused}
                    aiStep={aiStep}
                    setAiStep={setAiStep}
                    isResuming={isResuming}
                    setIsResuming={setIsResuming}
                  />
                  <div className="pause-resume">
                    <button
                      className="icon-container"
                      onClick={handleHomeClick}
                    >
                      <img src={HomeIcon} alt="Home Icon" />
                    </button>
                    <button
                      className="icon-container"
                      onClick={handleRestartWithSameAI}
                    >
                      <img src={RestartIcon} alt="Restart Icon" />
                    </button>
                    <button
                      className="icon-container"
                      onClick={handlePauseClick}
                    >
                      <img src={PauseIcon} alt="Pause Icon" />
                    </button>
                  </div>
                </div>
                <div className="content-container">
                  {currentQuestion && (
                    <>
                      <DisplayCode
                        question={currentQuestion.question}
                        codeString={currentQuestion.codeSnippet}
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
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

export default App;
