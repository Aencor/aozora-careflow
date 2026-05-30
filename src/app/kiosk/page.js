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
  Bed
} from 'lucide-react';

export default function Home() {
  // Navigation & General states
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'checkout' (for mobile toggle)
  
  // Check-In States
  const [visitType, setVisitType] = useState('visitante'); // 'visitante' | 'paciente' | 'urgencias' | 'hospitalizaciones'
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [visitorCompanion, setVisitorCompanion] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  // Handle email autocomplete lookup
  const handleEmailBlur = async () => {
    if (!patientEmail.trim() || !patientEmail.includes('@')) return;
    
    try {
      const res = await fetch(`/api/visits/by-email?email=${encodeURIComponent(patientEmail.trim())}`);
      const data = await res.json();
      if (data.success && data.visit) {
        // Pre-fill fields if they are currently empty
        if (!patientName) setPatientName(data.visit.patientName);
        if (!patientPhone) setPatientPhone(data.visit.phone || '');
        if (!visitorCompanion) setVisitorCompanion(data.visit.visitorCompanion || '');
        triggerNotification('success', '¡Historial encontrado! Pre-cargamos tus datos básicos.');
      }
    } catch (err) {
      console.error('Error during email autocomplete lookup:', err);
    }
  };
  
  // Database entities
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeVisits, setActiveVisits] = useState([]);
  const [scheduledAppts, setScheduledAppts] = useState([]);
  const [rooms, setRooms] = useState([]);

  // QR Scanner States
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrInputToken, setQrInputToken] = useState('');
  const [qrScanLoading, setQrScanLoading] = useState(false);
  const [qrScanResult, setQrScanResult] = useState(null);
  
  // Search / Check-out states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // Destination Autocomplete State
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: '' }

  // Load Clinics and Doctors
  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside to close autocomplete dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const searchContainer = document.getElementById('checkout-search-container');
      if (searchContainer && !searchContainer.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      const destContainer = document.getElementById('destination-suggestions-container');
      if (destContainer && !destContainer.contains(e.target)) {
        setShowDestSuggestions(false);
      }
      const roomContainer = document.getElementById('room-suggestions-container');
      if (roomContainer && !roomContainer.contains(e.target)) {
        setShowRoomSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [clinicsRes, doctorsRes, activeVisitsRes, scheduledRes, roomsRes] = await Promise.all([
        fetch('/api/clinics').then(r => r.json()),
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/visits?status=in house').then(r => r.json()),
        fetch('/api/visits?status=agendado').then(r => r.json()),
        fetch('/api/rooms').then(r => r.json())
      ]);

      if (clinicsRes.success) setClinics(clinicsRes.clinics);
      if (doctorsRes.success) setDoctors(doctorsRes.doctors);
      if (activeVisitsRes.success) setActiveVisits(activeVisitsRes.visits);
      if (scheduledRes.success) setScheduledAppts(scheduledRes.visits);
      if (roomsRes.success) setRooms(roomsRes.rooms);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  // Get Room autocomplete suggestions
  const getRoomSuggestions = (query) => {
    if (!query || query.trim().length === 0) {
      return rooms.filter(r => r.status === 'disponible').slice(0, 5);
    }
    const q = query.toLowerCase().trim();
    return rooms.filter(r => 
      r.number.toLowerCase().includes(q) || 
      r.floor.toLowerCase().includes(q) || 
      r.type.toLowerCase().includes(q)
    ).slice(0, 5);
  };

  // QR Code check-in scan handler
  const handleQRScan = async (token) => {
    const targetToken = token || qrInputToken;
    if (!targetToken.trim()) return;

    setQrScanLoading(true);
    setQrScanResult(null);
    try {
      const res = await fetch('/api/visits/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrToken: targetToken.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setQrScanResult({ type: 'success', message: data.message, visit: data.visit });
        triggerNotification('success', data.message);
        // Refresh lists
        fetchData();
        setQrInputToken('');
        // Auto-close success screen after 3.5 seconds
        setTimeout(() => {
          setQrScanResult(null);
          setShowQRModal(false);
        }, 3500);
      } else {
        setQrScanResult({ type: 'error', message: data.error });
        triggerNotification('error', data.error);
      }
    } catch (err) {
      setQrScanResult({ type: 'error', message: 'Error de red al conectar con el servidor de escaneo.' });
      triggerNotification('error', 'Error al escanear pase.');
    } finally {
      setQrScanLoading(false);
    }
  };

  // Filter doctors when clinic selection changes (for patient visit type)
  const handleClinicChange = (clinicId) => {
    const selectedClinic = clinics.find(c => c.id === clinicId);
    setDestination(selectedClinic ? selectedClinic.name : '');
    
    if (clinicId) {
      const docs = doctors.filter(d => d.clinicId === clinicId);
      setFilteredDoctors(docs);
    } else {
      setFilteredDoctors([]);
    }
    setSelectedDoctorId('');
  };

  // Get destination autocomplete suggestions based on doctors, clinics or specialties
  const getDestinationSuggestions = () => {
    if (!destination || destination.trim().length === 0) return [];
    const query = destination.toLowerCase().trim();
    
    const results = [];
    
    // 1. Search doctors
    doctors.forEach(d => {
      const matchName = d.name.toLowerCase().includes(query);
      const matchSpecialty = d.specialty.toLowerCase().includes(query);
      const matchClinic = d.clinic?.name.toLowerCase().includes(query) || false;
      if (matchName || matchSpecialty || matchClinic) {
        results.push({
          type: 'medico',
          title: d.name,
          subtitle: `${d.specialty} — ${d.clinic ? d.clinic.name : 'Consultorio General'}`,
          value: d.clinic ? `${d.clinic.name} - ${d.name}` : d.name,
          doctorId: d.id // Capture doctor ID for proper assignment
        });
      }
    });

    // 2. Search clinics
    clinics.forEach(c => {
      const matchName = c.name.toLowerCase().includes(query);
      const matchSpecialty = c.specialty.toLowerCase().includes(query);
      if (matchName || matchSpecialty) {
        results.push({
          type: 'consultorio',
          title: c.name,
          subtitle: `${c.specialty} ${c.floor ? `(${c.floor})` : ''}`,
          value: `${c.name} (${c.specialty})`
        });
      }
    });

    // 3. Search specialties (deduplicated)
    const matchedSpecialties = new Set();
    clinics.forEach(c => {
      if (c.specialty.toLowerCase().includes(query)) {
        matchedSpecialties.add(c.specialty);
      }
    });
    doctors.forEach(d => {
      if (d.specialty.toLowerCase().includes(query)) {
        matchedSpecialties.add(d.specialty);
      }
    });
    
    matchedSpecialties.forEach(spec => {
      const isAlreadySuggested = results.some(r => r.title.toLowerCase() === `área de ${spec.toLowerCase()}`);
      if (!isAlreadySuggested) {
        results.push({
          type: 'especialidad',
          title: `Área de ${spec}`,
          subtitle: 'Especialidad Hospitalaria',
          value: `Área de ${spec}`
        });
      }
    });

    // Limit to top 5 results
    return results.slice(0, 5);
  };

  // Trigger Toast Notification
  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Submit Check-In
  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !reason.trim() || !destination.trim()) {
      triggerNotification('error', 'Por favor llena todos los campos requeridos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          email: patientEmail.trim() || null,
          phone: patientPhone.trim() || null,
          type: visitType,
          destination,
          reason,
          visitorCompanion: visitorCompanion || null,
          doctorId: selectedDoctorId || null
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `¡Check-In completado! Entrada registrada para ${patientName}.`);
        // Reset Form
        setPatientEmail('');
        setPatientPhone('');
        setPatientName('');
        setDestination('');
        setReason('');
        setVisitorCompanion('');
        setSelectedDoctorId('');
        // Refresh active visits list for check-out
        fetchData();
      } else {
        triggerNotification('error', data.error || 'Ocurrió un error.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Check-Out
  const handleCheckOut = async (e) => {
    e.preventDefault();
    if (!selectedVisit) {
      triggerNotification('error', 'Por favor selecciona tu nombre de la lista.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/visits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId: selectedVisit.id })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `¡Salida registrada! Que tenga buen día, ${selectedVisit.patientName}.`);
        setSelectedVisit(null);
        setSearchQuery('');
        // Refresh active visits list
        fetchData();
      } else {
        triggerNotification('error', data.error || 'Ocurrió un error.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Filter visits for search bar
  const searchedVisits = searchQuery.trim() === ''
    ? []
    : activeVisits.filter(v => 
        v.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex-1 flex flex-col relative">
      
      {/* Dynamic Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 scale-100 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/90 border border-rose-500/30 text-rose-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-rose-400" />}
          <div>
            <p className="font-semibold text-sm">
              {notification.type === 'success' ? 'Éxito' : 'Error'}
            </p>
            <p className="text-xs opacity-90">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Activity className="w-6 h-6 text-emerald-400 pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Aozora <span className="text-emerald-400 font-extrabold font-display">Care-Flow</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Registro e Ingreso Público</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/showcase"
              className="hidden md:flex items-center gap-2 px-4 h-10 text-xs font-bold rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            >
              <span>✨ Demo Showcase</span>
            </Link>

            <button
              onClick={() => {
                setShowQRModal(true);
                setQrScanResult(null);
                setQrInputToken('');
              }}
              className="flex items-center gap-2 px-4 h-10 text-xs font-bold rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Escanear Cita QR</span>
            </button>

            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 h-10 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              <span>Acceso Personal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-center">
        
        {/* Showcase Banner */}
        <div className="max-w-2xl w-full mx-auto mb-8 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -z-10"></div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>✨ ¿Eres un cliente potencial?</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">DEMO</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">Explora el Showcase interactivo y descarga el Sales Kit completo del producto.</p>
          </div>
          <Link 
            href="/showcase"
            className="px-4 py-2 rounded-lg bg-indigo-500 glow-btn-indigo text-white font-bold text-xs hover:bg-indigo-400 transition-colors shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
          >
            Ver Showcase →
          </Link>
        </div>

        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Bienvenido al Portal de Acceso
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Por favor, registra tu entrada al ingresar al hospital. Al retirarte, recuerda realizar tu salida para mantener seguro el recinto.
          </p>
        </div>

        {/* Mobile View Toggle Switcher */}
        <div className="flex sm:hidden p-1 bg-slate-900/60 rounded-xl border border-white/5 mb-6">
          <button 
            onClick={() => setActiveTab('checkin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'checkin' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Registrar Entrada
          </button>
          <button 
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'checkout' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <UserMinus className="w-4 h-4" />
            Registrar Salida
          </button>
        </div>

        {/* Desktop Split Columns / Mobile conditional render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: CHECK-IN FORM */}
          <div className={`lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 ${
            activeTab === 'checkin' ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <UserPlus className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Registro de Entrada (Check-In)</h3>
                <p className="text-xs text-slate-400">Selecciona el tipo de lugar y completa tus datos</p>
              </div>
            </div>

            {/* Visit Type Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'visitante', label: 'Visitante' },
                { id: 'paciente', label: 'Paciente' },
                { id: 'urgencias', label: 'Urgencias' },
                { id: 'hospitalizaciones', label: 'Hosp.' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setVisitType(type.id);
                    setDestination('');
                    setSelectedDoctorId('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all duration-300 uppercase tracking-wider ${
                    visitType === type.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Check-In Form */}
            <form onSubmit={handleCheckIn} className="space-y-4">
              
              {/* Patient Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <span>Correo Electrónico <span className="text-emerald-400">*</span></span>
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ej. paciente@correo.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                  />
                </div>

                {/* Patient Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <span>Teléfono de Contacto</span>
                    <span className="text-[10px] text-slate-400 normal-case">Para recibir pase WhatsApp</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Ej. +525512345678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                  />
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Nombre del Paciente / Persona <span className="text-emerald-400">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez Gómez"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                />
              </div>

              {/* Dynamic Fields based on Visit Type */}
              {visitType === 'paciente' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Clinic */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Consultorio / Especialidad <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      required
                      onChange={(e) => handleClinicChange(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                    >
                      <option value="">Selecciona consultorio...</option>
                      {clinics.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Doctor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Médico Asignado
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      disabled={filteredDoctors.length === 0}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {filteredDoctors.length === 0 
                          ? 'Selecciona primero consultorio' 
                          : 'Selecciona médico...'}
                      </option>
                      {filteredDoctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : visitType === 'urgencias' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Área de Urgencias <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                    >
                      <option value="">Selecciona área...</option>
                      <option value="Triage / Valoración">Triage / Valoración</option>
                      <option value="Sala de Choque">Sala de Choque</option>
                      <option value="Consultorio Urgencias 1">Consultorio Urgencias 1</option>
                      <option value="Consultorio Urgencias 2">Consultorio Urgencias 2</option>
                      <option value="Observación Adultos">Observación Adultos</option>
                      <option value="Observación Pediatría">Observación Pediatría</option>
                    </select>
                  </div>

                  {/* Level of Urgency */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Gravedad / Acompañante
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Acompañado por Familiar"
                      value={visitorCompanion}
                      onChange={(e) => setVisitorCompanion(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                    />
                  </div>
                </div>
              ) : visitType === 'hospitalizaciones' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Room number */}
                  <div className="relative" id="room-suggestions-container">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Piso y Habitación <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Habitación 302-A"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setShowRoomSuggestions(true);
                        }}
                        onFocus={() => setShowRoomSuggestions(true)}
                        className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                      />
                      {/* Autocomplete rooms dropdown */}
                      {showRoomSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800/40">
                          {getRoomSuggestions(destination).length > 0 ? (
                            getRoomSuggestions(destination).map((room, index) => (
                              <button
                                type="button"
                                key={index}
                                onMouseDown={() => {
                                  setDestination(room.number);
                                  setShowRoomSuggestions(false);
                                }}
                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-slate-800/80 transition-colors"
                              >
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                  <Bed className="w-3.5 h-3.5 text-indigo-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-xs text-white truncate">{room.number}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{room.type} • {room.floor} ({room.status})</p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-slate-600" />
                              <span>No se encontraron habitaciones coincidentes.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Companion */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Familiar / Con quién va
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Esposa - María Gómez"
                      value={visitorCompanion}
                      onChange={(e) => setVisitorCompanion(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                    />
                  </div>
                </div>
              ) : (
                /* Visitante general */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination */}
                  <div className="relative" id="destination-suggestions-container">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      A dónde viene (Destino) <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Laboratorio, Piso 2, Dirección"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setShowDestSuggestions(true);
                        }}
                        onFocus={() => setShowDestSuggestions(true)}
                        className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                      />
                      {/* Autocomplete suggestions dropdown */}
                      {showDestSuggestions && destination.trim() !== '' && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800/40">
                          {getDestinationSuggestions().length > 0 ? (
                            getDestinationSuggestions().map((suggestion, index) => (
                              <button
                                type="button"
                                key={index}
                                onMouseDown={() => {
                                  setDestination(suggestion.value);
                                  // If a specific doctor was selected, capture their ID
                                  if (suggestion.type === 'medico' && suggestion.doctorId) {
                                    setSelectedDoctorId(suggestion.doctorId);
                                  } else {
                                    setSelectedDoctorId('');
                                  }
                                  setShowDestSuggestions(false);
                                }}
                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-slate-800/80 transition-colors"
                              >
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                  {suggestion.type === 'medico' ? (
                                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : suggestion.type === 'consultorio' ? (
                                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-xs text-white truncate">{suggestion.title}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{suggestion.subtitle}</p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-slate-600" />
                              <span>No se encontraron coincidencias directas.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visitor companion */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                      Con quién va (Acompañante)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Va solo, o nombre del acompañante"
                      value={visitorCompanion}
                      onChange={(e) => setVisitorCompanion(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Motivo (Common for all) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Motivo de la Visita <span className="text-emerald-400">*</span>
                </label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Ej. Consulta de rutina, Visitar paciente, Entrega de insumos..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-4 rounded-lg glass-input text-sm resize-none"
                />
              </div>

              {/* Hidden values warning (transparently showing for demo/admin, actual logic is strictly on backend) */}
              <div className="p-3 bg-slate-950/50 rounded-lg border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Se guardará hora automática (Timestamp)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow"></span>
                  <span>Estatus: <strong className="text-emerald-400">in house</strong></span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando registro...' : 'Completar Registro de Entrada'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* COLUMN 2: CHECK-OUT */}
          <div className={`lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 ${
            activeTab === 'checkout' ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <UserMinus className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Registro de Salida (Check-Out)</h3>
                <p className="text-xs text-slate-400">Encuentra tu nombre y registra tu salida del hospital</p>
              </div>
            </div>

            {/* Check-Out Search & Submit Form */}
            <form onSubmit={handleCheckOut} className="space-y-6">
              
              {/* Autocomplete Input Container */}
              <div className="relative" id="checkout-search-container">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Busca tu Nombre <span className="text-emerald-400">*</span>
                </label>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Escribe tu nombre para buscar..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                      setSelectedVisit(null);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    className="w-full h-11 pl-11 pr-4 rounded-lg glass-input text-sm"
                  />
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>

                {/* Autocomplete Search Dropdown */}
                {showSearchDropdown && searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl max-h-60 overflow-y-auto">
                    {searchedVisits.length > 0 ? (
                      searchedVisits.map((visit) => (
                        <button
                          type="button"
                          key={visit.id}
                          onClick={() => {
                            setSelectedVisit(visit);
                            setSearchQuery(visit.patientName);
                            setShowSearchDropdown(false);
                          }}
                          className="w-full px-4 py-3 flex flex-col items-start gap-1 text-left hover:bg-slate-800/80 transition-colors border-b border-slate-950 last:border-b-0"
                        >
                          <span className="font-semibold text-sm text-white">{visit.patientName}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span className="capitalize">{visit.type}</span>
                            <span>•</span>
                            <span>Destino: {visit.destination}</span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-slate-600" />
                        <span>No se encontraron visitas activas con ese nombre.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selection Summary Panel */}
              {selectedVisit ? (
                <div className="glass-card-emerald rounded-xl p-5 border border-emerald-500/10 space-y-4 transform transition-all duration-300 scale-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {selectedVisit.type}
                      </span>
                      <h4 className="text-white font-bold text-base mt-2">{selectedVisit.patientName}</h4>
                    </div>
                    <div className="text-right">
                      <span className="status-badge-in-house px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        in house
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5">
                    <div>
                      <p className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] font-bold">Lugar de Destino</p>
                      <p className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {selectedVisit.destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] font-bold">Hora de Entrada</p>
                      <p className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(selectedVisit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {selectedVisit.reason && (
                    <div className="text-xs">
                      <p className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] font-bold">Motivo</p>
                      <p className="text-slate-300 italic">"{selectedVisit.reason}"</p>
                    </div>
                  )}

                  {selectedVisit.doctor && (
                    <div className="text-xs pt-2 border-t border-white/5 flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-300">Médico: <strong>{selectedVisit.doctor.name}</strong></span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-850">
                    <UserCheck className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Ningún registro seleccionado</p>
                    <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto mt-1">
                      Usa el buscador superior para encontrar tu registro de entrada.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || !selectedVisit}
                className="w-full h-12 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando check-out...' : 'Confirmar Salida (Check-Out)'}
                <UserMinus className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </main>

      {/* QR Access Checkpoint Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative border border-emerald-500/20 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <QrCode className="w-5.5 h-5.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Lector de Citas QR</h3>
                  <p className="text-xs text-slate-400">Verificación y registro de entrada para pacientes agendados</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowQRModal(false);
                  setQrScanResult(null);
                }}
                className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Cerrar Lector
              </button>
            </div>

            {/* Scan Result Overlay Screen */}
            {qrScanResult ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                {qrScanResult.type === 'success' ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 pulse-glow">
                      <Check className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-emerald-400 font-display">¡ACCESO AUTORIZADO!</h4>
                      <p className="text-xs text-slate-400 mt-1">El pase QR ha sido verificado con éxito en el servidor</p>
                    </div>

                    {/* Patient summary ticket */}
                    <div className="w-full max-w-md p-5 rounded-xl glass-card-emerald border-emerald-500/20 text-left text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paciente:</span>
                        <span className="text-white font-bold text-sm">{qrScanResult.visit.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tipo de Ingreso:</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Cita Programada</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ubicación Destino:</span>
                        <span className="text-white font-semibold">{qrScanResult.visit.destination}</span>
                      </div>
                      {qrScanResult.visit.doctor && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Médico Asignado:</span>
                          <span className="text-white font-semibold">{qrScanResult.visit.doctor.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-white/5 pt-2 text-[10px]">
                        <span className="text-slate-400 uppercase tracking-widest font-bold">Hora de Entrada:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {new Date(qrScanResult.visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest animate-pulse font-semibold">Esta ventana se cerrará automáticamente...</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-rose-400 font-display">ACCESO DENEGADO</h4>
                      <p className="text-xs text-rose-300 font-semibold mt-2">{qrScanResult.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 max-w-xs mx-auto">
                        Verifica que el código QR sea el correcto y que no haya sido escaneado previamente para registrar ingresos hoy.
                      </p>
                    </div>
                    <button
                      onClick={() => setQrScanResult(null)}
                      className="px-6 h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-emerald cursor-pointer"
                    >
                      Re-intentar Escaneo
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUMN 1: QR SIMULATOR FOR TESTING */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/15 rounded-xl text-xs text-indigo-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Herramienta de Simulación:</span>
                      <p className="opacity-90 mt-0.5 leading-relaxed">
                        Dado que estás en un entorno de pruebas, hemos creado este **simulador interactivo**. Lista las citas agendadas por los médicos y te permite simular su lectura en la recepción con un solo clic.
                      </p>
                    </div>
                  </div>

                  <div className="glass-card-indigo rounded-xl p-5 border border-indigo-500/10">
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Citas Agendadas Activas para Escanear
                    </h4>

                    <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                      {scheduledAppts.length > 0 ? (
                        scheduledAppts.map((appt) => (
                          <div 
                            key={appt.id}
                            className="p-3 rounded-lg bg-slate-950/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 hover:border-slate-800 transition-colors"
                          >
                            <div>
                              <p className="font-bold text-white text-sm">{appt.patientName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Cita: {new Date(appt.appointmentDate).toLocaleDateString()} a las {new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                              <p className="text-[9px] text-slate-500 font-mono mt-0.5">Token: {appt.qrToken.slice(0,18)}...</p>
                            </div>
                            <button
                              onClick={() => handleQRScan(appt.qrToken)}
                              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500 hover:text-slate-950 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-center"
                            >
                              Simular Escaneo QR
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 italic py-8 border border-dashed border-slate-850 rounded-xl bg-slate-950/20">
                          No hay citas agendadas programadas. Genera una desde la pestaña del médico para probar el escáner.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Manual token input */}
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                      Ingreso Manual de Token QR
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Pega el qrToken de la cita..."
                        value={qrInputToken}
                        onChange={(e) => setQrInputToken(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-lg glass-input text-xs"
                      />
                      <button
                        onClick={() => handleQRScan(null)}
                        disabled={qrScanLoading || !qrInputToken.trim()}
                        className="px-4 h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-emerald cursor-pointer disabled:opacity-50"
                      >
                        Validar Pase
                      </button>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: CAMERA MOCKUP INTERFACE */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center h-full">
                  <div className="w-full aspect-square max-w-[280px] rounded-2xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col items-center justify-center relative overflow-hidden text-center shadow-2xl">
                    
                    {/* Glowing neon scan line moving up and down */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-[pulse-soft_2.5s_infinite_ease-in-out]"></div>

                    {/* Camera grid corners */}
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-emerald-500/40"></div>
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-emerald-500/40"></div>
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-emerald-500/40"></div>
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-emerald-500/40"></div>

                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                      <QrCode className="w-7 h-7 text-emerald-400" />
                    </div>

                    <h5 className="font-bold text-xs text-white">Lector de Cámara Activo</h5>
                    <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto mt-2 leading-relaxed">
                      El escáner de hardware del hospital se encuentra activo y listo para enfocar códigos QR.
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-[9px] text-emerald-400 uppercase tracking-widest font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow"></span>
                      <span>Buscando Código QR...</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-white/5 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Aozora Care-Flow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
