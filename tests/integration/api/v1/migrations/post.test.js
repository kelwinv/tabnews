import orchestrator from "tests/orchestrator";
import { cleanDatabase } from "tests/utils/db";

beforeAll(async () => {
	await orchestrator.waitForAllServices();
	await cleanDatabase();
});

test("POST to /api/v1/migration should return 200", async () => {
	const response = await fetch("http://localhost:3000/api/v1/migrations", {
		method: "POST",
	});
	expect(response.status).toBe(201);

	const responseBody = await response.json();

	expect(Array.isArray(responseBody.migratedMigrations)).toBe(true);
	expect(responseBody.migratedMigrations.length).toBeGreaterThan(0);

	const responseBefore = await fetch(
		"http://localhost:3000/api/v1/migrations",
		{
			method: "POST",
		},
	);

	expect(responseBefore.status).toBe(200);

	const responseBeforeBody = await responseBefore.json();

	expect(Array.isArray(responseBeforeBody.migratedMigrations)).toBe(true);
	expect(responseBeforeBody.migratedMigrations.length).toBe(0);
});
