document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/admin') {
        loadQuestions();

        document.getElementById('add-question').onclick = function() {
            const questionText = document.getElementById('question').value;
            const options = document.getElementById('options').value.split(',');
            const qtype = document.getElementById('question-type').value;

            fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: questionText, options: options, type: qtype })
            }).then(response => {
                if (response.ok) {
                    alert('Question added!');
                    loadQuestions();
                }
            });
        };
    } else if (window.location.pathname === '/survey') {
        loadSurveyQuestions();

        document.getElementById('submit-response').onclick = function() {
            const email = prompt('Please enter your email:');
            const responses = {};

            document.querySelectorAll('.question').forEach(q => {
                const questionText = q.querySelector('.question-text').innerText;
                const selectedOptions = Array.from(q.querySelectorAll('input:checked')).map(input => input.value);
                responses[questionText] = selectedOptions;
            });

            fetch('/api/responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, responses: responses })
            }).then(response => {
                if (response.ok) {
                    alert('Response submitted!');
                }
            });
        };
    }
});

function loadQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(data => {
            const questionList = document.getElementById('question-list');
            questionList.innerHTML = '';
            data.forEach((q, index) => {
                const li = document.createElement('li');
                li.innerText = `${index + 1}. ${q.text} (${q.type})`;
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete';
                deleteBtn.onclick = () => deleteQuestion(index);
                li.appendChild(deleteBtn);
                questionList.appendChild(li);
            });
        });
}

function deleteQuestion(index) {
    questions.splice(index, 1);
    loadQuestions();
}

function loadSurveyQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(data => {
            const questionsDiv = document.getElementById('questions');
            questionsDiv.innerHTML = '';
            data.forEach(q => {
                const questionContainer = document.createElement('div');
                questionContainer.classList.add('question');
                
                const questionText = document.createElement('div');
                questionText.classList.add('question-text');
                questionText.innerText = q.text;

                questionContainer.appendChild(questionText);
                
                if (q.type === 'multiple-choice') {
                    q.options.forEach(option => {
                        const optionLabel = document.createElement('label');
                        const optionInput = document.createElement('input');
                        optionInput.type = 'radio';
                        optionInput.name = q.text;
                        optionInput.value = option;
                        optionLabel.appendChild(optionInput);
                        optionLabel.appendChild(document.createTextNode(option));
                        questionContainer.appendChild(optionLabel);
                    });
                } else if (q.type === 'multiple-select') {
                    q.options.forEach(option => {
                        const optionLabel = document.createElement('label');
                        const optionInput = document.createElement('input');
                        optionInput.type = 'checkbox';
                        optionInput.value = option;
                        optionLabel.appendChild(optionInput);
                        optionLabel.appendChild(document.createTextNode(option));
                        questionContainer.appendChild(optionLabel);
                    });
                }

                questionsDiv.appendChild(questionContainer);
            });
        });
}
