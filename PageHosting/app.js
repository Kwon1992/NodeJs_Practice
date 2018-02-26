const http = require('http');
const fs = require('fs');        // 외부 파일 불러오기 위한 module.
const url = require("url");
const queryString = require('querystring');
const ejs = require('ejs');      // ejs 모듈 불러옴

const data = [
    {
        title: "첫번째 게시글",
        date: "2017-12-31",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et\n" +
        "            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex\n" +
        "            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat\n" +
        "            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit\n" +
        "            anim id est laborum."
    }, {
        title: "두번째 게시글",
        date: "2018-1-31",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et\n" +
        "            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex\n" +
        "            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat\n" +
        "            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit\n" +
        "            anim id est laborum."
    }, {
        title: "세번째 게시글",
        date: "2018-2-24",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et\n" +
        "            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex\n" +
        "            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat\n" +
        "            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit\n" +
        "            anim id est laborum."
    }
]


const index = fs.readFileSync("./index/index.ejs").toString(); // 해당 파일을 읽고 작업해야하므로 Sync로 read
const css = fs.readFileSync("./index/index.css");
const newArticle = fs.readFileSync("./index/newArticle.html");

const server = http.createServer((req, res) => {
        // get Method로 들어온다고만 생각!

        if (req.method !== "GET") {
            if (req.method === "POST") {
                let parsedUrl = url.parse(req.url);
                const path = parsedUrl.pathname.split("/");
                const query = queryString.parse(parsedUrl.query);
                if (path[1] === "new") {
                    let body = "";
                    req.on("data", function (data) {
                        body += data;
                    });
                    req.on("end", function () {
                        console.log(body);
                        return res.end(body);
                    });
                    res.writeHead(404, "Wrong Approach", {});
                    res.end("WRONG APPROACH");
                }
            }
        }

        let parsedUrl = url.parse(req.url);
        let path = parsedUrl.pathname.split("/");
        const query = queryString.parse(parsedUrl.query);

        console.log(path);
        if (path[1] == "" || path[1] === 'index.html') {
            res.writeHead(200, {"Content-Type": "text/html, charset=utf8"});
            // res.write(index); // 인덱스파일을 보내기 위해 write함.

            const result = ejs.render(index, {data: data});
            return res.end(result);
        } else if (path[1] === "index.css") {
            res.writeHead(200, {"Content-Type": "text/css, charset=utf8"});
            res.write(css); // 인덱스파일을 보내기 위해 write함.
            return res.end();
        } else if (path[1] === "newArticle.html") {
            res.writeHead(200, {"Content-Type": "text/html, charset=utf8"});

            return res.end(newArticle);
        }


        res.writeHead(404, "CANNOT FIND");
        res.end();
    }
);


server.listen(5000, () => {
    console.log("Hosting Server On");
});
