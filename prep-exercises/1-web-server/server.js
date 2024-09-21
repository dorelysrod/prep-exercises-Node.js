/**
 * Exercise 3: Create an HTTP web server
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

//create a server
let server = http.createServer(function (req, res) {
  if (req.url === "/") {
    const html = fs.readFileSync(path.join(__dirname, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html); // Send the HTML content
  } else if (req.url === "/index.js") {
    const js = fs.readFileSync(path.join(__dirname, "index.js"));
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js); // Send the JavaScript content
  } else if (req.url === "/style.css") {
    const css = fs.readFileSync(path.join(__dirname, "style.css"));
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(css); // Send the CSS content
  } else {
    res.write("Hello World!"); // Sends a response back to the client
    res.end(); // Ends the response
  }
});

server.listen(3000); // The server starts to listen on port 3000
