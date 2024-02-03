import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select";
import api from "../../helpers";

const SimpleReactPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState({});
  const [topScorer, setTopScorer] = useState([]);

  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Event handler for the searchable dropdown change
  const handleDropdownChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
    const data = await api.getExistingDataFromApi(selectedOption.value);
    setData(data.data.points);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await api.getExistingDataFromApi();
      const questionNumbers = data?.questionNumbers.map((v) => ({
        value: v.toUpperCase(),
        label: v.toUpperCase(),
      }));

      setTopScorer(data?.topScorer || {});
      setDropdownOptions(questionNumbers || []);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row">
      <div className="flex-1 mr-2 p-4 bg-gray-200 rounded">
        <div className="flex justify-center mb-4">
          <CreatableSelect
            className="w-80"
            value={selectedOption}
            onChange={handleDropdownChange}
            options={dropdownOptions}
            isSearchable
            placeholder="Select Question"
          />
        </div>

        <h2 className="text-lg font-bold mb-4">
          Points Table {selectedOption?.value}
        </h2>
        <div className="table">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="table-row mb-2">
              <div className="table-cell pr-8 font-bold">{key}</div>
              <div className="table-cell">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 bg-gray-200 rounded">
        <h2 className="text-lg font-bold mb-4">Top Scorer</h2>
        <div className="table">
          {topScorer.map(([key, value]) => (
            <div key={key} className="table-row mb-2">
              <div className="table-cell pr-8 font-bold">{key}</div>
              <div className="table-cell">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleReactPage;
