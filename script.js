let correctCount = 0;
let wrongCount = 0;

function showSection(section) {
    document.getElementById('previous').style.display = 'none';
    document.getElementById('test').style.display = 'none';
    document.getElementById(section).style.display = 'block';
    document.getElementById('score').style.display = 'none';
}

function loadQuestions(subject, section) {
    fetch(`${subject}_previous_year.json`)
        .then(response => response.json())
        .then(data => {
            const questions = data[subject];
            displayQuestions(questions, 'question-container');
        });
}

function loadTestRemember(subject, chapter, section) {
    if (chapter === 'allChapters') {
        loadAllChapters(subject, section);
    } else {
        fetch(`${subject}_${chapter}.json`)
            .then(response => response.json())
            .then(data => {
                const questions = data;
                displayQuestions(questions, `${section}-container`);
            });
    }
}

function loadAllChapters(subject, section) {
    const chapters = ['chapter1', 'chapter2']; // List all chapter names
    const promises = chapters.map(chapter => fetch(`${subject}_${chapter}.json`).then(response => response.json()));
    
    Promise.all(promises)
        .then(results => {
            const allQuestions = results.flat();
            displayQuestions(allQuestions, `${section}-container`);
        });
}

function displayQuestions(questions, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    questions.sort(() => 0.5 - Math.random()); // Shuffle the questions randomly

    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        // Add question number and text
        const questionText = `<p>${index + 1}. ${q.question}</p>`;
        questionElement.innerHTML = questionText;

        // Display options with labels (A, B, C, D)
        q.options.forEach((option, optIndex) => {
            const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
            const button = document.createElement('button');
            button.innerHTML = `${optionLabel}. ${option}`;
            button.onclick = () => handleAnswer(optIndex, q.answer, button, questionElement);
            button.classList.add('option-button'); // New class for option buttons
            questionElement.appendChild(button);
        });

        container.appendChild(questionElement);
    });

    document.getElementById('score').style.display = 'block';

    // Re-render MathJax
  MathJax.typesetPromise();
}

function handleAnswer(selected, correct, button, questionElement) {
    const buttons = questionElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true); // Disable all options after answering

    if (selected === correct) {
        button.classList.add('correct'); // Add correct class to the right answer
        correctCount++;
    } else {
        button.classList.add('wrong'); // Mark wrong answer
        buttons[correct].classList.add('correct'); // Highlight the correct option
        wrongCount++;
    }

    updateScore();
}

function updateScore() {
    document.getElementById('correct-count').innerText = correctCount;
    document.getElementById('wrong-count').innerText = wrongCount;
}
