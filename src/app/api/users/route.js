import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET: List all users (restricted to administrador and manager)
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        isPresent: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return Response.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Error al obtener la lista de usuarios' },
      { status: 500 }
    );
  }
}

// POST: Register a new user (restricted to administrador)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 403 }
      );
    }

    const { username, password, name, roleId } = await request.json();

    if (!username || !password || !name || !roleId) {
      return Response.json(
        { error: 'Todos los campos son requeridos (usuario, contraseña, nombre, rol)' },
        { status: 400 }
      );
    }

    const sanitizedUsername = username.toLowerCase().trim();

    // Verify if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: sanitizedUsername },
    });

    if (existingUser) {
      return Response.json(
        { error: `El nombre de usuario "${username}" ya está registrado` },
        { status: 400 }
      );
    }

    // Verify if the role exists
    const roleExists = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!roleExists) {
      return Response.json(
        { error: 'El rol seleccionado no es válido o no existe' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username: sanitizedUsername,
        password: hashedPassword,
        name: name.trim(),
        roleId,
      },
      include: {
        role: true,
      },
    });

    // Don't return password hash in response
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json({
      success: true,
      message: `Usuario "${name}" registrado exitosamente`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar el usuario' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing user (restricted to administrador)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 403 }
      );
    }

    const { id, username, password, name, roleId } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'El ID del usuario es requerido' },
        { status: 400 }
      );
    }

    // Verify if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return Response.json(
        { error: 'El usuario no existe' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (roleId) {
      // Verify if the role exists
      const roleExists = await prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!roleExists) {
        return Response.json(
          { error: 'El rol seleccionado no existe' },
          { status: 400 }
        );
      }
      updateData.roleId = roleId;
    }

    if (username) {
      const sanitizedUsername = username.toLowerCase().trim();
      // Check if username already exists for another user
      const existingUser = await prisma.user.findFirst({
        where: {
          username: sanitizedUsername,
          NOT: { id },
        },
      });
      if (existingUser) {
        return Response.json(
          { error: `El nombre de usuario "${username}" ya está registrado` },
          { status: 400 }
        );
      }
      updateData.username = sanitizedUsername;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return Response.json({
      success: true,
      message: `Usuario "${updatedUser.name}" actualizado exitosamente`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar el usuario' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user (restricted to administrador)
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'El ID del usuario es requerido' },
        { status: 400 }
      );
    }

    // Don't allow deleting yourself
    if (session.id === id) {
      return Response.json(
        { error: 'No puedes eliminar tu propia cuenta de administrador' },
        { status: 400 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { error: 'Error interno del servidor al eliminar al usuario' },
      { status: 500 }
    );
  }
}
