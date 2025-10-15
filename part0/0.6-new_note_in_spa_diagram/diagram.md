# Exercise 0.6 — New Note in Single Page App Diagram

```mermaid
sequenceDiagram
participant browser
participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Payload that contains the created resource
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```