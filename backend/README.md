# Patent Search Tool Backend

This is the FastAPI backend for the Patent Search Tool.

## Development

1. Install dependencies:
   ```
   poetry install
   ```

2. Run the development server:
   ```
   poetry run uvicorn app.main:app --reload
   ```

3. Access the API documentation at http://localhost:8000/docs

## API Endpoints

- `POST /search`: Search for patents
  - Request body: `{ "query": "search terms", "rows": 25 }`
  - Response: JSON object containing search results

## Database

The application uses PostgreSQL to cache search results. The database connection is configured using the `DATABASE_URL` environment variable.

## Testing

Run tests using pytest:
```
poetry run pytest
```

## License

This project is licensed under the MIT License.
