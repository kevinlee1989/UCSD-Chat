import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://kjmin99999:1034913aA%40%40@cluster0.3q4hb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    exit()

# Database and collection
db = client["Fall24LikeLion"]
collection = db["courses"]

# Load JSON data
json_file = "ucsd_courses.json"  # Path to your JSON file
try:
    with open(json_file, "r", encoding="utf-8") as f:
        course_data = json.load(f)
    print(f"Loaded JSON data from {json_file}")
except Exception as e:
    print(f"Error loading JSON file: {e}")
    exit()

# Prepare documents for insertion
documents = []

for link, courses in course_data.items():
    for course_name in courses:
        documents.append({
            "course_name": course_name,  # Add the course name
            "users": [],                 # Empty array for users
            "chatroom": []               # Empty array for chatroom
        })

# Insert documents into the MongoDB collection
try:
    result = collection.insert_many(documents)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'course' collection.")
except Exception as e:
    print(f"Error inserting documents into MongoDB: {e}")
