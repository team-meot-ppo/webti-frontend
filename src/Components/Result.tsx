import React, { useEffect, useState } from "react";
import TypingEffect from "./TypingEffect";

interface SurveyData {
  result: string;
  description: string;
  mbtiType: string;
}

const Result: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [typingCompleted, setTypingCompleted] = useState(false);

  const [input, setInput] = useState<string>(""); // 사용자 입력
  const [inputEnabled, setInputEnabled] = useState<boolean>(false); // 입력 동안 키보드 이벤트 막기

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputEnabled) {
      setInput(e.target.value); // 입력값 업데이트
    }
  };

  useEffect(() => {
    fetch("/result.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSurveyData(data.data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  if (!surveyData) {
    return <p>Loading...</p>;
  }

  const resultText = `
Your webit result : 
${surveyData.result}
  `;

  return (
    <div className="survey-result mb-20">
      <TypingEffect
        text={resultText}
        speed={20}
        onComplete={() => setTypingCompleted(true)}
      />
      {typingCompleted && (
        <div className="result-content">
          <img
            className="result-image"
            src="/img/INFP.webp"
            alt="result-image"
          />
          <div className="description-box break-all">
            <TypingEffect
              text={surveyData.description}
              speed={20}
              onComplete={() => setInputEnabled(true)}
            />
          </div>
        </div>
      )}
      {inputEnabled && (
        <div className="commands mt-4">
          <p>결과가 자신과 맞나요? yes/no</p>
          <p>
            &gt;&gt;&gt;{" "}
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              // onKeyDown={''}
              className="bg-black text-white outline-none"
              autoFocus
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default Result;
