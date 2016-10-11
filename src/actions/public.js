import {
	// actions
	REQUEST, RESPONSE_REDIRECT,

	// methods
	METHOD_GET, METHOD_POST, METHOD_HEAD
} from '../constants';
import { normalize } from './util';

export function get(url, { headers }) {
	return {
		type: REQUEST,
		method: METHOD_GET,
		url: normalize(url),
		headers
	};
}

export function head(url, { headers }) {
	return {
		type: REQUEST,
		method: METHOD_HEAD,
		url: normalize(url),
		headers
	};
}

export function post(url, { body, headers }) {
	return {
		type: REQUEST,
		method: METHOD_POST,
		url: normalize(url),
		body,
		headers
	};
}

export function redirect(url) {
	return {
		type: RESPONSE_REDIRECT,
		location: url
	}
}