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
   - Backend API: http://localhost:8000
   - Database: localhost:5432 (accessible from within the Docker network)

## Project Structure

- `backend/`: FastAPI backend service

## License

This project is licensed under CC BY-NC 4.0. For more information, see [LICENSE.md](LICENSE.md).
```
