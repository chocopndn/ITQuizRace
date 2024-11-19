import React from "react";
import "./DisplayCode.css";

export default function DisplayCode({ question, codeString }) {
  return (
    <div className="display-code-container">
      <div className="question">{question || "No question provided"}</div>
      <pre className="code">
        <code>{codeString || "No code snippet provided"}</code>
      </pre>
    </div>
  );
}
