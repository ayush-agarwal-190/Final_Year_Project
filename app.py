from flask import Flask, request, render_template, render_template_string
import pandas as pd
import joblib

app = Flask(__name__)

# Load prediction model and dataset
model = joblib.load("./models/prediction_model.pkl")
df = pd.read_csv('./data/processed_medicine_data.csv')

# ---------------------- Main Entry Page ----------------------
@app.route('/')
def main():
    return render_template("main.html")

# ---------------------- Health Prediction ----------------------
@app.route('/predict-form')
def form():
    return render_template("prediction.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = {
            'Age': int(request.form['Age']),
            'Heart_Rate_bpm': int(request.form['Heart_Rate_bpm']),
            'Body_Temperature_C': float(request.form['Body_Temperature_C']),
            'Oxygen_Saturation_%': float(request.form['Oxygen_Saturation_%']),
            'Body ache': int(request.form.get('Body ache', 0)),
            'Cough': int(request.form.get('Cough', 0)),
            'Fatigue': int(request.form.get('Fatigue', 0)),
            'Fever': int(request.form.get('Fever', 0)),
            'Headache': int(request.form.get('Headache', 0)),
            'Runny nose': int(request.form.get('Runny nose', 0)),
            'Shortness of breath': int(request.form.get('Shortness of breath', 0)),
            'Sore throat': int(request.form.get('Sore throat', 0)),
            'Male': int(request.form.get('Male', 0)),
            'Female': int(request.form.get('Female', 0)),
        }

        input_df = pd.DataFrame([input_data])
        prediction = model.predict(input_df)
        diagnosis, severity, treatment = prediction[0]

        return render_template_string("""
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Prediction Result</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f8ff;
        margin: 0;
        padding: 40px;
        display: flex;
        justify-content: center;
      }

      .container {
        background-color: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
      }

      h2 {
        color: #1e3a8a;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        margin: 0.8rem 0;
        line-height: 1.5;
      }

      strong {
        color: #111827;
      }

      a {
        display: inline-block;
        margin-top: 1.5rem;
        text-decoration: none;
        background-color: #2563eb;
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        transition: background-color 0.3s ease;
      }

      a:hover {
        background-color: #1e40af;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Prediction Result:</h2>
      <p><strong>Diagnosis:</strong> {{ diagnosis }}</p>
      <p><strong>Severity:</strong> {{ severity }}</p>
      <p><strong>Treatment Plan:</strong> {{ treatment }}</p>
      <a href="/">← Back to Home</a>
    </div>
  </body>
</html>
""", diagnosis=diagnosis, severity=severity, treatment=treatment)


    except Exception as e:
        return f"Error: {str(e)}"

# ---------------------- Medicine Dataset Features ----------------------
@app.route('/search')
def search():
    name = request.args.get("name", "")
    result = df[df['Medicine Name'].str.lower() == name.lower()]
    
    if result.empty:
        return "Medicine not found."

    medicine_info = result.iloc[0].to_dict()
    alternatives = df[(df['Composition'] == medicine_info['Composition']) & 
                      (df['Medicine Name'] != medicine_info['Medicine Name'])]

    return render_template("results.html", medicine=medicine_info, alternatives=alternatives.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)
