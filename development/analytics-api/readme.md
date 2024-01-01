### Analytics API Documentation

#### Base URL
```
POST BASE_URL/api
```

#### Headers
- `apiKey`: apiKey passed as an header in the api request
#### Request Types and Endpoints

##### 1. Per Page Views
```
POST /api?type=per-page-views
```

**Request:**
```json
{
  "apiKey": "your_api_key"
}
```

**Response:**
```json
[
  {
    "page_name": "string",
    "views": "string"
  }
]
```

**Description:**
- **Objective:** Retrieve the total views for each page.
- **Parameters:**
  - `apiKey`: The API key for authentication.
- **Response:**
  - An array of objects, each containing the `page_name` (string) and its corresponding `views` (string).

##### 2. Views by City and Page
```
POST /api?type=views-by-city-and-page
```

**Request:**
```json
{
  "apiKey": "your_api_key"
}
```

**Response:**
```json
[
  {
    "city_name": "string",
    "page_name": "string",
    "views": "string"
  }
]
```

**Description:**
- **Objective:** Retrieve the total views for each page in each city.
- **Parameters:**
  - `apiKey`: The API key for authentication.
- **Response:**
  - An array of objects, each containing the `city_name` (string), `page_name` (string), and the corresponding `views` (string).

##### 3. Views by Day
```
POST /api?type=views-by-day
```

**Request:**
```json
{
  "apiKey": "your_api_key"
}
```

**Response:**
```json
[
  {
    "date": "string",
    "views": "string"
  }
]
```

**Description:**
- **Objective:** Retrieve the total views for each day.
- **Parameters:**
  - `apiKey`: The API key for authentication.
- **Response:**
  - An array of objects, each containing the `date` (string) and the corresponding `views` (string).

#### Error Responses

- **400 Bad Request:**
  - The request is invalid. This can happen if the `type` parameter is missing or incorrect.
  
  **Response:**
  ```json
  {
    "error": "Invalid request"
  }
  ```

- **403 Forbidden:**
  - Access is forbidden. This occurs if the `apiKey` header is missing or incorrect.
  
  **Response:**
  ```json
  {
    "error": "Access Forbidden"
  }
  ```

- **500 Internal Server Error:**
  - An internal server error occurred during the processing of the request.
  
  **Response:**
  ```json
  {
    "error": "An error occurred"
  }
  ```

### Example Usage

**Python Requests Example:**
```python
import requests

url = 'http://localhost:5000/api?type=per-page-views'
headers = {'apiKey': 'your_api_key'}

response = requests.post(url, headers=headers)

print(response.status_code)
print(response.json())
```

Remember to replace `'your_api_key'` with your actual API key. This documentation assumes that the API is running locally on port 5000. Adjust the URL accordingly if it's hosted elsewhere.