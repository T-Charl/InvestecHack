from flask import Flask, jsonify, request
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import google.generativeai as genai
from flask_socketio import SocketIO
from dotenv import load_dotenv
import requests
import os

app = Flask(__name__)
socketio = SocketIO(app)
CORS(app)


load_dotenv()

key = os.getenv("GEMINI_API")

app = Flask(__name__)

# Categories and their keywords
categories = {
    "Groceries": ["supermarket", "grocery", "store"],
    "Entertainment": ["movie", "cinema", "concert", "entertainment"],
    "Dining": ["restaurant", "dining", "cafe", "food"],
    "Utilities": ["electricity", "water", "gas", "utility"],
    "Transfer": ["transfer", "api transfer"]
}

category_limits = {}
category_spending = {}

def categorize_transaction(transaction):
    description = transaction["description"].lower()
    transaction_type = transaction["transactionType"].lower()
    
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in description or keyword in transaction_type:
                return category
    return "Other"

# Fetch transactions from the API
def fetch_transactions(account_id, token):
    url = f"https://team2.sandboxpay.co.za/za/pb/v1/accounts/{account_id}/transactions"
    headers = {
        'Authorization': f"Bearer {token}",
        'Accept': "application/json"
    }
    response = requests.get(url, headers=headers)
    return response.json()["data"]["transactions"]

# Fetch account balance from the API
def fetch_balance(account_id, token):
    url = f"https://team2.sandboxpay.co.za/za/pb/v1/accounts/{account_id}/balance"
    headers = {
        'Authorization': f"Bearer {token}",
        'Accept': "application/json"
    }
    response = requests.get(url, headers=headers)
    return response.json()["data"]

# GET categorize transactions
@app.route('/transactions/<account_id>', methods=['GET'])
def get_transactions(account_id):
    token = request.headers.get('Authorization').split(" ")[1]
    transactions = fetch_transactions(account_id, token)
    categorized_transactions = []

    for transaction in transactions:
        category = categorize_transaction(transaction)
        transaction["category"] = category
        
        # Update spending for the category
        if category in category_spending:
            category_spending[category] += float(transaction["amount"])
        else:
            category_spending[category] = float(transaction["amount"])
        
        # Check if the spending limit is exceeded
        if category in category_limits and category_spending[category] > category_limits[category]:
            transaction["status"] = "LIMIT EXCEEDED"
        else:
            transaction["status"] = "APPROVED"
        
        categorized_transactions.append(transaction)

    return jsonify(categorized_transactions)


# POST set category limits
@app.route('/set_limit', methods=['POST'])
def set_limit():
    data = request.json
    category = data.get("category")
    limit = data.get("limit")
    
    if category in categories:
        category_limits[category] = float(limit)
        return jsonify({"message": f"Limit set for {category} category"}), 200
    else:
        return jsonify({"message": "Invalid category"}), 400
    
# Set up the API key
genai.configure(api_key=key)

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# set up the model
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="\"You are an Investec Transaction Analysis Chatbot provides valuable insights into users' financial habits, helping them identify areas where they may be overspending and offering practical solutions for better money management. For instance, after reviewing the transaction history, the bot might highlight, \"You spent 40% more on dining this month compared to last. Consider setting a weekly dining budget to cut down on excess spending.\" It also offers personalized tips, such as choosing more affordable alternatives for recurring purchases or services. Beyond spending insights, the chatbot delivers tailored recommendations for saving and investing. After identifying areas where users can cut back, it suggests strategies for saving, such as canceling unused subscriptions or adjusting spending habits in certain categories. Based on the savings, the bot proposes Investec’s financial products, like high-yield savings accounts or low-risk bonds, and even provides automated investment advice tailored to individual spending and saving patterns. For long-term financial growth, the chatbot helps users set aside a percentage of monthly savings into flexible investment accounts, integrating Investec’s wealth management services to create a personalized financial growth plan aligned with their goals. You should not ask for transactions at all. Transaction history will be provided through the backend of the application. Interact with the users as if you have the insight that are required. Keep responses short and simple\"",
)
# Start a chat session
chat_session = model.start_chat(history=[], enable_automatic_function_calling=True)


# Get the response from the model
def get_response(input_text):

    response = chat_session.send_message(input_text)
    return response.text



@app.route('/chatbot', methods=['POST'])
def model():
    try:
        # Get user input from the request
        user_input = request.get_json()
        print(f"\n\nUser input: {user_input}\n\n")

        # Extract the message from the JSON (assuming it's structured as {'message': '...'})
        message = user_input.get('message')
        response = get_response(message)

        # Return the assistant message as JSON
        return jsonify({'message': response})

    except Exception as e:
        print(f"Error in model: {e}")
        return jsonify({'error': "An error occurred"}), 500




@app.route('/get_limit/<category>', methods=['GET'])
def get_limit(category):
    if category in category_limits:
        return jsonify({"category": category, "limit": category_limits[category]}), 200
    else:
        return jsonify({"message": "Category limit not set or invalid category"}), 400

@app.route('/balance/<account_id>', methods=['GET'])
def get_balance(account_id):
    token = request.headers.get('Authorization').split(" ")[1]
    balance = fetch_balance(account_id, token)
    return jsonify(balance)

if __name__ == '__main__':
    # socketio.run(app, debug=True)
    app.run(debug=True)

