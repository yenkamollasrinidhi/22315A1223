from flask import Flask, jsonify, request
import requests
import time

app = Flask(__name__)


WINDOW_SIZE = 10
THIRD_PARTY_API = "https://9876"  
TIMEOUT = 0.5  


number_window = []

def fetch_number(qualifier):
    try:
        response = requests.get(f"{THIRD_PARTY_API}?type={qualifier}", timeout=TIMEOUT)
        response.raise_for_status()
        return response.json().get('number')
    except (requests.exceptions.RequestException, ValueError):
        return None

@app.route('/numbers/<qualifier>', methods=['GET'])
def get_numbers(qualifier):
    if qualifier not in {'p', 'f', 'e', 'r'}:
        return jsonify({"error": "Invalid qualifier"}), 400

    
    new_number = fetch_number(qualifier)
    
    if new_number is None:
        return jsonify({"error": "Failed to fetch number from third-party server"}), 500

    
    if new_number not in number_window:
        if len(number_window) >= WINDOW_SIZE:
            number_window.pop(0)  
        number_window.append(new_number)

    
    avg = sum(number_window) / len(number_window) if number_window else 0

    return jsonify({
        "windowPrevState": number_window[:-1],
        "windowCurrState": number_window,
        "numbers": number_window,
        "average": avg
    })

if __name__ == '__main__':
    app.run(port=9876)
