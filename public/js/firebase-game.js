// Firebase Game State Management
// This file handles all game state operations using Firebase Realtime Database

// Initialize default game state
const defaultGameState = {
  teams: [
    { id: 1, name: 'Team Blue', score: 0, color: '#3b82f6', icon: '🔵', active: true, picture: null },
    { id: 2, name: 'Team Red', score: 0, color: '#ef4444', icon: '🔴', active: true, picture: null },
    { id: 3, name: 'Team Green', score: 0, color: '#10b981', icon: '🟢', active: true, picture: null }
  ],
  categories: ['Science', 'History', 'Pop Culture', 'Geography', 'Sports'],
  questions: initializeQuestions(),
  currentQuestion: null,
  currentBuzzer: null,
  buzzerLocked: false,
  answerHistory: [],
  lastUpdate: Date.now()
};

function initializeQuestions() {
  return {
    'Science': [
      { value: 100, question: 'This planet is known as the Red Planet', answer: 'What is Mars?', type: 'standard', answered: false },
      { value: 200, question: 'H2O is the chemical formula for this substance', answer: 'What is water?', type: 'standard', answered: false },
      { value: 300, question: 'This force keeps planets in orbit around the sun', answer: 'What is gravity?', type: 'standard', answered: false },
      { value: 400, question: 'The smallest unit of life is called this', answer: 'What is a cell?', type: 'standard', answered: false },
      { value: 500, question: 'This scientist developed the theory of relativity', answer: 'Who is Einstein?', type: 'standard', answered: false }
    ],
    'History': [
      { value: 100, question: 'This wall fell in 1989, reuniting Germany', answer: 'What is the Berlin Wall?', type: 'standard', answered: false },
      { value: 200, question: 'The first president of the United States', answer: 'Who is George Washington?', type: 'standard', answered: false },
      { value: 300, question: 'This year marked the signing of the Declaration of Independence', answer: 'What is 1776?', type: 'standard', answered: false },
      { value: 400, question: 'This empire was ruled by Julius Caesar', answer: 'What is the Roman Empire?', type: 'standard', answered: false },
      { value: 500, question: 'World War II ended in this year', answer: 'What is 1945?', type: 'standard', answered: false }
    ],
    'Pop Culture': [
      { value: 100, question: 'This streaming service is known for "Stranger Things"', answer: 'What is Netflix?', type: 'standard', answered: false },
      { value: 200, question: 'She sang "Bad Romance" and "Poker Face"', answer: 'Who is Lady Gaga?', type: 'standard', answered: false },
      { value: 300, question: 'This superhero team includes Iron Man and Captain America', answer: 'What is the Avengers?', type: 'standard', answered: false },
      { value: 400, question: 'The highest-grossing film of all time (as of 2023)', answer: 'What is Avatar?', type: 'standard', answered: false },
      { value: 500, question: 'This boy wizard attends Hogwarts School', answer: 'Who is Harry Potter?', type: 'standard', answered: false }
    ],
    'Geography': [
      { value: 100, question: 'The capital of France', answer: 'What is Paris?', type: 'standard', answered: false },
      { value: 200, question: 'This ocean is the largest', answer: 'What is the Pacific Ocean?', type: 'standard', answered: false },
      { value: 300, question: 'Mount Everest is located in this mountain range', answer: 'What is the Himalayas?', type: 'standard', answered: false },
      { value: 400, question: 'This river is the longest in the world', answer: 'What is the Nile?', type: 'standard', answered: false },
      { value: 500, question: 'The Great Barrier Reef is located off the coast of this country', answer: 'What is Australia?', type: 'standard', answered: false }
    ],
    'Sports': [
      { value: 100, question: 'This sport uses a puck and ice', answer: 'What is hockey?', type: 'standard', answered: false },
      { value: 200, question: 'The number of players on a basketball team on court', answer: 'What is 5?', type: 'standard', answered: false },
      { value: 300, question: 'This tennis tournament is held in Wimbledon', answer: 'What is Wimbledon Championships?', type: 'standard', answered: false },
      { value: 400, question: 'This athlete has won the most Olympic gold medals', answer: 'Who is Michael Phelps?', type: 'standard', answered: false },
      { value: 500, question: 'The Super Bowl is the championship game for this sport', answer: 'What is American football?', type: 'standard', answered: false }
    ]
  };
}

