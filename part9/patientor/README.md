# Patientor
Web app available on [Render⬈](https://patientorapp.onrender.com)

## Table of Contents
- [Usage](#usage)
- [CRUD operations](#crud-operations)
- [Docker](#docker)
- [Tests](#tests)
  - [Integration tests](#integration-tests)
  - [E2E (Playwright)](#e2e-playwright)


## Usage
### Development mode
- Start the backend server
  ```bash
  cd ./patientor/server && npm install && npm run dev
  ```

- Start the frontend
  ```bash
  cd ./patientor/client && npm install && npm run dev
  ```

- Access the Web UI on http://localhost:5173

### Production mode
- In this mode, the JavaScript compiled backend code serves a static build of the frontend.

- Compile the backend server
  ```bash
  cd ./patientor/server && npm install && npm run tsc
  ```

- Build the frontend
  ```bash
  cd ./patientor/client && npm install && npm run build
  ```

- Copy the static build to the server folder
  ```bash
  cd ./patientor/client && cp -r ./dist ../server
  ```

- Run the server in production mode
  ```bash
  cd ./patientor/server && npm run start
  ```

- Access the Web UI on http://localhost:3001


## CRUD operations
### Patients
- GET all patients
  ```bash
  curl -X GET http://localhost:3001/api/patients
  ```

- GET a patient info by its id
  ```bash
  curl -X GET http://localhost:3001/api/patients/:id
  ```

- POST a new patient
  ```bash
  curl -X POST http://localhost:3001/api/patients \
    -H "Content-Type: application/json" \
    -d '{
      "name": "New Patient",
      "dateOfBirth": "1980-01-01",
      "ssn": "01-010101",
      "gender": "other",
      "occupation": "Developer"
    }'
  ```

- POST a new entry
  ```bash
  curl -X POST http://localhost:3001/api/patients/:id/entries \
    -H "Content-Type: application/json" \
    -d '{
      "type": "Hospital",
      "date": "2000-01-01",
      "specialist": "Doctor John",
      "diagnosisCodes": [
          "S62.5"
      ],
      "description": "Patient had a minor injury, nothing severe.",
      "discharge": {
          "date": "2000-01-02",
          "criteria": "Patient has healed."
      }
    }'
  ```

### Diagnoses
- GET all diagnoses
  ```bash
  curl -X GET http://localhost:3001/api/diagnoses
  ```

- GET a diagnose based on its code
  ```bash
  curl -X GET http://localhost:3001/api/diagnoses/:code
  ```

- POST a new diagnose (latin field is optional)
  ```bash
  curl -X POST http://localhost:3001/api/diagnoses \
    -H "Content-Type: application/json" \
    -d '{
      "code": "R51.9",
      "name": "General headache",
      "latin": "optional"
    }'
  ```


## Docker
**Disclaimer: This project utilizes a shared directory for TypeScript definitions. Consequently, the Docker build context must be set to the root project folder for the containers to compile successfully.**

### Composer (Recommended)
```bash
cd ./patientor && docker compose up -d
```

### Backend production build
- Navigate to the root folder of the Patientor project and build the Docker image
  ```bash
  cd ./patientor && docker build -f ./server/Dockerfile.prod -t patientor .
  ```

- Start the container
  ```bash
  docker run --name patientor -p 3001:3001 patientor
  ```

- Access the Web UI on http://localhost:3001

### Running E2E tests in Docker
- Run the tests
  ```bash
  cd ./patientor && docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from e2e
  ```

- After the tests finish, all containers will be stopped automatically.

- Tests results will be stored on the `/e2e/test-results` folder.

- (OPTIONAL) Removed the unused containers after testing
  ```bash
  cd ./patientor && docker compose -f docker-compose.test.yml down -v
  ```


## Tests
### Integration tests
Backend only tests, focused on the three main routes of the Express server: `/api/patients`, `/api/diagnoses` and `/api/patients/:id/entries`.

- Running all tests
  ```bash
  cd ./patientor/server && npm run test
  ```

- Patients route
  ```bash
  cd ./patientor/server && npm run test -- --test ./tests/patient.test.ts
  ```

- Diagnoses route
  ```bash
  cd ./patientor/server && npm run test -- --test ./tests/diagnosis.test.ts
  ```

- Entries route
  ```bash
  cd ./patientor/server && npm run test -- --test ./tests/entries.test.ts
  ```

### E2E (Playwright)
#### Setup
- Start the frontend
  ```bash
  cd ./patientor/client && npm install && npm run dev
  ```

- Start the backend server in **testing mode**
  ```bash
  cd ./patientor/server && npm install && npm run start:test
  ```

- Install the Playwright dependencies
  ```bash
  cd ./patientor/e2e && npm install && npx playwright install
  ```

#### Running the tests
- In CLI mode
  ```bash
  npm run test
  ```

- In UI mode
  ```bash
  npm run test:ui
  ```

- In debug mode
  ```bash
  npm run test:debug
  ```