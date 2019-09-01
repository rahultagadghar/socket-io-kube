var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

console.log("redis service", process.env.REDIS_DB);

const redisAdapter = require("socket.io-redis");
io.adapter(redisAdapter({ host: process.env.REDIS_DB, port: 6379 }));

server.listen(3000, console.log("server up"));

let activeClients = 0;

let totalConnections = 0;
let totalDisConnections = 0;

io.on("connection", function(socket) {
  totalConnections++;
  activeClients++;

  socket.on("connect", function() {
    io.of("/").adapter.clients((e, clients) => {
      console.log(
        `A:${activeClients}, C: ${totalConnections}, D: ${totalDisConnections}, L : ${clients.length}`
      );
    });
  });
  socket.on("disconnect", function() {
    totalDisConnections--;
    activeClients--;
  });
});

app.get("/", (req, res) => {
  res.send("cool");
});
