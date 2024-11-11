import { useState } from "react";
import Highway from "./components/Highway/Highway";
import DisplayCode from "./components/CodeDisplay/DisplayCode";
import AnswerGrid from "./components/AnswerGrid/AnswerGrid";
import questions from "./questions.json";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1 && correctAnswers < 10) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (correctAnswers >= 10) {
        alert("You've completed the quiz! Your score: " + score);
      }
    }, 1000);
  };

  return (
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
    </>
  );
}

export default App;
