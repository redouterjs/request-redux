import {
	RESPONSE_PENDING,
	RESPONSE_ERROR,
	RESPONSE_SERVER_ERROR,
	RESPONSE_OK
} from '../constants';
import { normalize } from './util';

export function pending(url) {
	return {
		type: RESPONSE_PENDING,
		url: normalize(url)
	};
}

export function ok(url, { body }) {
	return {
		type: RESPONSE_OK,
		url: normalize(url),
		body
	};
}

export function error(url, { error }) {
	return {
		type: RESPONSE_ERROR,
		url: normalize(url),
		error
	};	
}

export function serverError(url, { body, statusCode }) {
	return {
		type: RESPONSE_SERVER_ERROR,
		url: normalize(url),
		body,
		statusCode
	}
}