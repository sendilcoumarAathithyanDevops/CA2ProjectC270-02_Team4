# CI/CD Pipeline Documentation

## Overview
This document describes the automated CI/CD pipeline implemented using GitHub Actions for the Angry Birds game application.

## Pipeline Architecture

### Trigger Events
- **Push**: Any push to `main` or `develop` branches
- **Pull Request**: Any pull request to `main` or `develop` branches

## Pipeline Jobs

### 1. **Test Job**
Runs on: Ubuntu Latest
Strategy: Matrix testing across Node.js versions (14.x, 16.x, 18.x)

**Steps**:
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies (`npm ci`)
4. Run linter (`npm run lint`)
5. Run test suite (`npm test`)
6. Security audit (`npm run security:audit`)
7. Upload coverage to Codecov

**Purpose**: Ensure code quality, functionality, and security at the dependency level

### 2. **Build Job**
Runs on: Ubuntu Latest
Dependencies: Must pass `test` job

**Steps**:
1. Checkout code
2. Setup Docker Buildx
3. Build Docker image
4. Run server health check
5. Verify application startup

**Purpose**: Validate that application can be containerized and starts correctly

### 3. **Security Scan Job**
Runs on: Ubuntu Latest
Independent job

**Steps**:
1. Checkout code
2. Run Trivy vulnerability scanner
3. Upload SARIF results to GitHub Security tab

**Purpose**: Scan for known vulnerabilities in dependencies and code

### 4. **Code Quality Job**
Runs on: Ubuntu Latest
Independent job (requires SONAR_TOKEN secret)

**Steps**:
1. Checkout code
2. Run SonarCloud scan
3. Report quality metrics

**Purpose**: Analyze code quality, security hotspots, and technical debt

## Configuration Files

### `.github/workflows/ci.yml`
Main pipeline configuration file. Key environment setup:
- Node.js versions: 14.x, 16.x, 18.x
- Codecov integration
- Trivy vulnerability scanner
- SonarCloud integration (optional)

### `.github/pull_request_template.md`
Template for pull request descriptions
- Change description
- Type of change
- Testing checklist
- Security checklist

## Required Secrets

To enable all pipeline features, configure these GitHub repository secrets:

```
SONAR_TOKEN      # SonarCloud authentication (optional)
CODECOV_TOKEN    # Codecov authentication (optional)
```

Configure in: Settings → Secrets and variables → Actions

## Test Configuration

### Jest Configuration
Located in `package.json`:
- Test environment: Node
- Coverage collection enabled
- Coverage directory: `./coverage`
- Test files: `**/__tests__/**/*.js`, `**/?(*.)+(spec|test).js`

### Test Files
- `__tests__/server.test.js` - Server functionality tests
- `__tests__/game.test.js` - Game logic tests

**Run tests locally**:
```bash
npm test              # Run all tests with coverage
npm run test:watch   # Run tests in watch mode
```

## Code Quality

### ESLint Configuration
File: `.eslintrc.js`
- Extends: airbnb-base
- Environment: Node.js, ES2021, Browser
- Enforces code style consistency

**Run linter locally**:
```bash
npm run lint
```

## Security

### Dependency Auditing
Run `npm audit` to check for known vulnerabilities:
```bash
npm run security:audit
```

### Vulnerability Scanning
Trivy scans the entire filesystem for:
- Known CVEs in dependencies
- Misconfigurations
- Secrets in code

Results uploaded to GitHub Security tab automatically.

## Docker Containerization

### Image Building
Pipeline automatically builds Docker image:
- Based on: `node:18-alpine` (multi-stage)
- Non-root user: `appuser` (UID 1000)
- Health check: HTTP GET to port 3000
- Exposed port: 3000

**Build image locally**:
```bash
docker build -t angry-birds:latest .
```

**Run container locally**:
```bash
docker run -p 3000:3000 angry-birds:latest
```

## Scalability Features

### Load Balancing
Docker Compose (`docker-compose.yml`):
- Nginx reverse proxy on port 80
- 3 application instances
- Round-robin load balancing
- Health checks for each instance

**Run locally**:
```bash
docker-compose up
```

Access via: `http://localhost`

### Kubernetes Ready
Manifests can be created for production deployment:
- Horizontal Pod Autoscaler (HPA)
- Service endpoints
- Readiness/Liveness probes
- Resource limits

## Deployment Strategy

### Merge to Main
1. Create pull request with changes
2. All checks must pass:
   - Linting
   - Tests
   - Security audit
   - Build verification
3. Merge to `main` branch
4. Production deployment triggers (if configured)

### Merge to Develop
- Staging environment deployment
- Full test suite required
- Optional manual approval

## Health Checks

### Server Health Endpoint
The application serves static files with implicit health via HTTP 200 responses.

Enhanced with container health check in Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {...})"
```

## Monitoring

### Pipeline Status Badge
Add to README.md:
```markdown
![CI/CD Pipeline](https://github.com/[owner]/[repo]/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Logs
- GitHub Actions logs: Actions tab in repository
- Docker Compose logs: `docker-compose logs -f`
- Container logs: `docker logs [container-id]`

## Troubleshooting

### Test Failures
1. Check Actions tab for detailed logs
2. Run tests locally: `npm test`
3. Fix failing tests before pushing

### Build Failures
1. Verify Node.js version compatibility
2. Check `npm install` works locally
3. Validate Dockerfile syntax

### Security Scan Issues
1. Review Trivy scan results in Security tab
2. Update vulnerable dependencies: `npm update`
3. Add exceptions in `.trivyignore` if necessary

## Best Practices

1. **Always create pull requests** - Don't push directly to main
2. **Wait for checks to pass** - Don't merge with failing pipelines
3. **Review security warnings** - Address CVEs promptly
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Add tests for new features** - Maintain code coverage
6. **Document changes** - Update README and SECURITY.md

## Future Enhancements

- [ ] Automated deployment to staging/production
- [ ] Performance testing in pipeline
- [ ] Load testing with k6
- [ ] Chaos engineering tests
- [ ] Infrastructure as Code (Terraform/CloudFormation)
- [ ] Multi-region deployment
- [ ] Blue-green deployment strategy

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)
- [Docker Best Practices](https://docs.docker.com/develop/)
