const jsdom = require("jsdom");
const { JSDOM } = jsdom;

if (process.argv.length < 6) {
    console.error('Usage: node index.js loginUrl finalUrl username password');
    process.exit(1);
}

const loginUrl = process.argv[2];
const finalUrl = process.argv[3];
const userName = process.argv[4];
const password = process.argv[5];

class CustomResourceLoader extends jsdom.ResourceLoader {
    fetch(url, options) {
	if (this.startLogging) {
	    console.log(url);
	}
	return super.fetch(url, options);
    }
}
const resourceLoader = new CustomResourceLoader();
const cookieJar = new jsdom.CookieJar();

const requestString = `username=${userName}&password=${password}&grant_type=password`

console.log(requestString);

JSDOM.fromURL(loginUrl, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: resourceLoader,
    cookieJar: cookieJar
}).then(dom => {
    
    console.log('Loaded');
    console.log(dom.serialize());
});


