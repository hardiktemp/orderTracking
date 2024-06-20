from pymongo import MongoClient
import os 
import re
from dotenv import load_dotenv
import requests
load_dotenv()

client = MongoClient(os.getenv('MONGO_URI'))
shopify_url = os.getenv('SHOPIFY_API_KEY')

db = client['orders'] 
collection = db['orders']


def standardize_phone_number(phone):
    phone = re.sub(r'\D', '', phone)
    if phone.startswith('91'):
        phone = phone[2:]
    if phone.startswith('0'):
        phone = phone[1:]
    
    return phone

def main():
    startId = 0
    moreOrders = True
    response = requests.get(f"https://{shopify_url}/admin/orders.json?since_id={startId}&limit=250")
    if response.status_code == 200:
        data = response.json()
    else:
        print('Failed to retrieve data from the Shopify API')
    
    while(moreOrders):
        response = requests.get(f"https://{shopify_url}/admin/orders.json?since_id={startId}&limit=250")
        if response.status_code == 200:
            data = response.json()
            orderChunk = []
            for order in data['orders']:
                mongoorder = {}
                mongoorder["id"] = order['id']
                mongoorder['order_number'] = order['order_number']
                
                phone = order['billing_address']['phone'] or order['shipping_address']['phone'] or order['phone']
                
                mongoorder['phone'] = standardize_phone_number(phone)
                
                
                
                print(mongoorder)
                orderChunk.append(mongoorder)                
            collection.insert_many(orderChunk)
            startId = data['orders'][-1]['id']
            if len(data['orders']) < 250:
                moreOrders = False
        else:
            print('Failed to retrieve data from the Shopify API')
            break
            

if __name__ == '__main__':
    main()