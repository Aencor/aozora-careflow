import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: List all rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
    });
    return Response.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return Response.json(
      { error: 'Error al obtener las habitaciones' },
      { status: 500 }
    );
  }
}

// POST: Register a new room (restricted to administrador and manager)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { number, floor, type } = await request.json();

    if (!number || !floor || !type) {
      return Response.json(
        { error: 'El número, piso y tipo de habitación son obligatorios' },
        { status: 400 }
      );
    }

    // Check if room number already exists
    const existingRoom = await prisma.room.findUnique({
      where: { number: number.trim() },
    });

    if (existingRoom) {
      return Response.json(
        { error: `La habitación "${number}" ya está registrada` },
        { status: 400 }
      );
    }

    // Create the room
    const newRoom = await prisma.room.create({
      data: {
        number: number.trim(),
        floor: floor.trim(),
        type: type.trim(),
        status: 'disponible',
      },
    });

    return Response.json({
      success: true,
      message: `Habitación "${number}" registrada exitosamente`,
      room: newRoom,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar la habitación' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing room (restricted to administrador and manager)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { id, number, floor, type, status } = await request.json();

    if (!id || !number || !floor || !type || !status) {
      return Response.json(
        { error: 'Todos los campos (id, número, piso, tipo y estatus) son obligatorios' },
        { status: 400 }
      );
    }

    // Check if room number already exists for another room
    const existingRoom = await prisma.room.findFirst({
      where: {
        number: number.trim(),
        NOT: { id },
      },
    });

    if (existingRoom) {
      return Response.json(
        { error: `La habitación "${number}" ya está registrada en otra habitación` },
        { status: 400 }
      );
    }

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        number: number.trim(),
        floor: floor.trim(),
        type: type.trim(),
        status: status.trim(),
      },
    });

    return Response.json({
      success: true,
      message: `Habitación "${number}" actualizada exitosamente`,
      room: updatedRoom,
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar la habitación' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a room (restricted to administrador and manager)
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'El ID de la habitación es requerido' },
        { status: 400 }
      );
    }

    // Delete the room
    await prisma.room.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: 'Habitación eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return Response.json(
      { error: 'Error interno del servidor al eliminar la habitación' },
      { status: 500 }
    );
  }
}
