# Groups and Roles Management Application

## Project Description

This project is an application for managing a list of groups and roles, where roles are grouped into groups. For roles - permissions are grouped into roles.

### Features:

- **Groups Management**:
    - Create new groups.
    - Edit existing group names.
    - Manage roles within groups.

- **Roles Management**:
    - Create new roles consisting of permissions.
    - Edit role names.
    - Manage permissions within roles.

- **Filtering and Searching**:
    - The right panel allows filtering, searching, and pagination of roles and permissions.
    - Filter roles by label and search for specific roles.
    - Filter permissions by label and search for specific permissions.

- **Frontend Components**:
    - Created independent, reusable components to manage the user interface effectively.
    - Components are designed to be modular and reusable across different parts of the application.


### Technologies Used:
- **Angular 15**: For developing the client-side application;
- **Node.js + Express**: For building the backend;
- **json-server**: For data storage in the `db.json` file;
- **Webpack**: For building the application;
- **PostCSS**: For processing CSS with support for nesting and custom properties (CSS Variables).

## Setup and Running the Project

### Prerequisites

- **Node.js** (v18.19.1)
- **npm** (v10.2.4)

### Installing Dependencies

1. Clone the repository:

```bash
git clone https://github.com/your-username/groups-roles-management.git
```
2. Navigate to the project directory and install dependencies for both frontend and backend.

#### Frontend Dependencies:
```bash
cd client
npm install
```

#### Backend Dependencies:
```bash
cd ../server
npm install
```

## Running the Application

### Running the Backend:

To start the Express server and json-server, run the following commands:
1. Start json-server on port 3001:
```bash
npm run json-server
```
2. Start the Express server on port 3000:
```bash
npm run dev
```
The Express server will proxy requests to json-server. The API will be available at http://localhost:3000/, and json-server will handle data on http://localhost:3001/.

### Running the Frontend:
```bash
npm start
```
Starts the Angular development server with a proxy configuration to forward API requests to the Express server. 


### Scripts and Their Descriptions
#### Frontend:
- `npm start`: Starts the Angular development server with a proxy to the Express server.
- `npm run build`: Builds the application for production in the dist/ folder.
- `npm run watch`: Builds the project with watch mode enabled.
- `npm run lint`: Runs ESLint to check all .ts and .html files.
- `npm run lint`:fix: Runs ESLint and automatically fixes formatting issues.
- `npm run format`: Formats code using Prettier for .ts, .html, .css, and .scss files.

#### Backend:
- `npm run dev`: Starts the Express server using nodemon for automatic restarts on code changes.
- `npm run json-server`: Starts json-server using the db.json file on port 3001.

Project Structure

- client/: The frontend part of the application using Angular, including components and services for managing groups and roles.
- server/: The backend part using Node.js with Express, which proxies requests to json-server for handling data.

