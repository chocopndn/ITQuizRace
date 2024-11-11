import React, { useState, useEffect } from "react";
import "./StopLight.css";

export default function StopLight({ onCountdownComplete }) {
  const [light, setLight] = useState("red");

  useEffect(() => {
    const timer1 = setTimeout(() => setLight("yellow"), 1000);
    const timer2 = setTimeout(() => setLight("green"), 2000);

    const timer3 = setTimeout(() => {
      onCountdownComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onCountdownComplete]);

  return (
    <div className="stoplight-container">
      <div className={`light ${light}`}></div>
    </div>
  );
}
