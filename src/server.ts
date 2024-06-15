// Import necessary modules
import express from 'express';
import { delayMiddleware } from './delayMiddleware';

// Initialize express app and port
const app = express();
const port = 3000;

// Use delay middleware
app.use(delayMiddleware);

// Define route for REST API
// The :type parameter in the URL will be replaced with 'fast' or 'slow'
app.get('/api/rest/:type', (req, res) => 
    // Send a response with the type of REST API
    res.send(`REST API ${req.params.type} response`)
);

// Define route for GraphQL API
// The :type parameter in the URL will be replaced with 'fast' or 'slow'
app.get('/api/graphql/:type', (req, res) => 
    // Send a response with the type of GraphQL API
    res.send(`GraphQL API ${req.params.type} response`)
);

// Define route for gRPC API
// The :type parameter in the URL will be replaced with 'fast' or 'slow'
app.get('/api/grpc/:type', (req, res) => 
    // Send a response with the type of gRPC API
    res.send(`gRPC API ${req.params.type} response`)
);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});