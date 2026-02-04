# Part 9 Exercises

## Table of Contents
- [Express Server](#express-server)
- [BMI Calculator](#bmi-calculator)
- [Exercise Calculator](#exercise-calculator)


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