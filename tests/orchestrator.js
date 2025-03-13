import AsyncRetry from "async-retry";

async function waitForAllServices() {
	await waitForWebService();

	function waitForWebService() {
		return AsyncRetry(fetchStatusPage, { maxRetryTime: 100, maxTimeout: 1000 });

		function fetchStatusPage() {
			return fetch("http://localhost:3000/api/v1/status").then((response) => {
				if (response.status === 200) {
					return response.json().then((responseBody) => {
						if (responseBody.dependencies.pg) {
							return;
						}
						throw new Error("Missing pg dependency");
					});
				}
				throw new Error(`Unexpected status code: ${response.status}`);
			});
		}
	}
}

export { waitForAllServices };
