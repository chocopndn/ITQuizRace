import React from "react";
import "./DisplayCode.css";

export default function DisplayCode({ question, codeString }) {
  const isCodeProvided = !!codeString;

  return (
    <div
      className={`display-code-container ${
        !isCodeProvided ? "centered-container" : ""
      }`}
    >
      <div className="question">{question || "No question provided"}</div>
      {isCodeProvided && (
        <pre className="code">
          <code>{codeString}</code>
        </pre>
      )}
    </div>
  );
}
