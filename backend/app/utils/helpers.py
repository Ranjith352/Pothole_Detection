import os
from pathlib import Path

def ensure_directory_exists(dir_path: Path):
    dir_path.mkdir(parents=True, exist_ok=True)
