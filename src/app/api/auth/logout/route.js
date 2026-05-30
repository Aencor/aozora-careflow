import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();
    return Response.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return Response.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
