import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Token API Telegram bot
TOKEN = '7251647239:AAEyKqPnhEGm4mvAUbG9UhxdkdjXdnv344A'

# URL API sistem manajemen Wi-Fi
API_BASE_URL = 'https://flask-wifi-api.herokuapp.com/wifi'

def start(update: Update, context: CallbackContext):
    update.message.reply_text(
        'Hello! Use /createvoucher <amount> to generate a WiFi voucher. For example: /createvoucher 2000'
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

        # Call API to create the voucher
        response = requests.post(f'{API_BASE_URL}/create-voucher', json={
            'voucher_code': voucher_code,
            'amount': amount,
            'duration': duration
        })

        if response.status_code == 200:
            qr_code_url = response.json().get('qr_code_url')
            update.message.reply_text(f'Voucher created successfully!')
            update.message.reply_photo(photo=qr_code_url)
        else:
            update.message.reply_text('Failed to create voucher.')

    except ValueError:
        update.message.reply_text('Invalid amount. Please enter a numeric value.')

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("createvoucher", create_voucher))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
