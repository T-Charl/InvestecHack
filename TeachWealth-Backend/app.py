from flask import Flask, jsonify, request
import requests

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

if __name__ == '__main__':
    app.run(debug=True)
