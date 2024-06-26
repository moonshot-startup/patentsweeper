# Patent Search Tool

This project is a patent search and analysis tool that consists of a PostgreSQL database, a FastAPI backend, and a React frontend.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/patent-search-tool.git
   cd patent-search-tool
   ```

2. Start the services using Docker Compose:
   ```
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432 (accessible from within the Docker network)

## Project Structure

- `backend/`: FastAPI backend service
- `frontend/`: React frontend application
- `db_data/`: PostgreSQL data directory (created on first run)

## Sharing the Database

The PostgreSQL data is stored in the `db_data/` directory. To share the database:

1. Stop the running services: `docker-compose down`
2. Compress the `db_data/` directory: `tar -czvf db_data.tar.gz db_data/`
3. Share the `db_data.tar.gz` file

To use a shared database:

1. Ensure the services are not running: `docker-compose down`
2. Remove the existing `db_data/` directory: `rm -rf db_data/`
3. Extract the shared database: `tar -xzvf db_data.tar.gz`
4. Start the services: `docker-compose up`

## License

This project is licensed under the MIT License.
