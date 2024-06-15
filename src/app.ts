// Import necessary modules
import express from 'express';
import axios from 'axios';
import winston from 'winston';
import { FIFOQueue, PriorityQueue, RoundRobinQueue } from './queueManager';
import { delayMiddleware } from './delayMiddleware';

// Initialize express app and port
const app = express();
const port = 4000;

// Set up logger with winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/requests.log' })
    ]
});

// Define interface for request details
interface RequestDetails {
    req: express.Request;
    res: express.Response;
    targetUrl: string;
}

// Initialize queues
const fifoQueue = new FIFOQueue<RequestDetails>();
const priorityQueue = new PriorityQueue<RequestDetails>();
const roundRobinQueue = new RoundRobinQueue<RequestDetails>();
roundRobinQueue.addQueue('queue1');
roundRobinQueue.addQueue('queue2');
roundRobinQueue.addQueue('queue3');
// Internal queues and a variable to keep track of the current index for round-robin queue
const internalQueues = ['queue1', 'queue2', 'queue3'];
let currentIndex = 0;

// Function to process requests
const processRequest = async (req: express.Request, res: express.Response, targetUrl: string, priority?: number) => {
    try {
        // Make a GET request to the target URL
        const response = await axios.get(targetUrl);
        // Log the request details
        logger.info({
            timeStamp: new Date().toISOString(),
            apiType: req.query.apiType,
            payloadSize: req.query.payloadSize,
            targetUrl,
            priority,
            responseTime: response.headers['request-duration']
        });
        // Send the response data
        res.send(response.data);
    } catch (error: any) {
        // Log any errors
        logger.error({
            timeStamp: new Date().toISOString(),
            error: error.message
        });
        // Send a 500 status code
        res.status(500).send('Internal Server Error');
    }
};

// Function to handle queue processing
const handleQueueProcessing = () => {
    setInterval(() => {
        // Process requests in the FIFO queue
        if (!fifoQueue.isEmpty()) {
            const { req, res, targetUrl } = fifoQueue.dequeue()!;
            processRequest(req, res, targetUrl, parseInt(req.query.priority as string, 10));
        }

        // Process requests in the priority queue
        if (!priorityQueue.isEmpty()) {
            const { req, res, targetUrl } = priorityQueue.dequeue()!;
            processRequest(req, res, targetUrl, parseInt(req.query.priority as string, 10));
        }

        // Process requests in the round-robin queue
        if (!roundRobinQueue.isEmpty()) {
            const { req, res, targetUrl } = roundRobinQueue.dequeue()!;
            processRequest(req, res, targetUrl, parseInt(req.query.priority as string, 10));
        }
    }, 100);
};

// Start handling queue processing
handleQueueProcessing();

// Function to route requests
const routeRequest = (req: express.Request, res: express.Response) => {
    const { apiType, payloadSize, queueType, priority } = req.query;
    let targetUrl = '';

    // Determine the target URL based on the API type and payload size
    if (apiType === 'rest') {
        targetUrl = parseInt(payloadSize as string, 10) > 1000 ? 'http://localhost:3000/api/rest/slow' : 'http://localhost:3000/api/rest/fast';
    } else if (apiType === 'graphql') {
        targetUrl = parseInt(payloadSize as string, 10) > 1000 ? 'http://localhost:3000/api/graphql/slow' : 'http://localhost:3000/api/graphql/fast';
    } else if (apiType === 'grpc') {
        targetUrl = parseInt(payloadSize as string, 10) > 1000 ? 'http://localhost:3000/api/grpc/slow' : 'http://localhost:3000/api/grpc/fast';
    }

    // Enqueue the request based on the queue type
    if (queueType === 'fifo') {
        fifoQueue.enqueue({ req, res, targetUrl });
    } else if (queueType === 'priority') {
        priorityQueue.enqueue({ req, res, targetUrl }, parseInt(priority as string, 10));
    } else if (queueType === 'round-robin') {
        // Enqueue the request to the queue at the current index
        roundRobinQueue.enqueue(internalQueues[currentIndex], { req, res, targetUrl });
        // Increment the index and wrap around to 0 if it reaches the length of the array
        currentIndex = (currentIndex + 1) % internalQueues.length;
    } else {
        // Send a 400 status code for invalid queue types
        res.status(400).send('Invalid queue type');
    }
};

// Use delay middleware
app.use(delayMiddleware);

// Set up route
app.get('/route', routeRequest);

// Start the server
app.listen(port, () => {
    console.log(`Load Balancer with Queues running at http://localhost:${port}`);
});

// Export the app
export default app;