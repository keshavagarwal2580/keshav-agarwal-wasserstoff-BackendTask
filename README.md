# Load Balancer
# Load Balancer with Queues

This project implements a load balancer with different types of queues to handle incoming requests efficiently. It uses `express` for setting up the server and `axios` for making HTTP requests. It also utilizes `winston` for logging request details.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Queues](#queues)
- [Middleware](#middleware)
- [Scripts](#scripts)
- [Postman Collection](#postman-collection)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/keshavagarwal2580/keshav-agarwal-wasserstoff-BackendTask.git
    cd load-balancer
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

## Usage

You can start the load balancer and the server using the provided scripts.

1. Start the load balancer:

    ```sh
    npm run start:load-balancer
    ```

2. Start the API server:

    ```sh
    npm run start:server
    ```

3. Start both load balancer and server concurrently:

    ```sh
    npm run start:all
    ```

## Project Structure

The project structure is as follows:

```
src/
  |-- app.ts # Main application file for the load balancer
  |-- server.ts # Server that responds to API requests
  |-- queueManager.ts # Queue management classes (FIFO, Priority, RoundRobin)
  |-- delayMiddleware.ts # Middleware to simulate network delay
logs/
  |-- requests.log # Log file for request details
Load-Balancer-Postman-Collection.json # Postman collection file
package.json # Project configuration and scripts
tsconfig.json # TypeScript configuration
```

## Queues

### FIFO Queue

A simple first-in-first-out queue. Requests are processed in the order they arrive.

### Priority Queue

Requests are processed based on their priority. Higher priority requests are processed first.

### Round Robin Queue

Requests are distributed across multiple internal queues in a round-robin fashion. This ensures a balanced load distribution.

## Middleware

### delayMiddleware

This middleware introduces a delay to simulate network latency. It can be customized to add realistic delays to the requests.

## Scripts

- `start:load-balancer`: Starts the load balancer.
- `start:server`: Starts the API server.
- `start:all`: Starts both the load balancer and the server concurrently.

## Postman Collection

To test the application using Postman, you can import the provided Postman collection:

1. Open Postman.
2. Click on `Import`.
3. Select `File` and upload the [Load-Balancer-Postman-Collection.json](./Load-Balancer-Postman-Collection.json) file.
4. The collection will be imported, and you can use the predefined requests to test the load balancer and API server.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the ISC License.
