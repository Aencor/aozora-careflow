import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { 
      visitId, ailments, medicines, followUp,
      age, gender, chronicConditions, allergies, currentMedications, lastMenstrualPeriod 
    } = await request.json();

    if (!visitId) {
      return Response.json(
        { error: 'El ID de la visita es requerido para realizar el check-out' },
        { status: 400 }
      );
    }

    // Verify if the visit exists and is currently in house
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      return Response.json(
        { error: 'No se encontró el registro de la visita' },
        { status: 404 }
      );
    }

    if (visit.status === 'fuera') {
      return Response.json(
        { error: 'Esta visita ya registra una salida (check-out)' },
        { status: 400 }
      );
    }

    // Perform check-out
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: 'fuera',
        checkOutTime: new Date(),
        ailments: ailments ? ailments.trim() : undefined,
        medicines: medicines ? medicines.trim() : undefined,
        followUp: followUp ? followUp.trim() : undefined,
        age: age !== undefined ? (age !== null ? parseInt(age) : null) : undefined,
        gender: gender !== undefined ? gender : undefined,
        chronicConditions: chronicConditions !== undefined ? chronicConditions : undefined,
        allergies: allergies !== undefined ? allergies : undefined,
        currentMedications: currentMedications !== undefined ? currentMedications : undefined,
        lastMenstrualPeriod: lastMenstrualPeriod !== undefined ? (lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null) : undefined,
      },
    });

    return Response.json({
      success: true,
      message: `Salida registrada exitosamente para ${updatedVisit.patientName}`,
      visit: updatedVisit,
    });
  } catch (error) {
    console.error('Error during check-out:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar la salida' },
      { status: 500 }
    );
  }
}
