import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: List all roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    return Response.json({ success: true, roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return Response.json(
      { error: 'Error al obtener la lista de roles' },
      { status: 500 }
    );
  }
}

// POST: Add a new role (restricted to administrador)
export async function POST(request) {
  try {
    const session = await getSession();
    
    // Check authentication and role
    if (!session || !hasRole(session, ['administrador'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return Response.json(
        { error: 'El nombre del rol es requerido' },
        { status: 400 }
      );
    }

    const roleName = name.toLowerCase().trim();

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (existingRole) {
      return Response.json(
        { error: `El rol "${name}" ya existe` },
        { status: 400 }
      );
    }

    // Create the new role
    const newRole = await prisma.role.create({
      data: {
        name: roleName,
        description: description || null,
      },
    });

    return Response.json({
      success: true,
      message: `Rol "${name}" creado exitosamente`,
      role: newRole,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return Response.json(
      { error: 'Error interno del servidor al crear el rol' },
      { status: 500 }
    );
  }
}
