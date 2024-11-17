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
  const [playerName, setPlayerName] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isStopLightActive, setIsStopLightActive] = useState(false);
  const [onHomeScreen, setOnHomeScreen] = useState(true);

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
    if (selectedAnswer !== null || winner) return;

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
    setIsStopLightActive(false);
  };

  const handleReadyClick = () => {
    if (playerName.trim() === "") {
      alert("Please enter your name before starting the game.");
      return;
    }
    setReadyClicked(true);
    setIsStopLightActive(true);
    setOnHomeScreen(false);
  };

  const handleWinner = (winnerName) => {
    setWinner(winnerName === "Player" ? playerName : "AI");
  };

  const handleRestart = () => {
    setIsRestarting(true);
    setIsStopLightActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setWinner(null);
    setGameStarted(false);
  };

  const handleRestartComplete = () => {
    setIsRestarting(false);
    setIsStopLightActive(false);
    setGameStarted(true);
  };

  const handleHomeClick = () => {
    setOnHomeScreen(true);
    setReadyClicked(false);
    setPlayerName("");
    setGameStarted(false);
    setIsStopLightActive(false);
    setWinner(null);
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestionIndex(0);
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
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
            spellcheck="false"
          />
          <button className="ready-button" onClick={handleReadyClick}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          {isStopLightActive && !gameStarted && (
            <StopLight onCountdownComplete={handleCountdownComplete} />
          )}

          {gameStarted && (
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
            </>
          )}
        </>
      )}

      {isStopLightActive && !gameStarted && (
        <StopLight onCountdownComplete={handleRestartComplete} />
      )}
    </div>
  );
}

export default App;
