import requests
endpoint = "http://localhost:8000/api/schedule"
response = requests.get(endpoint)
print(response.content)