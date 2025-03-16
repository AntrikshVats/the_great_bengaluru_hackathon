from flask import Flask, jsonify, request
import pandas as pd
import requests
import time

app = Flask(__name__)

# Load CSV and create data dictionary
csv_file = "for_dictionary.csv"

try:
    df = pd.read_csv(csv_file)
    # Normalize ward names: strip spaces & lowercase for consistency
    data_dict = {k.strip().lower(): v for k, v in df.set_index("ward_name").T.to_dict("list").items()}
except FileNotFoundError:
    print(f"Error: CSV file '{csv_file}' not found.")
    data_dict = {}

# External API URL
EXTERNAL_API_URL = "https://revahackathon-production.up.railway.app/points"

# Set headers for JSON data
headers = {
    "Content-Type": "application/json"
}


@app.route('/get_data/<ward>', methods=['GET'])
def get_data(ward):
    # Normalize input (strip spaces & convert to lowercase)
    ward = ward.strip().lower()

    if ward not in data_dict:
        return jsonify({"error": f"Ward '{ward}' not found"}), 404  # Return proper error message

    # Retrieve data safely
    tosend = data_dict[ward]

    # Ensure the data has at least 5 values
    if len(tosend) < 5:
        return jsonify({"error": f"Incomplete data for '{ward}'"}), 500

    payload = {
        "a": tosend[0],
        "b": tosend[1],
        "c": tosend[2],
        "d": tosend[3],
        "e": tosend[4],
    }

    # Retry mechanism for API call
    MAX_RETRIES = 3
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(EXTERNAL_API_URL, json=payload, headers=headers)
            response.raise_for_status()  # Raise error for HTTP issues (4xx, 5xx)
            return jsonify(response.json())
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2)  # Wait before retrying

    return jsonify({"error": "Failed to connect to external API after multiple attempts"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

