import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: Fetch all nurse logs for a given visitId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return Response.json(
        { error: 'El ID de la visita (visitId) es requerido' },
        { status: 400 }
      );
    }

    const logs = await prisma.nurseLog.findMany({
      where: { visitId },
      orderBy: { loggedAt: 'desc' },
    });

    return Response.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching nurse logs:', error);
    return Response.json(
      { error: 'Error al obtener el historial de enfermería' },
      { status: 500 }
    );
  }
}

// POST: Add a new clinical check-up log (restricted to administrador, medico, or enfermero)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'medico', 'enfermero'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador, médico o enfermero' },
        { status: 403 }
      );
    }

    const { visitId, treatments, medicines, indications, loggedAt } = await request.json();

    if (!visitId || !treatments || !medicines || !indications) {
      return Response.json(
        { error: 'El ID de la visita, tratamientos, medicamentos e indicaciones son requeridos' },
        { status: 400 }
      );
    }

    // Verify if visit exists and is active
    const visitExists = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visitExists) {
      return Response.json(
        { error: 'La visita hospitalaria seleccionada no es válida' },
        { status: 404 }
      );
    }

    // Create the nurse log
    const newLog = await prisma.nurseLog.create({
      data: {
        visitId,
        nurseName: session.name, // Set the logged-in user's full name (e.g. nurse name, doctor name or admin name)
        treatments: treatments.trim(),
        medicines: medicines.trim(),
        indications: indications.trim(),
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      },
    });

    return Response.json({
      success: true,
      message: 'Expediente clínico actualizado exitosamente por enfermería',
      log: newLog,
    });
  } catch (error) {
    console.error('Error creating nurse log:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar la bitácora de enfermería' },
      { status: 500 }
    );
  }
}
