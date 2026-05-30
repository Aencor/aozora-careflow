const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const path = require('path');

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'dev.db');

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting MASSIVE database seeding...');

  // 1. Create Default Roles
  const defaultRoles = [
    { name: 'administrador', description: 'Control total del sistema' },
    { name: 'manager', description: 'Gestión de médicos, consultorios y reportes' },
    { name: 'guardia', description: 'Registro de entradas (Check-In) y salidas (Check-Out)' },
    { name: 'medico', description: 'Visualización de consultas asignadas' },
    { name: 'usuario', description: 'Personal general del hospital' },
    { name: 'visitante', description: 'Acceso básico auto-gestionado' },
  ];

  console.log('Creating roles...');
  const roleRecords = {};
  for (const role of defaultRoles) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    roleRecords[role.name] = record;
    console.log(`- Role "${role.name}" upserted.`);
  }

  const roleAdmin = roleRecords['administrador'];
  const roleManager = roleRecords['manager'];
  const roleGuardia = roleRecords['guardia'];
  const roleMedico = roleRecords['medico'];

  // Hashed Passwords
  const adminHashedPass = await bcrypt.hash('adminpassword', 10);
  const staffHashedPass = await bcrypt.hash('staffpassword', 10);
  const doctorHashedPass = await bcrypt.hash('doctorpassword', 10);

  // 2. Create 7 Clinics (Consultorios 101 - 107)
  console.log('Creating 7 clinics...');
  const clinicData = [
    { name: 'Consultorio 101', specialty: 'Pediatría', floor: 'Piso 1' },
    { name: 'Consultorio 102', specialty: 'Cardiología', floor: 'Piso 1' },
    { name: 'Consultorio 103', specialty: 'Ginecología', floor: 'Piso 2' },
    { name: 'Consultorio 104', specialty: 'Medicina General', floor: 'Piso 2' },
    { name: 'Consultorio 105', specialty: 'Traumatología', floor: 'Piso 3' },
    { name: 'Consultorio 106', specialty: 'Dermatología', floor: 'Piso 3' },
    { name: 'Consultorio 107', specialty: 'Oftalmología', floor: 'Piso 4' },
  ];

  const clinics = [];
  for (const item of clinicData) {
    const record = await prisma.clinic.upsert({
      where: { name: item.name },
      update: { specialty: item.specialty, floor: item.floor },
      create: item,
    });
    clinics.push(record);
    console.log(`- Clinic "${record.name}" (${record.specialty}) upserted.`);
  }

  // 3. Create 7 Doctors with Logins
  console.log('Creating 7 doctors with logins...');
  const doctorData = [
    { name: 'Dr. Alejandro Gómez', specialty: 'Pediatría', username: 'medico1' },
    { name: 'Dra. Elena Rostova', specialty: 'Cardiología', username: 'medico2' },
    { name: 'Dr. Carlos Mendoza', specialty: 'Ginecología', username: 'medico3' },
    { name: 'Dra. Sofía Martínez', specialty: 'Medicina General', username: 'medico4' },
    { name: 'Dr. Javier Ortega', specialty: 'Traumatología', username: 'medico5' },
    { name: 'Dra. Isabela Cruz', specialty: 'Dermatología', username: 'medico6' },
    { name: 'Dr. Mateo Beltrán', specialty: 'Oftalmología', username: 'medico7' },
  ];

  for (let i = 0; i < doctorData.length; i++) {
    const doc = doctorData[i];
    const clinic = clinics[i]; // assign one clinic per doctor
    
    // Create system user account for the doctor
    const user = await prisma.user.upsert({
      where: { username: doc.username },
      update: {
        name: doc.name,
        password: doctorHashedPass,
        roleId: roleMedico.id,
      },
      create: {
        username: doc.username,
        name: doc.name,
        password: doctorHashedPass,
        roleId: roleMedico.id,
      },
    });

    // Create doctor profile linked to user and clinic
    await prisma.doctor.upsert({
      where: { id: `doc-seeded-${i + 1}` },
      update: {
        name: doc.name,
        specialty: doc.specialty,
        clinicId: clinic.id,
        userId: user.id,
      },
      create: {
        id: `doc-seeded-${i + 1}`,
        name: doc.name,
        specialty: doc.specialty,
        clinicId: clinic.id,
        userId: user.id,
      },
    });
    console.log(`- Doctor "${doc.name}" (User: ${doc.username}) assigned to ${clinic.name}.`);
  }

  // 4. Create 14 Support Staff Members
  console.log('Creating 14 support staff users...');
  
  // 4.1. Admins (4)
  console.log('Registering 4 administrators...');
  await prisma.user.upsert({
    where: { username: 'admin' }, // keep standard admin
    update: { password: adminHashedPass, roleId: roleAdmin.id },
    create: { username: 'admin', name: 'Administrador Hospital', password: adminHashedPass, roleId: roleAdmin.id }
  });
  
  for (let i = 2; i <= 4; i++) {
    const username = `admin${i}`;
    await prisma.user.upsert({
      where: { username },
      update: { password: staffHashedPass, roleId: roleAdmin.id },
      create: { username, name: `Admin Hospital ${i}`, password: staffHashedPass, roleId: roleAdmin.id }
    });
    console.log(`- Admin "${username}" upserted.`);
  }

  // 4.2. Managers (4)
  console.log('Registering 4 managers...');
  for (let i = 1; i <= 4; i++) {
    const username = `manager${i}`;
    await prisma.user.upsert({
      where: { username },
      update: { password: staffHashedPass, roleId: roleManager.id },
      create: { username, name: `Manager Operaciones ${i}`, password: staffHashedPass, roleId: roleManager.id }
    });
    console.log(`- Manager "${username}" upserted.`);
  }

  // 4.3. Guardias (6)
  console.log('Registering 6 guardias...');
  for (let i = 1; i <= 6; i++) {
    const username = `guardia${i}`;
    await prisma.user.upsert({
      where: { username },
      update: { password: staffHashedPass, roleId: roleGuardia.id },
      create: { username, name: `Guardia Seguridad ${i}`, password: staffHashedPass, roleId: roleGuardia.id }
    });
    console.log(`- Guardia "${username}" upserted.`);
  }

  console.log('✅ MASSIVE Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
