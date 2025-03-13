import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import { database } from "infra/database";

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
	const allowedMethods = ["GET", "POST"];
	if (!allowedMethods.includes(req.method)) {
		return res.status(405).json({
			error: `Method "${req.method}" not allowed.`,
		});
	}
	let dbClient;

	try {
		dbClient = await database.getNewClient();

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
			return;
		}
		if (req.method === "POST") {
			await POST(defaultMigrationConf, req, res);
			return;
		}
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await dbClient.end();
	}
}

export default migrations;
