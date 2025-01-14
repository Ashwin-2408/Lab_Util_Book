import requests
endpoint = "http://localhost:8000/api/"
response = requests.get(endpoint, json={"abc" : 123})
print(response)