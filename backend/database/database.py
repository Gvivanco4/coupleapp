import sqlite3

conn = sqlite3.connect("coupleapp.db")
cursor = conn.cursor()

res = cursor.execute("""
CREATE TABLE test (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INT NOT NULL
)
               """)

conn.commit()
cursor.close()
