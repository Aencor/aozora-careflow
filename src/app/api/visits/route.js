import prisma from '@/lib/prisma';

// GET: Fetch all visits (with option to filter by status or email)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (email) {
      filter.email = email.toLowerCase().trim();
    }

    const visits = await prisma.visit.findMany({
      where: filter,
      include: {
        doctor: {
          select: {
            name: true,
            specialty: true,
          },
        },
      },
      orderBy: { checkInTime: 'desc' },
    });

    return Response.json({ success: true, visits });
  } catch (error) {
    console.error('Error fetching visits:', error);
    return Response.json(
      { error: 'Error al obtener la lista de visitas' },
      { status: 500 }
    );
  }
}

import crypto from 'crypto';

// POST: Register a new Check-In (Visit) or Pre-schedule an Appointment
export async function POST(request) {
  try {
    const { 
      patientName, email, phone, type, destination, reason, 
      visitorCompanion, doctorId, isAppointment, appointmentDate,
      age, gender, chronicConditions, allergies, currentMedications, lastMenstrualPeriod
    } = await request.json();

    if (!patientName || !type || !destination || !reason) {
      return Response.json(
        { error: 'Los campos nombre, tipo de visita, destino y motivo son requeridos' },
        { status: 400 }
      );
    }

    if (isAppointment) {
      // 1. Pre-schedule a medical appointment with a unique QR code token
      const qrToken = crypto.randomUUID();
      const newVisit = await prisma.visit.create({
        data: {
          patientName: patientName.trim(),
          email: email ? email.toLowerCase().trim() : null,
          phone: phone ? phone.trim() : null,
          type,
          destination: destination.trim(),
          reason: reason.trim(),
          visitorCompanion: visitorCompanion ? visitorCompanion.trim() : null,
          status: 'agendado', // Default status for scheduled appointments
          isAppointment: true,
          appointmentDate: new Date(appointmentDate),
          qrToken,
          doctorId: doctorId || null,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          chronicConditions: chronicConditions || null,
          allergies: allergies || null,
          currentMedications: currentMedications || null,
          lastMenstrualPeriod: lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null,
        },
        include: {
          doctor: true,
        },
      });

      return Response.json({
        success: true,
        message: 'Cita médica programada exitosamente',
        visit: newVisit,
      });
    }

    // 2. Standard Walk-In Check-In (Instant)
    const newVisit = await prisma.visit.create({
      data: {
        patientName: patientName.trim(),
        email: email ? email.toLowerCase().trim() : null,
        phone: phone ? phone.trim() : null,
        type,
        destination: destination.trim(),
        reason: reason.trim(),
        visitorCompanion: visitorCompanion ? visitorCompanion.trim() : null,
        status: 'in house', // Hidden field: default to in house
        checkInTime: new Date(), // Hidden field: actual timestamp
        doctorId: doctorId || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        chronicConditions: chronicConditions || null,
        allergies: allergies || null,
        currentMedications: currentMedications || null,
        lastMenstrualPeriod: lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null,
      },
      include: {
        doctor: true,
      },
    });

    return Response.json({
      success: true,
      message: 'Registro de entrada exitoso',
      visit: newVisit,
    });
  } catch (error) {
    console.error('Error creating visit:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar la entrada o cita' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing visit (e.g. promoting emergency to hospitalization)
export async function PUT(request) {
  try {
    const { 
      id, type, destination, doctorId, ailments, status,
      age, gender, chronicConditions, allergies, currentMedications, lastMenstrualPeriod,
      patientName, email, phone, visitorCompanion, reason
    } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'El ID de la visita es requerido' },
        { status: 400 }
      );
    }

    // Verify if doctor exists if doctorId is provided
    if (doctorId) {
      const doc = await prisma.doctor.findUnique({ where: { id: doctorId } });
      if (!doc) {
        return Response.json(
          { error: 'El médico seleccionado no existe' },
          { status: 400 }
        );
      }
    }

    const updateData = {};
    if (type) updateData.type = type;
    if (destination) updateData.destination = destination.trim();
    if (doctorId !== undefined) updateData.doctorId = doctorId;
    if (ailments !== undefined) updateData.ailments = ailments.trim();
    if (status) updateData.status = status;
    if (age !== undefined) updateData.age = age !== null ? parseInt(age) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (chronicConditions !== undefined) updateData.chronicConditions = chronicConditions;
    if (allergies !== undefined) updateData.allergies = allergies;
    if (currentMedications !== undefined) updateData.currentMedications = currentMedications;
    if (lastMenstrualPeriod !== undefined) updateData.lastMenstrualPeriod = lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null;
    if (patientName) updateData.patientName = patientName.trim();
    if (email !== undefined) updateData.email = email ? email.toLowerCase().trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (visitorCompanion !== undefined) updateData.visitorCompanion = visitorCompanion ? visitorCompanion.trim() : null;
    if (reason) updateData.reason = reason.trim();

    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: updateData,
      include: {
        doctor: true,
      },
    });

    return Response.json({
      success: true,
      message: 'Visita actualizada exitosamente',
      visit: updatedVisit,
    });
  } catch (error) {
    console.error('Error updating visit:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar la visita' },
      { status: 500 }
    );
  }
}
