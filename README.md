# codeslu-task

# WebSocket Chat Server

This is a WebSocket-based chat server built with Express.js and SQLite. The server allows users to send direct messages, create groups, and communicate within groups.

## Features
- WebSocket communication for real-time messaging
- SQLite database for storing messages, users, and groups
- Express.js for handling REST API routes
- Ability to send private messages
- Group chat functionality
- User and group management

## Installation
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <repository_directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and set the required environment variables:
   ```sh
   PORT=5001
   ```
4. Run the server:
   ```sh
   npm start
   ```

## API Endpoints
### Users
- `GET /users` - Retrieve all users

### Groups
- `GET /groups` - Retrieve all groups

### Messages
- WebSocket is used for sending and receiving messages in real-time.

## WebSocket Events
- `username` - Registers a user to the WebSocket connection.
- `to` - Sends a private message to a specific user.
- `createGroup` - Creates a new group.
- `joinGroup` - Adds a user to a group.
- `toGroup` - Sends a message to a group.

## Database Schema
- **users**: Stores usernames
- **messages**: Stores chat messages
- **groups**: Stores group names
- **group_members**: Links users to groups

## Technologies Used
- **Node.js** with Express.js
- **SQLite** for database storage
- **WebSocket** for real-time communication
