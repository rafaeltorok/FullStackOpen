FROM mcr.microsoft.com/playwright:v1.58.2

WORKDIR /e2e

COPY ./e2e/package*.json ./
COPY ./shared/types.ts ../shared/types.ts
COPY ./shared/data ../shared/data

RUN npm ci

COPY ./e2e .

CMD ["npx", "playwright", "test", "--reporter=html"]