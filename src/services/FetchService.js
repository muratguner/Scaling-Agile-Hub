export default class FetchService {
	static sendPost(url, body, headers) {
		const fetchData = {
			method: 'POST',
			...body && { body: JSON.stringify(body) },
			...headers && { headers: headers },
		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.then(data => data)
	}

	static uploadFile(url, body, headers) {
		const fetchData = {
			method: 'POST',
			...body && { body: body },
			...headers && { headers: headers },

		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.then(data => data)
	}

	static sendPut(url, body, headers) {
		const fetchData = {
			method: 'PUT',
			...body && { body: JSON.stringify(body) },
			...headers && { headers: headers },
		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.then(data => data)
	}

	static sendGet(url, headers) {
		const fetchData = {
			method: 'GET',
			...headers && { headers: headers },
		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.then(data => data)
	}

	static sendDelete(url, headers) {
		const fetchData = {
			method: 'DELETE',
			...headers && { headers: headers },
		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.then(data => data)
	}

	static imageGet(url, headers) {
		const fetchData = {
			method: 'GET',
			...headers && { headers: headers },
		}

		return fetch(url, fetchData)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response
			})
			.then(response => response.blob())
			.then(data => data)
	}

	static downloadPdf(url, type, list) {
		const fetchData = {
			method: 'post',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: type, list: list })
		}

		return fetch(url, fetchData)
	}


}

