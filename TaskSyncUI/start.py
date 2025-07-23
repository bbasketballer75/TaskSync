#!/usr/bin/env python3
"""
TaskSync Monitor - Easy Start Script
Automatically sets up and starts the TaskSync monitoring system.
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8 or higher."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required. Current version:", sys.version)
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def setup_virtual_environment():
    """Set up virtual environment if it doesn't exist."""
    venv_path = Path("venv")
    
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print("✅ Virtual environment created")
        except subprocess.CalledProcessError as e:
            print("❌ Failed to create virtual environment:", e)
            sys.exit(1)
    else:
        print("✅ Virtual environment already exists")
    
    return venv_path

def get_venv_python(venv_path):
    """Get the Python executable path for the virtual environment."""
    if os.name == 'nt':  # Windows
        return venv_path / "Scripts" / "python.exe"
    else:  # Unix/Linux/macOS
        return venv_path / "bin" / "python"

def install_dependencies():
    """Install required Python packages in virtual environment."""
    requirements_file = Path("backend/requirements.txt")
    
    if not requirements_file.exists():
        print("❌ requirements.txt not found in backend/")
        sys.exit(1)
    
    # Set up virtual environment
    venv_path = setup_virtual_environment()
    venv_python = get_venv_python(venv_path)
    
    print("📦 Installing dependencies in virtual environment...")
    try:
        subprocess.run([
            str(venv_python), "-m", "pip", "install", "-r", str(requirements_file)
        ], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print("❌ Failed to install dependencies:", e)
        sys.exit(1)

def create_directories():
    """Create necessary directories if they don't exist."""
    dirs_to_create = [
        ".tasksync",
        "backend",
        "frontend/css",
        "frontend/js"
    ]
    
    for dir_path in dirs_to_create:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
    
    # Create empty task and log files if they don't exist
    task_file = Path(".tasksync/tasks.md")
    log_file = Path(".tasksync/log.md")
    
    if not task_file.exists():
        task_file.write_text("# Current Tasks\n\n<!-- Tasks will appear here -->\n")
    
    if not log_file.exists():
        log_file.write_text("# Monitoring Log\n\n")
    
    print("✅ Directories and files created")

def start_server():
    """Start the FastAPI server using virtual environment."""
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        sys.exit(1)
    
    main_py = backend_dir / "main.py"
    if not main_py.exists():
        print("❌ main.py not found in backend/")
        sys.exit(1)
    
    # Get virtual environment Python
    venv_path = Path("venv")
    venv_python = get_venv_python(venv_path)
    
    print("🚀 Starting TaskSync server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws")
    print("💡 Press Ctrl+C to stop the server")
    print("\n" + "="*50)
    
    # Open browser after a short delay
    import threading
    import time
    
    def open_browser():
        time.sleep(3)  # Give server time to start
        try:
            webbrowser.open("http://localhost:8000")
            print("🌐 Browser opened automatically")
        except Exception as e:
            print(f"⚠️  Could not open browser automatically: {e}")
            print("🌐 Please open http://localhost:8000 manually")
    
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Start the server using the virtual environment Python
    try:
        subprocess.run([
            str(venv_python), str(main_py)
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

def main():
    """Main startup function."""
    print("🎯 TaskSync Monitor - Starting Up...")
    print("="*50)
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    install_dependencies()
    
    # Create necessary directories
    create_directories()
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()
