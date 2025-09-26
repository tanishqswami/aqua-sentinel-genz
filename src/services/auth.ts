/**
 * Authentication service for Smart Health Surveillance
 */
const API_BASE_URL = 'http://localhost:5000';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'volunteer' | 'official' | 'admin';
  full_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'volunteer' | 'official' | 'admin';
  full_name: string;
  phone?: string;
  location?: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    this.user = this.getStoredUser();
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearStoredData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      this.token = data.token;
      this.user = data.user;
      this.setStoredToken(data.token);
      this.setStoredUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ message: string; user_id: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    this.clearStoredData();
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
