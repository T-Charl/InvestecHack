import requests
from botbuilder.core import BotFrameworkAdapter, BotFrameworkAdapterSettings, TurnContext
from botbuilder.schema import Activity
import asyncio

# Bot Framework settings
settings = BotFrameworkAdapterSettings("YOUR_APP_ID", "YOUR_APP_PASSWORD")
adapter = BotFrameworkAdapter(settings)

# Investec API settings
INVESTEC_API_URL = "https://team2.sandboxpay.co.za"
ACCESS_TOKEN = "{{token}}"

# Function to get account balance
def get_account_balance():
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.get(f"{INVESTEC_API_URL}/za/pb/v1/accounts", headers=headers)
    if response.status_code == 200:
        accounts = response.json()["data"]["accounts"]
        # Assuming you want the balance of the first account
        balance = accounts[0]["balance"]["available"]
        return balance
    else:
        return None

# Function to get spending information
def get_spending_info():
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.get(f"{INVESTEC_API_URL}/za/pb/v1/accounts/transactions", headers=headers)
    if response.status_code == 200:
        transactions = response.json()["data"]["transactions"]
        # Calculate total spending for the current month
        total_spent = sum(txn["amount"] for txn in transactions if txn["type"] == "DEBIT")
        return total_spent
    else:
        return None

# Bot class
class BankingBot:
    async def on_turn(self, turn_context: TurnContext):
        if turn_context.activity.type == "message":
            user_message = turn_context.activity.text
            # Process user message and respond
            if "balance" in user_message.lower():
                balance = get_account_balance()
                if balance is not None:
                    await turn_context.send_activity(f"Your current balance is ${balance}.")
                else:
                    await turn_context.send_activity("Sorry, I couldn't fetch your balance at the moment.")
            elif "spending" in user_message.lower():
                spending = get_spending_info()
                if spending is not None:
                    await turn_context.send_activity(f"You have spent ${spending} this month.")
                else:
                    await turn_context.send_activity("Sorry, I couldn't fetch your spending information at the moment.")
            else:
                await turn_context.send_activity("I'm here to help with your banking needs!")

# Instantiate the bot
bot = BankingBot()

# Function to handle messages
async def handle_messages(activity, auth_header):
    await adapter.process_activity(activity, auth_header, bot.on_turn)