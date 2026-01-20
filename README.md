# AngryBirdsStage3

Stage 3 Angry Birds: Introducing Constraint

## How to Run the Game

### Option 1: Run with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running
2. In the project root directory, run:

```bash
docker-compose up
```

1. Open <http://localhost:3000> in your browser
2. To stop, press `Ctrl+C` and run:

```bash
docker-compose down
```

### Option 2: Run with Docker Manually

1. Build the Docker image:

```bash
docker build -t angrybirds-game .
```

1. Run the container:

```bash
docker run -p 3000:3000 angrybirds-game
```

1. Open <http://localhost:3000> in your browser
2. To stop, press `Ctrl+C`

### Option 3: Run Locally without Docker

1. Ensure you have Node.js installed (version 12+)
2. In the project root run:

```bash
npm start
```

1. Open <http://localhost:3000> in your browser

**Custom Port (Local):** Set the `PORT` environment variable, e.g., on Windows PowerShell:

```powershell
$env:PORT=4000; npm start
```

## Project Structure

- `index.html` - Main game page
- `sketch.js` - Game logic
- `server.js` - Simple HTTP server
- `Dockerfile` - Docker image configuration
- `docker-compose.yml` - Docker Compose configuration
- Game entities: `Bird.js`, `Pig.js`, `Box.js`, `Log.js`, `Ground.js`, `Slingshot.js`
