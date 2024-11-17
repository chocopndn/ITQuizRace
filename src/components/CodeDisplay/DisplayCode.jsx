import React from "react";
import "./DisplayCode.css";

export default function DisplayCode({ codeString }) {
  return (
    <div className="display-code-container">
      <div className="code">{codeString}</div>
    </div>
  );
}
