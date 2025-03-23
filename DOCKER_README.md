# Docker Setup for KENSAKI Product 2025

This project can be run via Docker for both development and production environments.

## Development Environment

To start the development environment with Fast Refresh enabled:

```bash
docker-compose up
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000
- PostgreSQL database

The development setup includes:
- Hot reloading for both frontend and backend
- Next.js Fast Refresh support
- Volume mounts for real-time code updates

## Production Environment

To start the production environment:

```bash
docker-compose -f docker-compose.prod.yml up
```

## Environment Variables

You can configure the environment by modifying the `.env` file at the root of the project.
