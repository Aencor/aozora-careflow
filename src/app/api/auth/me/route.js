import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    // Fetch the most up-to-date presence status from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { isPresent: true }
    });

    const mergedUser = {
      ...session,
      isPresent: dbUser ? dbUser.isPresent : false
    };

    return Response.json({
      authenticated: true,
      user: mergedUser,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return Response.json(
      { error: 'Error al obtener la sesión' },
      { status: 500 }
    );
  }
}
