"""
Database models and setup for Smart Health Surveillance System
"""
import sqlite3
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os

# Database configuration
DATABASE_PATH = "health_surveillance.db"
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

class DatabaseManager:
    def __init__(self, db_path: str = DATABASE_PATH):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('volunteer', 'official', 'admin')),
                full_name TEXT NOT NULL,
                phone TEXT,
                location TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Surveys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS surveys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                location TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                water_quality TEXT CHECK (water_quality IN ('good', 'fair', 'poor')),
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Predictions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                sensor_data TEXT NOT NULL, -- JSON string
                predicted_disease TEXT,
                confidence REAL,
                risk_level TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
                location TEXT NOT NULL,
                disease_type TEXT,
                cases_count INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved')),
                created_by INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users (id)
            )
        ''')
        
        # Create default admin user
        cursor.execute('SELECT COUNT(*) FROM users WHERE role = "admin"')
        if cursor.fetchone()[0] == 0:
            admin_password = self.hash_password("admin123")
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, role, full_name)
                VALUES (?, ?, ?, ?, ?)
            ''', ("admin", "admin@health.gov", admin_password, "admin", "System Administrator"))
        
        conn.commit()
        conn.close()
    
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return self.hash_password(password) == hashed
    
    def create_user(self, username: str, email: str, password: str, role: str, full_name: str, phone: str = None, location: str = None) -> int:
        """Create a new user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        password_hash = self.hash_password(password)
        
        try:
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, role, full_name, phone, location)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (username, email, password_hash, role, full_name, phone, location))
            
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return user data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, username, email, password_hash, role, full_name, phone, location, is_active
            FROM users WHERE username = ? AND is_active = 1
        ''', (username,))
        
        user = cursor.fetchone()
        conn.close()
        
        if user and self.verify_password(password, user[3]):
            return {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "role": user[4],
                "full_name": user[5],
                "phone": user[6],
                "location": user[7],
                "is_active": user[8]
            }
        return None
    
    def generate_token(self, user_id: int, username: str, role: str) -> str:
        """Generate JWT token for user"""
        payload = {
            "user_id": user_id,
            "username": username,
            "role": role,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return user data"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def create_survey(self, user_id: int, location: str, latitude: float = None, longitude: float = None, 
                     water_quality: str = None, notes: str = None) -> int:
        """Create a new survey"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO surveys (user_id, location, latitude, longitude, water_quality, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, location, latitude, longitude, water_quality, notes))
        
        survey_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return survey_id
    
    def create_prediction(self, user_id: int, sensor_data: str, predicted_disease: str, 
                        confidence: float, risk_level: str) -> int:
        """Create a new prediction record"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO predictions (user_id, sensor_data, predicted_disease, confidence, risk_level)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, sensor_data, predicted_disease, confidence, risk_level))
        
        prediction_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return prediction_id
    
    def create_alert(self, title: str, description: str, severity: str, location: str, 
                    disease_type: str = None, cases_count: int = 0, created_by: int = None) -> int:
        """Create a new health alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts (title, description, severity, location, disease_type, cases_count, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (title, description, severity, location, disease_type, cases_count, created_by))
        
        alert_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return alert_id
    
    def get_user_surveys(self, user_id: int) -> list:
        """Get surveys for a specific user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, location, latitude, longitude, water_quality, status, notes, created_at
            FROM surveys WHERE user_id = ? ORDER BY created_at DESC
        ''', (user_id,))
        
        surveys = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": survey[0],
                "location": survey[1],
                "latitude": survey[2],
                "longitude": survey[3],
                "water_quality": survey[4],
                "status": survey[5],
                "notes": survey[6],
                "created_at": survey[7]
            }
            for survey in surveys
        ]
    
    def get_all_alerts(self) -> list:
        """Get all health alerts"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, description, severity, location, disease_type, cases_count, status, created_at
            FROM alerts ORDER BY created_at DESC
        ''')
        
        alerts = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": alert[0],
                "title": alert[1],
                "description": alert[2],
                "severity": alert[3],
                "location": alert[4],
                "disease_type": alert[5],
                "cases_count": alert[6],
                "status": alert[7],
                "created_at": alert[8]
            }
            for alert in alerts
        ]
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total users
        cursor.execute('SELECT COUNT(*) FROM users WHERE is_active = 1')
        total_users = cursor.fetchone()[0]
        
        # Active users (logged in within last 7 days)
        cursor.execute('SELECT COUNT(*) FROM users WHERE last_login > datetime("now", "-7 days")')
        active_users = cursor.fetchone()[0]
        
        # Pending approvals
        cursor.execute('SELECT COUNT(*) FROM surveys WHERE status = "pending"')
        pending_approvals = cursor.fetchone()[0]
        
        # Total submissions
        cursor.execute('SELECT COUNT(*) FROM surveys')
        total_submissions = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "pending_approvals": pending_approvals,
            "total_submissions": total_submissions
        }

# Global database instance
db = DatabaseManager()
