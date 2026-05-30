import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// POST: Toggle or set isPresent status for self or target user (override)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { error: 'No autorizado. Inicie sesión.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userId, isPresent } = body;

    // Admin override scenario
    if (userId) {
      if (!hasRole(session, ['administrador', 'manager'])) {
        return Response.json(
          { error: 'No autorizado para realizar modificaciones de asistencia.' },
          { status: 403 }
        );
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!targetUser) {
        return Response.json(
          { error: 'El usuario especificado no existe.' },
          { status: 404 }
        );
      }

      const finalPresence = isPresent !== undefined ? isPresent : !targetUser.isPresent;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isPresent: finalPresence },
      });

      return Response.json({
        success: true,
        message: `Presencia de "${updatedUser.name}" actualizada a: ${updatedUser.isPresent ? 'DENTRO' : 'FUERA'}.`,
        isPresent: updatedUser.isPresent,
      });
    }

    // Self check-in / check-out scenario
    const targetUser = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!targetUser) {
      return Response.json(
        { error: 'El usuario de la sesión actual no existe.' },
        { status: 404 }
      );
    }

    const finalPresence = isPresent !== undefined ? isPresent : !targetUser.isPresent;
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { isPresent: finalPresence },
    });

    return Response.json({
      success: true,
      message: updatedUser.isPresent
        ? '¡Ingreso registrado! Tu estatus ahora es DENTRO del hospital.'
        : '¡Salida registrada! Tu estatus ahora es FUERA del hospital.',
      isPresent: updatedUser.isPresent,
    });
  } catch (error) {
    console.error('Error toggling staff presence:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar asistencia.' },
      { status: 500 }
    );
  }
}
