const puppeteer = require('puppeteer')
const fs = require('fs')
const { secureHeapUsed } = require('crypto')

const start_url = 'http://quotes.toscrape.com/js/'
//const start_url = 'http://quotes.toscrape.com/js-delayed/'

// CSS selectors
const quote_elem_selector = '.quote'
const quote_text_selector = '.text'
const quote_author_selector = '.author'
const quote_tags_selector = '.tag'
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

// the main function of the script

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

// goes to the url, scrapes the HTML output, and moves to the next page

const get_page = async (page, url) => {
	await page.goto(url)
	// waits for a quote element to appear, with a timeout of 20 seconds
	await page.waitForSelector(quote_elem_selector, {timeout: 20_000})
	// scrapes the page for quotes
	await scrape(page)
	// checks for a next page selector and extracts the href to scrape it
	try {
		let next_href = await page.$eval(next_page_selector, el => el.getAttribute('href'))
		let next_url = 'http://quotes.toscrape.com' + next_href
		console.log('Next URL to scrape: ' + next_url)
		// recursion to get and scrape next page of quotes
		await get_page(page, next_url)
	} catch {
		console.log('No next page, end job');
		return;
	}
}

const scrape = async (page) => {
	// finds all quote elements in the page and creates an array of them
	let quote_elements = await page.$$(quote_elem_selector)
	// for each quote element, scrapes their data and stores it in the quotes_list
	for (let quote_element of quote_elements) {
		let quote_text = await quote_element.$eval(quote_text_selector, el => el.innerText)
		let quote_author = await quote_element.$eval(quote_author_selector, el => el.innerText)
		// finds all tags elements (note the $$eval) and maps them to their text content
		let quote_tags = await quote_element.$$eval(quote_tags_selector, els => els.map(el => el.textContent))
		// console.log(quote_text)
		// console.log(quote_author)
		// console.log(quote_tags)
		// creates a quote object
		quote = {
			'text': quote_text,
			'author': quote_author,
			'tags': quote_tags,
		}
		// stores the quote object in the quotes_list
		quotes_list.push(quote)
	}
}

main()