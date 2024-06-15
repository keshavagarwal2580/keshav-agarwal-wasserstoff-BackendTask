// Import necessary modules
import express from 'express';

// Define interface for endpoint details
interface Endpoint {
    url: string; // URL of the endpoint
    responseTime: number; // Response time of the endpoint
}

// Define endpoints with their URLs and response times
const endpoints: Record<string, Endpoint[]> = {
    rest: [
        { url: '/api/rest/fast', responseTime: 100 },
        { url: '/api/rest/slow', responseTime: 1000 },
    ],
    graphql: [
        { url: '/api/graphql/fast', responseTime: 150 },
        { url: '/api/graphql/slow', responseTime: 1200 },
    ],
    grpc: [
        { url: '/api/grpc/fast', responseTime: 200 },
        { url: '/api/grpc/slow', responseTime: 1500 },
    ],
};

// Define delay middleware
const delayMiddleware: express.RequestHandler = (req, res, next) => {
    // Extract the endpoint type from the request path
    const endpointType = req.path.split('/')[2];
    // Find the endpoint that matches the request path
    const endpoint = endpoints[endpointType]?.find(e => e.url === req.path);
    if (endpoint) {
        // If the endpoint is found, delay the next middleware by the endpoint's response time
        setTimeout(() => next(), endpoint.responseTime);
    } else {
        // If the endpoint is not found, proceed to the next middleware immediately
        next();
    }
};

// Export the delay middleware
export { delayMiddleware };