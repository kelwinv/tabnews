import orchestrator from "tests/orchestrator";

beforeAll(async () => {
	await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
	const response = await fetch("http://localhost:3000/api/v1/status");
	expect(response.status).toBe(200);

	const responseBody = await response.json();
	expect(responseBody.updated_at).toBeDefined();

	const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
	expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

	expect(responseBody.dependencies.pg).toEqual({
		version: "16.0",
		max_connections: 100,
		current_connections: 1,
	});
});
