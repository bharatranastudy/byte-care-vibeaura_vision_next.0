import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaCheckCircle, 
  FaTimes, 
  FaCoins, 
  FaTrophy,
  FaPlay,
  FaRedo,
  FaClock,
  FaStar,
  FaAward,
  FaChartLine
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import TiltCard from '../components/TiltCard';

const HealthQuiz = () => {
  const { updateWallet } = useApp();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const quizzes = [
    {
      id: 1,
      title: 'General Health Knowledge',
      description: 'Test your basic health and wellness knowledge',
      difficulty: 'Easy',
      questions: 10,
      timePerQuestion: 30,
      reward: 50,
      category: 'general',
      questionList: [
        {
          question: 'How many hours of sleep do adults typically need per night?',
          options: ['4-5 hours', '6-7 hours', '7-9 hours', '10-12 hours'],
          correct: 2,
          explanation: 'Adults typically need 7-9 hours of sleep per night for optimal health and well-being.'
        },
        {
          question: 'Which vitamin is primarily obtained from sunlight?',
          options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
          correct: 3,
          explanation: 'Vitamin D is synthesized in the skin when exposed to UVB rays from sunlight.'
        },
        {
          question: 'What is the recommended daily water intake for adults?',
          options: ['4-6 glasses', '6-8 glasses', '8-10 glasses', '10-12 glasses'],
          correct: 2,
          explanation: 'Adults should drink about 8-10 glasses (2-2.5 liters) of water daily.'
        },
        {
          question: 'Which of these is NOT a symptom of dehydration?',
          options: ['Dry mouth', 'Dark urine', 'Excessive energy', 'Headache'],
          correct: 2,
          explanation: 'Excessive energy is not a symptom of dehydration. Fatigue is more common.'
        },
        {
          question: 'How often should you wash your hands to prevent illness?',
          options: ['Once a day', 'Before meals only', 'Frequently throughout the day', 'Only when visibly dirty'],
          correct: 2,
          explanation: 'Frequent handwashing throughout the day is one of the best ways to prevent illness.'
        }
      ]
    },
    {
      id: 2,
      title: 'Nutrition Basics',
      description: 'Learn about healthy eating and nutrition',
      difficulty: 'Medium',
      questions: 8,
      timePerQuestion: 45,
      reward: 75,
      category: 'nutrition',
      questionList: [
        {
          question: 'Which macronutrient provides the most calories per gram?',
          options: ['Carbohydrates', 'Proteins', 'Fats', 'Vitamins'],
          correct: 2,
          explanation: 'Fats provide 9 calories per gram, while carbohydrates and proteins provide 4 calories per gram.'
        },
        {
          question: 'What is the recommended daily intake of fruits and vegetables?',
          options: ['2-3 servings', '3-4 servings', '5-7 servings', '8-10 servings'],
          correct: 2,
          explanation: 'Health experts recommend 5-7 servings of fruits and vegetables daily for optimal nutrition.'
        },
        {
          question: 'Which type of fat is considered healthiest?',
          options: ['Saturated fat', 'Trans fat', 'Monounsaturated fat', 'Processed fat'],
          correct: 2,
          explanation: 'Monounsaturated fats, found in olive oil and avocados, are considered the healthiest.'
        }
      ]
    }
  ];

  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  const completeQuiz = useCallback((answers) => {
    setQuizCompleted(true);
    const finalScore = answers.filter(a => a.isCorrect).length;
    const percentage = (finalScore / currentQuiz.questionList.length) * 100;
    
    // Award tokens based on performance
    let tokensEarned = 0;
    if (percentage >= 80) {
      tokensEarned = currentQuiz.reward;
    } else if (percentage >= 60) {
      tokensEarned = Math.floor(currentQuiz.reward * 0.7);
    } else if (percentage >= 40) {
      tokensEarned = Math.floor(currentQuiz.reward * 0.5);
    }

    if (tokensEarned > 0) {
      updateWallet({ tokens: tokensEarned });
    }

    setCompletedQuizzes(prev => [...prev, {
      ...currentQuiz,
      score: finalScore,
      percentage,
      tokensEarned,
      completedAt: new Date().toISOString()
    }]);
  }, [currentQuiz, updateWallet]);

  const handleNextQuestion = useCallback(() => {
    const isCorrect = selectedAnswer === currentQuiz.questionList[currentQuestion].correct;
    const newUserAnswers = [...userAnswers, {
      question: currentQuestion,
      selected: selectedAnswer,
      correct: currentQuiz.questionList[currentQuestion].correct,
      isCorrect
    }];
    setUserAnswers(newUserAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < currentQuiz.questionList.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(currentQuiz.timePerQuestion);
    } else {
      completeQuiz(newUserAnswers);
    }
  }, [selectedAnswer, currentQuiz, currentQuestion, userAnswers, score, completeQuiz]);

  useEffect(() => {
    let timer;
    if (currentQuiz && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentQuiz, quizCompleted, handleNextQuestion]);

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(quiz.timePerQuestion);
    setQuizCompleted(false);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };


  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'medium': return 'text-orange-400 bg-orange-900/30 border-orange-500/30';
      case 'hard': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-display text-white mb-4">
            Health Quiz Challenge
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your health knowledge and earn tokens! Complete quizzes on various health topics 
            and learn while you earn rewards for your wellness journey.
          </p>
        </motion.div>

        {!currentQuiz ? (
          <>
            {/* Quiz Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Available Quizzes</h2>
                  {quizzes.map((quiz, index) => (
                    <TiltCard
                      key={quiz.id}
                      className="w-full"
                      tiltIntensity={12}
                      glowColor="from-cyan-400 via-purple-500 to-pink-500"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                              <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                {quiz.difficulty}
                              </div>
                            </div>
                            <p className="text-gray-300 mb-4">{quiz.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <FaQuestionCircle />
                                <span>{quiz.questions} questions</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaClock />
                                <span>{quiz.timePerQuestion}s per question</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaCoins className="text-yellow-400" />
                                <span>Up to {quiz.reward} tokens</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => startQuiz(quiz)}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                          >
                            <FaPlay />
                            <span>Start Quiz</span>
                          </button>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <TiltCard className="w-full" glowColor="from-blue-400 via-cyan-500 to-teal-500">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Quizzes Completed</span>
                        <span className="font-bold text-cyan-400">{completedQuizzes.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Tokens Earned</span>
                        <span className="font-bold text-green-400">
                          {completedQuizzes.reduce((sum, quiz) => sum + quiz.tokensEarned, 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Average Score</span>
                        <span className="font-bold text-purple-400">
                          {completedQuizzes.length > 0 
                            ? Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / completedQuizzes.length)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* Recent Completions */}
                {completedQuizzes.length > 0 && (
                  <TiltCard className="w-full" glowColor="from-green-400 via-emerald-500 to-teal-500">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Completions</h3>
                      <div className="space-y-3">
                        {completedQuizzes.slice(-3).map((quiz, index) => (
                          <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <h4 className="font-medium text-white text-sm">{quiz.title}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">{quiz.percentage}% score</span>
                              <span className="text-xs text-green-400">+{quiz.tokensEarned} tokens</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                )}

                {/* Tips */}
                <TiltCard className="w-full" glowColor="from-yellow-400 via-orange-500 to-red-500">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Health Quiz Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Read questions carefully before answering</li>
                      <li>• Higher scores earn more tokens</li>
                      <li>• Take your time but watch the timer</li>
                      <li>• Learn from explanations after each quiz</li>
                      <li>• Complete daily quizzes for bonus rewards</li>
                    </ul>
                  </div>
                </TiltCard>
              </div>
            </div>
          </>
        ) : (
          /* Quiz Interface */
          <div className="max-w-4xl mx-auto">
            {!quizCompleted ? (
              <TiltCard className="w-full" glowColor="from-indigo-400 via-purple-500 to-pink-500">
                <div className="p-8">
                  {/* Quiz Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentQuiz.title}</h2>
                      <p className="text-gray-300">Question {currentQuestion + 1} of {currentQuiz.questionList.length}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-orange-400" />
                        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gray-300'}`}>
                          {timeLeft}s
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaTrophy className="text-yellow-400" />
                        <span className="font-bold text-gray-300">{score}/{currentQuestion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / currentQuiz.questionList.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-6">
                      {currentQuiz.questionList[currentQuestion].question}
                    </h3>
                    <div className="space-y-3">
                      {currentQuiz.questionList[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                            selectedAnswer === index
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                              : 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === index ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'
                            }`}>
                              {selectedAnswer === index && <div className="w-2 h-2 bg-gray-900 rounded-full"></div>}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-between">
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Exit Quiz
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      {currentQuestion + 1 === currentQuiz.questionList.length ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                </div>
              </TiltCard>
            ) : (
              /* Quiz Results */
              <TiltCard className="w-full" glowColor="from-green-400 via-emerald-500 to-cyan-500">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-xl text-gray-300">{currentQuiz.title}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <FaCheckCircle className="text-3xl text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">{score}</div>
                      <div className="text-sm text-gray-300">Correct Answers</div>
                    </div>
                    <div className="text-center p-6 bg-green-500/20 rounded-lg border border-green-500/30">
                      <FaStar className="text-3xl text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round((score / currentQuiz.questionList.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-300">Score</div>
                    </div>
                    <div className="text-center p-6 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <FaCoins className="text-3xl text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-400">
                        {completedQuizzes[completedQuizzes.length - 1]?.tokensEarned || 0}
                      </div>
                      <div className="text-sm text-gray-300">Tokens Earned</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => startQuiz(currentQuiz)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg flex items-center space-x-2 transition-all duration-300"
                    >
                      <FaRedo />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Back to Quizzes
                    </button>
                  </div>
                </div>
              </TiltCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthQuiz;
