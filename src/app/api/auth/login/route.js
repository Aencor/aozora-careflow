import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: 'El nombre de usuario y la contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Find the user and include their role
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      include: { role: true },
    });

    if (!user) {
      return Response.json(
        { error: 'Nombre de usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Nombre de usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Create session
    const session = await createSession(user);

    return Response.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: session,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return Response.json(
      { error: 'Error interno del servidor al iniciar sesión' },
      { status: 500 }
    );
  }
}
