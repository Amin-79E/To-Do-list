# To-Do List App

A simple to-do list with a dark purple theme. Tasks are saved to a file (`tasks.json`) on your computer, so they are still there when you close the browser.

## Features

- Add tasks with the **Add** button or the Enter key
- Click a task to check it off, click **×** to delete it
- Double-click a task to edit it (Enter to save, Esc to cancel)
- **Clear completed** removes all checked tasks at once
- Counter showing how many tasks are left
- Empty-state message when there are no tasks
- Data saved to `tasks.json` through a small Node.js server

## Built with

- HTML, CSS, JavaScript
- Node.js (no extra packages)

## Project structure

```
├── index.html
├── style.css
├── script.js
├── server.js
└── tasks.json    (created automatically on the first save)
```

## How to run

1. Install [Node.js](https://nodejs.org).
2. Open a terminal in the project folder and run:

```bash
node server.js
```

3. Open http://localhost:3000 in your browser.

Do not open `index.html` by double-clicking it. The page needs the server to save and load tasks.

Stop the server with `Ctrl + C`.

## How saving works

Every change is sent to the server, which writes the list to `tasks.json` in the project folder. The file looks like this:

```json
[{"text": "Task 1", "done": true}, {"text": "Task 2", "done": false}]
```

To start fresh, stop the server and delete `tasks.json`.
