from pymongo import MongoClient , UpdateOne
import os
from dotenv import load_dotenv
import requests
import re

load_dotenv()

client = MongoClient(os.getenv('MONGO_URI'))
shopify_url = os.getenv('SHOPIFY_API_KEY')

def updateProducts():
    startId = 0
    moreProducts = True
    while(moreProducts):
        response = requests.get(f"https://{shopify_url}/admin/api/2024-04/products.json?since_id={startId}&limit=250")
        print(f"https://{shopify_url}/admin/api/2024-04/products.json?since_id={startId}&limit=250")
        if response.status_code == 200:
            data = response.json()
            products = data['products']
            if not products:
                moreProducts = False
                break
            
            productChunk = []
            bulk_operations = []
            for product in products:
                print(f"Processing product {product['title']}")
                startId = product['id']
                
                mongoProduct = {"id": product['id'] , 'title': product['title']}
                images = []
                for image in product['images']:
                    images.append(image['src'])
                
                variants = product['variants'][0]
                
                mongoProduct['product_id'] = variants['product_id']
                mongoProduct['price'] = variants['price']
                mongoProduct['sku'] = variants['sku']
                
                mongoProduct['images'] = images
                # print(mongoProduct)
                    
                
                productChunk.append(mongoProduct)
                bulk_operations.append(UpdateOne({'id': product['id']}, {'$set': mongoProduct}, upsert=True))
            
            if productChunk:
                client['orders']['products'].bulk_write(bulk_operations)
        else:
            print(response.text)
            moreProducts = False
            break

updateProducts()