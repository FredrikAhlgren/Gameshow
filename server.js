const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Game state
let gameState = {
  teams: [
    { id: 1, name: 'Team Blue', score: 0, color: '#3b82f6', icon: '🔵', active: true, picture: null },
    { id: 2, name: 'Team Red', score: 0, color: '#ef4444', icon: '🔴', active: true, picture: null },
    { id: 3, name: 'Team Green', score: 0, color: '#10b981', icon: '🟢', active: true, picture: null }
  ],
  categories: ['Science', 'History', 'Pop Culture', 'Geography', 'Sports'],
  questions: initializeQuestions(),
  currentQuestion: null,
  buzzerQueue: [],
  buzzerLocked: false,
  gameStarted: false,
  answerHistory: []
};

function initializeQuestions() {
  const defaultQuestions = {
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
  return defaultQuestions;
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send current game state to newly connected client
  socket.emit('gameState', gameState);

  // Handle buzzer press
  socket.on('buzzer', (data) => {
    if (!gameState.buzzerLocked && gameState.currentQuestion) {
      gameState.buzzerLocked = true;
      gameState.buzzerQueue.push({
        teamId: data.teamId,
        teamName: data.teamName,
        playerName: data.playerName,
        timestamp: Date.now()
      });
      io.emit('buzzerPressed', gameState.buzzerQueue[0]);
      console.log('Buzzer pressed by:', data.teamName, data.playerName);
    }
  });

  // Handle question selection
  socket.on('selectQuestion', (data) => {
    const { category, value } = data;
    const question = gameState.questions[category]?.find(q => q.value === value && !q.answered);

    if (question) {
      gameState.currentQuestion = {
        category,
        value,
        question: question.question,
        answer: question.answer,
        type: question.type
      };
      gameState.buzzerLocked = false;
      gameState.buzzerQueue = [];
      io.emit('questionSelected', gameState.currentQuestion);
      console.log('Question selected:', category, value);
    }
  });

  // Handle answer judgment
  socket.on('judgeAnswer', (data) => {
    const { correct, teamId, points, playerResponse } = data;

    if (gameState.currentQuestion) {
      const team = gameState.teams.find(t => t.id === teamId);

      if (team) {
        if (correct) {
          team.score += points;
        }

        // Add to history
        gameState.answerHistory.unshift({
          teamName: team.name,
          teamColor: team.color,
          category: gameState.currentQuestion.category,
          value: gameState.currentQuestion.value,
          correct: correct,
          points: correct ? points : 0,
          timestamp: Date.now()
        });

        // Mark question as answered
        const question = gameState.questions[gameState.currentQuestion.category]?.find(
          q => q.value === gameState.currentQuestion.value
        );
        if (question) {
          question.answered = true;
        }

        io.emit('answerJudged', {
          correct,
          teamId,
          teamName: team.name,
          points: correct ? points : 0,
          newScore: team.score
        });

        io.emit('gameState', gameState);
      }
    }

    // Reset for next question
    gameState.currentQuestion = null;
    gameState.buzzerLocked = false;
    gameState.buzzerQueue = [];
    io.emit('resetBuzzer');
  });

  // Handle team updates
  socket.on('updateTeams', (teams) => {
    gameState.teams = teams;
    io.emit('gameState', gameState);
    console.log('Teams updated');
  });

  // Handle question updates
  socket.on('updateQuestions', (data) => {
    gameState.categories = data.categories;
    gameState.questions = data.questions;
    io.emit('gameState', gameState);
    console.log('Questions updated');
  });

  // Handle manual score adjustment
  socket.on('adjustScore', (data) => {
    const { teamId, points } = data;
    const team = gameState.teams.find(t => t.id === teamId);
    if (team) {
      team.score += points;
      io.emit('gameState', gameState);
      console.log('Score adjusted for', team.name, ':', points);
    }
  });

  // Handle closing question popup
  socket.on('closeQuestion', () => {
    // Don't reset current question, just notify
    io.emit('questionClosed');
  });

  // Reset game
  socket.on('resetGame', () => {
    gameState.questions = initializeQuestions();
    gameState.currentQuestion = null;
    gameState.buzzerQueue = [];
    gameState.buzzerLocked = false;
    gameState.answerHistory = [];
    gameState.teams.forEach(team => {
      team.score = 0;
    });
    io.emit('gameState', gameState);
    console.log('Game reset');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/big-screen', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'big-screen.html'));
});

app.get('/buzzer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buzzer.html'));
});

app.get('/judge', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'judge.html'));
});

server.listen(PORT, () => {
  console.log(`🎄 Christmas Game Show Server running on http://localhost:${PORT}`);
  console.log(`📺 Big Screen: http://localhost:${PORT}/big-screen`);
  console.log(`📱 Mobile Buzzer: http://localhost:${PORT}/buzzer`);
  console.log(`⚖️  Judge Panel: http://localhost:${PORT}/judge`);
});
