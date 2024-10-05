import json

cats = {
      "groceries": 5000,
      "transport": 2000,
      "shopping": 3000,
      "savings_entertainment": 4000
    }


def set_limit(category, amount):
    if category in cats:
        cats[category] = amount
    else:
        print(f"Category '{category}' does not exist in the dictionary.")
        
set_limit("groceries", 600)
