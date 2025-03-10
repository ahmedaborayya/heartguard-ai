import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.core.config import settings
from app.core.init_db import init_db

def create_database():
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        host=settings.POSTGRES_SERVER,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Check if database exists
    cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{settings.POSTGRES_DB}'")
    exists = cur.fetchone()

    if not exists:
        # Create database
        cur.execute(f'CREATE DATABASE {settings.POSTGRES_DB}')
        print(f"Database {settings.POSTGRES_DB} created successfully!")
    else:
        print(f"Database {settings.POSTGRES_DB} already exists.")

    cur.close()
    conn.close()

    # Create tables
    init_db()
    print("Tables created successfully!")

if __name__ == "__main__":
    create_database()