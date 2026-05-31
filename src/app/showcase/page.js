'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  UserPlus, 
  UserMinus, 
  ShieldAlert, 
  Building, 
  Stethoscope, 
  Clock, 
  UserCheck, 
  Search,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  LogIn,
  QrCode,
  Calendar,
  Check,
  Bed,
  Play,
  ArrowRight,
  RefreshCw,
  Smartphone,
  CheckSquare,
  BarChart3,
  Database,
  ShieldCheck,
  Download,
  Award,
  ArrowLeft,
  HeartPulse,
  Pill,
  FileText
} from 'lucide-react';

export default function ShowcasePage() {
  // Simulator State
  const [currentStep, setCurrentStep] = useState(1);
  
  // Custom inputs for Simulator
  const [simName, setSimName] = useState('Sofía Montenegro');
  const [simEmail, setSimEmail] = useState('sofia.montenegro@email.com');
  const [simReason, setSimReason] = useState('Consulta obstétrica por fatiga, taquicardia y revisión de antecedente de preeclampsia');
  const [simDestination, setSimDestination] = useState('Consultorio 102 (Cardiología)');
  const [simDoctor, setSimDoctor] = useState('Dra. Elena Rostova');

  // Antecedentes Clínicos del Paciente
  const [simAge, setSimAge] = useState(32);
  const [simGender, setSimGender] = useState('Femenino');
  const [simAllergies, setSimAllergies] = useState('Penicilina, Sulfamidas');
  const [simChronicConditions, setSimChronicConditions] = useState('Diabetes gestacional, hipertensión gestacional crónica');
  const [simCurrentMedications, setSimCurrentMedications] = useState('Metildopa 250mg cada 12 horas, Aspirina protect 150mg/día');
  const [simLmp, setSimLmp] = useState('2026-05-10');
  const [showAntecedents, setShowAntecedents] = useState(true);

  // Análisis Clínicos del Paciente
  const [simAnalysisName, setSimAnalysisName] = useState('Química Sanguínea de 6 Elementos');
  const [simAnalysisScheduled, setSimAnalysisScheduled] = useState('2026-05-31T08:30');
  const [simAnalysisStatus, setSimAnalysisStatus] = useState('solicitado'); // solicitado | realizado | no realizado | reprogramado
  const [simAnalysisResults, setSimAnalysisResults] = useState('Glucosa: 84 mg/dL, Urea: 24 mg/dL, Creatinina: 0.72 mg/dL. Perfil hepático y renal estable.');
  const [simAnalysisIncidences, setSimAnalysisIncidences] = useState('Paciente refirió dolor de cabeza leve transitorio. Muestra tomada sin contratiempos.');
  const [simAnalysisPdfUrl, setSimAnalysisPdfUrl] = useState('https://aozora.careflow.com/docs/quimica-sofia-montenegro.pdf');
  const [simAnalysisRequested, setSimAnalysisRequested] = useState(true);

  // Recordatorios de Medicación
  const [simReminderName, setSimReminderName] = useState('Metoprolol 50mg');
  const [simReminderActive, setSimReminderActive] = useState(true);
  const [simReminderInterval, setSimReminderInterval] = useState(8);
  const [simReminderAlertTriggered, setSimReminderAlertTriggered] = useState(true);
  const [simReminderDosesTaken, setSimReminderDosesTaken] = useState(0);
  
  // Doctor step state
  const [simAilments, setSimAilments] = useState('Arritmia sinusal leve, fatiga asociada a estrés laboral.');
  const [simMedicines, setSimMedicines] = useState('Metoprolol 50mg - 1 tableta al día por la mañana. Descanso de 2 días.');
  const [simFollowUp, setSimFollowUp] = useState('Revisión en 1 mes con electrocardiograma de control.');
  
  // Nurse step state
  const [simNurseName, setSimNurseName] = useState('Enf. Carlos Rivera');
  const [simTreatments, setSimTreatments] = useState('Monitoreo ECG de 15 minutos en camilla, toma de signos vitales.');
  const [simNurseMedicines, setSimNurseMedicines] = useState('Ninguno (Paciente estable para tratamiento ambulatorio).');
  const [simNurseIndications, setSimNurseIndications] = useState('PA: 118/76 mmHg. Frecuencia Cardíaca: 72 lpm. Paciente descansada.');
  const [nurseLogList, setNurseLogList] = useState([]);
  
  // Role Explorer State
  const [activeRoleTab, setActiveRoleTab] = useState('guardia'); // 'guardia' | 'medico' | 'enfermera' | 'admin'

  // Generated QR Code dynamic state
  const [qrToken, setQrToken] = useState('QR-VC-7729-DE');
  
  // Handle QR Regeneration
  const regenerateQR = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setQrToken(`QR-VC-${randomNum}-SM`);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      if (currentStep === 3 && nurseLogList.length === 0) {
        // Auto-seed a nurse log for step 4 to make it realistic
        setNurseLogList([{
          nurseName: simNurseName,
          treatments: simTreatments,
          medicines: simNurseMedicines,
          indications: simNurseIndications,
          loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSimulator = () => {
    setCurrentStep(1);
    regenerateQR();
    setSimName('Sofía Montenegro');
    setSimEmail('sofia.montenegro@email.com');
    setSimReason('Consulta obstétrica por fatiga, taquicardia y revisión de antecedente de preeclampsia');
    setSimAilments('Arritmia sinusal leve, fatiga asociada a estrés laboral.');
    setSimMedicines('Metoprolol 50mg - 1 tableta al día por la mañana. Descanso de 2 días.');
    setSimFollowUp('Revisión en 1 mes con electrocardiograma de control.');
    setNurseLogList([]);
    setSimAge(32);
    setSimGender('Femenino');
    setSimAllergies('Penicilina, Sulfamidas');
    setSimChronicConditions('Diabetes gestacional, hipertensión gestacional crónica');
    setSimCurrentMedications('Metildopa 250mg cada 12 horas, Aspirina protect 150mg/día');
    setSimLmp('2026-05-10');
    setSimAnalysisName('Química Sanguínea de 6 Elementos');
    setSimAnalysisStatus('solicitado');
    setSimAnalysisRequested(true);
    setSimReminderActive(true);
    setSimReminderAlertTriggered(true);
    setSimReminderDosesTaken(0);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[100px] -z-10"></div>

      {/* Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:scale-105 transition-transform duration-300">
              <Activity className="w-6 h-6 text-emerald-400 pulse-glow" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Aozora <span className="text-emerald-400 font-extrabold font-display">Care-Flow</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse"></span>
                Showcase Interactivo y Comercial
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 h-10 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 mt-10 flex-1 flex flex-col">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Presentación Exclusiva para Clientes Potenciales</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 font-display leading-tight">
            Trazabilidad, Seguridad y <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">Eficiencia Operativa</span> Hospitalaria
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
            Descubre cómo <strong>Aozora Care-Flow</strong> transforma el caótico registro manual de visitas en un ecosistema integrado y seguro de control de aforo, indicaciones médicas y trazabilidad clínica de 360 grados.
          </p>
          
          {/* Quick buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#simulator-section"
              className="px-6 h-12 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider glow-btn-emerald flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Simular Flujo Completo</span>
            </a>
            <a 
              href="#roles-section"
              className="px-6 h-12 rounded-xl text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-700 bg-slate-900/40 hover:bg-slate-800/40 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4 text-indigo-400" />
              <span>Ver Portales de Trabajo</span>
            </a>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Seguridad Física Rigurosa</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pases de acceso digitalizados mediante códigos QR automáticos. Control exhaustivo de quién ingresa, a qué habitación se dirige, con qué acompañante va y a qué hora realiza su salida exacta.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-teal-500"></div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 mb-4">
              <HeartPulse className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trazabilidad Clínica 360°</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Integra el control de accesos de urgencias y observación con las bitácoras médicas y de enfermería. Cada medicamento e indicación queda auditada e inmutable de inicio a fin.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500"></div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Telemetría y Control de Aforos</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Visualiza en tiempo real la ocupación de camas, aforos en salas de urgencias y consultorios. Proporciona datos analíticos para la toma de decisiones gerenciales y protección civil.
            </p>
          </div>
        </section>

        {/* SIMULATOR SECTION */}
        <section id="simulator-section" className="mb-24 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Simulador de Trazabilidad en Tiempo Real</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Sigue el flujo de una visita médica y experimenta cómo interactúa cada área del hospital.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Simulator Controls & Explanation */}
            <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 sm:p-8 rounded-2xl border-white/5">
              
              <div>
                {/* Steps Visual Progress */}
                <div className="flex items-center gap-1.5 mb-8">
                  {[1, 2, 3, 4, 5].map((stepNum) => (
                    <button
                      key={stepNum}
                      onClick={() => setCurrentStep(stepNum)}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        stepNum <= currentStep 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : 'bg-slate-800'
                      }`}
                      title={`Ir al Paso ${stepNum}`}
                    ></button>
                  ))}
                </div>

                {/* Step Content Description */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      Paso 1: Pre-Registro & Cita
                    </div>
                    <h3 className="text-xl font-bold text-white">El Paciente agenda una cita</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      El paciente o visitor se registra. El sistema asigna su especialidad y doctor, y le genera automáticamente un <strong>pase QR exclusivo</strong> a su correo o WhatsApp.
                    </p>
                    
                    {/* Simulated Form Input inside Simulator Panel */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nombre del Paciente</label>
                        <input 
                          type="text" 
                          value={simName} 
                          onChange={(e) => setSimName(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg glass-input text-xs" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Consultorio/Área</label>
                          <select 
                            value={simDestination}
                            onChange={(e) => {
                              setSimDestination(e.target.value);
                              if (e.target.value.includes('Pediatría')) setSimDoctor('Dr. Alejandro Gómez');
                              else if (e.target.value.includes('Cardiología')) setSimDoctor('Dra. Elena Rostova');
                              else if (e.target.value.includes('Urgencias')) setSimDoctor('Dr. Javier Ortega');
                            }}
                            className="w-full h-9 px-2 rounded-lg glass-input text-[11px]"
                          >
                            <option value="Consultorio 102 (Cardiología)">Consultorio 102 (Cardiología)</option>
                            <option value="Consultorio 101 (Pediatría)">Consultorio 101 (Pediatría)</option>
                            <option value="Sala de Choque (Urgencias)">Sala de Choque (Urgencias)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Médico</label>
                          <input 
                            type="text" 
                            disabled 
                            value={simDoctor} 
                            className="w-full h-9 px-3 rounded-lg glass-input text-xs opacity-60" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Motivo de Consulta</label>
                        <input 
                          type="text" 
                          value={simReason} 
                          onChange={(e) => setSimReason(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg glass-input text-xs" 
                        />
                      </div>
                      
                      <div className="pt-2.5 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Ficha de Antecedentes Clínicos</label>
                          <button
                            type="button"
                            onClick={() => setShowAntecedents(!showAntecedents)}
                            className="text-[9px] text-slate-450 hover:text-slate-200 transition-colors uppercase font-bold cursor-pointer"
                          >
                            {showAntecedents ? 'Ocultar ✕' : 'Mostrar +'}
                          </button>
                        </div>
                        {showAntecedents && (
                          <div className="space-y-2.5 animate-fadeIn">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Edad</label>
                                <input 
                                  type="number" 
                                  value={simAge} 
                                  onChange={(e) => setSimAge(parseInt(e.target.value) || '')}
                                  className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Sexo</label>
                                <select 
                                  value={simGender}
                                  onChange={(e) => setSimGender(e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg glass-input text-[11px]"
                                >
                                  <option value="Femenino">Femenino</option>
                                  <option value="Masculino">Masculino</option>
                                  <option value="Otro">Otro</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Alergias</label>
                              <input 
                                type="text" 
                                value={simAllergies} 
                                onChange={(e) => setSimAllergies(e.target.value)}
                                className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Condiciones Especiales / Crónicas</label>
                              <input 
                                type="text" 
                                value={simChronicConditions} 
                                onChange={(e) => setSimChronicConditions(e.target.value)}
                                className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-1">Medicamentos Activos</label>
                                <input 
                                  type="text" 
                                  value={simCurrentMedications} 
                                  onChange={(e) => setSimCurrentMedications(e.target.value)}
                                  className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-1">Última Menstruación (FUM)</label>
                                <input 
                                  type="date" 
                                  disabled={simGender !== 'Femenino'}
                                  value={simLmp} 
                                  onChange={(e) => setSimLmp(e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg glass-input text-xs disabled:opacity-45" 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider">
                      Paso 2: Registro en Puerta (Guardia)
                    </div>
                    <h3 className="text-xl font-bold text-white">Validación de Acceso con QR</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Al llegar al hospital, el personal de seguridad o recepción escanea el código QR desde cualquier celular o escáner. El sistema valida el pase, registra la hora exacta (Check-In) y marca el estado del paciente como <strong>"In House"</strong>.
                    </p>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Estatus en Puerta:</span> <span className="text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Check-In Autorizado</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Código de Token:</span> <span className="font-mono text-slate-300">{qrToken}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Aforo Hospitalario:</span> <span className="text-slate-300">14 pacientes → <strong className="text-emerald-400">15 pacientes (Activo)</strong></span></div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      Paso 3: Diagnóstico y Receta (Médico)
                    </div>
                    <h3 className="text-xl font-bold text-white">Atención del Médico de Turno</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      El médico recibe una alerta de que el paciente ya está "In House". Durante la consulta, registra en el sistema los síntomas, el diagnóstico y prescribe medicamentos e indicaciones electrónicas integradas.
                    </p>
                    
                    {/* Simulated Medical Inputs */}
                    <div className="space-y-2.5 pt-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Diagnóstico Clínico</label>
                        <textarea 
                          rows="2"
                          value={simAilments} 
                          onChange={(e) => setSimAilments(e.target.value)}
                          className="w-full p-2 rounded-lg glass-input text-xs resize-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Receta Electrónica (Medicamentos)</label>
                        <input 
                          type="text" 
                          value={simMedicines} 
                          onChange={(e) => setSimMedicines(e.target.value)}
                          className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Plan de Seguimiento</label>
                        <input 
                          type="text" 
                          value={simFollowUp} 
                          onChange={(e) => setSimFollowUp(e.target.value)}
                          className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                        />
                      </div>

                      <div className="pt-2.5 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">🧪 Solicitar Análisis Clínico</label>
                          <span className="text-[8px] font-bold text-slate-500 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">NUEVA FUNCIÓN</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                          <div>
                            <label className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider mb-0.5">Estudio a Solicitar</label>
                            <select
                              value={simAnalysisName}
                              onChange={(e) => setSimAnalysisName(e.target.value)}
                              className="w-full h-8 px-2 rounded-lg glass-input text-[11px]"
                            >
                              <option value="Química Sanguínea de 6 Elementos">Química Sanguínea de 6 Elementos</option>
                              <option value="Electrocardiograma de 12 derivaciones">Electrocardiograma 12 derivaciones</option>
                              <option value="Ultrasonido Obstétrico Completo">Ultrasonido Obstétrico Completo</option>
                              <option value="Biometría Hemática Completa">Biometría Hemática Completa</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => setSimAnalysisRequested(!simAnalysisRequested)}
                              className={`w-full h-8 rounded-lg font-bold text-[10px] uppercase transition-all duration-300 border flex items-center justify-center cursor-pointer ${
                                simAnalysisRequested 
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                                  : 'bg-slate-900 text-slate-400 border-white/5 hover:border-slate-500 hover:text-white'
                              }`}
                            >
                              {simAnalysisRequested ? '✓ Solicitado' : '+ Solicitar Estudio'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      Paso 4: Cuidados Clínicos (Enfermería)
                    </div>
                    <h3 className="text-xl font-bold text-white">Seguimiento de Cuidados</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      El personal de enfermería en observación o consultorios visualiza las indicaciones electrónicas dejadas por el médico. Registra en la bitácora (Nurse Logs) los signos vitales, medicamentos administrados y la hora de atención.
                    </p>
                    
                    {/* Simulated Nurse Input */}
                    <div className="space-y-2.5 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Enfermero(a) Responsable</label>
                          <input 
                            type="text" 
                            value={simNurseName} 
                            onChange={(e) => setSimNurseName(e.target.value)}
                            className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Signos Vitales y Estado</label>
                          <input 
                            type="text" 
                            value={simNurseIndications} 
                            onChange={(e) => setSimNurseIndications(e.target.value)}
                            className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tratamiento / Procedimiento Realizado</label>
                        <input 
                          type="text" 
                          value={simTreatments} 
                          onChange={(e) => setSimTreatments(e.target.value)}
                          className="w-full h-8 px-3 rounded-lg glass-input text-xs" 
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const newLog = {
                            nurseName: simNurseName,
                            treatments: simTreatments,
                            medicines: simNurseMedicines,
                            indications: simNurseIndications,
                            loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setNurseLogList([...nurseLogList, newLog]);
                        }}
                        className="w-full h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500 hover:text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>Añadir Registro a Bitácora</span>
                      </button>
                      {/* Recordatorios de Medicación Section */}
                      <div className="pt-2.5 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">🔔 Sistema de Alertas de Medicamento</label>
                          <span className="text-[8px] font-bold text-slate-500 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">NUEVA FUNCIÓN</span>
                        </div>
                        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-350">Recordatorio periódico:</span>
                            <span className="text-emerald-400 font-bold">Activo (Cada {simReminderInterval}h)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-350">Dosis tomadas:</span>
                            <span className="font-bold text-white">{simReminderDosesTaken} dosis</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-350">Simular Alerta de Retraso:</span>
                            <input 
                              type="checkbox"
                              checked={simReminderAlertTriggered}
                              onChange={(e) => setSimReminderAlertTriggered(e.target.checked)}
                              className="rounded border-white/10 bg-slate-950 text-indigo-500 w-3.5 h-3.5 cursor-pointer"
                            />
                          </div>
                          {simReminderAlertTriggered && (
                            <button
                              type="button"
                              onClick={() => {
                                setSimReminderDosesTaken(simReminderDosesTaken + 1);
                                setSimReminderAlertTriggered(false);
                                // Add to nurse log list automatically
                                const newLog = {
                                  nurseName: simNurseName,
                                  treatments: `Administración de dosis regular de ${simReminderName} (Toma a tiempo)`,
                                  medicines: `${simReminderName} - Dosis registrada`,
                                  indications: `Toma regular registrada. Paciente refiere sentirse bien.`,
                                  loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                };
                                setNurseLogList([newLog, ...nurseLogList]);
                              }}
                              className="w-full h-7 rounded-lg bg-rose-500 text-slate-950 text-[10px] font-bold uppercase hover:bg-rose-400 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse"
                            >
                              <span>🔔 Registrar Toma en 1-Clic</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cargar Resultados Section */}
                      {simAnalysisRequested && (
                        <div className="pt-2.5 border-t border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">🧪 Registrar Resultados del Estudio</label>
                            <span className="text-[8px] font-bold text-slate-500 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">NUEVA FUNCIÓN</span>
                          </div>
                          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2.5 text-xs">
                            <div>
                              <label className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider mb-0.5">Estado del Análisis</label>
                              <select
                                value={simAnalysisStatus}
                                onChange={(e) => setSimAnalysisStatus(e.target.value)}
                                className="w-full h-8 px-2 rounded-lg glass-input text-[11px] cursor-pointer"
                              >
                                <option value="solicitado">Solicitado (Pendiente)</option>
                                <option value="realizado">Estudio Realizado (Cargar Resultados)</option>
                                <option value="no realizado">No Realizado (Especificar Motivo)</option>
                                <option value="reprogramado">Reprogramar Estudio</option>
                              </select>
                            </div>

                            {simAnalysisStatus === 'realizado' && (
                              <div className="space-y-2.5 animate-fadeIn">
                                <div>
                                  <label className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider mb-0.5">Informe de Resultados</label>
                                  <textarea
                                    rows="2"
                                    value={simAnalysisResults}
                                    onChange={(e) => setSimAnalysisResults(e.target.value)}
                                    className="w-full p-2 rounded-lg glass-input text-xs resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider mb-0.5">Incidencias o Notas</label>
                                  <input
                                    type="text"
                                    value={simAnalysisIncidences}
                                    onChange={(e) => setSimAnalysisIncidences(e.target.value)}
                                    className="w-full h-8 px-3 rounded-lg glass-input text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider mb-0.5">Enlace Externo PDF Resultados</label>
                                  <input
                                    type="url"
                                    value={simAnalysisPdfUrl}
                                    onChange={(e) => setSimAnalysisPdfUrl(e.target.value)}
                                    className="w-full h-8 px-3 rounded-lg glass-input text-[11px] text-sky-400"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider">
                      Paso 5: Egreso Seguro (Check-Out)
                    </div>
                    <h3 className="text-xl font-bold text-white">Egreso del Sistema</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      El paciente termina su estadía. El guardia registra su salida. El sistema libera la habitación asignada o consultorio, reduce la ocupación del aforo total y bloquea el pase QR para evitar reingresos no autorizados.
                    </p>
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs space-y-1">
                      <p className="font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-400" /> Trazabilidad Completa:</p>
                      <p className="text-[11px] opacity-90">Toda la información del ciclo vital de la visita ha quedado guardada de forma inalterable para futuras consultas médicas y auditorías de seguridad.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 h-9 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Anterior
                  </button>
                ) : (
                  <button
                    onClick={resetSimulator}
                    className="px-4 h-9 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reiniciar
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-5 h-9 rounded-lg bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Siguiente Paso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={resetSimulator}
                    className="px-5 h-9 rounded-lg bg-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-indigo-400 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Iniciar Nueva Simulación</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: High-Fidelity Visual Representation Screen */}
            <div className="lg:col-span-7 glass-panel rounded-2xl border-white/5 relative overflow-hidden flex flex-col min-h-[480px]">
              
              {/* Virtual Screen Header */}
              <div className="bg-slate-950/80 border-b border-white/5 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">DISPOSITIVO VIRTUAL // HVC-0092</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] text-slate-400 font-semibold font-mono">
                  {currentStep === 1 && 'PORTAL CLIENTE'}
                  {currentStep === 2 && 'ACCESO DE GUARDIA'}
                  {currentStep === 3 && 'PORTAL DEL MÉDICO'}
                  {currentStep === 4 && 'DASHBOARD ENFERMERÍA'}
                  {currentStep === 5 && 'COMPROBANTE DE SALIDA'}
                </div>
              </div>

              {/* Screen Workspace Body */}
              <div className="flex-1 p-6 flex flex-col justify-center bg-slate-950/30">
                
                {/* STEP 1 SCREEN: QR TICKET PRESENTATION */}
                {currentStep === 1 && (
                  <div className="max-w-sm w-full mx-auto glass-card-emerald rounded-2xl p-6 shadow-xl border border-emerald-500/20 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">PASE DE INGRESO DIGITAL</h4>
                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Aozora Care-Flow</p>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    <div className="space-y-3 text-xs mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Paciente</p>
                          <p className="font-bold text-white truncate">{simName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Destino</p>
                          <p className="font-bold text-slate-200 truncate">{simDestination}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Médico</p>
                          <p className="font-bold text-slate-200 truncate">{simDoctor}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Código de Cita</p>
                          <p className="font-mono font-bold text-emerald-300">{qrToken}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Motivo</p>
                        <p className="text-slate-300 italic text-[11px] truncate">"{simReason}"</p>
                      </div>

                      {showAntecedents && (
                        <div className="pt-2.5 mt-2 border-t border-white/5 space-y-1.5 text-[9px] text-left animate-fadeIn">
                          <div className="grid grid-cols-3 gap-1 text-slate-400">
                            <div>
                              <span className="block text-[7px] uppercase font-bold text-slate-500">Edad</span>
                              <strong className="text-white font-medium">{simAge} años</strong>
                            </div>
                            <div>
                              <span className="block text-[7px] uppercase font-bold text-slate-500">Sexo</span>
                              <strong className="text-white font-medium">{simGender}</strong>
                            </div>
                            {simGender === 'Femenino' && simLmp && (
                              <div>
                                <span className="block text-[7px] uppercase font-bold text-slate-500">FUM</span>
                                <strong className="text-sky-300 font-medium">{new Date(simLmp + 'T12:00:00').toLocaleDateString()}</strong>
                              </div>
                            )}
                          </div>
                          {simAllergies && (
                            <div>
                              <span className="block text-[7px] uppercase font-bold text-rose-400">Alergias</span>
                              <strong className="text-rose-300 font-semibold">{simAllergies}</strong>
                            </div>
                          )}
                          {simChronicConditions && (
                            <div>
                              <span className="block text-[7px] uppercase font-bold text-amber-400">Condiciones Crónicas / Especiales</span>
                              <strong className="text-amber-300 font-semibold">{simChronicConditions}</strong>
                            </div>
                          )}
                          {simCurrentMedications && (
                            <div>
                              <span className="block text-[7px] uppercase font-bold text-slate-500">Medicación habitual</span>
                              <strong className="text-slate-300 font-medium truncate block">{simCurrentMedications}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* QR Code Container Mock */}
                    <div className="bg-white p-3.5 rounded-xl max-w-[120px] mx-auto border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col items-center">
                      {/* Generar un QR SVG estilizado */}
                      <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100">
                        <rect x="0" y="0" width="25" height="25" fill="currentColor"/>
                        <rect x="5" y="5" width="15" height="15" fill="white"/>
                        <rect x="8" y="8" width="9" height="9" fill="currentColor"/>
                        
                        <rect x="75" y="0" width="25" height="25" fill="currentColor"/>
                        <rect x="80" y="5" width="15" height="15" fill="white"/>
                        <rect x="83" y="8" width="9" height="9" fill="currentColor"/>
                        
                        <rect x="0" y="75" width="25" height="25" fill="currentColor"/>
                        <rect x="5" y="80" width="15" height="15" fill="white"/>
                        <rect x="8" y="83" width="9" height="9" fill="currentColor"/>

                        {/* Random barcode noise dots */}
                        <rect x="35" y="10" width="5" height="10" fill="currentColor"/>
                        <rect x="45" y="5" width="10" height="5" fill="currentColor"/>
                        <rect x="60" y="15" width="5" height="15" fill="currentColor"/>
                        <rect x="30" y="35" width="15" height="5" fill="currentColor"/>
                        <rect x="50" y="30" width="10" height="10" fill="currentColor"/>
                        <rect x="65" y="40" width="15" height="5" fill="currentColor"/>
                        
                        <rect x="35" y="60" width="5" height="15" fill="currentColor"/>
                        <rect x="45" y="75" width="15" height="5" fill="currentColor"/>
                        <rect x="30" y="85" width="25" height="5" fill="currentColor"/>
                        <rect x="65" y="60" width="10" height="25" fill="currentColor"/>
                        <rect x="80" y="65" width="5" height="5" fill="currentColor"/>
                        <rect x="90" y="70" width="5" height="10" fill="currentColor"/>
                      </svg>
                      <button 
                        type="button"
                        onClick={regenerateQR}
                        className="mt-2 text-[8px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2 h-2" /> Regenerar
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 SCREEN: GUARD MONITOR SCANNER */}
                {currentStep === 2 && (
                  <div className="max-w-md w-full mx-auto glass-panel rounded-2xl p-6 border-emerald-500/20 relative animate-fade-in">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-xs text-white">ESCANER MÓVIL EN PUERTA</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">DISPONIBLE</span>
                    </div>

                    <div className="bg-slate-950/60 rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 mb-4">
                      
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Check className="w-7 h-7 text-emerald-400" />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">¡Código Escaneado!</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Estatus: <strong className="text-emerald-400 font-bold">VÁLIDO</strong></p>
                      </div>

                      <div className="w-full text-xs text-left divide-y divide-white/5 bg-slate-950/40 rounded-lg p-3 border border-white/5 space-y-1.5">
                        <div className="flex justify-between py-1"><span className="text-slate-400">Persona:</span> <span className="font-bold text-white">{simName}</span></div>
                        <div className="flex justify-between py-1"><span className="text-slate-400">Tipo:</span> <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">PACIENTE</span></div>
                        <div className="flex justify-between py-1"><span className="text-slate-400">Destino:</span> <span className="text-slate-300 font-semibold">{simDestination}</span></div>
                        <div className="flex justify-between py-1"><span className="text-slate-400">Fecha/Hora:</span> <span className="text-slate-400">Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 h-9 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 border border-emerald-500/30">
                        <CheckSquare className="w-4 h-4" />
                        <span>REGISTRAR ENTRADA</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 SCREEN: MEDICAL CONSULTATION PORTAL */}
                {currentStep === 3 && (
                  <div className="w-full mx-auto glass-panel rounded-2xl p-5 border-indigo-500/20 relative animate-fade-in">
                    
                    {/* Doctor Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-indigo-400" />
                        <div>
                          <span className="font-bold text-xs text-white block">{simDoctor}</span>
                          <span className="text-[9px] text-slate-400">Cardióloga • Consultorio 102</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">CONSULTA ACTIVA</span>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Active Patient Details Banner */}
                      <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase">Paciente en Atención</p>
                          <p className="font-bold text-white">{simName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 uppercase">Motivo Reportado</p>
                          <p className="text-indigo-300 font-semibold truncate max-w-[150px]">"{simReason}"</p>
                        </div>
                      </div>

                      {/* Patient antecedents visual badge row in Doctor Portal */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="text-[8px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-400 font-semibold">{simAge} años</span>
                        <span className="text-[8px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-400 font-semibold">{simGender}</span>
                        {simAllergies && (
                          <span className="text-[8px] bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-rose-400 font-bold">⚠️ Alergias: {simAllergies}</span>
                        )}
                        {simChronicConditions && (
                          <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400 font-bold">⚠️ Crónico: {simChronicConditions}</span>
                        )}
                      </div>

                      {/* Doctor Clinical Forms Mock */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span><strong className="text-slate-300 text-[10px] uppercase">Diagnóstico Clínico Registrado</strong></div>
                          <p className="text-slate-300 text-[11px] leading-relaxed italic bg-slate-950/80 p-2 rounded-lg border border-white/5">"{simAilments}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5">
                            <strong className="text-slate-300 text-[10px] uppercase block mb-1">Medicamentos Prescritos</strong>
                            <p className="text-emerald-400 text-[10px] leading-snug">{simMedicines}</p>
                          </div>
                          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5">
                            <strong className="text-slate-300 text-[10px] uppercase block mb-1">Recomendaciones</strong>
                            <p className="text-slate-400 text-[10px] leading-snug">{simFollowUp}</p>
                          </div>
                        </div>

                        {simAnalysisRequested && (
                          <div className="p-2.5 bg-indigo-950/20 border border-indigo-500/15 rounded-xl text-[10px] space-y-1 animate-fadeIn text-left">
                            <span className="font-bold text-indigo-400 uppercase text-[8px] tracking-wider block">🧪 Estudio Clínico Solicitado</span>
                            <div className="flex justify-between items-center text-[10px] text-slate-200">
                              <span>{simAnalysisName}</span>
                              <span className="text-[7.5px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-405">
                                solicitado
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="h-9 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 border border-indigo-500/30 cursor-pointer hover:bg-indigo-400 transition-colors">
                        <CheckSquare className="w-4 h-4" />
                        <span>GUARDAR DIAGNÓSTICO Y EXPEDIR ALTA</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 SCREEN: NURSE LOGS BITACORA */}
                {currentStep === 4 && (
                  <div className="w-full mx-auto glass-panel rounded-2xl p-5 border-indigo-500/20 relative animate-fade-in">
                    
                    {/* Nurse Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <div>
                          <span className="font-bold text-xs text-white block">Central de Enfermería - Observación</span>
                          <span className="text-[9px] text-slate-400">Registro de Insumos y Cuidados</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">BITÁCORA INTEGRADA</span>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Active Patient Details Banner */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-3 border border-white/5 text-[11px]">
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase block">Paciente</span>
                          <strong className="text-white">{simName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase block">Indicación Médica</span>
                          <span className="text-emerald-400 font-medium line-clamp-1">{simMedicines}</span>
                        </div>
                      </div>

                      {/* Medication Alarm floating card */}
                      {simReminderAlertTriggered && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-left animate-pulse">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-rose-400 uppercase text-[9px] tracking-wider">🔔 Alerta de Medicación Pendiente</span>
                              <span className="text-[7.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-400">retraso: 15m</span>
                            </div>
                            <p className="text-white text-[11px] font-medium leading-snug">Se requiere administración de <strong className="text-rose-300">{simReminderName}</strong> (Dosis de la mañana).</p>
                          </div>
                        </div>
                      )}

                      {/* Clinical Analysis study status card */}
                      {simAnalysisRequested && (
                        <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-left space-y-1.5 text-xs">
                          <span className="font-bold text-indigo-400 uppercase text-[8px] tracking-wider block">🧪 Estado del Estudio Clínico</span>
                          <div className="flex justify-between items-center">
                            <strong className="text-white text-[11px]">{simAnalysisName}</strong>
                            <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                              simAnalysisStatus === 'realizado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                              simAnalysisStatus === 'reprogramado' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                              'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            }`}>
                              {simAnalysisStatus}
                            </span>
                          </div>
                          
                          {simAnalysisStatus === 'realizado' && (
                            <div className="mt-1.5 p-2 bg-emerald-950/20 border border-emerald-500/5 rounded text-[10px] space-y-1 animate-fadeIn">
                              <p className="text-slate-200 font-medium">"{simAnalysisResults}"</p>
                              {simAnalysisIncidences && <p className="text-slate-450 text-[9px] mt-0.5"><strong>Incidencias:</strong> {simAnalysisIncidences}</p>}
                              {simAnalysisPdfUrl && (
                                <div className="mt-1.5 pt-1.5 border-t border-emerald-500/10 flex items-center">
                                  <a 
                                    href={simAnalysisPdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer text-[9px]"
                                  >
                                    <FileText className="w-2.5 h-2.5" />
                                    Ver PDF Completo
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Nurse Log Queue List */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Registros de Enfermería en la Visita</span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {nurseLogList.length > 0 ? (
                            nurseLogList.map((log, index) => (
                              <div key={index} className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-1.5 text-xs relative">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-indigo-400 font-bold uppercase">{log.nurseName}</span>
                                  <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {log.loggedAt}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                                  <div>
                                    <span className="text-slate-500 font-semibold block text-[8px] uppercase">Tratamiento Administrado</span>
                                    <p className="line-clamp-1">{log.treatments}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-semibold block text-[8px] uppercase">Observaciones y Vitales</span>
                                    <p className="line-clamp-1 text-slate-300">{log.indications}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                              No hay registros cargados. Haz clic en "Añadir Registro a Bitácora".
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 5 SCREEN: CHECK-OUT SLIP RECEIPT */}
                {currentStep === 5 && (
                  <div className="max-w-md w-full mx-auto glass-panel rounded-2xl p-5 border-rose-500/20 relative overflow-hidden animate-fade-in">
                    
                    {/* Glow element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>

                    {/* Receipt Header */}
                    <div className="flex flex-col items-center text-center border-b border-dashed border-slate-800 pb-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                        <UserCheck className="w-5 h-5 text-rose-400" />
                      </div>
                      <h4 className="text-xs font-extrabold text-white tracking-widest uppercase">REGISTRO DE EGRESO COMPLETADO</h4>
                      <p className="text-[9px] text-slate-400">Aozora Care-Flow</p>
                    </div>

                    {/* Receipt Body */}
                    <div className="space-y-3.5 text-xs">
                      
                      <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Paciente:</span>
                          <span className="font-bold text-white">{simName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Ubicación Asignada:</span>
                          <span className="font-semibold text-slate-300">{simDestination}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Médico Tratante:</span>
                          <span className="font-semibold text-slate-300">{simDoctor}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Código de Cita:</span>
                          <span className="font-mono font-bold text-slate-400">{qrToken}</span>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/40 rounded-xl p-3 border border-white/5 text-[10px] text-center font-mono">
                        <div>
                          <span className="text-slate-500 font-semibold block text-[8px] uppercase">Hora de Entrada</span>
                          <span className="text-emerald-400 font-bold">11:45 AM</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block text-[8px] uppercase">Hora de Salida</span>
                          <span className="text-rose-400 font-bold">01:15 PM</span>
                        </div>
                      </div>

                      {/* Medical outcome summary */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-1.5">
                        <span className="text-slate-500 font-semibold block text-[8px] uppercase">Diagnóstico Clínico Final</span>
                        <p className="text-slate-300 text-[10px] leading-relaxed italic">"{simAilments}"</p>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Virtual Screen Footer Status */}
              <div className="bg-slate-950/80 border-t border-white/5 px-4 py-2 flex justify-between items-center shrink-0 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>BASE DE DATOS CONECTADA</span>
                </div>
                <div className="text-slate-500 font-mono">
                  NEXTJS V16.2
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ROLE EXPLORER SECTION */}
        <section id="roles-section" className="mb-24 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Explorador de Dashboards de Trabajo</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Analiza la interfaz y las funciones exclusivas que Aozora Care-Flow ofrece para cada rol operativo.</p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap p-1 bg-slate-900/60 rounded-2xl border border-white/5 max-w-4xl mx-auto mb-10">
            {[
              { id: 'guardia', label: '🛡️ Seguridad / Guardia', color: 'border-emerald-500 text-emerald-400' },
              { id: 'medico', label: '🩺 Médico Tratante', color: 'border-indigo-500 text-indigo-400' },
              { id: 'enfermera', label: '💊 Enfermería', color: 'border-purple-500 text-purple-400' },
              { id: 'farmaco', label: '🧪 Farmacéutico', color: 'border-sky-500 text-sky-400' },
              { id: 'admin', label: '📊 Director / Administrador', color: 'border-teal-500 text-teal-400' }
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id)}
                className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider text-center cursor-pointer ${
                  activeRoleTab === tab.id
                    ? 'bg-slate-800 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role Explorer Content Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            
            {/* GUARD TAB */}
            {activeRoleTab === 'guardia' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Terminal del Guardia de Seguridad</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Diseñado para la máxima rapidez en puntos de control de accesos saturados. Permite realizar admisiones en segundos y auditar las salidas físicas sin generar filas ni cuellos de botella.
                  </p>
                  
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Escaneo de QR Integrado</strong>: Funciona de forma instantánea en cualquier smartphone o tablet, sin comprar hardware costoso.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Buscador Inteligente Predictivo</strong>: Realiza Check-Out en un clic buscando por nombre, consultorio o habitación.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Validación de Acompañante</strong>: Evita que entren múltiples personas sin registrar, vinculando acompañantes al pase oficial.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4">
                  {/* Mock Screenshot layout */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">PANEL DE GUARDIA // ACCESOS ACTIVOS</span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">6 PERSONAS ACTIVAS</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {[
                      { name: 'Enrique Valenzuela', type: 'Paciente', dest: 'Consultorio 104', companion: 'Familiar - Hija', time: '12:05 PM' },
                      { name: 'Mariana Rosas', type: 'Visitante', dest: 'Habitación 302-A', companion: 'Sola', time: '11:58 AM' },
                      { name: 'Dr. Alejandro Gómez', type: 'Personal', dest: 'Piso 1 (Pediatría)', companion: 'N/A', time: '08:00 AM' }
                    ].map((row, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{row.name}</p>
                          <p className="text-[10px] text-slate-400">{row.dest} • Acompañante: {row.companion}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider">{row.type}</span>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">Check-in: {row.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
                    Simulación de interfaz optimizada para tablets del personal de seguridad.
                  </div>
                </div>
              </div>
            )}

            {/* DOCTOR TAB */}
            {activeRoleTab === 'medico' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <Stethoscope className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Portal del Médico Tratante</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Permite a los profesionales médicos optimizar la consulta y agilizar el tránsito de pacientes de corta estancia o consulta externa.
                  </p>
                  
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>Cola de Espera Activa</strong>: Muestra al instante quién se registró en la entrada con destino a su consultorio.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>Receta Electrónica Simplificada</strong>: Emisión de indicaciones in-app que viajan automáticamente al portal de enfermería.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>Historial por Email</strong>: Acceso rápido al expediente y visitas pasadas del paciente escribiendo solo su correo.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4">
                  {/* Mock Screenshot layout */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">VISOR MÉDICO // FILA DE CONSULTORIO</span>
                    <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">2 ESPERANDO</span>
                  </div>
                  
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>Paciente: Mario Castillo Ramos</span>
                      <span className="text-indigo-300">Consulta Agendada</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Motivo: Evaluación de dolor abdominal y náuseas intensas.</p>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 space-y-2 mt-2">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block">Acción Médica</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-indigo-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider cursor-pointer">Diagnosticar</span>
                        <span className="px-2 py-1 rounded border border-slate-700 text-slate-300 font-bold text-[9px] uppercase tracking-wider cursor-pointer">Ver Historial</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
                    Reduce la pérdida de expedientes y unifica las recetas en una sola base de datos clínica.
                  </div>
                </div>
              </div>
            )}

            {/* NURSE TAB */}
            {activeRoleTab === 'enfermera' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Portal de Enfermería (Nurse Logs)</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Facilita el control de cuidados y aplicación de medicamentos para pacientes en observación de urgencias o internamiento.
                  </p>
                  
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Bitácora de Tratamientos</strong>: Registro inmutable de cada medicamento suministrado, dosis y hora exacta.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Indicaciones Médicas a la Vista</strong>: Las órdenes del médico aparecen de forma inmediata en el perfil del paciente.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Seguimiento de Constantes</strong>: Registro digital de signos vitales (presión arterial, frecuencia cardíaca, etc.).</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4">
                  {/* Mock Screenshot layout */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">TERMINAL ENFERMERÍA // REGISTRO DE TRATAMIENTO</span>
                    <span className="text-[9px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">REGISTRO SEGURO</span>
                  </div>
                  
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Paciente: Mariana Rosas (Hab. 302-A)</strong>
                      <span className="text-[9px] text-slate-500 font-mono">11:58 AM</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-white/5 text-[10px] text-slate-300 space-y-1">
                      <p><strong className="text-purple-400">Tratamiento:</strong> Administración de analgésico y suero IV.</p>
                      <p><strong className="text-purple-400">Observación:</strong> Signos estables. PA: 120/80. Frecuencia Cardíaca: 70 lpm.</p>
                      <p className="text-[9px] text-slate-500 italic mt-1">— Registrado por: Enf. Carlos Rivera</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
                    Evita la duplicidad de registros y asegura la trazabilidad legal de la atención.
                  </div>
                </div>
              </div>
            )}

            {/* PHARMACY TAB */}
            {activeRoleTab === 'farmaco' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                    <Pill className="w-6 h-6 text-sky-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Consola de Despacho Farmacéutico</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Portal exclusivo para el personal de farmacia. Centraliza todas las solicitudes de medicamentos generadas por enfermeras y las vincula al inventario del hospital en tiempo real.
                  </p>
                  
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Cola de Solicitudes en Tiempo Real</strong>: Visualiza todas las peticiones pendientes de medicamentos de cada enfermera, organizadas por urgencia y habitación.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Despacho con Un Clic</strong>: Confirma la entrega y el sistema actualiza el estatus a "Entregado" con sello de hora y nombre del farmacéutico responsable.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Inventario con Control de Stock</strong>: Catálogo de más de 30 medicamentos con ajuste manual de existencias (+/−) y alerta visual de stock agotado.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">CONSOLA FARMACIA // SOLICITUDES ACTIVAS</span>
                    <span className="text-[9px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">3 PENDIENTES</span>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { patient: 'Mariana Rosas', room: 'Hab. 302-A', med: 'Paracetamol 1g IV + Suero NaCl 0.9%', nurse: 'Enf. Rivera', status: 'pendiente' },
                      { patient: 'Mario Castillo', room: 'Hab. 215', med: 'Metoprolol 50mg, Aspirina 100mg', nurse: 'Enf. Gómez', status: 'pendiente' },
                      { patient: 'Elena Vásquez', room: 'UCI-3', med: 'Morfina 5mg IM + Ondansetrón 4mg IV', nurse: 'Enf. Torres', status: 'entregado' },
                    ].map((req, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border text-xs flex justify-between items-start gap-3 ${
                        req.status === 'pendiente'
                          ? 'bg-amber-950/20 border-amber-500/20'
                          : 'bg-emerald-950/20 border-emerald-500/20'
                      }`}>
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-bold text-white truncate">{req.patient} <span className="text-slate-500 font-normal">• {req.room}</span></p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{req.med}</p>
                          <p className="text-[9px] text-slate-500">Solicitado por: {req.nurse}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                          req.status === 'pendiente'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}>{req.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-sky-950/20 border border-sky-500/10 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">ÍÍNDICE DE INVENTARIO (Muestra)</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[{name:'Paracetamol', stock:48, unit:'Cajas'},{name:'Morfina 5mg', stock:12, unit:'Ampollas'},{name:'Metoprolol', stock:0, unit:'Tabletas'}].map((m, i) => (
                        <div key={i} className="p-2 bg-slate-950/60 rounded-lg border border-white/5">
                          <p className="text-[9px] text-slate-400 truncate">{m.name}</p>
                          <p className={`text-sm font-black ${m.stock > 0 ? 'text-sky-400' : 'text-rose-400'}`}>{m.stock}</p>
                          <p className="text-[8px] text-slate-600">{m.unit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN TAB */}
            {activeRoleTab === 'admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                <div className="lg:col-span-5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                    <BarChart3 className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Panel de Administración y Métricas</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    La torre de control del hospital. Diseñada para gerentes de operaciones, directores médicos y directores generales de salud que buscan tomar decisiones basadas en datos.
                  </p>
                  
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Telemetría de Camas y Habitaciones</strong>: Control absoluto del estado de habitaciones (UCI, Individuales, UCI Neonatal) y camas.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Control de Aforos Totales</strong>: Gráficos y alertas de sobrecupo en zonas de urgencias o salas de espera.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Registro y Auditoría Total</strong>: Descarga y auditoría inalterable de todos los ingresos y egresos históricos para revisiones de seguridad.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4">
                  {/* Mock Screenshot layout */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">DASHBOARD CENTRAL // TELEMETRÍA DE AFORO</span>
                    <span className="text-[9px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">ADMIN PANEL</span>
                  </div>
                  
                  {/* Mini-graphs mock */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Camas Disponibles</span>
                      <strong className="text-lg text-emerald-400 block mt-1">12 / 20</strong>
                      <span className="text-[8px] text-slate-400 block mt-0.5">60% Ocupación</span>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Aforo Urgencias</span>
                      <strong className="text-lg text-yellow-400 block mt-1">18 / 30</strong>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Estable</span>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Visitas del Día</span>
                      <strong className="text-lg text-indigo-400 block mt-1">87</strong>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Promedio 1.2 hrs</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
                    Toma el control absoluto de la logística y seguridad hospitalaria de tu centro.
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* DEMO ACCESS QUICK BANNER */}
        <section className="mb-20 glass-panel rounded-3xl p-8 sm:p-10 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider inline-block">
                ⚡ DEMO TOTALMENTE OPERATIVA
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">¿Listo para explorar la aplicación real?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Toda la base de datos está poblada con médicos, consultorios, camas y registros de prueba. Inicia sesión con cualquiera de las siguientes credenciales pre-configuradas para explorar el sistema de producción.
              </p>
            </div>

            <div className="w-full lg:max-w-md shrink-0 space-y-3.5">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-bold">Credenciales Semilla de Demostración:</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">SEEDED DATA</span>
                </div>
                
                <div className="space-y-1.5 font-mono">
                  <p className="text-slate-300 flex justify-between"><span className="text-slate-500">1. Administrador:</span> <span>User: <strong className="text-emerald-400">admin</strong> / Pass: <strong className="text-emerald-400">adminpassword</strong></span></p>
                  <p className="text-slate-300 flex justify-between"><span className="text-slate-500">2. Médico Pediatra:</span> <span>User: <strong className="text-indigo-400">medico1</strong> / Pass: <strong className="text-indigo-400">doctorpassword</strong></span></p>
                  <p className="text-slate-300 flex justify-between"><span className="text-slate-500">3. Guardia de Acceso:</span> <span>User: <strong className="text-purple-400">guardia1</strong> / Pass: <strong className="text-purple-400">staffpassword</strong></span></p>
                  <p className="text-slate-300 flex justify-between"><span className="text-slate-500">4. Farmacéutico:</span> <span>User: <strong className="text-sky-400">farmaco1</strong> / Pass: <strong className="text-sky-400">staffpassword</strong></span></p>
                </div>
              </div>

              <Link 
                href="/login"
                className="w-full h-12 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>Ingresar al Portal de Personal</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SALES KIT DOWNLOAD INTERACTIVE SECTION */}
        <section className="text-center bg-slate-900/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <Award className="w-8 h-8 text-emerald-400 mx-auto pulse-glow" />
            <h3 className="text-xl font-bold text-white">¿Necesitas presentar este producto a tu mesa directiva?</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Hemos preparado un dossier comercial completo que detalla el Retorno de Inversión (ROI), la tabla comparativa de flujos tradicionales de papel vs digital, y el plan de seguridad de accesos del hospital.
            </p>
            <div className="pt-2">
              <a 
                href="/PRODUCT_SHOWCASE_SALES_KIT.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/60 text-xs font-bold transition-all duration-300"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Abrir Sales Kit Comercial de Producto</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Dynamic styling for custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// Simple Helper Components for local use to ensure no import dependencies
function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
