# Task Service

This service is responsible for managing tasks.

## Usage

To start the service, run the following commands:
```
npm install
npm run start
```

You can make manual requests to the service using `curl` or `Postman`:
```
# Initial test
curl http://localhost:3000

# Get all tasks
curl http://localhost:3000/tasks
# or
curl -s http://localhost:3000/tasks | jq .

# Create a task
curl -X POST -H "Content-Type: application/json" -d '{
    "title": "First Task",
    "description": "This is my first task",
    "dueDate": "2025-02-06",
    "status": "pending",
    "userEmail": "till.hoffmann@superluminar.io"
}' http://localhost:3000/tasks
```

## Routes

- `POST /tasks`: Create a new task
- `GET /tasks`: Get all tasks
- `GET /tasks/:taskId`: Get a task by ID
- `DELETE /tasks/:taskId`: Delete a task by ID

## Architecture

The service takes requests and manages task data in a postgres database.
The database url is set in the `src/database.ts` file.
