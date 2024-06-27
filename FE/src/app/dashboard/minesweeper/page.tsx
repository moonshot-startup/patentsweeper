"use client";
import React, { useState, useEffect } from 'react';

type SquareValue = ' ' |'💣' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

interface SquareProps {
  value: SquareValue | ' ';
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <button
    onClick={onClick}
    className="w-5 h-5 text-xs border border-black flex items-center justify-center"
  >
    {value || ' '}
  </button>
);

type BoardProps = {
  squares: Array<SquareValue>;
  showsquares: (boolean | false)[];
  onClick: (i: number) => void;
};

const Board: React.FC<BoardProps> = ({ squares, showsquares , onClick }) => {
  const renderSquare = (i: number) => (
    <Square
      key={i}
      value={showsquares[i] ? squares[i]: " "}
      onClick={() => onClick(i)}
    />
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 20px)' }}>
      {Array(900).fill(null).map((_, i) => renderSquare(i))}
    </div>
  );
};

const Game: React.FC = () => {
  const [squares, setSquares] = useState<(SquareValue | ' ')[]>(Array(900).fill(' '));
  const [showsquares, setShownSquares,] = useState<(boolean | false)[]>(Array(900).fill(false));
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Example initialization logic, replace with your own
    const newSquares = Array(900).fill(null);
    // Randomly place mines
    for (let i = 0; i < 90; i++) { // 10% mines
      let pos;
      do {
        pos = Math.floor(Math.random() * 900);
      } while (newSquares[pos] === '💣');
      newSquares[pos] = '💣';
    }
    // Calculate adjacent mines for each square
    for (let i = 0; i < 900; i++) {
      if (newSquares[i] !== '💣') {
        const adjacentMines = calculateAdjacentMines(i, newSquares);
        newSquares[i] = adjacentMines > 0 ? adjacentMines.toString() as SquareValue : '0';
      }
    }
    setSquares(newSquares);
  };

  const calculateAdjacentMines = (index: number, squares: (SquareValue | null)[]): number => {
    const width = 30; // Board width
    let count = 0;
    const directions = [-width - 1, -width, -width + 1, -1, 1, width - 1, width, width + 1];
    const edgeLeft = index % width === 0;
    const edgeRight = index % width === width - 1;

    directions.forEach(direction => {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < 900) {
        if ((direction === -1 && edgeLeft) || (direction === 1 && edgeRight)) {
          return;
        }
        if (squares[newIndex] === '💣') {
          count++;
        }
      }
    });

    return count;
  };

  const handleClick = (i: number) => {
    const newShownSquares = [...showsquares];
    newShownSquares[i] = true;
    setShownSquares(newShownSquares);
    if (squares[i] === '💣') {
      window.alert("Game over!");
      return;
    }
    };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          showsquares={showsquares}
          onClick={i => handleClick(i)}
        />
      </div>
    </div>
  );
};

export default Game;