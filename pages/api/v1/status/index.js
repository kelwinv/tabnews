import database from "infra/database";

async function status(request, response) {
	const connectionsData = await database.query(
		`SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = '${process.env.POSTGRES_DB}';`,
	);
	const pgVersionData = await database.query("SHOW server_version;");
	const pgMaxConnectionsData = await database.query("SHOW max_connections;");

	const updatedAt = new Date().toISOString();

	const currentConnections = connectionsData.rows[0].count;
	const pgVersion = pgVersionData.rows[0].server_version;
	const pgMaxConnections = Number(pgMaxConnectionsData.rows[0].max_connections);

	response.status(200).json({
		updated_at: updatedAt,
		dependencies: {
			pg: {
				current_connections: currentConnections,
				version: pgVersion,
				max_connections: pgMaxConnections,
			},
		},
	});
}

export default status;
