import prisma from '@/lib/prisma';
import { getSession, hasRole } from '@/lib/auth';

// GET: List all doctors
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            specialty: true,
            floor: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return Response.json({ success: true, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return Response.json(
      { error: 'Error al obtener los médicos' },
      { status: 500 }
    );
  }
}

// POST: Register a doctor and assign to a clinic (restricted to administrador and manager)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { name, specialty, clinicId, email, phone, whatsapp } = await request.json();

    if (!name || !specialty) {
      return Response.json(
        { error: 'El nombre y la especialidad son campos obligatorios' },
        { status: 400 }
      );
    }

    // Verify if clinic exists if clinicId is provided
    if (clinicId) {
      const clinicExists = await prisma.clinic.findUnique({
        where: { id: clinicId },
      });

      if (!clinicExists) {
        return Response.json(
          { error: 'El consultorio seleccionado no es válido' },
          { status: 400 }
        );
      }
    }

    // Create the doctor
    const newDoctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        specialty: specialty.trim(),
        clinicId: clinicId || null,
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        whatsapp: whatsapp ? whatsapp.trim() : null,
      },
      include: {
        clinic: true,
      },
    });

    return Response.json({
      success: true,
      message: `Médico "${name}" registrado exitosamente`,
      doctor: newDoctor,
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar al médico' },
      { status: 500 }
    );
  }
}

// PUT: Update a doctor's profile (restricted to doctor themselves, or admin/manager)
export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { error: 'No autorizado. Inicie sesión.' },
        { status: 401 }
      );
    }

    const { id, name, specialty, workingHours, clinicId, email, phone, whatsapp } = await request.json();

    let targetDoctorId = id;

    // If the logged-in user is a doctor, they can only edit their own profile (which we find by their userId)
    if (session.role === 'medico') {
      const doctorProfile = await prisma.doctor.findUnique({
        where: { userId: session.id }
      });
      if (!doctorProfile) {
        return Response.json(
          { error: 'Perfil de médico no encontrado' },
          { status: 404 }
        );
      }
      targetDoctorId = doctorProfile.id;
    } else if (!hasRole(session, ['administrador', 'manager'])) {
      // Non-medico, non-admin/manager users cannot modify doctors
      return Response.json(
        { error: 'No autorizado para realizar esta acción' },
        { status: 403 }
      );
    }

    if (!targetDoctorId) {
      return Response.json(
        { error: 'ID de médico requerido' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (specialty !== undefined) updateData.specialty = specialty.trim();
    if (workingHours !== undefined) updateData.workingHours = workingHours ? workingHours.trim() : null;
    if (email !== undefined) updateData.email = email ? email.trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp ? whatsapp.trim() : null;
    if (clinicId !== undefined && hasRole(session, ['administrador', 'manager'])) {
      updateData.clinicId = clinicId || null;
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: targetDoctorId },
      data: updateData,
      include: { clinic: true },
    });

    return Response.json({
      success: true,
      message: 'Perfil de médico actualizado exitosamente',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar el perfil' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a doctor (restricted to administrador and manager)
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, ['administrador', 'manager'])) {
      return Response.json(
        { error: 'No autorizado. Se requiere rol de administrador o manager' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'El ID del médico es requerido' },
        { status: 400 }
      );
    }

    // Delete the doctor
    await prisma.doctor.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: 'Médico eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return Response.json(
      { error: 'Error interno del servidor al eliminar al médico' },
      { status: 500 }
    );
  }
}
