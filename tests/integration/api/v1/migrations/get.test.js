import { waitForAllServices } from "tests/orchestrator";
import { cleanDatabase } from "tests/utils/db";

beforeAll(async () => {
	await waitForAllServices();
	await cleanDatabase();
});

test("GET to /api/v1/migration should return 200", async () => {
	const response = await fetch("http://localhost:3000/api/v1/migrations");
	expect(response.status).toBe(200);

	const responseBody = await response.json();

	expect(Array.isArray(responseBody.paddingMigrations)).toBe(true);
	expect(responseBody.paddingMigrations.length).toBeGreaterThan(0);
});
