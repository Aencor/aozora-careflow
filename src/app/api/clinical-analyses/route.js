import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Fetch clinical analyses (optionally filter by visitId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    const filter = {};
    if (visitId) {
      filter.visitId = visitId;
    }

    const analyses = await prisma.clinicalAnalysis.findMany({
      where: filter,
      orderBy: { scheduledAt: 'asc' },
      include: {
        visit: {
          select: {
            patientName: true,
            destination: true,
          }
        }
      }
    });

    return Response.json({ success: true, analyses });
  } catch (error) {
    console.error('Error fetching clinical analyses:', error);
    return Response.json(
      { error: 'Error al obtener la lista de análisis clínicos' },
      { status: 500 }
    );
  }
}

// POST: Request a new clinical analysis
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { visitId, name, scheduledAt, notes } = await request.json();

    if (!visitId || !name || !scheduledAt) {
      return Response.json(
        { error: 'El ID de la visita, el nombre del análisis y la fecha programada son requeridos' },
        { status: 400 }
      );
    }

    const analysis = await prisma.clinicalAnalysis.create({
      data: {
        visitId,
        name: name.trim(),
        requestedBy: session.name,
        requestedRole: session.role,
        scheduledAt: new Date(scheduledAt),
        notes: notes ? notes.trim() : null,
        status: 'solicitado',
      },
    });

    return Response.json({
      success: true,
      message: 'Análisis clínico solicitado exitosamente',
      analysis,
    });
  } catch (error) {
    console.error('Error creating clinical analysis:', error);
    return Response.json(
      { error: 'Error interno al registrar el análisis clínico' },
      { status: 500 }
    );
  }
}

// PUT: Update clinical analysis (results, notes, incidences, reschedule or mark as not done)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const {
      id, status, results, notes, incidences, notDoneReason, rescheduledTo, rescheduledReason, pdfUrl
    } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'El ID del análisis clínico es requerido' },
        { status: 400 }
      );
    }

    const currentAnalysis = await prisma.clinicalAnalysis.findUnique({
      where: { id },
    });

    if (!currentAnalysis) {
      return Response.json(
        { error: 'El análisis clínico no existe' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (results !== undefined) updateData.results = results ? results.trim() : null;
    if (notes !== undefined) updateData.notes = notes ? notes.trim() : null;
    if (incidences !== undefined) updateData.incidences = incidences ? incidences.trim() : null;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl ? pdfUrl.trim() : null;
    
    if (status === 'no realizado') {
      updateData.notDoneReason = notDoneReason ? notDoneReason.trim() : 'No especificado';
    } else if (status === 'reprogramado') {
      if (!rescheduledTo) {
        return Response.json(
          { error: 'La nueva fecha de reprogramación es requerida' },
          { status: 400 }
        );
      }
      updateData.rescheduled = true;
      updateData.scheduledAt = new Date(rescheduledTo);
      updateData.rescheduledTo = new Date(rescheduledTo);
      updateData.rescheduledReason = rescheduledReason ? rescheduledReason.trim() : 'No especificado';
    }

    const updatedAnalysis = await prisma.clinicalAnalysis.update({
      where: { id },
      data: updateData,
    });

    return Response.json({
      success: true,
      message: 'Análisis clínico actualizado exitosamente',
      analysis: updatedAnalysis,
    });
  } catch (error) {
    console.error('Error updating clinical analysis:', error);
    return Response.json(
      { error: 'Error interno al actualizar el análisis clínico' },
      { status: 500 }
    );
  }
}
