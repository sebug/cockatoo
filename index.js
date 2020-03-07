const jsdom = require("jsdom");
const { JSDOM } = jsdom;

if (process.argv.length < 6) {
    console.error('Usage: node index.js loginUrl finalUrl username password');
    process.exit(1);
}

const loginUrl = process.argv[2];

class CustomResourceLoader extends jsdom.ResourceLoader {
    fetch(url, options) {
	console.log(url);
	return super.fetch(url, options);
    }
}
const resourceLoader = new CustomResourceLoader();
const cookieJar = new jsdom.CookieJar();

JSDOM.fromURL(loginUrl, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: resourceLoader,
    cookieJar: cookieJar
}).then(dom => {
    console.log('Loaded');
});


