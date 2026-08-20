import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.settings import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            engine = create_engine(db_url, pool_pre_ping=True)
            # Test connection
            with engine.connect() as conn:
                logger.info("Successfully connected to PostgreSQL database.")
            return engine
    except Exception as e:
        logger.warning(f"Failed to connect to PostgreSQL ({e}). Falling back to SQLite database.")

    # Fallback to local SQLite DB
    sqlite_url = "sqlite:///./pothole_detection.db"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    logger.info(f"Using SQLite database at {sqlite_url}")
    return engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
