import requests

url = "http://20.257.70.104:5000/execute"
headers = {"Content-Type": "application/json"}
data = {
    "language": "python",
    "code": "print(\"Hello, HackEx!\")"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())  # Should print actual execution output
