import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Fetch medication reminders (optionally filter by visitId or status)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');
    const status = searchParams.get('status');

    const filter = {};
    if (visitId) {
      filter.visitId = visitId;
    }
    if (status) {
      filter.status = status;
    }

    const reminders = await prisma.medicationReminder.findMany({
      where: filter,
      orderBy: { nextDoseAt: 'asc' },
      include: {
        visit: {
          select: {
            patientName: true,
            destination: true,
          }
        }
      }
    });

    return Response.json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching medication reminders:', error);
    return Response.json(
      { error: 'Error al obtener la lista de recordatorios de medicamentos' },
      { status: 500 }
    );
  }
}

// POST: Create a new medication reminder cycle
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { visitId, medicationName, intervalHours } = await request.json();

    if (!visitId || !medicationName || !intervalHours) {
      return Response.json(
        { error: 'El ID de la visita, el medicamento y el intervalo son requeridos' },
        { status: 400 }
      );
    }

    const interval = parseInt(intervalHours, 10);
    const nextDose = new Date();
    nextDose.setHours(nextDose.getHours() + interval);

    const reminder = await prisma.medicationReminder.create({
      data: {
        visitId,
        medicationName: medicationName.trim(),
        intervalHours: interval,
        nextDoseAt: nextDose,
        lastAdministeredAt: new Date(),
        status: 'activo',
        nurseName: session.name,
      },
    });

    return Response.json({
      success: true,
      message: 'Ciclo de recordatorios de medicamento iniciado',
      reminder,
    });
  } catch (error) {
    console.error('Error creating medication reminder:', error);
    return Response.json(
      { error: 'Error interno al registrar el recordatorio de medicamento' },
      { status: 500 }
    );
  }
}

// PUT: Administer next dose, complete cycle or cancel cycle
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, action } = await request.json();

    if (!id || !action) {
      return Response.json(
        { error: 'El ID del recordatorio y la acción son requeridos' },
        { status: 400 }
      );
    }

    const reminder = await prisma.medicationReminder.findUnique({
      where: { id },
      include: { visit: true },
    });

    if (!reminder) {
      return Response.json(
        { error: 'El recordatorio no existe' },
        { status: 404 }
      );
    }

    if (action === 'administer') {
      // 1. Create a NurseLog showing the administration of this periodic dose
      await prisma.nurseLog.create({
        data: {
          visitId: reminder.visitId,
          nurseName: session.name,
          treatments: `Administración programada de medicamento`,
          medicines: `${reminder.medicationName} (Toma periódica cada ${reminder.intervalHours} hrs)`,
          indications: `Dosis de mantenimiento administrada a tiempo por enfermería.`,
          loggedAt: new Date(),
        },
      });

      // 2. Calculate next dose time
      const nextDose = new Date();
      nextDose.setHours(nextDose.getHours() + reminder.intervalHours);

      const updated = await prisma.medicationReminder.update({
        where: { id },
        data: {
          lastAdministeredAt: new Date(),
          nextDoseAt: nextDose,
          status: 'activo',
        },
      });

      return Response.json({
        success: true,
        message: 'Toma registrada exitosamente. Siguiente dosis programada.',
        reminder: updated,
      });
    } else if (action === 'complete') {
      const updated = await prisma.medicationReminder.update({
        where: { id },
        data: { status: 'completado' },
      });

      return Response.json({
        success: true,
        message: 'Ciclo de medicamento marcado como completado',
        reminder: updated,
      });
    } else if (action === 'cancel') {
      const updated = await prisma.medicationReminder.update({
        where: { id },
        data: { status: 'cancelado' },
      });

      return Response.json({
        success: true,
        message: 'Ciclo de medicamento cancelado con éxito',
        reminder: updated,
      });
    } else {
      return Response.json(
        { error: 'Acción no válida' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating medication reminder:', error);
    return Response.json(
      { error: 'Error interno al actualizar el recordatorio de medicamento' },
      { status: 500 }
    );
  }
}
