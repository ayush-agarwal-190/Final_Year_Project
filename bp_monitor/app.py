from flask import Flask, render_template, request, redirect, jsonify
import json
from datetime import datetime

app = Flask(__name__)
DATA_FILE = 'data.json'

# Load or initialize data
def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        date = request.form['date']
        systolic = int(request.form['systolic'])
        diastolic = int(request.form['diastolic'])

        entry = {
            'date': date,
            'systolic': systolic,
            'diastolic': diastolic
        }

        data = load_data()
        data.append(entry)
        data.sort(key=lambda x: datetime.strptime(x['date'], "%Y-%m-%d"))
        save_data(data)
        return redirect('/graph')

    return render_template('index.html')

@app.route('/graph')
def graph():
    data = load_data()
    return render_template('graph.html', data=data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
