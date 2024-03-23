# Target to start the database Docker container in detached mode.
start_db:
	docker compose up -d

# Target to stop the database Docker container.
stop_db:
	docker compose down

# Target to apply all pending database migrations.
migrate:
	db-migrate up
	
# Target to rollback the last applied database migration.
migrate-down:
	db-migrate down

# Target to create a new database migration file.
create_migration:
	db-migrate create ${n} --sql-file

# Target to start the server in development mode.
server:
	npm run dev

# Declare the phony targets to prevent conflicts with filenames.
.PHONY: start_db stop_db migrate migrate-down create_migration server 
