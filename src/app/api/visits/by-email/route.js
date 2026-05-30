import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    const latestVisit = await prisma.visit.findFirst({
      where: {
        email: email.toLowerCase().trim(),
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    return Response.json({
      success: true,
      visit: latestVisit, // Returns null if no previous visit exists
    });
  } catch (error) {
    console.error('Error fetching latest visit by email:', error);
    return Response.json(
      { error: 'Error al buscar el historial del paciente' },
      { status: 500 }
    );
  }
}
