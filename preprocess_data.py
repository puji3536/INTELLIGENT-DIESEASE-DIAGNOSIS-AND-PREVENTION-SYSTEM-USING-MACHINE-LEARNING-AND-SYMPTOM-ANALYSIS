import pandas as pd
import json

# Load your dataset
df = pd.read_csv("train.csv")

# Extract unique symptoms
symptom_columns = [col for col in df.columns if "Symptom" in col]
unique_symptoms = set()
for col in symptom_columns:
    unique_symptoms.update(df[col].dropna().unique())

# Convert to JSON for frontend dropdown
with open("symptoms.json", "w") as f:
    json.dump(sorted(unique_symptoms), f)

# Save the disease information for prediction output
df.to_json("disease_info.json", orient="records")
