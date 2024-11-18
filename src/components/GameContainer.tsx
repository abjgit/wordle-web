import React from 'react';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { useGameStore } from '@/stores/gameStore';

export const GameContainer = () => {
  const { gameState } = useGameStore();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <GameBoard />
      </div>
      <div>
        <Keyboard />
      </div>
      {gameState.isFinished && (
        <div className="mt-4 text-xl font-bold">
          {gameState.guesses.includes(gameState.word) ? 'Congratulations!' : 'Game Over!'}
        </div>
      )}
    </div>
  );
};
