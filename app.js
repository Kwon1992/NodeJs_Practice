const http = require("http");
const URL = require("url");
const queryString = require("querystring");
// node.js의 http module을 가져옴 (exports. XXX)
// JAVA의 import, C의 header 파일 추가 등과 비슷함.

// 주의 !!
// 두 개 이상의 javascript 파일에서 같은 http를 require을 하면...
// (require은 caching이 된 것이 전달되므로 다른 곳에 side effect를 줄 수 있으므로 지양한다.)


let greeting = {"kr": "안녕하세요", "en": "Hello"};
let byeing = {"kr": "안녕히가세요", "en": "Bye"};
let data = {"hello": greeting, "bye": byeing};


const handler = function (req, res) { // 왜 req, res를 param으로 가져? -> 약속.
    // 1번째 요청객체, 2번째 응답객체.
    // 요청객체에는 상대방의 요청이 있고, 응답객체에는 내가 보낼 정보가 있음.

    // console.log(req.method);  // GET, POST 등등...
    // console.log(req.url);     // 무엇을 요청하는지 알려주는 부분
    // console.log(req.headers); // metadata 가 출력됨.

    // header는 고정적으로 정해진 것은 아니고 (기본적인 필수 요소는 있고) 필요에 따라 추가도 할 수 있다.
    // 단, header에도 크기가 정해져있으므로 무작정 추가하는 것은 지양해야한다.
    // 대표적으로 login 정보를 암호화해 header를 통해 전달하는 경우가 많다.


    // URL - Resource의 위치
    // Method - GET/POST/PUT/DELETE ...
    // GET xxx -> xxx에 대한 정보를 받고싶다는 요청.

    // url, method를 이용해 if와 switch문 써서 간단하게 해보자. --

    // url이 여러 단계가 존재하면...??
    // Consideration 1)) split해서 하면 편할 것 같다. - URL module에서 제공된다.

    const url = URL.parse(req.url); // request의 url부분을 parsing해서 객채화한다. (parse : string -> object화)
    // console.log(url);
    const path = url.pathname.split("/") // path 부분만 추출할 수 있다.
    path.shift();  // shift()를 함으로 맨 앞의 빈 문자열 제거
    console.log(path);


    // const query = url.query.split("&").map((val) => { // split의 결과로 나온 값을 val로 받아서.. map함수에서 한번 더 처리!
    //     let splited = val.split("=");
    //     let result = {};
    //     result[splited[0]] = splited[1];
    //     return result;
    // }); // query가 여러개 올 경우 &로 연결되므로 쪼갠다... 또한 =을 기준으로 key - value로 만들어야한다.

    // 위의 과정이 생각보다 복잡... module이 존재 -> queryString!


    const query = queryString.parse(url.query); // 위의 과정처럼 query를 알아서 map형태로 만들어서 반환해줌.
    console.log(query);
    // url이 /bye/en 으로 올지... /bye?lang=en 같은 형태로 올지... 알 수 없다!! 따라서 query부분도 처리..

    /* http://localhost:4000/v1/bye?lang=en&locale=uk를 이용해서 url과 query를 뽑아내면...
           url :: [ '', 'v1', 'bye' ] --> 배열에 shift()를 하면 deque처럼 작동된다. (technique)
           query :: { lang: 'en', locale: 'uk' }
           가 된다.
     */


    // if (req.url === "/hello") {
    //     switch (req.method) {
    //         case "GET":
    //             res.end(greeting);
    //             break;
    //         case "POST":
    //             break;
    //         case "PUT":
    //             break;
    //         case "DELETE":
    //             break;
    //         default:
    //
    //     }
    // } else if (req.url === "/bye") {
    //     switch (req.method) {
    //         case "GET":
    //             res.end(byeing);
    //             break;
    //         case "POST":
    //             break;
    //         case "PUT":
    //             break;
    //         case "DELETE":
    //             break;
    //         default:
    //
    //     }
    // }

    //  refactoring #1...
    // switch (path[1].toUpperCase()) {
    //     case "BYE":
    //         res.end(byeing[query.lang]);
    //         break;
    //     case "HELLO":
    //         res.end(greeting[query["lang"]]);
    //         break;
    // }


    // refactoring #2 - erase switch statement
    // let data = {"hello": greeting, "bye": byeing};
    // res.end(data[path[1].toLowerCase()][query.lang]); // data의 path[1]에 해당하는 value를 가져와서 해당 value에 대한 key값과 대읕되는 value 반환.

    // refactoring #2 - more 유연한 대처
    // const statement = path[1];
    // const lang = path[2].toLowerCase() || query.lang;
    // if (!lang || !data[statement] || !data[statement][lang]) return res.end("CANNOT FIND");
    // res.end(data[statement][lang]);


    switch (req.method) {
        case "GET": // body가 없음
            const statement = path[1];
            const lang = path[2] || query.lang;

            if(path[1] === "hi")  {
                // res.writeHead(302, {"Location" : "/v1/hello?"+"lang="+lang});
                res.writeHead(302, {"Location" : '/v1/hello?lang=${lang}'});
                return res.end("Redirect");
            }

            if (!lang || !data[statement] || !data[statement][lang]) {
                // res.statusCode = 404; // 너가 잘못 찾았다 (statusCode 지정)
                res.writeHead(404, {
                    "Context-Type" : "text/html, charset=utf8"
                }); // statusCode를 적고 header에 들어갈 것을 객체로 적어줌.
                  return res.end("<h1>CANNOT FIND</h1>");
            }
            res.statusCode = 200;
            res.setHeader('Context-Type', "text/html, charset=utf8");
            res.setHeader("Set-Cookie",['auth=123123;expires="2018-2-24"', 'lalalalaa=1233']); // 쿠키 설정. // expires는 대충 적어놓음. 양식에 맞춰서 써야 제대로 작동함.
            res.write("<h1>What You Requested : </h1>"); // 전달할 body부분도 작성 가능.
            res.end(data[statement][lang]);
            break;

        case "POST": // body가 있음. __ POST method는 "새로 생성"하는 방식임 (덮어쓰기 X)
            // url :: /v1/morning
            let body = "";
            // {"kr" : "좋은 아침", "en" : "Good Morning"};
            req.on("data", function (data) {
                body += data; // body에 대한 Closure를 가지므로 계속 접근 가능.
            }); // request는 어떠한 일이 생기면 event를 발생시킨다. data가 들어올 때 "data"
            req.on("end", function () {
                if (req.headers["content-type"] !== "application/json") { // body type이 지정타입이 아닐 경우.
                    res.statusCode = 404;
                    return res.end("Body should be a JSON file.")
                }

                // JSON 양식
                if (data[path[1]]) { // 이미 해당 key에 대한 값이 존재하는 경우
                    res.statusCode = 404;
                    return res.end("Already Exists");
                }

                try {
                    const newData = JSON.parse(body); // body를 JSON 객체에 맞게 바꾸어줌.
                    data[path[1]] = newData;            // { "morning" : { "kr" : "좋은 아침", "en" : "Good Morning"} }
                    res.statusCode = 200;
                    res.end("New Data Added Successfully");
                } catch (e) { // JSON 파일이 잘못 되어있어서 에러가 날 수도 있으므로 처리함.
                    res.statusCode = 404;
                    res.end("Mal-formatted JSON");
                }
            }); // data를 전부 받았을 때 "end"
            break;
    }


}


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
