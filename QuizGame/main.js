let Questions = [];
let currQuestion = 0;
let score = 0;
const ques = document.getElementById("ques");
const startScreen = document.getElementById("start-screen");
const quizSection = document.getElementById("quiz-section");

const apiUrls = {
  general: "https://opentdb.com/api.php?amount=10&category=9",
  sports: "https://opentdb.com/api.php?amount=10&category=21",
  videogames: "https://opentdb.com/api.php?amount=10&category=15",
  movies: "https://opentdb.com/api.php?amount=10&category=11",
};

function loadCategory(category) {
  startScreen.style.display = "none";
  quizSection.style.display = "grid";
  fetchQuestions(apiUrls[category]);
}

async function fetchQuestions(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to fetch the data`);
    }
    const data = await response.json();
    Questions = data.results;
    loadQues();
  } catch (error) {
    console.log(error);
    ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
  }
}

function loadQues() {
  if (Questions.length === 0) {
    ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
    return;
  }

  const opt = document.getElementById("opt");
  let currentQuestion = Questions[currQuestion].question;

  currentQuestion = currentQuestion
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/;/g, "")
    .replace(/&amp;/, "&");

  ques.innerText = currentQuestion;
  opt.innerHTML = "";

  const correctAnswer = Questions[currQuestion].correct_answer;
  const incorrectAnswers = Questions[currQuestion].incorrect_answers;
  const options = [correctAnswer, ...incorrectAnswers];
  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    option = option
      .replace(/"/g, '"')
      .replace(/&#039/g, "'")
      .replace(/&amp;/, "&")
      .replace(/&quot;/g, '"')
      .replace(/&eacute;/, "é");

    const choiceLabel = document.createElement("label");
    choiceLabel.classList.add("choice");
    choiceLabel.dataset.value = option;
    choiceLabel.textContent = option;
    choiceLabel.addEventListener("click", selectChoice);

    opt.appendChild(choiceLabel);
  });
}

function selectChoice(event) {
  const selectedAns = event.target.dataset.value;
  const correctAns = Questions[currQuestion].correct_answer;

  const choices = document.querySelectorAll(".choice");
  let correctChoice = null;

  choices.forEach((choice) => {
    if (choice.dataset.value === correctAns) {
      correctChoice = choice;
    }
  });

  choices.forEach((choice) => {
    choice.classList.remove("correct", "incorrect");
  });

  if (selectedAns === correctAns) {
    correctChoice.classList.add("correct");
    score++;
  } else {
    if (correctChoice) {
      correctChoice.classList.add("incorrect");
    }
  }

  setTimeout(() => {
    nextQuestion();
  }, 1000);
}

function loadScore() {
  const totalScore = document.getElementById("score");
  totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
}

function nextQuestion() {
  if (currQuestion < Questions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    document.getElementById("opt").style.display = "none";
    document.getElementById("ques").style.display = "none";
    loadScore();
  }
}

async function resetGame() {
  currQuestion = 0;
  score = 0;
  document.getElementById("score").innerHTML = "";
  document.getElementById("opt").innerHTML = "";
  document.getElementById("opt").style.display = "flex";
  document.getElementById("ques").style.display = "block";
  startScreen.style.display = "block";
  quizSection.style.display = "none";
  Questions = [];
}

document.addEventListener("DOMContentLoaded", () => {
  startScreen.style.display = "block";
  quizSection.style.display = "none";
});