// Initialize game state if it doesn't exist
function initializeGameState() {
  return gameStateRef.once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      return gameStateRef.set(defaultGameState);
    }
  });
}

// Listen for game state changes
function onGameStateChange(callback) {
  gameStateRef.on('value', (snapshot) => {
    const state = snapshot.val();
    if (state) {
      callback(state);
    }
  });
}

// Update specific parts of game state
function updateGameState(updates) {
  updates.lastUpdate = Date.now();
  return gameStateRef.update(updates);
}

// Question operations
function selectQuestion(category, value) {
  return gameStateRef.once('value').then((snapshot) => {
    const state = snapshot.val();
    const question = state.questions[category]?.find(q => q.value === value && !q.answered);

    if (question) {
      return updateGameState({
        currentQuestion: {
          category,
          value,
          question: question.question,
          answer: question.answer,
          type: question.type,
          selectedAt: Date.now()
        },
        buzzerLocked: false,
        currentBuzzer: null
      });
    }
  });
}

function closeQuestion() {
  return updateGameState({
    currentQuestion: null,
    currentBuzzer: null,
    buzzerLocked: false
  });
}

// Buzzer operations
function pressBuzzer(teamId, teamName, playerName) {
  return gameStateRef.once('value').then((snapshot) => {
    const state = snapshot.val();

    // Only allow buzzer if not locked and question is active
    if (!state.buzzerLocked && state.currentQuestion) {
      return updateGameState({
        buzzerLocked: true,
        currentBuzzer: {
          teamId,
          teamName,
          playerName,
          timestamp: Date.now()
        }
      });
    }
  });
}

function resetBuzzer() {
  return updateGameState({
    buzzerLocked: false,
    currentBuzzer: null
  });
}

// Scoring operations
function judgeAnswer(correct, teamId, points) {
  return gameStateRef.once('value').then((snapshot) => {
    const state = snapshot.val();
    const teams = [...state.teams];
    const team = teams.find(t => t.id === teamId);

    if (team && state.currentQuestion) {
      // Update team score
      if (correct) {
        team.score += points;
      }

      // Mark question as answered
      const questions = JSON.parse(JSON.stringify(state.questions));
      const categoryQuestions = questions[state.currentQuestion.category];
      const question = categoryQuestions?.find(q => q.value === state.currentQuestion.value);
      if (question) {
        question.answered = true;
      }

      // Add to history
      const history = state.answerHistory || [];
      history.unshift({
        teamName: team.name,
        teamColor: team.color,
        category: state.currentQuestion.category,
        value: state.currentQuestion.value,
        correct: correct,
        points: correct ? points : 0,
        timestamp: Date.now()
      });

      // Keep only last 20 history items
      if (history.length > 20) {
        history.length = 20;
      }

      return updateGameState({
        teams: teams,
        questions: questions,
        answerHistory: history,
        currentQuestion: null,
        currentBuzzer: null,
        buzzerLocked: false
      });
    }
  });
}

function adjustScore(teamId, points) {
  return gameStateRef.once('value').then((snapshot) => {
    const state = snapshot.val();
    const teams = [...state.teams];
    const team = teams.find(t => t.id === teamId);

    if (team) {
      team.score += points;
      return updateGameState({ teams: teams });
    }
  });
}

// Team operations
function updateTeams(teams) {
  return updateGameState({ teams: teams });
}

// Question/Category operations
function updateQuestions(categories, questions) {
  return updateGameState({
    categories: categories,
    questions: questions
  });
}

// Reset game
function resetGame() {
  const resetState = {
    ...defaultGameState,
    teams: defaultGameState.teams.map(t => ({ ...t, score: 0 })),
    questions: initializeQuestions(),
    currentQuestion: null,
    currentBuzzer: null,
    buzzerLocked: false,
    answerHistory: [],
    lastUpdate: Date.now()
  };

  // Preserve custom team configuration if exists
  return gameStateRef.once('value').then((snapshot) => {
    const state = snapshot.val();
    if (state && state.teams) {
      resetState.teams = state.teams.map(t => ({ ...t, score: 0 }));
    }
    return gameStateRef.set(resetState);
  });
}

// Connection status
function onConnectionChange(callback) {
  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', (snapshot) => {
    callback(snapshot.val() === true);
  });
}
