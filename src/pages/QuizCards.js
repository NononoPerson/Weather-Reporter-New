import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles.css";

export default function QuizCards() {
  const location = useLocation();
  const difficulty = location.state?.difficulty || "Easy";

  const questionSets = {
    Easy: [
      { question: "What should you wear on a sunny day?", options: ["Jacket", "T-shirt", "Sweater", "Coat"], correct: 1 },
      { question: "Rainy day equipment?", options: ["Umbrella", "Sunglasses", "Hat", "Sandals"], correct: 0 },
      { question: "Best way to stay cool in summer?", options: ["Heavy coat", "Light clothes", "Sweater", "Boots"], correct: 1 },
      { question: "Drink to stay hydrated?", options: ["Water", "Coffee", "Soda", "Wine"], correct: 0 },
      { question: "Wear this to avoid sunburn?", options: ["Hat", "Scarf", "Coat", "Boots"], correct: 0 },
      { question: "Best footwear for rain?", options: ["Sandals", "Boots", "Flip-flops", "High heels"], correct: 1 },
      { question: "Protect eyes from sun?", options: ["Sunglasses", "Gloves", "Hat", "Coat"], correct: 0 },
      { question: "Wear on windy day?", options: ["Jacket", "Shorts", "T-shirt", "Flip-flops"], correct: 0 },
      { question: "Cold day clothing?", options: ["Sweater", "T-shirt", "Shorts", "Sandals"], correct: 0 },
      { question: "Best accessory in snow?", options: ["Scarf", "Sunglasses", "Hat", "Flip-flops"], correct: 0 },
      { question: "Protect from rain?", options: ["Raincoat", "Sweater", "T-shirt", "Boots"], correct: 0 },
      { question: "Best clothing for indoors?", options: ["Comfortable casual wear", "Heavy coat", "Raincoat", "Boots"], correct: 0 },
      { question: "Wear at beach?", options: ["Shorts", "Sweater", "Jacket", "Boots"], correct: 0 },
      { question: "Accessory for sun?", options: ["Sunglasses", "Umbrella", "Boots", "Scarf"], correct: 0 },
      { question: "Stay warm in mild winter?", options: ["Sweater", "T-shirt", "Shorts", "Sandals"], correct: 0 },
    ],
    Medium: [
      { question: "What is the main cause of rainfall?", options: ["Evaporation", "Condensation", "Precipitation", "Wind"], correct: 2 },
      { question: "Ideal temperature for spring?", options: ["0°C", "10-20°C", "30-40°C", "50°C"], correct: 1 },
      { question: "Which clothing is best for moderate cold?", options: ["T-shirt", "Light sweater", "Heavy jacket", "Shorts"], correct: 1 },
      { question: "Best hydration during moderate heat?", options: ["Water", "Coffee", "Milkshake", "Soda"], correct: 0 },
      { question: "Which day is considered a cloudy day?", options: ["No clouds", "Few clouds", "Mostly cloudy", "Sunny"], correct: 2 },
      { question: "Best shoes for walking in rain?", options: ["Sneakers", "Flip-flops", "Rain boots", "Sandals"], correct: 2 },
      { question: "Protective wear in snow?", options: ["Scarf", "Sunglasses", "Shorts", "Boots"], correct: 3 },
      { question: "Wear during light drizzle?", options: ["Raincoat", "T-shirt", "Shorts", "Gloves"], correct: 0 },
      { question: "Ideal indoor clothing?", options: ["Pajamas", "Sweater", "Coat", "Boots"], correct: 0 },
      { question: "Best hat for sunny day?", options: ["Beanie", "Baseball cap", "Helmet", "Beret"], correct: 1 },
      { question: "Optimal clothing for cloudy day?", options: ["Sweater", "T-shirt", "Shorts", "Coat"], correct: 0 },
      { question: "Best attire for evening walk?", options: ["Light jacket", "Heavy coat", "Shorts", "Flip-flops"], correct: 0 },
      { question: "Ideal footwear for spring?", options: ["Rain boots", "Sandals", "Sneakers", "High heels"], correct: 2 },
      { question: "Accessory for light sun?", options: ["Sunglasses", "Hat", "Scarf", "Gloves"], correct: 0 },
      { question: "Clothing for moderate wind?", options: ["Jacket", "T-shirt", "Shorts", "Cap"], correct: 0 },
    ],
    Hard: [
      { question: "Which layer in clouds produces heavy rain?", options: ["Stratus", "Cumulus", "Nimbus", "Cirrus"], correct: 2 },
      { question: "Which clothing material is best for high humidity?", options: ["Cotton", "Wool", "Polyester", "Leather"], correct: 0 },
      { question: "Best footwear for muddy paths?", options: ["Sandals", "Boots", "Sneakers", "Flip-flops"], correct: 1 },
      { question: "What protects against UV rays?", options: ["Sunscreen", "Sweater", "Boots", "Hat"], correct: 0 },
      { question: "Optimal hydration method?", options: ["Water", "Juice", "Soda", "Tea"], correct: 0 },
      { question: "Which clothing is suitable for sudden rain?", options: ["Raincoat", "T-shirt", "Shorts", "Boots"], correct: 0 },
      { question: "Cold windy day attire?", options: ["Light jacket", "Heavy coat", "Sweater", "T-shirt"], correct: 1 },
      { question: "Indoor comfort clothing?", options: ["Sweatpants", "Coat", "Boots", "Gloves"], correct: 0 },
      { question: "Best accessory for snow?", options: ["Scarf", "Gloves", "Boots", "Hat"], correct: 0 },
      { question: "Protect eyes during bright sun?", options: ["Hat", "Sunglasses", "Cap", "Gloves"], correct: 1 },
      { question: "Attire for drizzle?", options: ["Raincoat", "Shorts", "T-shirt", "Jacket"], correct: 0 },
      { question: "Ideal indoor temperature?", options: ["10°C", "20°C", "25°C", "30°C"], correct: 2 },
      { question: "Best footwear for snow?", options: ["Boots", "Sneakers", "Sandals", "Flip-flops"], correct: 0 },
      { question: "Clothing for evening walk?", options: ["Light jacket", "Sweater", "Shorts", "T-shirt"], correct: 0 },
      { question: "Accessory for light sun?", options: ["Hat", "Sunglasses", "Scarf", "Gloves"], correct: 1 },
    ],
    Impossible: [
      { question: "Exact boiling point of water?", options: ["100°C", "90°C", "120°C", "80°C"], correct: 0 },
      { question: "Standard indoor temperature?", options: ["18°C", "22°C", "25°C", "30°C"], correct: 1 },
      { question: "Optimal winter jacket insulation?", options: ["1 inch", "2 inches", "3 inches", "4 inches"], correct: 2 },
      { question: "Humidity level in desert?", options: ["10%", "30%", "50%", "70%"], correct: 0 },
      { question: "UV index range for strong sun?", options: ["0-2", "3-5", "6-7", "8-11"], correct: 3 },
      { question: "Best clothing for sub-zero?", options: ["T-shirt", "Sweater", "Down jacket", "Shorts"], correct: 2 },
      { question: "Footwear for icy roads?", options: ["Boots", "Sneakers", "Flip-flops", "Sandals"], correct: 0 },
      { question: "Best accessory in blizzard?", options: ["Hat", "Sunglasses", "Gloves", "Boots"], correct: 2 },
      { question: "Ideal hydration in extreme heat?", options: ["Water", "Coffee", "Soda", "Tea"], correct: 0 },
      { question: "Best rain protection?", options: ["Umbrella", "Raincoat", "Boots", "Hat"], correct: 1 },
      { question: "Clothing for stormy wind?", options: ["Light jacket", "Heavy coat", "Sweater", "T-shirt"], correct: 1 },
      { question: "Footwear for trekking?", options: ["Sneakers", "Boots", "Flip-flops", "Sandals"], correct: 1 },
      { question: "Wear for high UV?", options: ["Hat", "Sunglasses", "Coat", "Gloves"], correct: 1 },
      { question: "Cold night attire?", options: ["Sweater", "Jacket", "Coat", "Shorts"], correct: 2 },
      { question: "Accessory in snowstorm?", options: ["Scarf", "Hat", "Gloves", "Boots"], correct: 2 },
    ],
  };

  const questions = questionSets[difficulty];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (index) => {
    const updatedSelections = [...selectedOptions];
    updatedSelections[currentQuestion] = index;
    setSelectedOptions(updatedSelections);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setShowResults(true);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  if (showResults) {
    const correctCount = questions.reduce(
      (acc, q, idx) => acc + (q.correct === selectedOptions[idx] ? 1 : 0),
      0
    );

    return (
      <div
        className="quiz-results-container"
        style={{
          margin: "20px auto",
          width: "500px",
          height: "550px",
          overflowY: "auto",
          textAlign: "center",
          backgroundColor: "rgba(0,123,255,0.2)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ fontSize: "1.8em" }}>Quiz Results ({difficulty})</h1>
        <div
          style={{
            margin: "20px auto",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.2em"
          }}
        >
          {correctCount}/{questions.length}
        </div>

        {questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: "10px", textAlign: "center" }}>
            <p style={{ fontWeight: "bold" }}>{idx + 1}. {q.question}</p>
            <p style={{ color: selectedOptions[idx] === q.correct ? "green" : "red" }}>
              Your answer: {selectedOptions[idx] !== null ? q.options[selectedOptions[idx]] : "Not answered"}<br />
              {selectedOptions[idx] !== q.correct ? `Correct answer: ${q.options[q.correct]}` : null}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div
        style={{
          backgroundColor: "rgba(0,123,255,0.2)",
          borderRadius: "15px",
          padding: "20px",
          width: "500px",
          margin: "20px auto 70px",
          textAlign: "center",
          color: "black",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >
        <h1 style={{ fontSize: "1.8em" }}>Quiz ({difficulty})</h1>
        <p style={{ fontSize: "1.1em", marginBottom: "20px" }}>
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <p style={{ fontWeight: "bold", fontSize: "1.2em", textAlign: "center" }}>
          {currentQ.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px", alignItems: "center" }}>
          {currentQ.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              style={{
                padding: "12px 15px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1.1em",
                backgroundColor: selectedOptions[currentQuestion] === idx ? "#007bff" : "transparent",
                color: selectedOptions[currentQuestion] === idx ? "white" : "black",
                border: "2px solid #007bff",
                transition: "0.3s",
                textAlign: "center",
                width: "80%"
              }}
            >
              {option}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <button
            onClick={handlePrevious}
            style={{
              padding: "12px 24px",
              maxWidth: "248px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1em"
            }}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            style={{
              padding: "12px 24px",
              maxWidth: "248px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1em"
            }}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
