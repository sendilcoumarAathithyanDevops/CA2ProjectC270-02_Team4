# AngryBirdsStage3

Stage 3 Angry Birds: Introducing Constraint

## How to Run the Game

### Option 1: Run with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running
2. In the project root directory, run:

```bash
docker-compose -f docker/docker-compose.yml up
```

3. Open <http://localhost:3000> in your browser
4. To stop, press `Ctrl+C` and run:

```bash
docker-compose -f docker/docker-compose.yml down
```

### Option 2: Run with Docker Manually

1. Build the Docker image from the project root:

```bash
docker build -f docker/Dockerfile -t angrybirds-game .
```

2. Run the container:

```bash
docker run -p 3000:3000 angrybirds-game
```

3. Open <http://localhost:3000> in your browser
4. To stop, press `Ctrl+C`

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

```
CA2ProjectC270-02_Team4/
├── src/
│   ├── client/              # Client-side code
│   │   ├── js/
│   │   │   ├── game/       # Game entity classes
│   │   │   │   ├── BaseClass.js
│   │   │   │   ├── Bird.js
│   │   │   │   ├── Box.js
│   │   │   │   ├── Ground.js
│   │   │   │   ├── Log.js
│   │   │   │   ├── Pig.js
│   │   │   │   └── Slingshot.js
│   │   │   └── sketch.js   # Game logic
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── lib/            # Third-party libraries
│   │   │   ├── matter.js
│   │   │   ├── p5.min.js
│   │   │   ├── p5.dom.min.js
│   │   │   └── p5.sound.min.js
│   │   └── assets/
│   │       └── sprites/    # Game images
│   └── server/
│       └── server.js       # HTTP server
├── public/
│   └── index.html          # Main game page
├── tests/                  # Test files
│   ├── game.test.js
│   └── server.test.js
├── docker/                 # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── config/                 # Configuration files
│   └── nginx.conf
├── docs/                   # Documentation
│   ├── README.md
│   ├── SCALABILITY.md
│   └── SECURITY.md
└── package.json
```
