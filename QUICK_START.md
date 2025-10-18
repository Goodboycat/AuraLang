# AuraLang Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
Open your browser to `http://localhost:5173`

## 📡 API Usage Examples

### Authentication

#### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123!",
    "displayName": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### Project Management

#### Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My AuraLang Project",
    "description": "Building something amazing",
    "visibility": "private",
    "category": "web-app",
    "tags": ["aura", "ai", "quantum"]
  }'
```

#### List Projects
```bash
curl -X GET "http://localhost:3000/api/projects?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### AI Assistant

#### Chat with AI
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create an intent in AuraLang?",
    "context": {
      "projectId": "proj_123"
    }
  }'
```

#### Get Code Completion
```bash
curl -X POST http://localhost:3000/api/ai/complete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "intent build_",
    "cursorPosition": { "line": 1, "column": 13 },
    "language": "aura"
  }'
```

#### Analyze Code
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "your code here",
    "language": "typescript"
  }'
```

### Analytics

#### Track Event
```bash
curl -X POST http://localhost:3000/api/analytics/events \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "code_execution",
    "category": "intent",
    "action": "execute",
    "label": "cognitive_assistant",
    "sessionId": "session_123"
  }'
```

#### Get Insights
```bash
curl -X GET http://localhost:3000/api/analytics/insights \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_secret

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-change-this

# Email Service (optional)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key

# Database (optional - uses in-memory by default)
DATABASE_URL=postgresql://user:password@localhost:5432/auralang
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T...",
  "features": {
    "authentication": true,
    "twoFactor": true,
    "oauth": true,
    "projects": true,
    "collaboration": true,
    "websockets": true,
    "analytics": true,
    "marketplace": true,
    "aiAssistant": true,
    "notifications": true
  },
  "version": "1.0.0"
}
```

### API Documentation
```bash
curl http://localhost:3000/api
```

Returns complete API documentation with all endpoints.

## 🌐 WebSocket Connection

### Connect to Collaboration Session
```javascript
const ws = new WebSocket('ws://localhost:3000/collaboration');

ws.onopen = () => {
  // Join project session
  ws.send(JSON.stringify({
    type: 'join',
    projectId: 'proj_123',
    userId: 'user_123',
    username: 'johndoe'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Send cursor position
ws.send(JSON.stringify({
  type: 'cursor_moved',
  payload: {
    fileId: 'file_123',
    line: 10,
    column: 5
  }
}));

// Send chat message
ws.send(JSON.stringify({
  type: 'chat_message',
  payload: {
    content: 'Hello team!',
    type: 'text'
  }
}));
```

## 📱 Frontend Integration

### Using Fetch API
```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.tokens.accessToken);
  return data;
}

// Create Project
async function createProject(name, description) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, description })
  });
  
  return response.json();
}

// Chat with AI
async function chatWithAI(message) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data.response;
}
```

## 🔒 Authentication Flow

1. **Register** → Get user credentials
2. **Login** → Receive access token and refresh token
3. **Use Access Token** → Make authenticated requests
4. **Token Expires** → Use refresh token to get new access token
5. **Logout** → Revoke tokens

### Token Refresh Example
```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.tokens.accessToken);
  return data.tokens;
}
```

## 🎯 Common Use Cases

### 1. Building a Project
```bash
# Create project
PROJECT_ID=$(curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My App","description":"Cool app"}' | jq -r '.id')

# Add a file
curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"main.aura",
    "path":"/main.aura",
    "content":"intent hello_world { ... }",
    "language":"aura"
  }'
```

### 2. Collaborating
```bash
# Add collaborator
curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/collaborators \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user_456",
    "role":"editor",
    "permissions":["read","write"]
  }'
```

### 3. Getting AI Help
```bash
# Ask AI to generate code
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description":"Create a user authentication system",
    "language":"typescript"
  }'
```

## 📚 Additional Resources

- **Full Feature List**: See `FEATURES.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Documentation**: GET `/api`
- **Health Check**: GET `/health`

## 🆘 Troubleshooting

### Port Already in Use
```bash
npm run clean-port  # Kills process on port 3000
```

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Token Expired
Refresh your access token using the refresh token endpoint.

## 🎉 You're Ready!

Start building with AuraLang's 100 features:
- ✅ Authentication & Security
- ✅ Real-time Collaboration
- ✅ AI Assistant
- ✅ Analytics & Insights
- ✅ Project Management
- ✅ Marketplace
- ✅ And 94 more features!

Happy coding! 🚀
