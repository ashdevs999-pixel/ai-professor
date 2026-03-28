'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Quiz as QuizType } from '@/types';

interface QuizComponentProps {
  quiz: QuizType;
  onComplete?: (score: number) => void;
}

export function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    setAnswers([...answers, selectedAnswer]);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      const score = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
      onComplete?.(score);
    }
  };

  const score = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div
            className={cn(
              'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4',
              score / quiz.questions.length >= 0.7
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            )}
          >
            <CheckCircle
              className={cn(
                'w-10 h-10',
                score / quiz.questions.length >= 0.7
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              )}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You scored {score} out of {quiz.questions.length}
          </p>
          <div className="w-32 h-2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
              style={{ width: `${(score / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {quiz.title}
          </h2>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg text-gray-900 dark:text-white font-medium mb-4">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={!showExplanation ? { scale: 1.01 } : {}}
              whileTap={!showExplanation ? { scale: 0.99 } : {}}
              onClick={() => handleSelectAnswer(index)}
              disabled={showExplanation}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                'flex items-center gap-3',
                selectedAnswer === index
                  ? showExplanation
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                showExplanation && index === question.correctIndex && 'border-green-500 bg-green-50 dark:bg-green-900/20'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                  selectedAnswer === index
                    ? showExplanation
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-gray-900 dark:text-white">{option}</span>
              {showExplanation && index === question.correctIndex && (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto" />
              )}
              {showExplanation && selectedAnswer === index && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'p-4 rounded-lg mb-6',
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            )}
          >
            <p className="text-sm">
              <strong className="text-gray-900 dark:text-white">Explanation: </strong>
              <span className="text-gray-700 dark:text-gray-300">{question.explanation}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showExplanation ? (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
            {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </Button>
        )}
      </div>
    </Card>
  );
}
