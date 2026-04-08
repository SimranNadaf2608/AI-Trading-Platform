import os
from dotenv import load_dotenv

print("CWD:", os.getcwd())
load_dotenv()
print("ENV DATABASE_URL:", os.environ.get("DATABASE_URL"))

from database import DATABASE_URL, engine
print("database.py URL:", DATABASE_URL)
print("Engine URL:", engine.url)

from sqlalchemy import inspect
inspector = inspect(engine)
print("Tables in engine:", inspector.get_table_names())
