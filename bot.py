import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Token API Telegram bot
TOKEN = '7251647239:AAEyKqPnhEGm4mvAUbG9UhxdkdjXdnv344A'

# URL API sistem manajemen Wi-Fi
ROUTER_API_URL = 'http://192.168.0.1/api/'

def start(update: Update, context: CallbackContext):
    update.message.reply_text(
        'Hello! Use /createvoucher <amount> to generate a WiFi voucher. For example: /createvoucher 2000\n'
        'Use /checkstatus to check the router status.'
    )

def create_voucher(update: Update, context: CallbackContext):
    if len(context.args) != 1:
        update.message.reply_text('Usage: /createvoucher <amount>')
        return

    try:
        amount = int(context.args[0])
        duration_mapping = {
            2000: '1 hour',
            5000: '3 hours',
            10000: '6 hours',
            20000: '12 hours'
        }
        duration = duration_mapping.get(amount, 'Unknown duration')

        voucher_code = f'WIFI-{amount}-{duration}'

        # Simulate creating a voucher (Replace this with actual API call)
        # Example: Assuming there's an endpoint /create-voucher in the router API
        response = requests.post(f'{ROUTER_API_URL}/create-voucher', json={
            'voucher_code': voucher_code,
            'amount': amount,
            'duration': duration
        })

        if response.status_code == 200:
            qr_code_url = response.json().get('qr_code_url', '')
            update.message.reply_text(f'Voucher created successfully!')
            if qr_code_url:
                update.message.reply_photo(photo=qr_code_url)
        else:
            update.message.reply_text('Failed to create voucher.')

    except ValueError:
        update.message.reply_text('Invalid amount. Please enter a numeric value.')

def check_status(update: Update, context: CallbackContext):
    try:
        # Example: Assuming there's an endpoint /status in the router API
        response = requests.get(f'{ROUTER_API_URL}/status')
        if response.status_code == 200:
            status_info = response.json()  # Assuming the API returns JSON
            update.message.reply_text(f'Router Status: {status_info}')
        else:
            update.message.reply_text('Failed to retrieve status.')
    except requests.RequestException as e:
        update.message.reply_text(f'Error: {str(e)}')

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("createvoucher", create_voucher))
    dp.add_handler(CommandHandler("checkstatus", check_status))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
