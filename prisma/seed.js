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
    { name: 'farmaco', description: 'Gestión y despacho de farmacia hospitalaria' },
    { name: 'enfermero', description: 'Atención clínica y bitácora de enfermería' },
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
  const roleFarmaco = roleRecords['farmaco'];
  const roleEnfermero = roleRecords['enfermero'];

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

  // 4.4. Fármacos (1)
  console.log('Registering 1 farmaco...');
  await prisma.user.upsert({
    where: { username: 'farmaco1' },
    update: { password: staffHashedPass, roleId: roleFarmaco.id },
    create: { username: 'farmaco1', name: 'Fármaco de Turno', password: staffHashedPass, roleId: roleFarmaco.id }
  });
  console.log('- Pharmacist "farmaco1" upserted.');

  // 4.5. Enfermeros (1)
  console.log('Registering 1 enfermero...');
  await prisma.user.upsert({
    where: { username: 'enfermero1' },
    update: { password: staffHashedPass, roleId: roleEnfermero.id },
    create: { username: 'enfermero1', name: 'Enfermero de Turno', password: staffHashedPass, roleId: roleEnfermero.id }
  });
  console.log('- Nurse "enfermero1" upserted.');

  // 4.6. Create 31 Sample Medications
  console.log('Creating 31 sample medications...');
  const medicationsData = [
    { name: 'Paracetamol 500mg', description: 'Analgésico y antipirético indicado para aliviar dolor leve a moderado y fiebre.', category: 'Analgésico', stock: 150, unit: 'Cajas' },
    { name: 'Ibuprofeno 400mg', description: 'Antiinflamatorio no esteroideo (AINE) para dolor, inflamación y fiebre.', category: 'Antiinflamatorio', stock: 120, unit: 'Cajas' },
    { name: 'Ketorolaco 10mg', description: 'Analgésico potente indicado para el tratamiento a corto plazo del dolor moderado a severo.', category: 'Analgésico', stock: 80, unit: 'Cajas' },
    { name: 'Metamizol Sódico 1g IV', description: 'Analgésico y antipirético inyectable para dolor severo agudo o fiebre refractaria.', category: 'Analgésico', stock: 200, unit: 'Ampollas' },
    { name: 'Tramadol 50mg', description: 'Analgésico opioide para dolor moderado a severo.', category: 'Analgésico', stock: 60, unit: 'Cajas' },
    { name: 'Amoxicilina 500mg', description: 'Antibiótico betalactámico de amplio espectro para infecciones bacterianas.', category: 'Antibiótico', stock: 100, unit: 'Cajas' },
    { name: 'Ceftriaxona 1g IV', description: 'Antibiótico cefalosporínico de tercera generación para infecciones severas.', category: 'Antibiótico', stock: 150, unit: 'Ampollas' },
    { name: 'Azitromicina 500mg', description: 'Antibiótico macrólido para infecciones de vías respiratorias y tejidos blandos.', category: 'Antibiótico', stock: 90, unit: 'Cajas' },
    { name: 'Ciprofloxacino 500mg', description: 'Antibiótico fluoroquinolona de amplio espectro para infecciones urinarias y respiratorias.', category: 'Antibiótico', stock: 110, unit: 'Cajas' },
    { name: 'Claritromicina 500mg', description: 'Antibiótico macrólido indicado en infecciones respiratorias y de piel.', category: 'Antibiótico', stock: 70, unit: 'Cajas' },
    { name: 'Clindamicina 300mg', description: 'Antibiótico indicado para bacterias anaerobias e infecciones óseas/articulares.', category: 'Antibiótico', stock: 85, unit: 'Cajas' },
    { name: 'Losartán 50mg', description: 'Antagonista de receptores de angiotensina II para hipertensión arterial.', category: 'Cardiovascular', stock: 180, unit: 'Cajas' },
    { name: 'Enalapril 10mg', description: 'Inhibidor de la ECA para tratamiento de hipertensión e insuficiencia cardíaca.', category: 'Cardiovascular', stock: 140, unit: 'Cajas' },
    { name: 'Amlodipino 5mg', description: 'Antagonista de canales de calcio indicado para hipertensión y angina de pecho.', category: 'Cardiovascular', stock: 130, unit: 'Cajas' },
    { name: 'Metoprolol 100mg', description: 'Beta-bloqueador para hipertensión arterial, angina de pecho y arritmias.', category: 'Cardiovascular', stock: 95, unit: 'Cajas' },
    { name: 'Atorvastatina 20mg', description: 'Estatina indicada para reducir el colesterol y triglicéridos elevados.', category: 'Cardiovascular', stock: 200, unit: 'Cajas' },
    { name: 'Metformina 850mg', description: 'Antidiabético oral para el control de la diabetes mellitus tipo 2.', category: 'Endocrino', stock: 250, unit: 'Cajas' },
    { name: 'Glibenclamida 5mg', description: 'Hipoglucemiante oral del grupo de las sulfonilureas para diabetes tipo 2.', category: 'Endocrino', stock: 100, unit: 'Cajas' },
    { name: 'Insulina Glargina 100 UI/ml', description: 'Insulina de acción prolongada de 24 horas para control glucémico.', category: 'Endocrino', stock: 50, unit: 'Viales' },
    { name: 'Insulina Rápida Humana 100 UI/ml', description: 'Insulina de acción rápida/regular para control glucémico prandial.', category: 'Endocrino', stock: 45, unit: 'Viales' },
    { name: 'Loratadina 10mg', description: 'Antihistamínico de segunda generación no sedante para alergias y rinitis.', category: 'Antihistamínico', stock: 160, unit: 'Cajas' },
    { name: 'Cetirizina 10mg', description: 'Antihistamínico para alivio de síntomas de rinitis alérgica y urticaria.', category: 'Antihistamínico', stock: 140, unit: 'Cajas' },
    { name: 'Salbutamol Aerosol 100mcg', description: 'Broncodilatador beta-2 agonista de acción rápida para asma y broncoespasmo.', category: 'Respiratorio', stock: 75, unit: 'Inhaladores' },
    { name: 'Montelukast 10mg', description: 'Antagonista de receptores de leucotrienos para control crónico del asma.', category: 'Respiratorio', stock: 110, unit: 'Cajas' },
    { name: 'Omeprazol 20mg', description: 'Inhibidor de la bomba de protones para gastritis, reflujo y úlceras.', category: 'Gastrointestinal', stock: 300, unit: 'Cajas' },
    { name: 'Ranitidina 150mg', description: 'Antagonista de receptores H2 para reducir acidez estomacal.', category: 'Gastrointestinal', stock: 150, unit: 'Cajas' },
    { name: 'Metoclopramida 10mg', description: 'Procinético y antiemético para reflujo gastroesofágico y náuseas.', category: 'Gastrointestinal', stock: 120, unit: 'Cajas' },
    { name: 'Butilhioscina 10mg', description: 'Espasmolítico para cólicos y espasmos del tracto gastrointestinal y biliar.', category: 'Gastrointestinal', stock: 90, unit: 'Cajas' },
    { name: 'Dexametasona 4mg IV', description: 'Corticoesteroide antiinflamatorio e inmunosupresor inyectable potente.', category: 'Corticoesteroide', stock: 100, unit: 'Ampollas' },
    { name: 'Prednisona 5mg', description: 'Glucocorticoide sintético de acción intermedia para afecciones inflamatorias.', category: 'Corticoesteroide', stock: 120, unit: 'Cajas' },
    { name: 'Diazepam 10mg', description: 'Benzodiacepina con efectos ansiolíticos, miorrelajantes y anticonvulsivantes.', category: 'Ansiolítico', stock: 80, unit: 'Cajas' }
  ];

  for (const med of medicationsData) {
    await prisma.medication.upsert({
      where: { name: med.name },
      update: {
        description: med.description,
        category: med.category,
        stock: med.stock,
        unit: med.unit
      },
      create: med
    });
  }
  console.log('- 31 Sample medications upserted successfully.');

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
