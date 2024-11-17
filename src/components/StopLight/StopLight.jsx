import React, { useState, useEffect } from "react";
import "./StopLight.css";

export default function StopLight({ onCountdownComplete }) {
  const [light, setLight] = useState("red");
  const [countdownText, setCountdownText] = useState("Ready");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLight("yellow");
      setCountdownText("Set");
    }, 1000);

    const timer2 = setTimeout(() => {
      setLight("green");
      setCountdownText("Go");
    }, 2000);

    const timer3 = setTimeout(() => {
      setCountdownText("");
    }, 3000);

    const timer4 = setTimeout(() => {
      onCountdownComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onCountdownComplete]);

  return (
    <div
      className="stoplight-container"
      style={{ width: "150px", height: "300px", backgroundColor: "#444" }}
    >
      <div className={`light ${light}`}></div>
      <div className="countdown">{countdownText}</div>
    </div>
  );
}
