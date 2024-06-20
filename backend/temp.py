from pymongo import MongoClient
import os 
from dotenv import load_dotenv
import requests
load_dotenv()

client = MongoClient(os.getenv('MONGO_URI'))
shopify_url = os.getenv('SHOPIFY_API_KEY')

db = client['orders'] 
collection = db['orders']


def main():
    startId = 0
    moreOrders = True
    response = requests.get(f"https://{shopify_url}/admin/orders.json?since_id={startId}&limit=250")
    if response.status_code == 200:
        data = response.json()
    else:
        print('Failed to retrieve data from the Shopify API')
    
    while(moreOrders):
        response = requests.get(f"https://{shopify_url}/admin/orders.json?since_id={0}&limit=250")
        if response.status_code == 200:
            data = response.json()
            orderChunk = []
            for order in data['orders']:
                mongoorder = {}
                mongoorder["id"] = order['id']
                mongoorder['products'] = []
                for product in order['line_items']:
                #     if product['product_id'] != None:
                #         prodData = requests.get(f"https://{shopify_url}/admin/products/{product['product_id']}.json")
                        
                #         images = [prodData.json()['product']['image']['src']]

                #         for image in prodData.json()['product']['images']:
                #             images.append(image['src'])
                #     else:
                #         images = []                    
                    
                    product = {
                        "id": product['id'],
                        "product_id": product['product_id'],
                        "title": product['title'],
                        "quantity": product['quantity'],
                        }
                    mongoorder['products'].append(product)
                
                
                
                print(mongoorder)
                orderChunk.append(mongoorder)                
            collection.insert_many(orderChunk)
            moreOrders = False
        else:
            print('Failed to retrieve data from the Shopify API')
            break
            

if __name__ == '__main__':
    main()