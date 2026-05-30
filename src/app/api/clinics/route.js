import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: List all clinics
export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return Response.json({ success: true, clinics });
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return Response.json(
      { error: 'Error al obtener los consultorios' },
      { status: 500 }
    );
  }
}

// POST: Register a new clinic (restricted to administrador and manager)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { name, specialty, floor } = await request.json();

    if (!name || !specialty) {
      return Response.json(
        { error: 'El nombre y la especialidad son campos obligatorios' },
        { status: 400 }
      );
    }

    // Check if clinic name already exists
    const existingClinic = await prisma.clinic.findUnique({
      where: { name: name.trim() },
    });

    if (existingClinic) {
      return Response.json(
        { error: `El consultorio "${name}" ya está registrado` },
        { status: 400 }
      );
    }

    // Create the clinic
    const newClinic = await prisma.clinic.create({
      data: {
        name: name.trim(),
        specialty: specialty.trim(),
        floor: floor ? floor.trim() : null,
      },
    });

    return Response.json({
      success: true,
      message: `Consultorio "${name}" registrado exitosamente`,
      clinic: newClinic,
    });
  } catch (error) {
    console.error('Error creating clinic:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar el consultorio' },
      { status: 500 }
    );
  }
}
