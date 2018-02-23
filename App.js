const http = require("http");
// node.js의 http module을 가져옴 (exports. XXX)
// JAVA의 import, C의 header 파일 추가 등과 비슷함.

// 주의 !!
// 두 개 이상의 javascript 파일에서 같은 http를 require을 하면...
// (require은 caching이 된 것이 전달되므로 다른 곳에 side effect를 줄 수 있으므로 지양한다.)

const handler = function (req, res) {
    // 1번째 요청객체, 2번째 응답객체.
    // 요청객체에는 상대방의 요청이 있고, 응답객체에는 내가 보낼 정보가 있음.
    console.log(req.method);  // GET, POST 등등...
    console.log(req.url);     // 무엇을 요청하는지 알려주는 부분
    console.log(req.headers); // metadata 가 출력됨.
    // header는 고정적으로 정해진 것은 아니고 (기본적인 필수 요소는 있고) 필요에 따라 추가도 할 수 있다.
    // 단, header에도 크기가 정해져있으므로 무작정 추가하는 것은 지양해야한다.
    
    
    // URL - Resource의 위치 
    // Method - GET/POST/PUT/DELETE ...
    // GET xxx -> xxx에 대한 정보를 받고싶다는 요청.

    // switch문 써서 간단하게 해보자.
    switch(req.method) {
        case GET:
            break;
        case POST:
            break;
        case PUT:
            break;
        case DELETE:
            break;
        default:
    }

    res.end("Hi");    // res에 "Hi"라는 정보를 담아 전달함.
};


const server = http.createServer(handler); // 서버 생성
/*
const server = http.createServer(function(req, res){});
const server = http.createSerer((req, res) => {});
 */

server.listen(4000, () => {
    // Server가 Booting이 완료되었을 때 호출되는 곳.
    // 4000번대 port에서 request를 기다림.
    console.log("Server is running");
});
// listen을 하면 서버가 죽지 않고 계속 돈다.


// 진짜 Server를 올릴 경우에는 http는 80, https는 8080을 쓴다.
// cloud에 deploy해서 server를 계속 구동시킬 수 있다.
