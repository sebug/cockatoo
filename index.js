const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');
const tough = require('tough-cookie');
const { Cookie } = tough;

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

class CustomResourceLoader extends jsdom.ResourceLoader {
    
    fetch(url, options) {
	if (this.loggingEnabled) {
	    console.log(url);
	}
	return super.fetch(url, options);
    }
}

function afterLogin(cookieHeader) {
    const resourceLoader = new CustomResourceLoader();
    let cookieJar = new jsdom.CookieJar();
    const sourceUrl = 'https://' + host;
    for (let cookieString of cookieHeader) {
	cookieJar.setCookieSync(
	    Cookie.parse(cookieString), sourceUrl, {
		loose: true
	    });
    }
    resourceLoader.loggingEnabled = true;
    JSDOM.fromURL(finalUrl, {
	runScripts: 'dangerously',
	pretendToBeVisual: true,
	resources: resourceLoader,
	cookieJar: cookieJar
    }).then(dom => {
	setTimeout(() => {
	    console.log(dom.serialize());
	}, 10 * 1000);
    });

}









