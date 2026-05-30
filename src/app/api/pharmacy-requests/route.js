import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: Fetch all pharmacy requests (ordered with "pendiente" first, then by date desc)
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco', 'enfermero', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere iniciar sesión con un rol válido' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    const where = {};
    if (visitId) {
      where.visitId = visitId;
    }

    const requests = await prisma.pharmacyRequest.findMany({
      where,
      include: {
        visit: {
          include: {
            doctor: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // 'pendiente' first
        { createdAt: 'desc' }
      ]
    });

    return Response.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching pharmacy requests:', error);
    return Response.json(
      { error: 'Error interno al obtener las solicitudes de farmacia' },
      { status: 500 }
    );
  }
}

// POST: Create a new pharmacy request (Triggered when nurse submits a clinical checkup)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'medico', 'enfermero', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador, médico o enfermero' },
        { status: 403 }
      );
    }

    const { visitId, medicines, nurseName } = await request.json();

    if (!visitId || !medicines) {
      return Response.json(
        { error: 'El ID de la visita y los medicamentos solicitados son obligatorios' },
        { status: 400 }
      );
    }

    // Verify if visit exists
    const visitExists = await prisma.visit.findUnique({
      where: { id: visitId }
    });

    if (!visitExists) {
      return Response.json(
        { error: 'La visita hospitalaria seleccionada no es válida' },
        { status: 404 }
      );
    }

    // Create the pharmacy request
    const newRequest = await prisma.pharmacyRequest.create({
      data: {
        visitId,
        nurseName: nurseName || session.name, // Fallback to session name
        medicines: medicines.trim(),
        status: 'pendiente'
      }
    });

    return Response.json({
      success: true,
      message: 'Solicitud de medicamento enviada a farmacia con éxito',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating pharmacy request:', error);
    return Response.json(
      { error: 'Error interno del servidor al crear la solicitud de medicamento' },
      { status: 500 }
    );
  }
}

// PUT: Dispense/Deliver a pending medication request (restricted to administrador or farmaco)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'farmaco'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o fármaco' },
        { status: 403 }
      );
    }

    const { requestId } = await request.json();

    if (!requestId) {
      return Response.json(
        { error: 'El ID de la solicitud (requestId) es obligatorio' },
        { status: 400 }
      );
    }

    // Verify request exists
    const requestExists = await prisma.pharmacyRequest.findUnique({
      where: { id: requestId }
    });

    if (!requestExists) {
      return Response.json(
        { error: 'La solicitud de farmacia no es válida o no existe' },
        { status: 404 }
      );
    }

    if (requestExists.status === 'entregado') {
      return Response.json(
        { error: 'Esta solicitud ya ha sido despachada previamente' },
        { status: 400 }
      );
    }

    // Update status to delivered
    const updatedRequest = await prisma.pharmacyRequest.update({
      where: { id: requestId },
      data: {
        status: 'entregado',
        dispensedBy: session.name,
        dispensedAt: new Date()
      }
    });

    return Response.json({
      success: true,
      message: 'Medicamentos despachados y entregados con éxito',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error dispensing pharmacy request:', error);
    return Response.json(
      { error: 'Error interno del servidor al dispensar el medicamento' },
      { status: 500 }
    );
  }
}
