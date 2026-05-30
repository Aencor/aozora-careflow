import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: Fetch all medications
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco', 'enfermero', 'manager', 'medico'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere iniciar sesión con un rol válido' },
        { status: 403 }
      );
    }

    const medications = await prisma.medication.findMany({
      orderBy: { name: 'asc' }
    });

    return Response.json({ success: true, medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    return Response.json(
      { error: 'Error interno al obtener el catálogo de medicamentos' },
      { status: 500 }
    );
  }
}

// POST: Add a new medication (Restricted to administrador and farmaco)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o fármaco' },
        { status: 403 }
      );
    }

    const { name, description, category, stock, unit } = await request.json();

    if (!name || !category) {
      return Response.json(
        { error: 'El nombre y la categoría del medicamento son obligatorios' },
        { status: 400 }
      );
    }

    // Verify unique name
    const existingMed = await prisma.medication.findUnique({
      where: { name: name.trim() }
    });

    if (existingMed) {
      return Response.json(
        { error: 'Ya existe un medicamento registrado con este nombre' },
        { status: 400 }
      );
    }

    const newMed = await prisma.medication.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        category: category.trim(),
        stock: stock ? parseInt(stock) : 0,
        unit: unit ? unit.trim() : 'Cajas'
      }
    });

    return Response.json({
      success: true,
      message: 'Medicamento agregado con éxito al catálogo',
      medication: newMed
    });
  } catch (error) {
    console.error('Error creating medication:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar el medicamento' },
      { status: 500 }
    );
  }
}

// PUT: Update medication stock or details
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o fármaco' },
        { status: 403 }
      );
    }

    const { id, name, description, category, stock, unit } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'El ID del medicamento es obligatorio' },
        { status: 400 }
      );
    }

    // Update
    const updated = await prisma.medication.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        category: category ? category.trim() : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        unit: unit ? unit.trim() : undefined
      }
    });

    return Response.json({
      success: true,
      message: 'Medicamento actualizado con éxito',
      medication: updated
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar el medicamento' },
      { status: 500 }
    );
  }
}

// DELETE: Remove medication from inventory
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o fármaco' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'El ID del medicamento es obligatorio' },
        { status: 400 }
      );
    }

    await prisma.medication.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Medicamento eliminado con éxito del catálogo'
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    return Response.json(
      { error: 'Error interno del servidor al eliminar el medicamento' },
      { status: 500 }
    );
  }
}
