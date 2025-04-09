import json
import pandas as pd
import joblib
import numpy as np
from flask import Flask, request, jsonify, render_template,request, redirect
import random
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# -------------------- Load Models and Data --------------------

# Load disease prediction model and vectorizer
model_path = os.path.join(os.path.dirname(__file__), "disease_prediction_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "symptom_vectorizer.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# Load JSON symptom and disease information
with open(os.path.join(os.path.dirname(__file__), "symptoms.json"), "r") as file:
    all_symptoms = json.load(file)

disease_df = pd.read_json(os.path.join(os.path.dirname(__file__), "disease_info.json"))

# Load hospital data (from CSV)
# Load hospital data (from CSV)
csv_path = os.path.join(os.path.dirname(__file__), "datasets", "maps-links.csv")

# Check if the file exists
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"CSV file not found at {csv_path}")

hospital_df = pd.read_csv(csv_path)



# -------------------- Routes --------------------

@app.route("/")
def home():
    return render_template("index.html")



@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        symptoms = data.get("symptoms", [])
        valid_symptoms = [sym for sym in symptoms if sym in all_symptoms]

        if not valid_symptoms:
            return jsonify({"error": "Invalid symptoms selected"}), 400

        symptoms_text = " ".join(valid_symptoms)
        input_vector = vectorizer.transform([symptoms_text])
        probabilities = model.predict_proba(input_vector)[0]
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        top_3_diseases = model.classes_[top_3_indices]

        results = []
        for disease in top_3_diseases:
            info = disease_df[disease_df["Disease"] == disease]
            if info.empty:
                continue
            info = info.iloc[0]
            results.append({
                "disease": disease,
                "probability": round(probabilities[top_3_indices][list(top_3_diseases).index(disease)] * 100, 2),
                "precautions": info.get("Precautions", "N/A"),
                "medications": info.get("Medications", "N/A"),
                "specialist": info.get("Specialist", "N/A"),
                "tests": info.get("Tests", "N/A"),
                "causes": info.get("Causes", "N/A"),
            })
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-symptoms")
def get_symptoms():
    return jsonify(all_symptoms)


# -------------------- Hospital Lookup Routes --------------------

@app.route("/get-diseases",methods=["GET"])
def get_diseases():
    diseases = hospital_df["Disease"].dropna().unique().tolist()
    return jsonify(diseases)
@app.route("/get-maps-links", methods=["GET"])
def get_maps_links():
    # Replace NaN values with None so JSON is valid.
    data = hospital_df.replace({np.nan: None}).to_dict(orient="records")
    return jsonify(data)


@app.route("/get-states", methods=["GET"])
def get_states():
    disease = request.args.get("disease")
    if not disease:
        return jsonify([])

    states = hospital_df[hospital_df["Disease"] == disease]["State"].dropna().unique().tolist()
    return jsonify(states)

@app.route("/get-districts", methods=["GET"])
def get_districts():
    state = request.args.get("state")
    if not state:
        return jsonify([])

    districts = hospital_df[hospital_df["State"] == state]["District"].dropna().unique().tolist()
    return jsonify(districts)


@app.route("/find-hospitals", methods=["GET"])
def find_hospitals():
    disease = request.args.get("disease", "").strip().lower()
    state = request.args.get("state", "").strip().lower()
    district = request.args.get("district", "").strip().lower()

    filtered_df = hospital_df[
        (hospital_df["Disease"].str.lower() == disease) &
        (hospital_df["State"].str.lower() == state) &
        (hospital_df["District"].str.lower() == district)
    ]

    hospitals = []
    for _, row in filtered_df.iterrows():
        if pd.notna(row["map1"]):
            hospitals.append({"name": "Hospital 1", "link": row["map1"], "register_link": "https://kranthijannu.github.io/disease-regi/"})
        if pd.notna(row["map2"]):
            hospitals.append({"name": "Hospital 2", "link": row["map2"], "register_link": "https://kranthijannu.github.io/disease-regi/"})
        if pd.notna(row["map3"]):
            hospitals.append({"name": "Hospital 3", "link": row["map3"], "register_link": "https://kranthijannu.github.io/disease-regi/"})
    return jsonify(hospitals)


@app.route("/find-hospital")
def find_hospital_page():
    return render_template("find-hospitals.html")
#-----------------------HSPTL1-Queue-----------#


if __name__ == "__main__":
    app.run(debug=True)  