#!/usr/bin/env python3
"""
Setup script for Smart Health Surveillance AI App
This script helps set up both the Flask backend and React frontend
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(
            command, 
            shell=shell, 
            cwd=cwd, 
            capture_output=True, 
            text=True, 
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_python():
    """Check if Python is installed"""
    try:
        result = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
        print(f"✓ Python found: {result.stdout.strip()}")
        return True
    except:
        print("✗ Python not found. Please install Python 3.8+")
        return False

def check_node():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        print(f"✓ Node.js found: {result.stdout.strip()}")
        return True
    except:
        print("✗ Node.js not found. Please install Node.js 16+")
        return False

def setup_backend():
    """Set up the Flask backend"""
    print("\n🔧 Setting up Flask backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("✗ Backend directory not found")
        return False
    
    # Create virtual environment
    print("Creating virtual environment...")
    venv_cmd = f"{sys.executable} -m venv venv"
    if platform.system() == "Windows":
        venv_cmd = f"{sys.executable} -m venv venv"
    
    result = run_command(venv_cmd, cwd=backend_dir)
    if result is None:
        print("✗ Failed to create virtual environment")
        return False
    
    # Activate virtual environment and install dependencies
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate && pip install -r requirements.txt"
    else:
        activate_cmd = "source venv/bin/activate && pip install -r requirements.txt"
    
    print("Installing Python dependencies...")
    result = run_command(activate_cmd, cwd=backend_dir)
    if result is None:
        print("✗ Failed to install dependencies")
        return False
    
    # Create mock model
    print("Creating mock ML model...")
    model_cmd = f"{sys.executable} create_mock_model.py"
    if platform.system() == "Windows":
        model_cmd = f"venv\\Scripts\\python create_mock_model.py"
    else:
        model_cmd = f"venv/bin/python create_mock_model.py"
    
    result = run_command(model_cmd, cwd=backend_dir)
    if result is None:
        print("⚠ Warning: Failed to create mock model, but backend will still work")
    
    print("✓ Backend setup complete!")
    return True

def setup_frontend():
    """Set up the React frontend"""
    print("\n🔧 Setting up React frontend...")
    
    # Install dependencies
    print("Installing Node.js dependencies...")
    result = run_command("npm install")
    if result is None:
        print("✗ Failed to install dependencies")
        return False
    
    print("✓ Frontend setup complete!")
    return True

def create_start_scripts():
    """Create start scripts for easy development"""
    print("\n📝 Creating start scripts...")
    
    # Backend start script
    if platform.system() == "Windows":
        backend_script = """@echo off
echo Starting Flask backend...
cd backend
call venv\\Scripts\\activate
python app.py
pause
"""
        with open("start_backend.bat", "w") as f:
            f.write(backend_script)
        
        # Frontend start script
        frontend_script = """@echo off
echo Starting React frontend...
npm run dev
pause
"""
        with open("start_frontend.bat", "w") as f:
            f.write(frontend_script)
    else:
        backend_script = """#!/bin/bash
echo "Starting Flask backend..."
cd backend
source venv/bin/activate
python app.py
"""
        with open("start_backend.sh", "w") as f:
            f.write(backend_script)
        os.chmod("start_backend.sh", 0o755)
        
        frontend_script = """#!/bin/bash
echo "Starting React frontend..."
npm run dev
"""
        with open("start_frontend.sh", "w") as f:
            f.write(frontend_script)
        os.chmod("start_frontend.sh", 0o755)
    
    print("✓ Start scripts created!")
    return True

def main():
    """Main setup function"""
    print("🚀 Smart Health Surveillance AI App Setup")
    print("=" * 50)
    
    # Check prerequisites
    print("\n📋 Checking prerequisites...")
    python_ok = check_python()
    node_ok = check_node()
    
    if not python_ok or not node_ok:
        print("\n❌ Prerequisites not met. Please install the required software.")
        return False
    
    # Setup backend
    backend_ok = setup_backend()
    if not backend_ok:
        print("\n❌ Backend setup failed.")
        return False
    
    # Setup frontend
    frontend_ok = setup_frontend()
    if not frontend_ok:
        print("\n❌ Frontend setup failed.")
        return False
    
    # Create start scripts
    scripts_ok = create_start_scripts()
    if not scripts_ok:
        print("\n⚠ Warning: Failed to create start scripts")
    
    print("\n🎉 Setup complete!")
    print("\n📖 Next steps:")
    print("1. Start the backend: Run 'start_backend.bat' (Windows) or './start_backend.sh' (Linux/Mac)")
    print("2. Start the frontend: Run 'start_frontend.bat' (Windows) or './start_frontend.sh' (Linux/Mac)")
    print("3. Open http://localhost:5173 in your browser")
    print("\n🔧 Backend API will be available at http://localhost:5000")
    print("📱 Mobile app will be available at http://localhost:5173")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

