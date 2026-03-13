import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ wins: 0, total: 0 });

  const handleGuess = async (number) => {
    setSelectedNumber(number);
    setIsLoading(true);
    setResult(null);

    try {
      // Update this URL to your deployed backend URL when deploying
      const apiUrl = process.env.REACT_APP_API_URL || 'https://guess-the-number-backend-aj6r.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/v1/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: number }),
      });

      const data = await response.json();
      setResult(data);
      
      setStats(prev => ({
        wins: prev.wins + (data.correct ? 1 : 0),
        total: prev.total + 1
      }));
    } catch (error) {
      console.error('Error:', error);
      setResult({ 
        correct: false, 
        message: 'Error connecting to server. Make sure backend is running!',
        rolledNumber: '?',
        userGuess: number
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setSelectedNumber(null);
    setResult(null);
  };

  const winRate = stats.total > 0 
    ? Math.round((stats.wins / stats.total) * 100) 
    : 0;

  return (
    <div className="App">
      <div className="game-container">
        <div className="header">
          <h1 className="title">
            <span className="title-guess">Guess</span>
            <span className="title-number">the Number</span>
          </h1>
          <p className="subtitle">Pick a number from 1 to 6</p>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.wins}</span>
            <span className="stat-label">Wins</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tries</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{winRate}%</span>
            <span className="stat-label">Win Rate</span>
          </div>
        </div>

        {!result ? (
          <div className="numbers-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={`number-button ${selectedNumber === num ? 'selected' : ''} ${isLoading ? 'disabled' : ''}`}
                onClick={() => handleGuess(num)}
                disabled={isLoading}
              >
                <span className="number-value">{num}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={`result-container ${result.correct ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">
              {result.correct ? '🎉' : '😔'}
            </div>
            <h2 className="result-message">{result.message}</h2>
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">You guessed:</span>
                <span className="detail-value your-guess">{result.userGuess}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rolled number:</span>
                <span className="detail-value rolled-number">{result.rolledNumber}</span>
              </div>
            </div>
            <button className="play-again-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Checking...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
