import React, { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import "../App.css";
const NUMB_OF_WORDS = 10;
const DEFAULT_SECONDS = 300;
const TIME_OPTIONS = [
  { label: "1 minutes", value: 1 },
  { label: "2 minutes", value: 2 },
  { label: "5 minutes", value: 5 },
];

function Typing() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(DEFAULT_SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0].value);
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  useEffect(() => {
    setCountDown(selectedTime * 60);
  }, [selectedTime]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return selectedTime * 60;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    //space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    }
    //backspace
    else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
  }

  function handleTimeChange(event) {
    setSelectedTime(Number(event.target.value));
  }

  return (
    <div className="App">
      <div className="section">
        <div className="timeSelection">
          <label htmlFor="time">Select Time (minutes): </label>
          <select id="time" value={selectedTime} onChange={handleTimeChange}>
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="section">
        <div className="countDown">
          <h2>{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input
          ref={textInput}
          disabled={status !== "started"}
          type="text"
          className="input"
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>
      <div className="section">
        <button className="button" onClick={start}>
          Start
        </button>
      </div>
      {status === "started" && (
        <div className="section">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="text-centered">
              <p className="is-size-5">Words per minute: </p>
              <p className="">{correct}</p>
            </div>
            <div>
              <div className="is-size-5">Accuracy : </div>
              <p className="has-text-info is-size-1">
                {Math.round((correct / (correct + incorrect)) * 100)} %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Typing;
