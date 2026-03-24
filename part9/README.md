# Part 9 Exercises

## Table of Contents
- [Express Server](#express-server)
  - [Running the tests](#running-the-tests)
- [BMI Calculator](#bmi-calculator)
- [Exercise Calculator](#exercise-calculator)
- [Exercises Count](#exercises-count)
- [Flight Diaries](#flight-diaries)
- [Patientor](#patientor)


## Express Server
Backend server to be used with both the [BMI Calculator](#bmi-calculator) and [Exercise Calculator](#exercise-calculator) apps.

### Setup
Install dependencies
```bash
cd ./expressServer && npm install && npm start
```

### Usage
#### BMI Calculator app
Make a GET request to http://localhost:3003/bmi with both **height** and **weight** values (Example):
```bash
curl -G 'localhost:3003/bmi' \
  -d height=180 \
  -d weight=72
```

- Response (Example):
  ```bash
  {"result":"Normal range"}
  ```

Or with HTTPie
```bash
http GET 'localhost:3003/bmi?height=180&weight=72'
```

#### Exercises Calculator app
Make a POST request to http://localhost:3003/exercises with both the **daily_exercises** and **target** hours on the request body (Example)
```json
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

Should return an output (Example)
```json
{
  "periodLength": 7,
  "trainingDays": 4,
  "success": false,
  "rating": 1,
  "ratingDescription": "bad",
  "target": 2.5,
  "average": 1.2142857142857142
}
```

### Running the tests
Run all tests for both the `/bmi` and `/exercises` routes
```bash
npm run test
```

Run only a single test script
```bash
npm run test -- ./__tests__/bmi.test.ts
npm run test -- ./__tests__/exercises.test.ts
```


## BMI Calculator
The results were based on the [NHS UK⇗](https://www.nhs.uk/health-assessment-tools/calculate-your-body-mass-index/calculate-bmi-for-adults) rating system.

### Setup
Install dependencies
```bash
cd ./bmiCalculator && npm install
```

### Usage
```bash
npm run calculateBmi 180 91
```


## Exercise Calculator
### Setup
Install dependencies
```bash
cd ./exerciseCalculator && npm install
```

### Usage
```bash
npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4
```


## Exercises Count
This app has no separate backend, all logic has been implemented directly on the React frontend.

Install dependencies
```bash
cd ./exercisesCount && npm install
```

Start the app
```bash
npm run dev
```

Access the app on http://localhost:5173


## Flight Diaries
**This app has no database integration, so new diaries entries will only remain stored at runtime.**

Start the backend server
```bash
cd ./flightDiaries/server && npm install && npm run dev
```

Start the React frontend
```bash
cd ./flightDiaries/client && npm install && npm run dev
```

Access the Web UI on http://localhost:5173

### CRUD operations
- GET all diaries
  ```bash
  curl -X GET http://localhost:3000/api/diaries
  ```

- GET a single diary by its id
  ```bash
  curl -X GET http://localhost:3000/api/diaries/:id
  ```

- GET the non-sensitive entries (filters out the comment)
  ```bash
  curl -X GET http://localhost:3000/api/diaries/nonsensitive
  ```

- POST a new entry
  ```bash
  curl -X POST http://localhost:3000/api/diaries \
    -H "Content-Type: application/json" \
    -d '{
      "date": "2025-12-31",
      "weather": "sunny",
      "visibility": "good",
      "comment": "Last flight of the year, to celebrate the new years eve"
    }'
  ```


## Patientor
[Read full documentation⬈](./patientor/README.md)
