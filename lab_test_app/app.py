from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
import json
import os

app = Flask(__name__)

DATA_FILE = 'lab_tests.json'

# Load tests from file
def load_tests():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Save tests to file
def save_tests(tests):
    with open(DATA_FILE, 'w') as f:
        json.dump(tests, f, indent=4)

lab_tests = load_tests()

@app.route('/')
def dashboard():
    return render_template('index.html', lab_tests=lab_tests)

@app.route('/add', methods=['POST'])
def add():
    new_test = {
        'id': len(lab_tests) + 1,
        'patient_name': request.form['patient_name'],
        'test_name': request.form['test_name'],
        'result': request.form['result'],
        'status': request.form['status'],
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    lab_tests.append(new_test)
    save_tests(lab_tests)
    return redirect(url_for('dashboard'))

@app.route('/delete/<int:test_id>')
def delete(test_id):
    global lab_tests
    lab_tests = [test for test in lab_tests if test['id'] != test_id]
    save_tests(lab_tests)
    return redirect(url_for('dashboard'))

@app.route('/view/<int:test_id>')
def view(test_id):
    test = next((t for t in lab_tests if t['id'] == test_id), None)
    return render_template('view.html', test=test)

@app.route('/edit/<int:test_id>', methods=['GET', 'POST'])
def edit(test_id):
    test = next((t for t in lab_tests if t['id'] == test_id), None)
    if request.method == 'POST':
        test['patient_name'] = request.form['patient_name']
        test['test_name'] = request.form['test_name']
        test['result'] = request.form['result']
        test['status'] = request.form['status']
        save_tests(lab_tests)
        return redirect(url_for('dashboard'))
    return render_template('edit.html', test=test)

if __name__ == '__main__':
    app.run(debug=True, port=5003)

"""
Features:
1. Dashboard to view all lab tests
2. Add new test records
3. View test details
4. Edit test records
5. Delete test records
6. Store data persistently in JSON
7. Responsive UI with Bootstrap
8. Timestamp included with each test
9. Runs on port 5003
"""
