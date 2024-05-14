# InvoiceIt Web Application

## Overview

InvoiceIt is a web application designed for managing invoices efficiently. This application uses a microservices architecture with a frontend built in React, a backend in Node.js, and MongoDB as the database. This setup ensures that the application is modular, scalable, and easy to update.

### Main Components

1. **MongoDB (Database)**: Stores all application data including user and invoice details. It is containerized for easy setup and scalability.
2. **Backend (Node.js/Express)**: Handles business logic, API requests from the frontend, and interactions with the MongoDB database. Runs on Node.js and uses Express for routing.
3. **Frontend (React)**: The user interface of the application, built with React. It communicates with the backend via API calls and provides a responsive user interface.

### Interaction Between Components

- The **frontend** communicates with the **backend** through RESTful APIs, sending and receiving data to be displayed or updated in the UI.
- The **backend** interacts with **MongoDB**, querying or updating data as requested by API calls from the frontend.
- **MongoDB** runs in its own container, and the backend accesses it using MongoDB credentials and URI provided in the environment variables.

## Getting Started

### Prerequisites

Before you start, ensure you have Docker and Docker Compose installed on your machine. These tools are essential as they will handle the setup of the multiple containers needed for the application.

### Running the Application

1. **Clone the repository:**

	```bash
	git clone [your-repository-url]
	cd [repository-name]
2. **Build the Docker images (first time only):**

	```bash
	docker-compose up --build
This command builds the images if they don't exist and starts the containers. The --build option is only needed the first time you start the application or when you make changes to Dockerfiles.


3. **Start the application (subsequent times):**
	```bash
	docker-compose up
This command starts the containers without rebuilding the images.

4. **Access the application:**

- Open your web browser and visit http://localhost:3000 to access the frontend.
- The backend will be available at http://localhost:5000.

### Modifying the Code

1. Frontend Changes:
- You can make changes to the React code in the invoiceIt_frontend_react directory. Thanks to the volume mapping in Docker Compose, changes will automatically trigger a reload in your browser.
- Ensure that your editor/IDE is set to reflect changes directly in the local invoiceIt_frontend_react directory which is mapped to the container.

2. Backend Changes:
- Modifications to the backend should be done in the invoiceIt_backend directory. With nodemon watching the files, any changes you save will automatically restart the backend service, reflecting changes immediately.

### Shutting Down the Application

To stop and remove containers, networks, and volumes created by *docker-compose up*, you can use:

	docker-compose down

### Cleaning Up Docker (Optional)

If you wish to remove all unused containers, networks, and images, you can use the Docker system prune command:

	docker system prune

This will help you reclaim disk space by cleaning up unused Docker resources. Be cautious as this will remove all stopped containers, unused networks, and dangling images.


## Additional Notes

- If you encounter any issues with ports being already in use on your system, ensure that the respective ports (3000 for frontend and 5000 for backend) are free, or modify the docker-compose.yml to map the services to different ports.
    
- This setup includes development optimizations like hot-reloading. For a production environment, additional configurations for security, performance, and reliability would be necessary.