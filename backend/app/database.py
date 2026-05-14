"""
SQLite database connection management and schema initialization.
Creates all required tables if they don't already exist.
"""

import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_PATH = os.getenv("DATABASE_PATH", "./saas_analytics.db")


def get_connection() -> sqlite3.Connection:
    """Return a new SQLite connection with row factory set to dict-like rows."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    """Create all tables if they don't exist. Called at application startup."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            signup_date TEXT NOT NULL,
            activation_date TEXT,
            first_payment_date TEXT,
            churn_date TEXT,
            plan TEXT DEFAULT 'free',
            monthly_revenue REAL DEFAULT 0.0,
            ab_test_group TEXT
        );

        CREATE TABLE IF NOT EXISTS daily_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE NOT NULL,
            dau INTEGER NOT NULL,
            signups INTEGER NOT NULL,
            activations INTEGER NOT NULL,
            active_paying INTEGER NOT NULL,
            churned INTEGER NOT NULL,
            revenue REAL NOT NULL,
            activation_rate REAL NOT NULL,
            retention_rate REAL NOT NULL,
            conversion_rate REAL NOT NULL,
            churn_rate REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            event_date TEXT NOT NULL,
            metadata TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS ab_test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            test_name TEXT NOT NULL,
            variant TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            converted INTEGER NOT NULL DEFAULT 0,
            conversion_event TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)

    conn.commit()
    conn.close()
