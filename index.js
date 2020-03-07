const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');

if (process.argv.length < 7) {
    console.error('Usage: node index.js host loginpath finalUrl username password');
    process.exit(1);
}

const host = process.argv[2];
const loginPath = process.argv[3];
const finalUrl = process.argv[4];
const userName = process.argv[5];
const password = process.argv[6];

const requestString = `username=${encodeURI(userName)}&password=${encodeURI(password)}&grant_type=password`;

const loginOptions = {
    hostname: host,
    port: 443,
    path: loginPath,
    method: 'POST',
    headers: {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Content-Length': requestString.length
    }
};

const loginReq = https.request(loginOptions, (res) => {
    let data = '';

    res.on('data', (d) => {
	data += d;
    });

    res.on('end', () => {
	afterLogin(res.headers['set-cookie']);
    });
});

loginReq.on('error', (e) => {
  console.error(e);
});

loginReq.write(requestString);
loginReq.end();

function afterLogin(data) {
    console.log(data);
}


class CustomResourceLoader extends jsdom.ResourceLoader {
    
    fetch(url, options) {
	if (this.loggingEnabled) {
	    console.log(url);
	}
	return super.fetch(url, options);
    }
}
const resourceLoader = new CustomResourceLoader();
const cookieJar = new jsdom.CookieJar();





/*JSDOM.fromURL(loginUrl, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: resourceLoader,
    cookieJar: cookieJar
}).then(dom => {
    setTimeout(() => {
	console.log('Loaded');
	resourceLoader.loggingEnabled = true;
	const toEval = `$.ajax({ url: "/Login", method: "POST", data: { grant_type: 'password', username: '${userName}', password: '${password}' }  })`;
	dom.window.eval(toEval);
    }, 10 * 1000);
});*/


