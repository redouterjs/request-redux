// this is a redux middlware that handles request type actions
// it sends a representative XHR with the action as the body and waits
// for responses from the server, which should be in the form of additional
// redux actions.
//
// Errors (server and otherwise) should be handled by action-trapping mechanisms
// However, redirects are a routing-specific issue that should be handled by
// the redirector that is passed into this middleware.
import { REQUEST, RESPONSE_REDIRECT } from './constants';
import { pending, error, serverError } from './actions/internal';
import axios from 'axios';
import serializeError from 'serialize-error';

export default redirector => (/* store */) => next => async action => {

	// if it not a route-action, passthrough
	if (action !== REQUEST) {
		return next(action);
	}

	// dispatch an action indicating the pending status
	next(pending(action.url));

	// we need to prepare a payload for the fetch method.
	const payload = {
		url: action.url,
		method: action.method || 'GET',
		withCredentials: false
	};

	// transfer headers from the route action to the payload,
	// and set other necessary headers
	payload.headers = {
		...action.headers,

		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest' // this guarantees req.xhr === true server-side
	};

	if (!/^(GET|HEAD)$/.test(payload.method)) {
		payload.body = JSON.stringify(action);
	}

	return axios(payload).then(res => {		
		res.json().then(actions => {
			// we handle redirects manually, by invoking the redirector
			const firstAction = actions[0];
			if (firstAction && firstAction.type === RESPONSE_REDIRECT) {
				// note that we don't actually dispatch this action
				// the redirector / routing framework must deal with this
				return redirector(firstAction.location);
			}

			// otherwise we simply dispatch actions normally
			actions.forEach(action => next(action));
		});
	}).catch(err => {
		// determine if it is a server error or an unexpected error
		if (err.response) {
			return next(
				serverError(action.url, { error: serializeError(err.response) })
			);
		}

		return next(
			error(action.url, { error: serializeError(err) })
		);
	});

};