# Exercise 0.6 — New Note in Single Page App Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Writes new note and clicks "Save"
    Browser->>Server: POST /exampleapp/new_note_spa (JSON body: { content, important })
    activate Server
    Server-->>Browser: 201 Created (JSON with created note object)
    deactivate Server

    Browser->>Browser: execute callback -> add created note to UI (render/update list)
    Note right of Browser: No full page reload — SPA updates DOM dynamically
```