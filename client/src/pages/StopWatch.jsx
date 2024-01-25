import React, { useEffect, useRef, useState } from "react";

function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
    console.log(startTimeRef.current, elapsedTime);
  }

  function reset() {
    setIsRunning(false);
    setElapsedTime(0);
  }

  return (
    <div>
      <div>{elapsedTime}</div>
      <div className="controls">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default StopWatch;
