import { parse, format } from 'url';

export function normalize(url) {
	const urlObj = parse(url, true);

	// strip out any hash / search and make sure the query object is sorted
	delete urlObj.hash;
	delete urlObj.search;
	const queryKeys = Object.keys(urlObj.query);
	queryKeys.sort(); // string sort
	urlObj.query = queryKeys.reduce((acc, key) => {
		acc[key] = urlObj.query[key];
		return acc;
	}, {});

	// remove any redundant port 80 / 443
	const redundantHttpPort = urlObj.protocol === 'http:' && parseInt(urlObj.port,10) === 80;
	const redundantHttpsPort = urlObj.protocol === 'https:' && parseInt(urlObj.port,10) === 443;
	if (redundantHttpPort || redundantHttpsPort) {
		delete urlObj.protocol;
	}

	// finally format the url and return it
	return format(urlObj);
}