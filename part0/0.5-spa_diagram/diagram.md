# Exercise 0.5 – Single Page App Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Opens the SPA version (https://studies.cs.helsinki.fi/exampleapp/spa)
    Browser->>Server: HTTP GET /exampleapp/spa
    Server-->>Browser: HTML document
    Browser->>Server: HTTP GET /exampleapp/main.js
    Server-->>Browser: main.js
    Browser->>Server: HTTP GET /exampleapp/data.json
    Server-->>Browser: JSON data (all notes)
    Browser-->>User: Renders notes using JavaScript
```