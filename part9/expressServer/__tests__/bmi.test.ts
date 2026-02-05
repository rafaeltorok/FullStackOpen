import request from 'supertest';
import app from '../index';

describe('GET /bmi', () => {
  it('a valid height and weight gives a proper result', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=72');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 72,
      "bmi": "Normal range"
    });
  });

  it('underweight result', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=42');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 42,
      "bmi": "Underweight"
    });
  });

  it('overweight result', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=92');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 92,
      "bmi": "Overweight"
    });
  });

  it('obese result', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=122');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 122,
      "bmi": "Obese"
    });
  });

  it('decimal values', async () => {
    const response = await request(app)
      .get('/bmi?height=175.5&weight=70.2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 175.5,
      "weight": 70.2,
      "bmi": "Normal range"
    });
  });

  it('boundary between underweight and normal range', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=59.9');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 59.9,
      "bmi": "Underweight"
    });
  });

  it('boundary at BMI ≥ 25 returns Overweight', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=81');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "height": 180,
      "weight": 81,
      "bmi": "Overweight"
    });
  });
});

describe('Testing the error handling', () => {
  it('a GET request without any parameters', async () => {
    const response = await request(app)
      .get('/bmi');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('invalid height', async () => {
    const response = await request(app)
      .get('/bmi?height=none&weight=92');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('invalid weight', async () => {
    const response = await request(app)
      .get('/bmi?height=180&weight=none');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('zero values', async () => {
    const response = await request(app)
      .get('/bmi?height=0&weight=0');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('missing weight', async () => {
    const response = await request(app)
      .get('/bmi?height=180');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('missing height', async () => {
    const response = await request(app)
      .get('/bmi?weight=92');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });

  it('negative numbers', async () => {
    const response = await request(app)
      .get('/bmi?height=-180&weight=-92');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "malformatted parameters"
    });
  });
});
