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
	parse($)
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
		console.log("Next page selector not found, end job")
		return
	}
}

// the parse function uses CSS selector syntax to find and extract data from the elements we're targeting

const parse = ($) => {
	// finds all product pod html elements in the page
	$('.product_pod').each((i, elem) => {
		// finds element with book title
		const book_title = $(elem).find('h3').text();
		// finds element with book price and removes the pound sign
		const book_price = $(elem).find('.price_color').text().replace('£', '');
		// finds the star-rating element, takes it's full class name (e.g. star-rating Three), splits it into two words and takes the 2nd word (the rating)
		const book_rating = $(elem).find('p.star-rating').attr("class").split(' ')[1];
		// finds the element with book stock, takes its text and trims the whitespaces
		const book_stock = $(elem).find('.instock').text().trim();
		// finds book link element (<a>), takes its href attribute, and appends it to the start url
		const book_url = start_url + $(elem).find('a').attr('href');
		// creates an object to store the data and adds it the books_list array
		books_list.push({
      "title": book_title,
      "price": book_price,
      "rating": book_rating,
      "stock": book_stock,
      "url": book_url
    });
	})
	// console.log(books_list);
};

// write_to_csv uses the gathered data in books_lists to create a csv file

const write_to_csv = (books_list) => {
	// creates the first line of the csv file by reading the keys from books_list's first object and putting them in CSV format.
	let csv = Object.keys(books_list[0]).join(", ") + '\n';
	// iterates through the books_list array and puts each object's data in CSV format
	books_list.forEach((book) => {
		csv += `"${book['title']}", ${book['price']}, ${book['rating']}, ${book['stock']}, ${book['url']},\n`
	})
	// creates the output csv file
	fs.writeFile('output.csv', csv, (err) => {
		if (err)
			console.log(err);
		else {
			console.log('Output written successfully to output.csv')
		}
	})
}


// this script runs the scrape function and writes the data to a csv file

(async () => {
	await scrape(start_url);
	write_to_csv(books_list);
})();