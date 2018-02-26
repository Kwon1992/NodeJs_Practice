// terminal에 npm install express --save

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const router = express.Router();

router.get("/", function(req, res) {

}); // ~~/v1/ 에서 동작

router.get("main", function(req, res) {

}); // ~~/v1/main 에서 동작

app.use("/v1", router); // 위에서 정의한 router가 동작할 path를 app.use를 통해 명시함

// app.get("/", function(req, res) {
//     res.json({"path" : "/", "response" : "GOOD"});
// }); // path가 없는 get을 이렇게 처리하겠다.
//
// app.get("/index.html", function(req, res){
//     res.json({"path" : "/index.html", "response" : "GOOD"});
//
// }); // path가 /index.html인 get을 이렇게 처리하겠다

// app.post("/", function(req, res) {
//
// }) // path가 없는 post는 이렇게 처리하겠다.
    
// 코드가 매우 간결해짐....
// 여기에 더해 Express가 제공하는 Router라는 객체가 더욱 강력하게 작동함.



server.listen(4500, () => {
    console.log("Express Server is running");
});

