# API Documentation

Base URL: http://localhost:3000

## Users API Endpoints

### Get All Users
- **URL:** `/api/usuarios`
- **Method:** GET
- **Description:** Retrieves a list of all users
- **Response:** Array of user objects
```json
[
  {
    "_id": "string",
    "nome": "string",
    "email": "string",
    "senha": "string",
    "imagem": "string"
  }
]
```

### Create User
- **URL:** `/api/usuarios`
- **Method:** POST
- **Description:** Creates a new user
- **Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```
- **Response:** Created user object

### Login User
- **URL:** `/api/usuarios/login`
- **Method:** POST
- **Description:** Authenticates a user with email and password
- **Request Body:**
```json
{
  "email": "string",
  "senha": "string"
}
```
- **Response:** 
  - Success (200): 
```json
{
  "message": "Usuário habilitado a logar",
  "user": {
    "_id": "string",
    "nome": "string",
    "email": "string",
    "imagem": "string"
  }
}
```
  - Error (401): 
```json
{
  "error": "Credenciais inválidas"
}
```

### Get User by ID
- **URL:** `/api/usuarios/:id`
- **Method:** GET
- **Description:** Retrieves a specific user by ID
- **Parameters:** 
  - `id`: User's MongoDB ID
- **Response:** User object

### Upload User Image
- **URL:** `/api/usuarios/upload/:id`
- **Method:** POST
- **Description:** Uploads an image for a specific user
- **Parameters:**
  - `id`: User's MongoDB ID
- **Request Body:** FormData
  - `imagem`: Image file
- **Response:** Updated user object with new image path

### Delete User
- **URL:** `/api/usuarios/:id`
- **Method:** DELETE
- **Description:** Deletes a specific user
- **Parameters:**
  - `id`: User's MongoDB ID
- **Response:** Status 204 on success

## Messages API Endpoints
- Base endpoint: `/api/mensagens`
- Note: Message routes are configured but implementation details need to be documented

## Static Files
- **Images URL:** `/images/:filename`
- **Method:** GET
- **Description:** Serves user images from the frontend/public/images directory
- **Example:** `http://localhost:3000/images/1234567890.jpg`

## Notes
1. All image files are stored in: `frontend/public/images/`
2. Default user image path: `/images/padrao.png`
3. Image URLs in the database are stored as relative paths: `/images/filename.ext`
4. The API uses CORS and supports file uploads
5. All error responses include an error message in the format:
```json
{
  "error": "Error description"
}
```

## Error Codes
- 200: Success
- 201: Created successfully
- 204: Deleted successfully
- 400: Bad request
- 404: Not found
- 500: Server error 