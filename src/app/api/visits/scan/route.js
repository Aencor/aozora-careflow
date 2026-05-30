import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { qrToken } = await request.json();

    if (!qrToken) {
      return Response.json(
        { error: 'El token de código QR es requerido para procesar la cita' },
        { status: 400 }
      );
    }

    // Find the pre-scheduled visit by its unique QR token
    const visit = await prisma.visit.findUnique({
      where: { qrToken },
      include: {
        doctor: {
          select: {
            name: true,
            specialty: true,
          }
        }
      }
    });

    if (!visit) {
      return Response.json(
        { error: 'El código QR es inválido o no corresponde a ninguna cita' },
        { status: 404 }
      );
    }

    if (visit.status === 'in house') {
      return Response.json(
        { error: `El paciente ${visit.patientName} ya se encuentra registrado dentro del hospital.` },
        { status: 400 }
      );
    }

    if (visit.status === 'fuera') {
      return Response.json(
        { error: 'Esta cita ya ha sido completada y el paciente ya se retiró.' },
        { status: 400 }
      );
    }

    // Complete check-in for the pre-scheduled appointment
    const updatedVisit = await prisma.visit.update({
      where: { qrToken },
      data: {
        status: 'in house',
        checkInTime: new Date(),
      },
      include: {
        doctor: true,
      }
    });

    return Response.json({
      success: true,
      message: `¡Bienvenido! Cita confirmada para ${updatedVisit.patientName}. Entrada registrada automáticamente.`,
      visit: updatedVisit,
    });
  } catch (error) {
    console.error('Error during QR check-in scan:', error);
    return Response.json(
      { error: 'Error interno del servidor al procesar la cita por QR' },
      { status: 500 }
    );
  }
}
