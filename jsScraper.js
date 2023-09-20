const puppeteer = require('puppeteer')
const fs = require('fs')

const start_url = 'http://quotes.toscrape.com/js/'
//const start_url = 'http://quotes.toscrape.com/js-delayed/'


const quotes_list = []

// This prepares a 'headful' browser, so that a GUI will appear. This is useful for debugging.
// 'Headless' is for automating, since you won't be able to interact with the browser.
// This is also where proxy set up happens.(https://proxyway.com/guides/puppeteer-proxy-setup)
const prepare_browser = async () => {
	const browser = await puppeteer.launch({
		headless: false,
	})
	return browser;
}

