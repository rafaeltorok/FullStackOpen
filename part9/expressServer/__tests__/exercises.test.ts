import request from 'supertest';
import app from '../index';

describe('POST /exercises', () => {
  it('the route correctly works with valid parameters', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
        "target": 2.5
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "periodLength": 7,
      "trainingDays": 4,
      "success": false,
      "rating": 1,
      "ratingDescription": "bad",
      "target": 2.5,
      "average": 1.2142857142857142
    });
  });

  it('rating result of 2', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, 0, 2, 0, 4, 0, 2.5],
        "target": 2.5
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "periodLength": 7,
      "trainingDays": 4,
      "success": false,
      "rating": 2,
      "ratingDescription": "not too bad but could be better",
      "target": 2.5,
      "average": 1.6428571428571428
    });
  });

  it('rating result of 3', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, 4, 2, 1, 4, 3, 2.5],
        "target": 2.5
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "periodLength": 7,
      "trainingDays": 7,
      "success": true,
      "rating": 3,
      "ratingDescription": "you reached your target, well done!",
      "target": 2.5,
      "average": 2.7857142857142856
    });
  });

  it('a zero value for the target is a valid parameter', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
        "target": 0
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "periodLength": 7,
      "trainingDays": 4,
      "success": true,
      "rating": 3,
      "ratingDescription": "you reached your target, well done!",
      "target": 0,
      "average": 1.2142857142857142
    });
  });
});

describe('Testing the error handling', () => {
  it('missing a target value', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, 0, 2, 0, 4, 0, 2.5]
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "parameters missing"
    });
  });

  it('missing daily exercises hours', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "target": 2.5
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "parameters missing"
    });
  });

  it('incorrect parameters names', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exer": [3, 0, 2, 0, 4, 0, 2.5],
        "targets": 2.5
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "parameters missing"
    });
  });

  it('null values', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [null],
        "target": null
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "malformatted parameters"
    });
  });

  it('sending the values as strings', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": ["1", "0", "2", "0", "3", "0", "2.5"],
        "target": "2.5"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('empty strings do not get evaluated to zero', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [" ", ""],
        "target": " "
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "malformatted parameters"
    });
  });

  it('negative target hours', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, 0, 2, 0, 4, 0, 2.5],
        "target": -1
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "malformatted parameters"
    });
  });

  it('a negative daily exercise hours', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, 0, -2, 0, 4, 0, 2.5],
        "target": 1
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "malformatted parameters"
    });
  });

  it('empty number of daily exercises hours', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [],
        "target": 2.5
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "parameters missing"
    });
  });

  it('non-array daily exercises hours', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": 2,
        "target": 2.5
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "parameters missing"
    });
  });

  it('NaN values gets rejected', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({
        "daily_exercises": [3, "NaN", 2, 0, 4, 0, 2.5],
        "target": "NaN"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "malformatted parameters"
    });
  });
});