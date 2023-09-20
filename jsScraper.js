const puppeteer = require('puppeteer')
const fs = require('fs')

const start_url = 'http://quotes.toscrape.com/js/'
//const start_url = 'http://quotes.toscrape.com/js-delayed/'

// CSS selectors
const quote_elem_selector = '.quote'
const quote_text_selector = '.text'
const quote_author_selector = '.author'
const quote_tag_selector = '.tag'
const next_page_selector = '.next > a'

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

const main = async () => {
	const browser = await prepare_browser()
	// opens a page in the browser
	const page = await browser.newPage()
	// Navigates to the start_url and does the scraping
	await get_page(page, start_url)
	// closes the browser
	await browser.close()
	console.log(quotes_list)
}



// main()