# Book Review System

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
    ```sh
    cd express
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```
    This will start the backend server on port 3000 by default.

### Frontend Setup

1. Open a new terminal and go to the frontend folder:
    ```sh
    cd book-review-system
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm start
    ```
    The frontend server will typically start on port 3000. If it detects that the port is already in use, it will ask you to run the app on another port. Please click 'Yes'.

4. Open your browser and navigate to the address shown in the terminal.

### Notes

- The initial load might take a few seconds.

### Running Backend Tests

1. Navigate to the backend folder:
    ```sh
    cd express
    ```

2. Run the tests:
    ```sh
    npm test
    ```
    All test files are located in the `spec/tests` directory.

### Seeded User

A seeded user is set up in the frontend and can be configured in `ReviewForm.tsx` by modifying the `userId` variable:
```tsx
const userId = 1;
```
Finally, I hope you will enjoy it!
