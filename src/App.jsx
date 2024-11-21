import { useState, useEffect, useRef } from "react";
import Highway from "./components/Highway/Highway";
import DisplayCode from "./components/DisplayCode/DisplayCode";
import AnswerGrid from "./components/AnswerGrid/AnswerGrid";
import questions from "./assets/json/questions.json";
import aiNames from "./assets/json/aiNames.json";
import StopLight from "./components/StopLight/StopLight";
import Modal from "./components/Modal/Modal";
import SettingsModal from "./components/SettingsModal/SettingsModal";
import "./App.css";

import HomeIcon from "./assets/icons/home.svg";
import PauseIcon from "./assets/icons/pause.svg";
import RestartIcon from "./assets/icons/restart.svg";
import SettingsIcon from "./assets/icons/settings.svg";

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const randomizeAnswerPositions = (options, correctAnswer, lastPositions) => {
  let shuffled = shuffleArray(options);
  const correctIndex = shuffled.indexOf(correctAnswer);

  if (lastPositions.includes(correctIndex)) {
    const availableIndices = shuffled
      .map((_, i) => i)
      .filter((i) => !lastPositions.includes(i));

    if (availableIndices.length > 0) {
      const newCorrectIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      [shuffled[correctIndex], shuffled[newCorrectIndex]] = [
        shuffled[newCorrectIndex],
        shuffled[correctIndex],
      ];
    }
  }

  return shuffled;
};

function App() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [unlockedImpossible, setUnlockedImpossible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [titlePressCount, setTitlePressCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [randomizedAnswers, setRandomizedAnswers] = useState([]);
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
  const [lastCorrectPositions, setLastCorrectPositions] = useState([]);
  const [bgMusic, setBgMusic] = useState(
    "./src/assets/sounds/music/space_cadet_training_montage.wav"
  );
  const [bgMusicMuted, setBgMusicMuted] = useState(false);
  const [fxMuted, setFxMuted] = useState(false);
  const [bgVolume, setBgVolume] = useState(100);
  const [fxVolume, setFxVolume] = useState(100);
  const audioRef = useRef(null);

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
    if (audioRef.current) {
      audioRef.current.volume = bgVolume / 100;
      audioRef.current.loop = true;
      audioRef.current.muted = bgMusicMuted;
    }
  }, [bgVolume, bgMusicMuted]);

  useEffect(() => {
    if (readyClicked && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play background music on start:", error);
      });
    }
  }, [readyClicked]);

  const handleMusicChange = (musicPath) => {
    setBgMusic(musicPath);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = musicPath;
      audioRef.current
        .play()
        .catch((error) =>
          console.error("Failed to play background music:", error)
        );
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsPaused(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      const randomized = randomizeAnswerPositions(
        currentQuestion.options,
        currentQuestion.correctAnswer,
        lastCorrectPositions
      );
      setRandomizedAnswers(randomized);
    }
  }, [currentQuestion, lastCorrectPositions]);

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

    setSelectedAnswer(null);

    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      const reshuffledQuestions = shuffleArray(questions);
      setShuffledQuestions(reshuffledQuestions);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
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

  const handleTitleClick = () => {
    setTitlePressCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 5) {
        setUnlockedImpossible(true);
        setShowModal(true);
      }
      return newCount;
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleUserInteraction = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error(
          "Failed to play background music on user interaction:",
          error
        );
      });
    }
  };

  const handleToggleBgMusicMute = () => {
    setBgMusicMuted((prevMuted) => !prevMuted);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const handleToggleFxMute = () => {
    setFxMuted((prevMuted) => !prevMuted);
  };

  const handleBgVolumeChange = (volume) => {
    setBgVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  };

  const handleFxVolumeChange = (volume) => {
    setFxVolume(volume);
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
    <div className="app-container" onClick={handleUserInteraction}>
      {showModal && (
        <Modal
          title="Impossible Unlocked!"
          message="You have unlocked the Impossible difficulty. Good luck!"
          onClose={closeModal}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={closeSettings}
          onChangeMusic={handleMusicChange}
          onToggleBgMusicMute={handleToggleBgMusicMute}
          onToggleFxMute={handleToggleFxMute}
          bgMusicMuted={bgMusicMuted}
          fxMuted={fxMuted}
          bgVolume={bgVolume}
          onChangeBgVolume={handleBgVolumeChange}
          fxVolume={fxVolume}
          onChangeFxVolume={handleFxVolumeChange}
        />
      )}
      {onHomeScreen ? (
        <div className="ready-button-container">
          <h1 className="title" onClick={handleTitleClick}>
            ITQuiz Race
          </h1>
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
          <div className="difficulty-container">
            {[
              "Easy",
              "Medium",
              "Hard",
              ...(unlockedImpossible ? ["Impossible"] : []),
            ].map((level) => (
              <button
                key={level}
                className={`difficulty-button ${
                  difficulty === level ? "selected-difficulty" : ""
                }`}
                onClick={() => handleDifficultyChange(level)}
              >
                {level}
              </button>
            ))}
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
                    difficulty={difficulty}
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
                    <button
                      className="icon-container"
                      onClick={handleSettingsClick}
                    >
                      <img src={SettingsIcon} alt="Settings Icon" />
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
                        options={randomizedAnswers}
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
      <audio ref={audioRef} loop autoPlay>
        <source src={bgMusic} type="audio/mpeg" />
        <p>Your browser does not support the audio element.</p>
      </audio>
    </div>
  );
}

export default App;
