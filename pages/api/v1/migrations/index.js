import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

const GET = async (defaultMigrationConf, req, res) => {
	const paddingMigrations = await migrationRunner(defaultMigrationConf);

	return res.status(200).json({ paddingMigrations });
};

const POST = async (defaultMigrationConf, req, res) => {
	const migratedMigrations = await migrationRunner({
		...defaultMigrationConf,
		dryRun: false,
	});

	const status = migratedMigrations.length > 0 ? 201 : 200;

	return res.status(status).json({
		migratedMigrations,
	});
};

async function migrations(req, res) {
	const dbClient = await database.getNewClient();

	const defaultMigrationConf = {
		dbClient,
		databaseUrl: process.env.DATABASE_URL,
		dir: join("infra", "migrations"),
		migrationsTable: "pgmigrations",
		direction: "up",
		verbose: true,
		dryRun: true,
	};

	if (req.method === "GET") {
		await GET(defaultMigrationConf, req, res);
		await dbClient.end();
		return;
	}
	if (req.method === "POST") {
		await POST(defaultMigrationConf, req, res);
		await dbClient.end();
		return;
	}

	res.status(405).end();
}

export default migrations;
