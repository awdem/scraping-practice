const axios = require('axios');
const { load } = require('cheerio');
const fs = require('fs');

// downloads target page
const start_url = "http://books.toscrape.com/";
// list to store data
const books_list = [];
// tutorial scrape function
const scrape = async (url) => {
	// HTTP request to url
	let resp = await axios.get(url);
	// extracts HTML from HTTP response
	let resp_html = resp.data;
	// uses cheerio to parse HTML
	const $ = load(resp_html);
	// parse function needs to be written
	// parse($)
	// Finds the next page selector and takes it's href attribute
	try {
		// finds the correct next page button html element and takes it's href attribute
		let next_href = $('.next > a').attr('href')
		// In case the '/catalogue/' part of the URL is not found within
		// the href attribute value, add it to the href
		if (!next_href.includes('catalogue')){
			next_href = `catalogue/${next_href}`
		}
		let next_url = start_url + next_href;
		console.log('Scrape: ' + next_url);
		await scrape(next_url);
	} catch {
		// Next page selector not found, end job
		return
	}
}

scrape(start_url);
