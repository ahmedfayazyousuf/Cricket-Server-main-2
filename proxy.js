const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const cors = require('cors'); // Import the cors middleware
app.use(cors());


app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://talli.app',
    changeOrigin: true,
  })
);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 4000');
});
