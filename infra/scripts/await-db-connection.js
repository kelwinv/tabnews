const { exec } = require("node:child_process");

function awaitDbConnection() {
	exec(
		"docker exec tab_db pg_isready -h localhost -U tab -d tab",
		handleDbConnection
	);

	function handleDbConnection(_error, stdout) {
		if (stdout.includes("accepting connections")) {
			process.stdout.write("\n ✅ Database is ready!\n\n");
			process.exit(0);
		}
		process.stdout.write(".");
		setTimeout(awaitDbConnection, 1000);
	}
}

process.stdout.write("\n\n ⏳ Waiting for database connection...");
awaitDbConnection();
