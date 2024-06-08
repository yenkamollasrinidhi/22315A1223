import React, { useState } from 'react';
import './App.css';

function App() {
  const [qualifier, setQualifier] = useState('p');
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(null);
  const [prevState, setPrevState] = useState([]);
  const [currState, setCurrState] = useState([]);
  const [error, setError] = useState(null);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${qualifier}`);
      setPrevState(response.data.windowPrevState);
      setCurrState(response.data.windowCurrState);
      setNumbers(response.data.numbers);
      setAverage(response.data.average);
      setError(null);
    } catch (err) {
      setError('Failed to fetch numbers');
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>
          Select Qualifier: 
          <select value={qualifier} onChange={(e) => setQualifier(e.target.value)}>
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
        </label>
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div>
        <h2>Previous State</h2>
        <pre>{JSON.stringify(prevState, null, 2)}</pre>
        <h2>Current State</h2>
        <pre>{JSON.stringify(currState, null, 2)}</pre>
        <h2>Numbers</h2>
        <pre>{JSON.stringify(numbers, null, 2)}</pre>
        <h2>Average</h2>
        <p>{average}</p>
      </div>
    </div>
  );
}

export default App;
