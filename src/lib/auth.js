import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'hospital_session';
const SECRET = process.env.SESSION_SECRET || 'super-secret-key-change-this-in-production-123456';

// Helper to encrypt session data
export function encrypt(data) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.scryptSync(SECRET, 'salt', 32),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Helper to decrypt session data
export function decrypt(text) {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      crypto.scryptSync(SECRET, 'salt', 32),
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}

// Create and set the session cookie
export async function createSession(user) {
  const cookieStore = await cookies();
  const sessionData = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role.name,
    roleId: user.roleId,
  };
  const token = encrypt(sessionData);
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  return sessionData;
}

// Retrieve user session from request/cookies
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  
  return decrypt(sessionCookie.value);
}

// Destroy session cookie
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Helper to check if user has required roles
export function hasRole(session, allowedRoles) {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}
