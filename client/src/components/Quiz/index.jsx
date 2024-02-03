import React, { useRef, useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import api from "../../helpers";

const SimpleReactPage = () => {
  const inputRef = useRef(null);

  const [points, setPoint] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionNumber, setQuestionNumber] = useState("");
  const [numberInput, setNumberInput] = useState(0);

  // Options for the searchable dropdown
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Event handler for the searchable dropdown change
  const handleDropdownChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  // Event handler for the number input change
  const handleNumberInputChange = (event) => {
    setNumberInput(event.target.value);
  };

  // Event handler for the number input change
  const handleQuestionNumber = (event) => {
    setQuestionNumber(event.target.value.toUpperCase());
  };

  const handleDone = () => {
    if (!selectedOption || numberInput < 0) {
      alert("Please fill data");
      return;
    }
    setPoint((v) => {
      return { ...v, [selectedOption.value.toUpperCase()]: numberInput };
    });

    // Check if the inputRef is defined
    if (inputRef.current) {
      // Focus on the input field
      inputRef.current.focus();
    }

    setSelectedOption(null);
    setNumberInput(0);
  };

  const handleNext = async () => {
    if (!questionNumber) alert("No questionNumber");
    if (!Object.keys(points)?.length) alert("No points");

    const data = await api.saveData({
      question: questionNumber,
      points,
    });

    // Check if the inputRef is defined
    if (inputRef.current) {
      // Focus on the input field
      inputRef.current.focus();
    }

    const lastChar = questionNumber.slice(-1);
    if (!isNaN(lastChar)) {
      const numericPart = questionNumber.match(/\d+$/)[0];
      const newNumber = parseInt(numericPart, 10) + 1;
      setQuestionNumber(questionNumber.replace(/\d+$/, newNumber));
    } else {
      setQuestionNumber("");
    }

    setSelectedOption(null);
    setNumberInput(0);
    setPoint({});

    setDropdownOptions(data.participants);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await api.saveData();
      const participants = data?.participants.map((v) => ({
        value: v.toUpperCase(),
        label: v.toUpperCase(),
      }));

      setDropdownOptions(participants || []);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-center mb-4 pb-2 ">
        <input
          className="border p-1 rounded"
          type="text"
          placeholder="Question Number"
          value={questionNumber}
          onChange={handleQuestionNumber}
        />
      </div>
      <div className="flex flex-row">
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <CreatableSelect
              ref={inputRef}
              className="w-80"
              value={selectedOption}
              onChange={handleDropdownChange}
              options={dropdownOptions}
              isSearchable
              placeholder="Select Name"
            />
            <input
              className="ml-2 border p-1 rounded w-24"
              type="number"
              value={numberInput}
              onChange={handleNumberInputChange}
            />
            <button
              onClick={handleDone}
              className="ml-2 border p-1 rounded w-24"
            >
              Done
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleNext}
              className="mt-4 border p-1 rounded w-42"
            >
              Next Question
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex-1 ml-4 p-4">
            <div className="max-w-md p-4 bg-gray-200 rounded">
              <h2 className="text-lg font-bold mb-4">
                Points Table ({questionNumber})
              </h2>
              <div className="table">
                {Object.entries(points).map(([key, value]) => (
                  <div key={key} className="table-row mb-2">
                    <div className="table-cell pr-8 font-bold">{key}</div>
                    <div className="table-cell">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleReactPage;
