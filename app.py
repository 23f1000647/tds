from flask import Flask, request, jsonify, render_template, redirect, url_for

app = Flask(__name__)

# In-memory storage for questions and responses
questions = []
responses = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions', methods=['GET', 'POST'])
def handle_questions():
    if request.method == 'POST':
        data = request.json
        question = data.get('question')
        options = data.get('options')
        qtype = data.get('type')
        questions.append({'text': question, 'options': options, 'type': qtype})
        return jsonify({'message': 'Question added!'}), 201

    return jsonify(questions)

@app.route('/api/responses', methods=['POST'])
def submit_response():
    email = request.json.get('email')
    user_responses = request.json.get('responses')
    responses[email] = user_responses
    return jsonify({'message': 'Response submitted!'}), 201

@app.route('/api/view-responses', methods=['GET'])
def view_responses():
    return jsonify(responses)

@app.route('/admin')
def admin():
    return render_template('admin.html', questions=questions)

@app.route('/survey')
def survey():
    return render_template('survey.html', questions=questions)

@app.route('/responses')
def responses_page():
    return render_template('responses.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    if email == "admin@ds.study.iitm.ac.in":
        return redirect(url_for('admin'))
    elif email.endswith('@ds.study.iitm.ac.in'):
        return redirect(url_for('survey'))
    else:
        return "Invalid email domain. Please use @ds.study.iitm.ac.in", 400

if __name__ == '__main__':
    app.run(debug=True)
