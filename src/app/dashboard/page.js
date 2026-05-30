'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Users, 
  Building, 
  Stethoscope, 
  FileText, 
  LogOut, 
  Plus, 
  UserPlus, 
  Clock, 
  ShieldCheck, 
  ShieldAlert,
  Trash2, 
  Edit,
  Search,
  CheckCircle,
  HelpCircle,
  Calendar,
  AlertTriangle,
  QrCode,
  Phone,
  UserCheck,
  Check,
  Bed,
  Pill,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth Session States
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Tab Navigation
  // 'monitoring' (All roles) | 'admin' (Admin/Manager only) | 'history' (Admin/Manager only)
  const [activeTab, setActiveTab] = useState('monitoring');
  
  // Inner admin tabs
  // 'clinics' | 'rooms' | 'doctors' | 'staff' | 'roles'
  const [adminSection, setAdminSection] = useState('clinics');

  // Database lists
  const [visits, setVisits] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Form States - Room Registry
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState('');
  const [newRoomType, setNewRoomType] = useState('Individual');

  // Search/Filters
  const [monitoringFilter, setMonitoringFilter] = useState('all'); // 'all' | 'visitante' | 'paciente' | 'urgencias' | 'hospitalizaciones'
  const [monitoringSearch, setMonitoringSearch] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); // 'all' | 'visitante' | 'paciente' | 'urgencias' | 'hospitalizaciones'
  const [presenceSearch, setPresenceSearch] = useState('');
  const [presenceRoleFilter, setPresenceRoleFilter] = useState('all');
  const [presenceStatusFilter, setPresenceStatusFilter] = useState('all');

  // Form States - Dynamic Role Addition
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Form States - User Registration
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRoleId, setNewStaffRoleId] = useState('');

  // Form States - Guard Registration
  const [newGuardName, setNewGuardName] = useState('');
  const [newGuardUser, setNewGuardUser] = useState('');
  const [newGuardPass, setNewGuardPass] = useState('');

  // Form States - Clinic Registry
  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicSpecialty, setNewClinicSpecialty] = useState('');
  const [newClinicFloor, setNewClinicFloor] = useState('');

  // Form States - Doctor Registry & Assignment
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('');
  const [newDoctorClinicId, setNewDoctorClinicId] = useState('');
  const [newDoctorEmail, setNewDoctorEmail] = useState('');
  const [newDoctorPhone, setNewDoctorPhone] = useState('');
  const [newDoctorWhatsapp, setNewDoctorWhatsapp] = useState('');

  // UI Toast Notification
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Patient History Modal states
  const [historyEmail, setHistoryEmail] = useState('');
  const [historyPatientName, setHistoryPatientName] = useState('');
  const [patientHistory, setPatientHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Hospitalization Transfer Modal states
  const [showHospitalizeModal, setShowHospitalizeModal] = useState(false);
  const [selectedVisitForHosp, setSelectedVisitForHosp] = useState(null);
  const [hospDoctorId, setHospDoctorId] = useState('');
  const [hospRoom, setHospRoom] = useState('');
  const [hospStatus, setHospStatus] = useState('Estable');
  const [hospSubmitting, setHospSubmitting] = useState(false);
  const [showHospRoomSuggestions, setShowHospRoomSuggestions] = useState(false);

  // Handle click outside to close autocomplete dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const roomContainer = document.getElementById('hosp-room-suggestions-container');
      if (roomContainer && !roomContainer.contains(e.target)) {
        setShowHospRoomSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const getHospRoomSuggestions = (query) => {
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

  // Nurse Portal & Clinical Bitácora States
  const [showNurseLogModal, setShowNurseLogModal] = useState(false);
  const [showAddNurseLogModal, setShowAddNurseLogModal] = useState(false);
  const [selectedVisitForNurse, setSelectedVisitForNurse] = useState(null);
  const [nurseLogs, setNurseLogs] = useState([]);
  const [nurseLogsLoading, setNurseLogsLoading] = useState(false);
  const [newTreatments, setNewTreatments] = useState('');
  const [newMedicines, setNewMedicines] = useState('');
  const [newIndications, setNewIndications] = useState('');
  const [newLoggedAt, setNewLoggedAt] = useState('');
  const [nurseSubmitting, setNurseSubmitting] = useState(false);
  const [visitPharmacyRequests, setVisitPharmacyRequests] = useState([]);

  // Pharmacist Portal States
  const [pharmacyRequests, setPharmacyRequests] = useState([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);

  // Edit Room States
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editRoomFloor, setEditRoomFloor] = useState('');
  const [editRoomType, setEditRoomType] = useState('Individual');
  const [editRoomStatus, setEditRoomStatus] = useState('disponible');

  // Admin Doctor Edit States
  const [showEditDocModal, setShowEditDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editDocNameAdmin, setEditDocNameAdmin] = useState('');
  const [editDocSpecialtyAdmin, setEditDocSpecialtyAdmin] = useState('');
  const [editDocWorkingHoursAdmin, setEditDocWorkingHoursAdmin] = useState('');
  const [editDocEmailAdmin, setEditDocEmailAdmin] = useState('');
  const [editDocPhoneAdmin, setEditDocPhoneAdmin] = useState('');
  const [editDocWhatsappAdmin, setEditDocWhatsappAdmin] = useState('');
  const [editDocClinicIdAdmin, setEditDocClinicIdAdmin] = useState('');

  // Admin Staff Edit States
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editStaffUsername, setEditStaffUsername] = useState('');
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffRoleId, setEditStaffRoleId] = useState('');
  const [editStaffPassword, setEditStaffPassword] = useState('');

  // Fetch Nurse Logs and Pharmacy Requests for a Visit
  const fetchNurseLogs = async (visitId) => {
    setNurseLogsLoading(true);
    try {
      const [logsRes, pharmacyRes] = await Promise.all([
        fetch(`/api/nurse-logs?visitId=${visitId}`).then(r => r.json()),
        fetch(`/api/pharmacy-requests?visitId=${visitId}`).then(r => r.json())
      ]);

      if (logsRes.success) {
        setNurseLogs(logsRes.logs);
      } else {
        triggerNotification('error', logsRes.error || 'Error al obtener bitácora de enfermería.');
      }

      if (pharmacyRes.success) {
        setVisitPharmacyRequests(pharmacyRes.requests);
      } else {
        setVisitPharmacyRequests([]);
      }
    } catch (err) {
      triggerNotification('error', 'Error de red al consultar expediente clínico.');
      setVisitPharmacyRequests([]);
    } finally {
      setNurseLogsLoading(false);
    }
  };

  // Fetch all pharmacy requests for the pharmacist portal
  const fetchPharmacyRequests = async () => {
    setPharmacyLoading(true);
    try {
      const res = await fetch('/api/pharmacy-requests');
      const data = await res.json();
      if (data.success) {
        setPharmacyRequests(data.requests);
      } else {
        triggerNotification('error', data.error || 'Error al obtener solicitudes de farmacia.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red al consultar farmacia.');
    } finally {
      setPharmacyLoading(false);
    }
  };

  // Dispense/deliver a pending medication request
  const handleDispenseRequest = async (requestId) => {
    try {
      const res = await fetch('/api/pharmacy-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'Medicamentos despachados y entregados con éxito.');
        fetchPharmacyRequests();
      } else {
        triggerNotification('error', data.error || 'Error al despachar el medicamento.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red al despachar el medicamento.');
    }
  };

  const handleOpenNurseLogModal = (visit) => {
    setSelectedVisitForNurse(visit);
    setNurseLogs([]);
    setShowNurseLogModal(true);
    fetchNurseLogs(visit.id);
  };

  const handleOpenAddNurseLogModal = (visit) => {
    setSelectedVisitForNurse(visit);
    setNewTreatments('');
    setNewMedicines('');
    setNewIndications('');
    setNewLoggedAt(new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16).replace(' ', 'T')); // YYYY-MM-DDTHH:MM
    setShowAddNurseLogModal(true);
  };

  const handleConfirmNurseLog = async (e) => {
    e.preventDefault();
    if (!selectedVisitForNurse) return;
    if (!newTreatments.trim() || !newMedicines.trim() || !newIndications.trim()) {
      triggerNotification('error', 'Por favor completa todos los campos.');
      return;
    }

    setNurseSubmitting(true);
    try {
      const res = await fetch('/api/nurse-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: selectedVisitForNurse.id,
          treatments: newTreatments,
          medicines: newMedicines,
          indications: newIndications,
          loggedAt: newLoggedAt ? new Date(newLoggedAt).toISOString() : new Date().toISOString()
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'Chequeo clínico de enfermería registrado con éxito.');
        
        // Auto-trigger Pharmacy Dispensing Request if medicines are prescribed
        if (newMedicines.trim()) {
          try {
            await fetch('/api/pharmacy-requests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                visitId: selectedVisitForNurse.id,
                medicines: newMedicines,
                nurseName: session.name
              })
            });
            console.log('Pharmacy request successfully auto-sent.');
          } catch (pharmacyErr) {
            console.error('Error auto-creating pharmacy request:', pharmacyErr);
          }
        }

        setShowAddNurseLogModal(false);
        fetchDashboardData(); // Refresh patient lists
      } else {
        triggerNotification('error', data.error || 'Error al registrar bitácora.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setNurseSubmitting(false);
    }
  };

  const handleOpenHospitalizationModal = (visit) => {
    setSelectedVisitForHosp(visit);
    setHospDoctorId(visit.doctorId || '');
    setHospRoom(visit.destination || '');
    setHospStatus('Estable');
    setShowHospRoomSuggestions(false);
    setShowHospitalizeModal(true);
  };

  const handleConfirmHospitalization = async (e) => {
    e.preventDefault();
    if (!selectedVisitForHosp) return;
    if (!hospRoom.trim()) {
      triggerNotification('error', 'Por favor ingresa un número de habitación.');
      return;
    }

    setHospSubmitting(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedVisitForHosp.id,
          type: 'hospitalizaciones',
          destination: hospRoom.trim(),
          doctorId: hospDoctorId || null,
          ailments: `Ingreso Hospitalario - Estado: ${hospStatus}`,
          status: 'in house'
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Paciente ${selectedVisitForHosp.patientName} transferido a Hospitalización.`);
        setShowHospitalizeModal(false);
        fetchDashboardData();
      } else {
        triggerNotification('error', data.error || 'Ocurrió un error al procesar el traslado.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red al conectar con el servidor.');
    } finally {
      setHospSubmitting(false);
    }
  };

  const getVisitorsForVisit = (patientVisit) => {
    if (!patientVisit) return [];
    const patientNameLower = patientVisit.patientName.toLowerCase().trim();
    const patientDestLower = (patientVisit.destination || '').toLowerCase().trim();
    
    return visits.filter(v => {
      if (v.type !== 'visitante') return false;
      
      const vDestLower = (v.destination || '').toLowerCase().trim();
      const vReasonLower = (v.reason || '').toLowerCase().trim();
      const vCompanionLower = (v.visitorCompanion || '').toLowerCase().trim();
      
      const isSameDest = patientDestLower && vDestLower && (
        vDestLower === patientDestLower || 
        vDestLower.includes(patientDestLower) || 
        patientDestLower.includes(vDestLower)
      );
      
      const mentionsPatient = patientNameLower && (
        vDestLower.includes(patientNameLower) ||
        vReasonLower.includes(patientNameLower) ||
        vCompanionLower.includes(patientNameLower)
      );
      
      return isSameDest || mentionsPatient;
    });
  };

  const handleViewPatientHistory = async (email, patientName) => {
    if (!email) return;
    setHistoryEmail(email);
    setHistoryPatientName(patientName);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      const res = await fetch(`/api/visits?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setPatientHistory(data.visits);
      } else {
        setPatientHistory([]);
      }
    } catch (err) {
      console.error('Error fetching patient history:', err);
      setPatientHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };


  // ==========================================
  // DOCTOR PORTAL CORE STATE & LOGIC (EMR)
  // ==========================================
  const [docTab, setDocTab] = useState('patients'); // 'patients' | 'schedule' | 'myhistory' | 'profile'
  const [editDocName, setEditDocName] = useState('');
  const [editDocSpecialty, setEditDocSpecialty] = useState('');
  const [editDocWorkingHours, setEditDocWorkingHours] = useState('');
  const [docUpdating, setDocUpdating] = useState(false);

  // Helper to generate Google Calendar URL
  const getGoogleCalendarUrl = (appt, doctorName, clinicName) => {
    if (!appt || !appt.appointmentDate) return '#';
    const startDate = new Date(appt.appointmentDate);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min duration
    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    const dates = `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`;
    const title = `Cita Médica: ${appt.patientName}`;
    const details = `Cita programada con el Dr. ${doctorName || 'Especialista'}.\nMotivo: ${appt.reason}\nCódigo de Entrada (Check-In QR): ${appt.qrToken}`;
    const location = clinicName || 'Consultorio Asignado';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  // Handler to update doctor profile
  const handleUpdateDoctorProfile = async (e) => {
    e.preventDefault();
    if (!editDocName.trim() || !editDocSpecialty.trim()) {
      triggerNotification('error', 'El nombre y la especialidad son requeridos.');
      return;
    }

    setDocUpdating(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editDocName,
          specialty: editDocSpecialty,
          workingHours: editDocWorkingHours
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'Perfil y horarios actualizados correctamente.');
        fetchDashboardData(); // Refresh doctor data and session info
      } else {
        triggerNotification('error', data.error || 'Error al actualizar el perfil.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red al conectar con el servidor.');
    } finally {
      setDocUpdating(false);
    }
  };
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [clinicalAilments, setClinicalAilments] = useState('');
  const [clinicalMedicines, setClinicalMedicines] = useState('');
  const [clinicalFollowUp, setClinicalFollowUp] = useState('');
  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [historyLoadingDoc, setHistoryLoadingDoc] = useState(false);

  // Appointment Form States
  const [apptName, setApptName] = useState('');
  const [apptEmail, setApptEmail] = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [createdAppt, setCreatedAppt] = useState(null);

  // Doctor Select Patient
  const handleSelectPatient = async (visit) => {
    setSelectedPatient(visit);
    if (!visit) {
      setSelectedPatientHistory([]);
      return;
    }

    setClinicalAilments(visit.ailments || '');
    setClinicalMedicines(visit.medicines || '');
    setClinicalFollowUp(visit.followUp || '');

    if (visit.email) {
      setHistoryLoadingDoc(true);
      try {
        const res = await fetch(`/api/visits?email=${encodeURIComponent(visit.email)}`);
        const data = await res.json();
        if (data.success) {
          // Filter out the current active visit to show only past ones
          setSelectedPatientHistory(data.visits.filter(v => v.id !== visit.id));
        } else {
          setSelectedPatientHistory([]);
        }
      } catch (err) {
        console.error('Error fetching patient clinical history:', err);
        setSelectedPatientHistory([]);
      } finally {
        setHistoryLoadingDoc(false);
      }
    } else {
      setSelectedPatientHistory([]);
    }
  };

  // Complete Consultation & Check-Out
  const handleCompleteConsultation = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setLoading(true);
    try {
      const res = await fetch('/api/visits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: selectedPatient.id,
          ailments: clinicalAilments,
          medicines: clinicalMedicines,
          followUp: clinicalFollowUp
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Consulta completada y Check-Out registrado para ${selectedPatient.patientName}.`);
        setSelectedPatient(null);
        setClinicalAilments('');
        setClinicalMedicines('');
        setClinicalFollowUp('');
        setSelectedPatientHistory([]);
        fetchDashboardData();
      } else {
        triggerNotification('error', data.error || 'Error al guardar la consulta.');
      }
    } catch (err) {
      triggerNotification('error', 'Error al procesar los datos de consulta.');
    } finally {
      setLoading(false);
    }
  };

  // Schedule Appointment & Generate QR
  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    if (!apptName.trim() || !apptDate || !apptReason.trim()) {
      triggerNotification('error', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    const currentDoc = doctors.find(d => d.userId === session.id);
    if (!currentDoc) {
      triggerNotification('error', 'No se encontró un perfil médico asociado a este usuario.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: apptName,
          email: apptEmail || null,
          phone: apptPhone || null,
          type: 'paciente',
          destination: currentDoc.clinic ? currentDoc.clinic.name : 'Consultorio',
          reason: apptReason,
          isAppointment: true,
          appointmentDate: apptDate,
          doctorId: currentDoc.id
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Cita agendada para ${apptName}. Pase QR disponible.`);
        setCreatedAppt(data.visit);
        // Reset fields
        setApptName('');
        setApptEmail('');
        setApptPhone('');
        setApptDate('');
        setApptReason('');
        fetchDashboardData();
      } else {
        triggerNotification('error', data.error || 'Error al agendar la cita.');
      }
    } catch (err) {
      triggerNotification('error', 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // RENDER DEDICATED NURSE PORTAL UI
  const renderNursePortal = () => {
    // Only hospitalized patients currently "in house"
    const hospitalizedPatients = visits.filter(v => v.status === 'in house' && v.type === 'hospitalizaciones');

    return (
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Toast Alert */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
          }`}>
            <ShieldCheck className="w-5 h-5" />
            <p className="text-xs font-semibold">{notification.message}</p>
          </div>
        )}

        {/* Header */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Activity className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wide text-white leading-tight uppercase Outfit">Aozora Care-Flow</h2>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                PORTAL GENERAL DE ENFERMERÍA
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{session.name}</p>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">Enfermero de Turno</p>
            </div>
            
            {/* Presence Toggle Button */}
            <button
              onClick={() => handleTogglePresence()}
              className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                session.isPresent
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
              }`}
              title={session.isPresent ? 'Presiona para registrar tu salida del hospital' : 'Presiona para registrar tu entrada al hospital'}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${session.isPresent ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
              <span className="hidden sm:inline">{session.isPresent ? 'En Hospital (Dentro)' : 'Fuera de Turno'}</span>
              <span className="sm:hidden">{session.isPresent ? 'Dentro' : 'Fuera'}</span>
            </button>

            <button 
              onClick={handleLogout}
              className="h-9 px-3 rounded-lg border border-rose-500/15 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Welcome Dashboard Overview Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-indigo-500/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
            <h3 className="text-xl font-extrabold text-white Outfit">¡Hola, {session.name}!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Bienvenido a tu consola de enfermería. Aquí puedes monitorear a los pacientes en hospitalización, consultar su expediente clínico y registrar chequeos, indicaciones y la administración de medicamentos en su expediente clínico compartido.
            </p>
          </div>

          {/* Hospitalized Patients List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bed className="w-4 h-4 text-indigo-400" />
                Pacientes Hospitalizados Actualmente ({hospitalizedPatients.length})
              </h3>
              <button 
                onClick={fetchDashboardData}
                className="text-[10px] text-slate-400 hover:text-white border border-white/5 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-300 cursor-pointer"
              >
                Actualizar Lista
              </button>
            </div>

            {/* Patients Grid */}
            {hospitalizedPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitalizedPatients.map((visit) => (
                  <div key={visit.id} className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between">
                    
                    {/* Header: Bed & Time */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                          <Bed className="w-3 h-3" /> {visit.destination}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-650" /> Ingreso: {new Date(visit.checkInTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Name & Contact */}
                      <h4 className="text-white font-extrabold text-base leading-tight mt-2">{visit.patientName}</h4>
                      {visit.phone && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-500" /> {visit.phone}
                        </p>
                      )}
                      {visit.email && (
                        <p className="text-[10px] text-slate-500 truncate" title={visit.email}>
                          {visit.email}
                        </p>
                      )}
                    </div>

                    {/* Doctor assigned & clinical info */}
                    <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                      {visit.doctor && (
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-slate-300">Médico: <strong>{visit.doctor.name}</strong></span>
                        </div>
                      )}
                      <div className="p-3 rounded-lg bg-slate-950/40 border border-white/5">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Motivo de Ingreso</p>
                        <p className="text-slate-300 italic mt-0.5">"{visit.reason}"</p>
                        {visit.ailments && (
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">Diagnóstico / Estado</p>
                            <p className="text-slate-300 mt-0.5">{visit.ailments}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => handleOpenNurseLogModal(visit)}
                        className="flex-1 h-9 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
                        title="Ver Bitácora / Expediente de Enfermería"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Expediente
                      </button>
                      <button
                        onClick={() => handleOpenAddNurseLogModal(visit)}
                        className="flex-1 h-9 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                        title="Registrar chequeo o medicamentos"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Registrar
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                  <Bed className="w-6 h-6 text-slate-650" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">No hay pacientes hospitalizados</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                    Actualmente no se registran pacientes en la categoría de Hospitalización (in house).
                  </p>
                </div>
              </div>
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 bg-slate-950/20 mt-12">
          <p>&copy; {new Date().getFullYear()} Aozora Care-Flow. Portal de Enfermería ({session.name}).</p>
        </footer>

        {/* ═══ NURSE MODALS (must live inside portal return) ═══ */}

        {/* Modal: Ver Expediente Clínico */}
        {showNurseLogModal && selectedVisitForNurse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative border border-indigo-500/20 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/5 pb-4 mb-6 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Expediente Clínico</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1 uppercase">
                        <Bed className="w-3 h-3" /> {selectedVisitForNurse.destination}
                      </span>
                      <span className="text-xs text-slate-400">Paciente: <strong className="text-white">{selectedVisitForNurse.patientName}</strong></span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowNurseLogModal(false)} className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer self-start">
                  Cerrar
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 text-left">
                
                {/* Evolution & Clinical Logs Timeline */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Activity className="w-4 h-4" /> Evolución y Chequeos Clínicos ({nurseLogs.length})
                  </h4>
                  {nurseLogsLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <Activity className="w-8 h-8 text-indigo-400 pulse-glow animate-pulse" />
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Cargando Expediente...</p>
                    </div>
                  ) : nurseLogs.length > 0 ? (
                    <div className="relative border-l border-white/10 ml-4 pl-8 space-y-8 py-2">
                      {nurseLogs.map((log) => {
                        const t = new Date(log.loggedAt);
                        return (
                          <div key={log.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border border-slate-950 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 bg-slate-950/20">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 gap-2 text-xs">
                                <span className="text-indigo-400 font-bold flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {t.toLocaleDateString()} — {t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-slate-400">Por: <strong className="text-slate-200">{log.nurseName}</strong></span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1"><Activity className="w-3 h-3" /> Tratamientos</span>
                                  <p className="text-xs text-slate-200 mt-1 whitespace-pre-wrap">{log.treatments}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Medicación</span>
                                  <p className="text-xs text-slate-200 mt-1 whitespace-pre-wrap">{log.medicines}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FileText className="w-3 h-3" /> Observaciones</span>
                                  <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap">{log.indications}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
                      <Bed className="w-10 h-10 text-slate-700" />
                      <div>
                        <h4 className="font-extrabold text-white">Sin Registros Clínicos</h4>
                        <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">Aún no hay chequeos de enfermería registrados para este paciente.</p>
                      </div>
                      <button onClick={() => { setShowNurseLogModal(false); handleOpenAddNurseLogModal(selectedVisitForNurse); }} className="h-10 px-5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer">
                        <Plus className="w-4 h-4" /> Registrar Primer Chequeo
                      </button>
                    </div>
                  )}
                </div>

                {/* Right column: Visitors */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Users className="w-4 h-4" /> Historial de Visitantes ({getVisitorsForVisit(selectedVisitForNurse).length})
                  </h4>
                  
                  {getVisitorsForVisit(selectedVisitForNurse).length > 0 ? (
                    <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                      {getVisitorsForVisit(selectedVisitForNurse).map((v) => {
                        const vt = new Date(v.checkInTime);
                        const vOut = v.checkOutTime ? new Date(v.checkOutTime) : null;
                        return (
                          <div key={v.id} className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2.5 hover:border-indigo-500/10 transition-all duration-300 bg-slate-950/20">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-extrabold text-xs text-white">👤 {v.patientName}</span>
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{v.type}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">"{v.reason}"</p>
                            <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[10px] font-mono text-slate-500">
                              <div className="flex items-center justify-between">
                                <span>Entrada:</span>
                                <span className="text-slate-350">{vt.toLocaleDateString()} {vt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Salida:</span>
                                <span className="text-slate-350">{vOut 
                                  ? `${vOut.toLocaleDateString()} ${vOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                  : <span className="text-emerald-400 font-extrabold">Dentro</span>}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-950/20 border border-dashed border-white/5 text-center flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-700" />
                      <p className="text-xs text-slate-500">Aún no hay visitas registradas para este paciente.</p>
                    </div>
                  )}

                  {/* Pharmacy Requests Section */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <Plus className="w-3.5 h-3.5" /> Solicitudes a Farmacia ({visitPharmacyRequests.length})
                    </h4>
                    
                    {visitPharmacyRequests.length > 0 ? (
                      <div className="space-y-3.5 max-h-[40vh] overflow-y-auto pr-1">
                        {visitPharmacyRequests.map((req) => {
                          const reqDate = new Date(req.createdAt);
                          return (
                            <div key={req.id} className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2.5 hover:border-sky-500/10 transition-all duration-300 bg-slate-950/20">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-extrabold text-[11px] text-white">💊 Solicitado por: {req.nurseName}</span>
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                  req.status === 'pendiente'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}>
                                  {req.status}
                                </span>
                              </div>
                              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-[10px] text-slate-300 font-medium">
                                {req.medicines}
                              </div>
                              <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[9px] font-mono text-slate-500">
                                <div className="flex items-center justify-between">
                                  <span>Fecha Solicitud:</span>
                                  <span>{reqDate.toLocaleDateString()} {reqDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {req.status === 'entregado' && (
                                  <>
                                    <div className="flex items-center justify-between text-emerald-400">
                                      <span>Despachado por:</span>
                                      <span>{req.dispensedBy}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-emerald-400">
                                      <span>Fecha Entrega:</span>
                                      <span>{req.dispensedAt ? new Date(req.dispensedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-slate-950/20 border border-dashed border-white/5 text-center flex flex-col items-center justify-center gap-2">
                        <Plus className="w-6 h-6 text-slate-700" />
                        <p className="text-xs text-slate-500">No hay solicitudes de medicamentos para este paciente.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Modal: Registrar Chequeo Clínico */}
        {showAddNurseLogModal && selectedVisitForNurse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
              <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Plus className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Registrar Chequeo Clínico</h3>
                    <p className="text-xs text-slate-400 mt-1">Para <span className="text-indigo-400 font-bold">{selectedVisitForNurse.patientName}</span> ({selectedVisitForNurse.destination})</p>
                  </div>
                </div>
                <button onClick={() => setShowAddNurseLogModal(false)} className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all">
                  Cancelar
                </button>
              </div>
              <form onSubmit={handleConfirmNurseLog} className="space-y-5 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Tratamientos / Procedimientos <span className="text-indigo-400">*</span></label>
                  <textarea required rows="3" placeholder="Ej. Curación de herida, monitoreo cardíaco..." value={newTreatments} onChange={(e) => setNewTreatments(e.target.value)} className="w-full p-3 rounded-lg glass-input text-xs resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Medicamentos / Soluciones Administradas <span className="text-indigo-400">*</span></label>
                  <textarea required rows="3" placeholder="Ej. Cloruro de Sodio 0.9% 500ml IV..." value={newMedicines} onChange={(e) => setNewMedicines(e.target.value)} className="w-full p-3 rounded-lg glass-input text-xs resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Indicaciones / Observaciones <span className="text-indigo-400">*</span></label>
                  <textarea required rows="3" placeholder="Ej. Reposo absoluto, control de líquidos..." value={newIndications} onChange={(e) => setNewIndications(e.target.value)} className="w-full p-3 rounded-lg glass-input text-xs resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Fecha y Hora del Chequeo <span className="text-indigo-400">*</span></label>
                  <input type="datetime-local" required value={newLoggedAt} onChange={(e) => setNewLoggedAt(e.target.value)} className="w-full h-11 px-4 rounded-lg glass-input text-xs" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowAddNurseLogModal(false)} className="flex-1 h-11 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                    Cancelar
                  </button>
                  <button type="submit" disabled={nurseSubmitting} className="flex-1 h-11 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50">
                    {nurseSubmitting ? 'Registrando...' : 'Guardar Chequeo Clínico'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  // RENDER DEDICATED DOCTOR PORTAL UI
  const renderDoctorPortal = () => {
    const currentDoc = doctors.find(d => d.userId === session.id);
    const docClinicName = currentDoc && currentDoc.clinic ? currentDoc.clinic.name : 'Consultorio Asignado';
    
    // Filter active patients assigned to this doctor currently checked-in
    // Match by doctorId (direct assignment) OR by clinic name in destination (walk-in autocomplete)
    const docClinicNameLower = (currentDoc?.clinic?.name || '').toLowerCase();
    const docNameLower = (currentDoc?.name || '').toLowerCase();
    const myActivePatients = currentDoc 
      ? visits.filter(v => {
          if (v.status !== 'in house') return false;
          // Direct assignment (paciente form with dropdown or appointment)
          if (v.doctorId === currentDoc.id) return true;
          // Autocomplete walk-in: destination contains doctor's name or clinic name
          const destLower = (v.destination || '').toLowerCase();
          if (docNameLower && destLower.includes(docNameLower)) return true;
          if (docClinicNameLower && destLower.includes(docClinicNameLower)) return true;
          return false;
        })
      : [];

    // Sort waiting list: appointments for today first (by appointment time), then walk-ins by arrival
    const today = new Date();
    const todayStr = today.toDateString();
    const sortedActivePatients = [...myActivePatients].sort((a, b) => {
      const aIsApptToday = a.isAppointment && a.appointmentDate && new Date(a.appointmentDate).toDateString() === todayStr;
      const bIsApptToday = b.isAppointment && b.appointmentDate && new Date(b.appointmentDate).toDateString() === todayStr;
      if (aIsApptToday && !bIsApptToday) return -1;
      if (!aIsApptToday && bIsApptToday) return 1;
      // Both appointments: sort by appointment time
      if (aIsApptToday && bIsApptToday) return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      // Both walk-ins: sort by check-in time (earliest first)
      return new Date(a.checkInTime) - new Date(b.checkInTime);
    });

    // Filter past patients treated by this doctor
    const myTreatedPatients = currentDoc
      ? visits.filter(v => v.doctorId === currentDoc.id && v.status === 'fuera')
      : [];

    // Filter scheduled appointments assigned to this doctor
    const myAppts = currentDoc
      ? visits.filter(v => v.doctorId === currentDoc.id && v.status === 'agendado')
      : [];

    // All patients ever associated with this doctor (any status) — for Mis Pacientes tab
    const myAllPatients = currentDoc
      ? visits.filter(v => {
          if (v.doctorId === currentDoc.id) return true;
          const destLower = (v.destination || '').toLowerCase();
          if (docNameLower && destLower.includes(docNameLower)) return true;
          if (docClinicNameLower && destLower.includes(docClinicNameLower)) return true;
          return false;
        }).sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)) // newest first
      : [];


    return (
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="glass-panel border-b border-white/5 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Stethoscope className="w-6 h-6 text-emerald-400 pulse-glow" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Portal <span className="text-emerald-400 font-extrabold font-display">Clínico Médico</span>
                </h1>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  {currentDoc ? `${currentDoc.name} • ${currentDoc.specialty}` : 'Médico General'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end text-xs text-right">
                <span className="text-white font-bold">{docClinicName}</span>
                {currentDoc?.workingHours && (
                  <span className="text-[10px] text-slate-400 font-medium italic mt-0.5" title="Horarios de atención">
                    📅 {currentDoc.workingHours}
                  </span>
                )}
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1">
                  En Turno Activo
                </span>
              </div>
              
              {/* Presence Toggle Button */}
              <button
                onClick={() => handleTogglePresence()}
                className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  session.isPresent
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                    : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
                }`}
                title={session.isPresent ? 'Presiona para registrar tu salida del hospital' : 'Presiona para registrar tu entrada al hospital'}
              >
                <span className={`w-2 h-2 rounded-full animate-pulse ${session.isPresent ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
                <span className="hidden sm:inline">{session.isPresent ? 'En Hospital (Dentro)' : 'Fuera de Turno'}</span>
                <span className="sm:hidden">{session.isPresent ? 'Dentro' : 'Fuera'}</span>
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
          
          {/* Navigation tabs */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-px mb-8 overflow-x-auto">
            <button
              onClick={() => {
                setDocTab('patients');
                setSelectedPatient(null);
                setSelectedPatientHistory([]);
              }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                docTab === 'patients'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Atención a Pacientes
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {sortedActivePatients.length}
              </span>
            </button>
            
            <button
              onClick={() => {
                setDocTab('schedule');
                setCreatedAppt(null);
              }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                docTab === 'schedule'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              Agendar Citas / Pase QR
              {myAppts.length > 0 && (
                <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {myAppts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setDocTab('mypatients')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                docTab === 'mypatients'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Mis Pacientes
              {myAllPatients.length > 0 && (
                <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {myAllPatients.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setDocTab('myhistory')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                docTab === 'myhistory'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              Consultas Realizadas
              <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {myTreatedPatients.length}
              </span>
            </button>

            <button
              onClick={() => {
                setDocTab('profile');
                if (currentDoc) {
                  setEditDocName(currentDoc.name || '');
                  setEditDocSpecialty(currentDoc.specialty || '');
                  setEditDocWorkingHours(currentDoc.workingHours || '');
                }
              }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                docTab === 'profile'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4.5 h-4.5" />
              Mi Perfil y Horarios
            </button>
          </div>

          {/* TAB: PATIENTS */}
          {docTab === 'patients' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Waiting list */}
              <div className="lg:col-span-4 glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-emerald-400 pulse-glow" />
                    Sala de Espera
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {sortedActivePatients.length}
                    </span>
                  </h4>
                  <button
                    onClick={fetchDashboardData}
                    className="text-[9px] text-slate-400 hover:text-white border border-white/5 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800 px-2 py-1 rounded-lg font-bold transition-all duration-300 cursor-pointer"
                    title="Actualizar lista"
                  >
                    ↻ Actualizar
                  </button>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {sortedActivePatients.length > 0 ? (
                    sortedActivePatients.map((visit, idx) => {
                      const isSelected = selectedPatient && selectedPatient.id === visit.id;
                      const isApptToday = visit.isAppointment && visit.appointmentDate &&
                        new Date(visit.appointmentDate).toDateString() === new Date().toDateString();
                      const waitMins = Math.floor((new Date() - new Date(visit.checkInTime)) / 60000);
                      return (
                        <button
                          key={visit.id}
                          onClick={() => handleSelectPatient(visit)}
                          className={`w-full p-3.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                              : 'bg-slate-900/40 border-white/5 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>{idx + 1}</span>
                              <span className="font-bold text-sm text-white leading-tight">{visit.patientName}</span>
                            </div>
                            {isApptToday ? (
                              <span className="text-[8px] font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">Cita</span>
                            ) : (
                              <span className="text-[9px] font-mono text-slate-500 shrink-0">
                                {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>

                          {visit.email && <span className="text-[10px] text-slate-400 truncate max-w-full pl-7">{visit.email}</span>}

                          <div className="flex items-center justify-between pl-7 pt-1 border-t border-white/5 w-full text-[10px]">
                            <span className="text-slate-500 italic truncate max-w-[130px]">{visit.reason}</span>
                            <span className={`font-semibold shrink-0 ${
                              waitMins > 30 ? 'text-rose-400' : waitMins > 15 ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {waitMins}m espera
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <UserCheck className="w-8 h-8 text-slate-700" />
                      <div>
                        <p className="font-semibold text-slate-400 text-xs">Sin pacientes en espera</p>
                        <p className="text-[9px] text-slate-600 mt-0.5 max-w-[180px] mx-auto">Los pacientes appearán aquí al registrar su ingreso. Presiona Actualizar si esperas a alguien.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active consultation board */}
              <div className="lg:col-span-8 space-y-6">
                {selectedPatient ? (
                  <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
                    
                    {/* Patient Overview */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                          Consulta Médica Activa
                        </span>
                        <h3 className="text-xl font-extrabold text-white mt-2">{selectedPatient.patientName}</h3>
                        <div className="flex items-center gap-4 text-slate-400 text-xs mt-1.5">
                          {selectedPatient.email && <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-500" /> {selectedPatient.email}</span>}
                          {selectedPatient.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" /> Tel: {selectedPatient.phone}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {selectedPatient.type === 'hospitalizaciones' && (
                          <button
                            type="button"
                            onClick={() => handleOpenNurseLogModal(selectedPatient)}
                            className="px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                            title="Ver Bitácora de Enfermería"
                          >
                            <FileText className="w-4 h-4" />
                            Expediente Enfermería
                          </button>
                        )}
                        <button
                          onClick={() => handleSelectPatient(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white text-xs hover:border-slate-500 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>

                    {/* Historical Clinical timeline */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Historial de Consultas Anteriores
                      </h5>

                      {historyLoadingDoc ? (
                        <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-400 pulse-glow" />
                          <span>Cargando antecedentes...</span>
                        </div>
                      ) : selectedPatientHistory.length > 0 ? (
                        <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                          {selectedPatientHistory.map((hist) => (
                            <div key={hist.id} className="p-3 rounded-lg bg-slate-900/50 border border-white/5 text-xs text-slate-300">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1.5">
                                <span>📅 {new Date(hist.checkInTime).toLocaleDateString()} - Consulta de {hist.destination}</span>
                                <span className="text-indigo-400">Dr. {hist.doctor?.name || 'Médico'}</span>
                              </div>
                              <p className="mt-1 font-semibold text-white">Diagnóstico/Padecimientos:</p>
                              <p className="text-slate-300 pl-2 italic">"{hist.ailments || 'No especificados'}"</p>
                              <p className="mt-1 font-semibold text-white">Tratamiento prescrito:</p>
                              <p className="text-slate-300 pl-2 italic">"{hist.medicines || 'Sin medicamentos prescritos'}"</p>
                              {hist.followUp && (
                                <>
                                  <p className="mt-1 font-semibold text-white">Seguimiento:</p>
                                  <p className="text-slate-300 pl-2 italic">"{hist.followUp}"</p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic py-2 pl-1">No se registran antecedentes clínicos de consultas anteriores para este paciente.</p>
                      )}
                    </div>

                    {/* EMR Diagnosis Form */}
                    <form onSubmit={handleCompleteConsultation} className="space-y-4">
                      
                      {/* Diagnosis / Ailments */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                          Diagnóstico Clínico / Padecimientos <span className="text-emerald-400">*</span>
                        </label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Escribe los síntomas detectados, dolores, padecimiento del paciente o diagnóstico..."
                          value={clinicalAilments}
                          onChange={(e) => setClinicalAilments(e.target.value)}
                          className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                        />
                      </div>

                      {/* Prescriptions / Medicines */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                          Prescripción Médica / Tratamiento <span className="text-emerald-400">*</span>
                        </label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Especifica los medicamentos, dosis y horarios prescritos al paciente..."
                          value={clinicalMedicines}
                          onChange={(e) => setClinicalMedicines(e.target.value)}
                          className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                        />
                      </div>

                      {/* Follow-up notes */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                          Instrucciones de Seguimiento
                        </label>
                        <textarea
                          rows="2"
                          placeholder="Recomendaciones adicionales, reposo, o fecha de próxima consulta..."
                          value={clinicalFollowUp}
                          onChange={(e) => setClinicalFollowUp(e.target.value)}
                          className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                        />
                      </div>

                      {/* Submit Consultation */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Guardando consulta...' : 'Guardar Receta y Completar Check-Out'}
                        <CheckCircle className="w-4.5 h-4.5" />
                      </button>

                    </form>

                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[50vh]">
                    <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                      <Stethoscope className="w-7 h-7 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Consola de Diagnóstico Clínico</h4>
                      <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1.5 leading-relaxed">
                        Selecciona un paciente de la lista de espera (izquierda) para acceder a su expediente, revisar antecedentes y redactar su consulta de hoy.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: SCHEDULE APPOINTMENTS */}
          {docTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-lg text-white border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Agendar Nueva Cita
                </h3>

                <form onSubmit={handleScheduleAppointment} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Nombre Completo del Paciente <span className="text-emerald-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={apptName}
                      onChange={(e) => setApptName(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="Ej. juan.perez@correo.com"
                        value={apptEmail}
                        onChange={(e) => setApptEmail(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Teléfono Movil (WhatsApp)</label>
                      <input
                        type="tel"
                        placeholder="Ej. +521234567890"
                        value={apptPhone}
                        onChange={(e) => setApptPhone(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>

                  {/* Appointment Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Fecha y Hora de la Cita <span className="text-emerald-400">*</span></label>
                    <input
                      type="datetime-local"
                      required
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Motivo de Consulta <span className="text-emerald-400">*</span></label>
                    <textarea
                      required
                      rows="2"
                      placeholder="Ej. Consulta de control pediátrico mensual..."
                      value={apptReason}
                      onChange={(e) => setApptReason(e.target.value)}
                      className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                    />
                  </div>

                  {/* Submit Appt */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Programando cita...' : 'Agendar Cita y Generar Pase'}
                    <Plus className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>

              {/* Right Column: Ticket / QR Code / Agenda Consultation */}
              <div className="lg:col-span-6">
                {createdAppt ? (
                  <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl space-y-6 flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Glowing effect */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500"></div>

                    <div className="text-center">
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Pase de Cita Médica QR
                      </span>
                      <h4 className="font-extrabold text-white text-base mt-2">Cita Médica Autorizada</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Acceso automático al hospital sin fricción</p>
                    </div>

                    {/* QR Code Graphic using Lightweight Server API */}
                    <div className="p-3 bg-white rounded-xl shadow-inner flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${createdAppt.qrToken}`}
                        alt="Pase de cita QR" 
                        className="w-44 h-44 shrink-0"
                      />
                    </div>

                    {/* Details card */}
                    <div className="w-full text-left p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paciente:</span>
                        <span className="text-white font-bold">{createdAppt.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fecha y Hora:</span>
                        <span className="text-white font-semibold">
                          {new Date(createdAppt.appointmentDate).toLocaleDateString()} a las {new Date(createdAppt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Consultorio:</span>
                        <span className="text-white font-semibold">{docClinicName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Médico:</span>
                        <span className="text-white font-semibold">{currentDoc ? currentDoc.name : 'Asignado'}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-[10px]">
                        <span className="text-slate-400 uppercase tracking-wider font-bold">Token de Cita (Copia):</span>
                        <span className="text-emerald-400 font-mono font-bold">{createdAppt.qrToken}</span>
                      </div>
                    </div>

                    {/* WhatsApp Action and Actions bar */}
                    <div className="w-full space-y-3">
                      {createdAppt.phone ? (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(createdAppt.phone)}&text=${encodeURIComponent(
                            `🏥 *PASE DE ENTRADA QR - HOSPITAL*\n\nHola *${createdAppt.patientName}*, tu cita médica ha sido confirmada exitosamente.\n\n👨‍⚕️ *Médico:* ${currentDoc ? currentDoc.name : 'Especialista'}\n🏢 *Ubicación:* ${docClinicName} (${currentDoc ? currentDoc.specialty : 'Consulta'})\n📅 *Fecha:* ${new Date(createdAppt.appointmentDate).toLocaleDateString()} a las ${new Date(createdAppt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n\n🔑 *CÓDIGO DE CHECK-IN:* ${createdAppt.qrToken}\n_(Copia y pega este código en la entrada si el escáner QR de tu cámara no funciona)_\n\nPresenta tu pase de entrada QR en recepción para registrar tu ingreso automático:\nhttps://api.qrserver.com/v1/create-qr-code/?size=250x250%26data=${createdAppt.qrToken}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-11 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                        >
                          <Phone className="w-4 h-4" />
                          Enviar por WhatsApp
                        </a>
                      ) : (
                        <div className="p-3 rounded-lg bg-slate-950/40 border border-white/5 text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>No ingresaste teléfono móvil para enviar por WhatsApp.</span>
                        </div>
                      )}

                      <a
                        href={getGoogleCalendarUrl(createdAppt, currentDoc?.name, docClinicName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-11 rounded-xl border border-white/5 hover:border-white/10 bg-slate-900/40 hover:bg-slate-800 text-slate-200 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                      >
                        <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                        Añadir a Google Calendar
                      </a>

                      <button
                        onClick={() => setCreatedAppt(null)}
                        className="w-full h-10 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                      >
                        Limpiar Pase / Volver a Citas
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 text-left">
                    <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                      <Calendar className="w-4.5 h-4.5 text-emerald-400" />
                      Próximas Citas Programadas ({myAppts.length})
                    </h4>
                    
                    {myAppts.length > 0 ? (
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {[...myAppts]
                          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                          .map((appt) => {
                            const apptTime = new Date(appt.appointmentDate);
                            return (
                              <div key={appt.id} className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all duration-300 space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="font-bold text-white text-xs">{appt.patientName}</h5>
                                    {appt.phone && (
                                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3 h-3 text-emerald-500" /> {appt.phone}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                                    ⏱️ {apptTime.toLocaleDateString()} a las {apptTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                
                                <p className="text-[10px] text-slate-400 italic">
                                  Motivo: "{appt.reason}"
                                </p>
                                
                                <div className="text-[9px] font-mono text-slate-500 flex items-center justify-between border-t border-white/5 pt-2">
                                  <span>Token QR: <strong className="text-emerald-400">{appt.qrToken}</strong></span>
                                </div>
                                
                                <div className="flex gap-2 pt-1">
                                  <button
                                    onClick={() => setCreatedAppt(appt)}
                                    className="flex-1 h-7 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                                    title="Ver Código QR y ticket de acceso"
                                  >
                                    <QrCode className="w-3 h-3" /> Ver QR
                                  </button>
                                  <a
                                    href={getGoogleCalendarUrl(appt, currentDoc?.name, docClinicName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 h-7 rounded border border-slate-700 hover:border-slate-500 text-slate-350 hover:text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 text-center"
                                  >
                                    <Calendar className="w-3 h-3" /> Calendario
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 animate-pulse">
                          <Calendar className="w-5 h-5 text-slate-650" />
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold text-xs">No hay citas registradas</p>
                          <p className="text-[9px] text-slate-600 mt-0.5 max-w-[200px] mx-auto">
                            Las citas programadas que aún no ingresan aparecerán organizadas aquí.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}
          {/* TAB: MIS PACIENTES — full patient directory */}
          {docTab === 'mypatients' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Users className="w-4.5 h-4.5 text-emerald-400" />
                      Directorio de Mis Pacientes
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Todos los pacientes asociados a tu consultorio — historial completo, notas clínicas y bitácora de enfermería.</p>
                  </div>
                  <button onClick={fetchDashboardData} className="text-[9px] text-slate-400 hover:text-white border border-white/5 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer">
                    ↻ Actualizar
                  </button>
                </div>
              </div>

              {myAllPatients.length > 0 ? (
                <div className="space-y-3">
                  {myAllPatients.map((patient) => {
                    const isExpanded = selectedPatient && selectedPatient.id === patient.id && docTab === 'mypatients';
                    // Status config
                    const statusMap = {
                      'in house': { label: 'En Sala', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                      'agendado': { label: 'Cita Agendada', cls: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                      'fuera': { label: 'Alta / Se fue', cls: 'bg-slate-800 text-slate-400 border-slate-700' },
                    };
                    const typeMap = {
                      'visitante': { label: 'Visitante', cls: 'text-slate-400' },
                      'paciente': { label: 'Paciente', cls: 'text-emerald-400' },
                      'urgencias': { label: 'Urgencias', cls: 'text-rose-400' },
                      'hospitalizaciones': { label: 'Hospitalizado', cls: 'text-indigo-400' },
                    };
                    const s = statusMap[patient.status] || { label: patient.status, cls: 'bg-slate-800 text-slate-400 border-slate-700' };
                    const ty = typeMap[patient.type] || { label: patient.type, cls: 'text-slate-400' };
                    const checkin = new Date(patient.checkInTime);

                    return (
                      <div key={patient.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-emerald-500/10">
                        {/* Patient row — clickable header */}
                        <button
                          onClick={() => {
                            if (isExpanded) {
                              handleSelectPatient(null);
                            } else {
                              handleSelectPatient(patient);
                              fetchNurseLogs(patient.id);
                            }
                          }}
                          className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-900/30 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                              patient.type === 'hospitalizaciones' ? 'bg-indigo-500/10 border-indigo-500/20' :
                              patient.type === 'urgencias' ? 'bg-rose-500/10 border-rose-500/20' :
                              'bg-emerald-500/10 border-emerald-500/20'
                            }`}>
                              <Users className={`w-4 h-4 ${ty.cls}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-sm text-white leading-tight">{patient.patientName}</span>
                                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-widest ${ty.cls}`}>{ty.label}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 flex-wrap text-[10px] text-slate-400">
                                {patient.email && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{patient.email}</span>}
                                {patient.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>}
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{checkin.toLocaleDateString()} {checkin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[9px] font-mono text-slate-500 hidden sm:block">{patient.destination}</span>
                            <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        </button>

                        {/* Expanded expediente */}
                        {isExpanded && (
                          <div className="border-t border-white/5 p-4 sm:p-6 space-y-6 bg-slate-950/20">

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Correo</p>
                                <p className="text-slate-200 font-medium truncate">{patient.email || 'No registrado'}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Teléfono</p>
                                <p className="text-slate-200 font-medium">{patient.phone || '—'}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Destino / Hab.</p>
                                <p className="text-slate-200 font-medium">{patient.destination}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Motivo</p>
                                <p className="text-slate-200 font-medium italic truncate" title={patient.reason}>"{patient.reason}"</p>
                              </div>
                            </div>

                            {/* Doctor's Clinical Notes */}
                            {(patient.ailments || patient.medicines || patient.followUp) && (
                              <div>
                                <h5 className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                  <Stethoscope className="w-3.5 h-3.5" /> Notas Clínicas del Médico
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                  {patient.ailments && (
                                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                      <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Diagnóstico / Padecimientos</p>
                                      <p className="text-slate-200 whitespace-pre-wrap">{patient.ailments}</p>
                                    </div>
                                  )}
                                  {patient.medicines && (
                                    <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Medicamentos Prescritos</p>
                                      <p className="text-slate-200 whitespace-pre-wrap">{patient.medicines}</p>
                                    </div>
                                  )}
                                  {patient.followUp && (
                                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Seguimiento / Indicaciones</p>
                                      <p className="text-slate-200 whitespace-pre-wrap">{patient.followUp}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Nurse Logs Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5" /> Bitácora de Enfermería ({nurseLogsLoading ? '...' : nurseLogs.length} registros)
                                </h5>
                                <button
                                  onClick={() => fetchNurseLogs(patient.id)}
                                  className="text-[9px] text-slate-400 hover:text-white border border-white/5 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800 px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer"
                                >
                                  ↻ Recargar
                                </button>
                              </div>

                              {nurseLogsLoading ? (
                                <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                                  <Activity className="w-4 h-4 animate-pulse text-indigo-400" /> Cargando bitácora...
                                </div>
                              ) : nurseLogs.length > 0 ? (
                                <div className="relative border-l border-white/10 ml-3 pl-6 space-y-5 py-1">
                                  {nurseLogs.map((log) => {
                                    const lt = new Date(log.loggedAt);
                                    return (
                                      <div key={log.id} className="relative">
                                        <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-950 shadow-[0_0_6px_rgba(99,102,241,0.8)]"></div>
                                        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
                                          <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-indigo-400 font-bold flex items-center gap-1">
                                              <Clock className="w-3 h-3" /> {lt.toLocaleDateString()} — {lt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-slate-400">Enf. <strong className="text-slate-200">{log.nurseName}</strong></span>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                            <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Tratamientos</p>
                                              <p className="text-slate-200 whitespace-pre-wrap">{log.treatments}</p>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Medicación</p>
                                              <p className="text-slate-200 whitespace-pre-wrap">{log.medicines}</p>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Observaciones</p>
                                              <p className="text-slate-200 whitespace-pre-wrap">{log.indications}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="py-6 text-center text-slate-500 flex flex-col items-center gap-2">
                                  <Activity className="w-6 h-6 text-slate-700" />
                                  <p className="text-xs">Sin registros de enfermería para este paciente.</p>
                                </div>
                              )}
                            </div>

                            {/* Visitors Section */}
                            <div className="mt-6 pt-6 border-t border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" /> Visitantes Registrados ({getVisitorsForVisit(patient).length} visitas)
                                </h5>
                              </div>
                              {getVisitorsForVisit(patient).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  {getVisitorsForVisit(patient).map((v) => {
                                    const vt = new Date(v.checkInTime);
                                    const vOut = v.checkOutTime ? new Date(v.checkOutTime) : null;
                                    return (
                                      <div key={v.id} className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-2 text-left bg-slate-950/20">
                                        <div className="flex items-center justify-between font-semibold text-slate-200">
                                          <span>👥 {v.patientName}</span>
                                          <span className="text-[9px] font-normal text-slate-400 italic">"{v.reason}"</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
                                          <p>Entrada: {vt.toLocaleDateString()} — {vt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                          <p>Salida: {vOut 
                                            ? `${vOut.toLocaleDateString()} — ${vOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                            : <span className="text-emerald-400 font-bold">Dentro</span>}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="py-6 text-center text-slate-500 flex flex-col items-center gap-2">
                                  <Users className="w-6 h-6 text-slate-700" />
                                  <p className="text-xs">Sin visitas registradas para este paciente.</p>
                                </div>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-panel rounded-2xl p-16 text-center flex flex-col items-center gap-3">
                  <Users className="w-10 h-10 text-slate-700" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Sin pacientes registrados</h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">Los pacientes que hayas atendido o tengas agendados aparecerán aquí.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MEDICAL TREATED HISTORY */}
          {docTab === 'myhistory' && (

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-5 border-b border-white/5 bg-slate-900/20">
                <h4 className="font-bold text-white text-sm">Consultas Realizadas e Historial Clínico</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Listado histórico de consultas atendidas en este consultorio</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950/40">
                      <th className="p-4 pl-6">Paciente</th>
                      <th className="p-4">Contacto / Email</th>
                      <th className="p-4">Diagnóstico / Padecimientos</th>
                      <th className="p-4">Tratamiento Prescrito</th>
                      <th className="p-4">Fecha y Hora</th>
                      <th className="p-4 pr-6 text-center">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {myTreatedPatients.length > 0 ? (
                      myTreatedPatients.map((hist) => {
                        const entry = new Date(hist.checkInTime);
                        const exit = hist.checkOutTime ? new Date(hist.checkOutTime) : null;
                        const duration = exit 
                          ? `${Math.floor((exit - entry) / 1000 / 60)} min`
                          : '-';

                        return (
                          <tr key={hist.id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="p-4 pl-6 font-bold text-white">{hist.patientName}</td>
                            <td className="p-4 text-slate-400">{hist.email || 'No registrado'}</td>
                            <td className="p-4 italic max-w-[200px] truncate" title={hist.ailments}>
                              "{hist.ailments || 'No registrado'}"
                            </td>
                            <td className="p-4 italic max-w-[200px] truncate" title={hist.medicines}>
                              "{hist.medicines || 'Sin medicamentos'}"
                            </td>
                            <td className="p-4 text-slate-400 font-mono text-[11px]">
                              {entry.toLocaleDateString()} {entry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4 pr-6 text-center font-bold text-emerald-400 font-mono">{duration}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-slate-500">
                          <p className="font-semibold text-slate-400 text-sm">No has realizado ninguna consulta hoy</p>
                          <p className="text-[10px] text-slate-650 mt-0.5">Tus consultas finalizadas se archivarán aquí para referencias clínicas.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MEDICAL PROFILE & WORKING HOURS */}
          {docTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              
              {/* Left Column: Edit Form */}
              <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-lg text-white border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  Actualizar Mi Perfil y Horarios
                </h3>

                <form onSubmit={handleUpdateDoctorProfile} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Nombre Completo del Médico <span className="text-emerald-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Dr. Alejandro López"
                      value={editDocName}
                      onChange={(e) => setEditDocName(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                    />
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Especialidad Médica <span className="text-emerald-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Pediatría General, Cardiología..."
                      value={editDocSpecialty}
                      onChange={(e) => setEditDocSpecialty(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                    />
                  </div>

                  {/* Working Hours */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Horarios de Atención / Guardia</label>
                    <input
                      type="text"
                      placeholder="Ej. Lunes a Viernes 08:00 - 16:00, Sábados 09:00 - 13:00"
                      value={editDocWorkingHours}
                      onChange={(e) => setEditDocWorkingHours(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Este horario será visible en recepción y para el llenado automático al programar tus citas.
                    </span>
                  </div>

                  {/* Submit Profile */}
                  <button
                    type="submit"
                    disabled={docUpdating}
                    className="w-full h-11 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {docUpdating ? 'Guardando cambios...' : 'Guardar Perfil e Indicaciones'}
                    <CheckCircle className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>

              {/* Right Column: Visual Info Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5 text-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Stethoscope className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm Outfit uppercase tracking-wider">Médico Adscrito</h4>
                      <p className="text-[10px] text-slate-400">Datos registrados en el sistema del hospital</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consultorio:</span>
                      <span className="text-white font-bold">{docClinicName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Especialidad:</span>
                      <span className="text-emerald-400 font-semibold">{currentDoc?.specialty || 'General'}</span>
                    </div>
                    {currentDoc?.workingHours && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Horario de Guardia:</span>
                        <span className="text-indigo-400 font-semibold">{currentDoc.workingHours}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/5 pt-2 text-[10px]">
                      <span className="text-slate-400">Usuario Asignado:</span>
                      <span className="text-slate-300 font-mono font-bold">{session.name} ({session.role})</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <h5 className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Coordinación de Visitas
                    </h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Mantener tu nombre, especialidad y horario de atención actualizados ayuda a los recepcionistas a registrar la entrada de tus pacientes con mayor precisión, y a poblar tus datos en la confirmación de pases QR por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 mt-12">
          <p>&copy; {new Date().getFullYear()} Aozora Care-Flow. Portal Médico de Turno ({session.name}).</p>
        </footer>
      </div>
    );
  };

  // RENDER DEDICATED PHARMACIST PORTAL UI
  const renderPharmacistPortal = () => {
    const pendingRequests = pharmacyRequests.filter(r => r.status === 'pendiente');
    const deliveredRequests = pharmacyRequests.filter(r => r.status === 'entregado');

    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased">
        {/* Toast Alert */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 font-medium' 
              : 'bg-rose-950/90 border-rose-500/30 text-rose-300 font-medium'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-xs font-semibold">{notification.message}</p>
          </div>
        )}

        {/* Header */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <Pill className="w-5.5 h-5.5 text-sky-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wide text-white leading-tight uppercase Outfit">Aozora Care-Flow</h2>
              <div className="text-[10px] text-sky-400 mt-0.5 flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                Consola de Despacho Farmacéutico
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{session.name}</p>
              <p className="text-[9px] text-sky-400 font-bold uppercase tracking-wider mt-0.5">Fármaco de Turno</p>
            </div>
            
            {/* Presence Toggle Button */}
            <button
              onClick={() => handleTogglePresence()}
              className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                session.isPresent
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
              }`}
              title={session.isPresent ? 'Presiona para registrar tu salida del hospital' : 'Presiona para registrar tu entrada al hospital'}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${session.isPresent ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
              <span className="hidden sm:inline">{session.isPresent ? 'En Hospital (Dentro)' : 'Fuera de Turno'}</span>
              <span className="sm:hidden">{session.isPresent ? 'Dentro' : 'Fuera'}</span>
            </button>

            <button 
              onClick={handleLogout}
              className="h-9 px-3 rounded-lg border border-rose-500/15 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/30 via-slate-900/40 to-slate-950/20 border border-sky-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight Outfit">
                ¡Hola, {session.name}! 👋
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Esta es tu consola de despacho de medicamentos. Todas las solicitudes de medicamentos generadas por enfermería durante los chequeos clínicos aparecen aquí en tiempo real para su entrega y registro digital seguro.
              </p>
            </div>
            
            <button 
              onClick={fetchPharmacyRequests}
              disabled={pharmacyLoading}
              className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/25 border border-sky-400/20 text-sky-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pharmacyLoading ? 'animate-spin' : ''}`} />
              {pharmacyLoading ? 'Sincronizando...' : 'Refrescar Cola'}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/35 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pendientes de Entrega</p>
                <p className="text-2xl font-black text-amber-400 mt-1 tracking-tight">{pendingRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/35 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Despachadas con Éxito</p>
                <p className="text-2xl font-black text-emerald-400 mt-1 tracking-tight">{deliveredRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/35 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Histórico</p>
                <p className="text-2xl font-black text-white mt-1 tracking-tight">{pharmacyRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Pill className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Pending Cola */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-sm font-extrabold text-white tracking-wider uppercase Outfit flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Cola de Despacho Inmediato ({pendingRequests.length})
                </h3>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/20 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400/80 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">¡Gran trabajo! Sin solicitudes pendientes</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Todas las recetas y solicitudes de enfermería han sido debidamente suministradas y registradas en el sistema.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {pendingRequests.map((req) => {
                    const reqDate = new Date(req.createdAt);
                    const formattedTime = reqDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const minutesElapsed = Math.floor((new Date() - reqDate) / 60000);
                    
                    return (
                      <div 
                        key={req.id} 
                        className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900/50 border border-white/5 hover:border-sky-500/30 transition-all duration-300 shadow-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(14,165,233,0.05)]"
                      >
                        {/* Status stripe accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 group-hover:bg-sky-500 transition-colors duration-300"></div>
                        
                        {/* Upper Row: Room, Name, Elapsed badge */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-sky-950 border border-sky-400/20 text-sky-300 flex items-center gap-1 w-max">
                              <Bed className="w-3 h-3" /> {req.visit?.destination || 'Sin Habitación'}
                            </span>
                            <h4 className="font-extrabold text-sm text-white mt-1.5 tracking-tight group-hover:text-sky-300 transition-colors duration-300">
                              {req.visit?.patientName || 'Paciente General'}
                            </h4>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-500 block">
                              Solicitud: {formattedTime}
                            </span>
                            <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border mt-1 ${
                              minutesElapsed > 20 
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              Hace {minutesElapsed} min
                            </span>
                          </div>
                        </div>

                        {/* Mid section: Doctor, Diagnosis and Nurse details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-white/5 text-xs text-slate-400 mb-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Causa de Estancia</p>
                            <p className="text-[11px] text-slate-300 font-semibold truncate">{req.visit?.reason || 'Ninguna'}</p>
                            <p className="text-[9px] text-slate-500 mt-1 leading-none">Dr: {req.visit?.doctor?.name || 'No Asignado'}</p>
                          </div>
                          <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/5 pt-2.5 md:pt-0 md:pl-3.5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Solicitado Por</p>
                            <p className="text-[11px] text-slate-300 font-semibold">Enf: {req.nurseName}</p>
                            <p className="text-[9px] text-slate-500 mt-1 leading-none">ID Visita: {req.visitId.slice(0,8)}...</p>
                          </div>
                        </div>

                        {/* Prescribed Medicines Box (High Visibility) */}
                        <div className="space-y-2 mb-4">
                          <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest leading-none flex items-center gap-1">
                            <span>💊</span> Medicamentos e Indicación de Dosis
                          </p>
                          <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/15 text-xs text-sky-100 font-bold leading-relaxed whitespace-pre-line shadow-inner">
                            {req.medicines}
                          </div>
                        </div>

                        {/* Deliver Action Button */}
                        <div className="flex justify-end pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleDispenseRequest(req.id)}
                            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(14,165,233,0.3)] hover:shadow-[0_4px_25px_rgba(14,165,233,0.5)] active:scale-97 transition-all duration-300"
                          >
                            <Check className="w-4 h-4 stroke-[3px]" />
                            Despachar y Entregar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Delivered Audit Log */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-sm font-extrabold text-slate-300 tracking-wider uppercase Outfit flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                  Bitácora de Entregas Recientes ({deliveredRequests.length})
                </h3>
              </div>

              {deliveredRequests.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950/15 border border-dashed border-white/5 text-slate-500 flex flex-col items-center justify-center gap-2">
                  <p className="text-xs">Sin despachos registrados hoy.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                  {deliveredRequests.map((req) => {
                    const deliveredDate = req.dispensedAt ? new Date(req.dispensedAt) : new Date();
                    const formattedDelivered = deliveredDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + deliveredDate.toLocaleDateString();
                    
                    return (
                      <div 
                        key={req.id} 
                        className="p-4 rounded-xl bg-slate-950/40 border border-emerald-500/10 space-y-3 hover:border-emerald-500/20 transition-all duration-300 shadow-md relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                        
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-xs text-white block">
                              🚪 {req.visit?.destination || 'N/A'} — {req.visit?.patientName || 'Paciente'}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">
                              Entregado a Enfermería
                            </span>
                          </div>
                          
                          <span className="text-[9px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            ✓ Entregado
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5 text-[11px] text-slate-400 font-mono italic font-bold">
                          {req.medicines}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[9px] font-mono text-slate-500">
                          <div className="flex items-center justify-between">
                            <span>Despachó:</span>
                            <span className="text-emerald-400 font-bold">{req.dispensedBy}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Hora de Entrega:</span>
                            <span>{formattedDelivered}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Origen Solicitud:</span>
                            <span>{req.nurseName}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 mt-12 bg-slate-950/20">
          <p>&copy; {new Date().getFullYear()} Aozora Care-Flow. Consola Médica & Farmacéutica ({session.role}).</p>
        </footer>
      </div>
    );
  };

  // Fetch session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Fetch lists once session is valid
  useEffect(() => {
    if (session) {
      if (session.role === 'farmaco') {
        fetchPharmacyRequests();
      } else {
        fetchDashboardData();
      }
    }
  }, [session]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setSession(data.user);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Auth verification error:', err);
      router.push('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [visitsRes, rolesRes, usersRes, clinicsRes, doctorsRes, roomsRes] = await Promise.all([
        fetch('/api/visits').then(r => r.json()),
        fetch('/api/roles').then(r => r.json()),
        fetch('/api/users').then(r => r.json()),
        fetch('/api/clinics').then(r => r.json()),
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/rooms').then(r => r.json())
      ]);

      if (visitsRes.success) setVisits(visitsRes.visits);
      if (rolesRes.success) setRoles(rolesRes.roles);
      if (usersRes.success) setUsers(usersRes.users);
      if (clinicsRes.success) setClinics(clinicsRes.clinics);
      if (doctorsRes.success) setDoctors(doctorsRes.doctors);
      if (roomsRes.success) setRooms(roomsRes.rooms);
    } catch (err) {
      console.error('Error fetching dashboard lists:', err);
    }
  };

  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Perform Force Check-out
  const handleForceCheckOut = async (visitId, patientName) => {
    try {
      const res = await fetch('/api/visits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Salida registrada para ${patientName}.`);
        fetchDashboardData();
      } else {
        triggerNotification('error', data.error || 'No se pudo realizar el check-out.');
      }
    } catch (err) {
      triggerNotification('error', 'Error al comunicar con el servidor.');
    }
  };

  // Create Dynamic Role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, description: newRoleDesc })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Rol "${newRoleName}" creado exitosamente.`);
        setNewRoleName('');
        setNewRoleDesc('');
        fetchDashboardData(); // Refresh roles list
      } else {
        triggerNotification('error', data.error || 'Error al crear el rol.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Register Employee
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUser.trim() || !newStaffPass.trim() || !newStaffRoleId) {
      triggerNotification('error', 'Por favor llena todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffName,
          username: newStaffUser,
          password: newStaffPass,
          roleId: newStaffRoleId
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Usuario "${newStaffName}" registrado.`);
        setNewStaffName('');
        setNewStaffUser('');
        setNewStaffPass('');
        setNewStaffRoleId('');
        fetchDashboardData(); // Refresh users list
      } else {
        triggerNotification('error', data.error || 'Error al registrar.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Register Guard
  const handleCreateGuard = async (e) => {
    e.preventDefault();
    const guardRole = roles.find(r => r.name === 'guardia');
    if (!guardRole) {
      triggerNotification('error', 'El rol de guardia no está configurado en el sistema.');
      return;
    }

    if (!newGuardName.trim() || !newGuardUser.trim() || !newGuardPass.trim()) {
      triggerNotification('error', 'Por favor llena todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGuardName,
          username: newGuardUser,
          password: newGuardPass,
          roleId: guardRole.id
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Guardia "${newGuardName}" registrado exitosamente.`);
        setNewGuardName('');
        setNewGuardUser('');
        setNewGuardPass('');
        fetchDashboardData(); // Refresh users list
      } else {
        triggerNotification('error', data.error || 'Error al registrar al guardia.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Register Clinic
  const handleCreateClinic = async (e) => {
    e.preventDefault();
    if (!newClinicName.trim() || !newClinicSpecialty.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClinicName,
          specialty: newClinicSpecialty,
          floor: newClinicFloor || null
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Consultorio "${newClinicName}" registrado.`);
        setNewClinicName('');
        setNewClinicSpecialty('');
        setNewClinicFloor('');
        fetchDashboardData(); // Refresh clinics list
      } else {
        triggerNotification('error', data.error || 'Error al registrar.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Register Hospital Room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomNumber.trim() || !newRoomFloor.trim() || !newRoomType) return;

    setLoading(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: newRoomNumber,
          floor: newRoomFloor,
          type: newRoomType
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Habitación "${newRoomNumber}" registrada exitosamente.`);
        setNewRoomNumber('');
        setNewRoomFloor('');
        setNewRoomType('Individual');
        fetchDashboardData(); // Refresh rooms list
      } else {
        triggerNotification('error', data.error || 'Error al registrar la habitación.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Edit & Delete Room Handlers
  const handleOpenEditRoomModal = (room) => {
    setEditingRoom(room);
    setEditRoomNumber(room.number);
    setEditRoomFloor(room.floor);
    setEditRoomType(room.type);
    setEditRoomStatus(room.status);
    setShowEditRoomModal(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editingRoom || !editRoomNumber.trim() || !editRoomFloor.trim() || !editRoomType || !editRoomStatus) return;

    setLoading(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRoom.id,
          number: editRoomNumber,
          floor: editRoomFloor,
          type: editRoomType,
          status: editRoomStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Habitación "${editRoomNumber}" actualizada exitosamente.`);
        setShowEditRoomModal(false);
        setEditingRoom(null);
        fetchDashboardData(); // Refresh rooms list
      } else {
        triggerNotification('error', data.error || 'Error al actualizar la habitación.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id, number) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la habitación "${number}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/rooms?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Habitación "${number}" eliminada exitosamente.`);
        fetchDashboardData(); // Refresh rooms list
      } else {
        triggerNotification('error', data.error || 'Error al eliminar la habitación.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Edit & Delete Doctor Handlers
  const handleOpenEditDocModal = (doc) => {
    setEditingDoc(doc);
    setEditDocNameAdmin(doc.name);
    setEditDocSpecialtyAdmin(doc.specialty);
    setEditDocWorkingHoursAdmin(doc.workingHours || '');
    setEditDocEmailAdmin(doc.email || '');
    setEditDocPhoneAdmin(doc.phone || '');
    setEditDocWhatsappAdmin(doc.whatsapp || '');
    setEditDocClinicIdAdmin(doc.clinicId || '');
    setShowEditDocModal(true);
  };

  const handleUpdateDoctorAdmin = async (e) => {
    e.preventDefault();
    if (!editingDoc || !editDocNameAdmin.trim() || !editDocSpecialtyAdmin.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDoc.id,
          name: editDocNameAdmin,
          specialty: editDocSpecialtyAdmin,
          workingHours: editDocWorkingHoursAdmin || null,
          clinicId: editDocClinicIdAdmin || null,
          email: editDocEmailAdmin || null,
          phone: editDocPhoneAdmin || null,
          whatsapp: editDocWhatsappAdmin || null
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Médico "${editDocNameAdmin}" actualizado exitosamente.`);
        setShowEditDocModal(false);
        setEditingDoc(null);
        fetchDashboardData(); // Refresh doctors list
      } else {
        triggerNotification('error', data.error || 'Error al actualizar al médico.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al médico "${name}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/doctors?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Médico "${name}" eliminado exitosamente.`);
        fetchDashboardData(); // Refresh doctors list
      } else {
        triggerNotification('error', data.error || 'Error al eliminar al médico.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Staff Presence (self or override)
  const handleTogglePresence = async (userId = null) => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId ? { userId } : {})
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', data.message);
        
        // If updating self, update local session
        if (!userId && session) {
          setSession(prev => ({
            ...prev,
            isPresent: data.isPresent
          }));
        }
        
        // Refresh dashboard lists
        fetchDashboardData();
      } else {
        triggerNotification('error', data.error || 'Error al registrar presencia.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Edit & Delete Staff Handlers
  const handleOpenEditStaffModal = (staff) => {
    setEditingStaff(staff);
    setEditStaffUsername(staff.username);
    setEditStaffName(staff.name);
    setEditStaffRoleId(staff.roleId);
    setEditStaffPassword('');
    setShowEditStaffModal(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff || !editStaffUsername.trim() || !editStaffName.trim() || !editStaffRoleId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStaff.id,
          username: editStaffUsername,
          name: editStaffName,
          roleId: editStaffRoleId,
          password: editStaffPassword || null
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Usuario "${editStaffName}" actualizado exitosamente.`);
        setShowEditStaffModal(false);
        setEditingStaff(null);
        fetchDashboardData(); // Refresh staff list
      } else {
        triggerNotification('error', data.error || 'Error al actualizar al usuario.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${name}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Usuario "${name}" eliminado exitosamente.`);
        fetchDashboardData(); // Refresh staff list
      } else {
        triggerNotification('error', data.error || 'Error al eliminar al usuario.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Register Doctor & Assign Clinic
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctorName.trim() || !newDoctorSpecialty.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDoctorName,
          specialty: newDoctorSpecialty,
          clinicId: newDoctorClinicId || null,
          email: newDoctorEmail || null,
          phone: newDoctorPhone || null,
          whatsapp: newDoctorWhatsapp || null
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', `Médico "${newDoctorName}" registrado y asignado.`);
        setNewDoctorName('');
        setNewDoctorSpecialty('');
        setNewDoctorClinicId('');
        setNewDoctorEmail('');
        setNewDoctorPhone('');
        setNewDoctorWhatsapp('');
        fetchDashboardData(); // Refresh doctors list
      } else {
        triggerNotification('error', data.error || 'Error al registrar.');
      }
    } catch (err) {
      triggerNotification('error', 'Error de red.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for active monitoring
  const activeVisits = visits.filter(v => v.status === 'in house');
  const finishedVisits = visits.filter(v => v.status === 'fuera');

  const filteredFinishedVisits = finishedVisits.filter(v => {
    // 1. Patient Type Filter
    const matchesType = historyTypeFilter === 'all' || v.type === historyTypeFilter;
    if (!matchesType) return false;

    // 2. Checkout Date Filter
    if (!historyDateFilter) return true;
    if (!v.checkOutTime) return false;
    const outDate = new Date(v.checkOutTime);
    const outYear = outDate.getFullYear();
    const outMonth = String(outDate.getMonth() + 1).padStart(2, '0');
    const outDay = String(outDate.getDate()).padStart(2, '0');
    const outDateStr = `${outYear}-${outMonth}-${outDay}`;
    return outDateStr === historyDateFilter;
  });

  const filteredMonitoringVisits = activeVisits.filter(v => {
    const matchesTab = monitoringFilter === 'all' || v.type === monitoringFilter;
    const matchesSearch = v.patientName.toLowerCase().includes(monitoringSearch.toLowerCase()) ||
                          v.destination.toLowerCase().includes(monitoringSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Check role authorization for admin features
  const isAdminOrManager = session && ['administrador', 'manager'].includes(session.role);

  if (session && session.role === 'medico') {
    return renderDoctorPortal();
  }

  if (session && session.role === 'enfermero') {
    return renderNursePortal();
  }

  if (session && session.role === 'farmaco') {
    return renderPharmacistPortal();
  }

  if (authLoading || !session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#090d16]">
        <Activity className="w-10 h-10 text-emerald-400 pulse-glow mb-4" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Verificando Credenciales de Personal...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* Toast Alert */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
        }`}>
          <ShieldCheck className="w-5 h-5" />
          <p className="text-xs font-semibold">{notification.message}</p>
        </div>
      )}

      {/* Admin Layout Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Hospital <span className="text-indigo-400 font-extrabold font-display">Control-Panel</span>
              </h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Gestión de Seguridad & Operación</p>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-xs">
              <span className="text-white font-bold">{session.name}</span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mt-1">
                {session.role}
              </span>
            </div>
            
            {/* Presence Toggle Button */}
            <button
              onClick={() => handleTogglePresence()}
              className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                session.isPresent
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
              }`}
              title={session.isPresent ? 'Presiona para registrar tu salida del hospital' : 'Presiona para registrar tu entrada al hospital'}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${session.isPresent ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></span>
              <span className="hidden sm:inline">{session.isPresent ? 'En Hospital (Dentro)' : 'Fuera de Turno'}</span>
              <span className="sm:hidden">{session.isPresent ? 'Dentro' : 'Fuera'}</span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-px mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'monitoring'
                ? 'border-indigo-400 text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4.5 h-4.5" />
            Monitoreo Activo (In House)
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              {activeVisits.length}
            </span>
          </button>
          
          {isAdminOrManager && (
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'border-indigo-400 text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-4.5 h-4.5" />
                Panel Administrativo
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-indigo-400 text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                Historial de Salidas
                <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {finishedVisits.length}
                </span>
              </button>
            </>
          )}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'monitoring' ? (
          
          /* ========================================================
             MONITORING VIEW
             ======================================================== */
          <div className="space-y-6">
            
            {/* Stat Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Widget 1 */}
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-emerald-400 pulse-glow" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">En el Hospital (In House)</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{activeVisits.length}</p>
                </div>
              </div>

              {/* Widget 2 */}
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Casos en Urgencias</p>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {activeVisits.filter(v => v.type === 'urgencias').length}
                  </p>
                </div>
              </div>

              {/* Widget 3 */}
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Ingresos Registrados Hoy</p>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {visits.filter(v => {
                      const today = new Date().toDateString();
                      return new Date(v.checkInTime).toDateString() === today;
                    }).length}
                  </p>
                </div>
              </div>

            </div>

            {/* Filter and Search Bar */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto shrink-0">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'visitante', label: 'Visitantes' },
                  { id: 'paciente', label: 'Pacientes' },
                  { id: 'urgencias', label: 'Urgencias' },
                  { id: 'hospitalizaciones', label: 'Hosp.' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMonitoringFilter(item.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all duration-300 uppercase tracking-wider shrink-0 cursor-pointer ${
                      monitoringFilter === item.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Buscar por nombre o destino..."
                  value={monitoringSearch}
                  onChange={(e) => setMonitoringSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

            </div>

            {/* Live Monitoring Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
                <div>
                  <h4 className="font-bold text-white text-sm">Pacientes y Visitas en Curso</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Monitoreo en tiempo real de accesos activos</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950/40">
                      <th className="p-4 pl-6">Nombre de la Persona</th>
                      <th className="p-4">Contacto / Email</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Destino</th>
                      <th className="p-4">Acompañante</th>
                      <th className="p-4">Motivo / Caso</th>
                      <th className="p-4">Hora Ingreso</th>
                      <th className="p-4 pr-6 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {filteredMonitoringVisits.length > 0 ? (
                      filteredMonitoringVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 pl-6 font-bold text-white">{visit.patientName}</td>
                          <td className="p-4">
                            {visit.email ? (
                              <button
                                onClick={() => handleViewPatientHistory(visit.email, visit.patientName)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1 text-left cursor-pointer"
                                title="Ver Historial Clínico de Visitas"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                {visit.email}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">No registrado</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              visit.type === 'urgencias' 
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                                : visit.type === 'paciente' 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : visit.type === 'hospitalizaciones'
                                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}>
                              {visit.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-200">{visit.destination}</div>
                            {visit.doctor && (
                              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Stethoscope className="w-3 h-3 text-emerald-400" />
                                {visit.doctor.name}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-slate-400">{visit.visitorCompanion || 'Solo'}</td>
                          <td className="p-4 max-w-[200px] truncate text-slate-400 italic" title={visit.reason}>
                            "{visit.reason}"
                          </td>
                          <td className="p-4 font-mono text-[11px]">
                            {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 pr-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {visit.type === 'urgencias' && (
                                <button
                                  onClick={() => handleOpenHospitalizationModal(visit)}
                                  className="px-2.5 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                                  title="Pasar paciente a Hospitalización"
                                >
                                  Hospitalizar
                                </button>
                              )}
                              {visit.type === 'hospitalizaciones' && (
                                <button
                                  onClick={() => handleOpenNurseLogModal(visit)}
                                  className="px-2.5 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1"
                                  title="Ver Expediente Clínico de Enfermería"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Bitácora
                                </button>
                              )}
                              <button
                                onClick={() => handleForceCheckOut(visit.id, visit.patientName)}
                                className="px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                                title="Registrar Salida de la Persona"
                              >
                                Check-Out
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-12 text-center text-slate-500">
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-8 h-8 text-slate-700" />
                            <div>
                              <p className="font-semibold text-slate-400 text-sm">No hay personas dentro en esta categoría</p>
                              <p className="text-[10px] text-slate-600 mt-0.5">Actualmente no se registran visitas con estos filtros.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : activeTab === 'admin' && isAdminOrManager ? (
          
          /* ========================================================
             ADMINISTRATION PANEL
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Admin Left Tabs */}
            <div className="lg:col-span-3 glass-panel rounded-2xl p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto shrink-0">
              {[
                { id: 'clinics', label: 'Consultorios', icon: Building },
                { id: 'rooms', label: 'Habitaciones', icon: Bed },
                { id: 'doctors', label: 'Médicos', icon: Stethoscope },
                { id: 'staff', label: 'Personal Hospital', icon: Users },
                { id: 'guardias', label: 'Guardias de Seguridad', icon: ShieldAlert },
                { id: 'presence', label: 'Asistencia / Presencia', icon: UserCheck },
                { id: 'roles', label: 'Roles Dinámicos', icon: ShieldCheck }
              ].map(sec => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setAdminSection(sec.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all duration-300 shrink-0 cursor-pointer ${
                      adminSection === sec.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Admin Form & Lists Column */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* SECTION: CLINICS (CONSULTORIOS) */}
              {adminSection === 'clinics' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Registrar Consultorio
                    </h4>
                    <form onSubmit={handleCreateClinic} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre / Identificador</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Consultorio 102"
                          value={newClinicName}
                          onChange={(e) => setNewClinicName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Especialidad</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Cardiología, Pediatría"
                          value={newClinicSpecialty}
                          onChange={(e) => setNewClinicSpecialty(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ubicación / Piso</label>
                        <input
                          type="text"
                          placeholder="Ej. Piso 1, Ala Oriente"
                          value={newClinicFloor}
                          onChange={(e) => setNewClinicFloor(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Building className="w-3.5 h-3.5" />
                        Registrar
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Consultorios Registrados</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {clinics.length > 0 ? (
                        clinics.map(c => (
                          <div key={c.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-white text-sm">{c.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Especialidad: {c.specialty} • {c.floor || 'Sin Piso'}</p>
                            </div>
                            <div className="text-right">
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {c.doctors?.length || 0} Médicos
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 py-8">No hay consultorios registrados.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: ROOMS (HABITACIONES) */}
              {adminSection === 'rooms' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Registrar Habitación
                    </h4>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Número de Habitación</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Habitación 302-A"
                          value={newRoomNumber}
                          onChange={(e) => setNewRoomNumber(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ubicación / Piso</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Piso 3"
                          value={newRoomFloor}
                          onChange={(e) => setNewRoomFloor(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipo de Habitación</label>
                        <select
                          value={newRoomType}
                          onChange={(e) => setNewRoomType(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-slate-200"
                        >
                          <option value="Individual">Individual (Single)</option>
                          <option value="Doble">Doble (Double)</option>
                          <option value="UCI">UCI (ICU)</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Bed className="w-3.5 h-3.5" />
                        Registrar Habitación
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Habitaciones Registradas</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {rooms.length > 0 ? (
                        rooms.map(r => (
                          <div key={r.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-white text-sm">{r.number}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Tipo: {r.type} • {r.floor}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`border text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                r.status === 'disponible'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : r.status === 'ocupado'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {r.status}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditRoomModal(r)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(r.id, r.number)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 py-8">No hay habitaciones registradas.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: DOCTORS (MÉDICOS) */}
              {adminSection === 'doctors' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Registrar y Asignar Médico
                    </h4>
                    <form onSubmit={handleCreateDoctor} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Dr. Mario Silva"
                          value={newDoctorName}
                          onChange={(e) => setNewDoctorName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Especialidad</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Pediatría, Urgenciólogo"
                          value={newDoctorSpecialty}
                          onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Consultorio Asignado</label>
                        <select
                          value={newDoctorClinicId}
                          onChange={(e) => setNewDoctorClinicId(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-slate-200"
                        >
                          <option value="">Sin Consultorio Asignado</option>
                          {clinics.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.specialty})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                          <input
                            type="email"
                            placeholder="mail@host.com"
                            value={newDoctorEmail}
                            onChange={(e) => setNewDoctorEmail(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teléfono</label>
                          <input
                            type="text"
                            placeholder="1234567890"
                            value={newDoctorPhone}
                            onChange={(e) => setNewDoctorPhone(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp</label>
                          <input
                            type="text"
                            placeholder="521..."
                            value={newDoctorWhatsapp}
                            onChange={(e) => setNewDoctorWhatsapp(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        Registrar Médico
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Médicos Registrados</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {doctors.length > 0 ? (
                        doctors.map(d => (
                          <div key={d.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                                <Stethoscope className="w-4 h-4 text-indigo-400" />
                                {d.name}
                              </p>
                              <p className="text-[10px] text-slate-400">Especialidad: <span className="text-slate-200 font-semibold">{d.specialty}</span></p>
                              {(d.email || d.phone || d.whatsapp) && (
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[9px] text-slate-400">
                                  {d.email && (
                                    <span className="flex items-center gap-1">
                                      <span className="text-indigo-455 font-bold">📧</span> {d.email}
                                    </span>
                                  )}
                                  {d.phone && (
                                    <span className="flex items-center gap-1">
                                      <span className="text-indigo-455 font-bold">📞</span> {d.phone}
                                    </span>
                                  )}
                                  {d.whatsapp && (
                                    <span className="flex items-center gap-1">
                                      <span className="text-emerald-455 font-bold">💬</span> {d.whatsapp}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              {d.clinic ? (
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                                  <Building className="w-3 h-3 text-indigo-400" />
                                  {d.clinic.name}
                                </span>
                              ) : (
                                <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Sin Asignar
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditDocModal(d)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                  title="Editar Médico"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDoctor(d.id, d.name)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                                  title="Eliminar Médico"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 py-8">No hay médicos registrados.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: STAFF (PERSONAL DEL HOSPITAL) */}
              {adminSection === 'staff' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      Registrar Personal
                    </h4>
                    <form onSubmit={handleCreateStaff} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Ana Beltrán"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario (Login)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. anabeltran"
                          value={newStaffUser}
                          onChange={(e) => setNewStaffUser(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newStaffPass}
                          onChange={(e) => setNewStaffPass(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rol de Sistema</label>
                        <select
                          required
                          value={newStaffRoleId}
                          onChange={(e) => setNewStaffRoleId(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        >
                          <option value="">Selecciona rol...</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Registrar Personal
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Personal Registrado</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {users.filter(u => u.role.name !== 'medico' && u.role.name !== 'guardia').length > 0 ? (
                        users.filter(u => u.role.name !== 'medico' && u.role.name !== 'guardia').map(u => (
                          <div key={u.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-white text-sm">{u.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Usuario: {u.username}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {u.role.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditStaffModal(u)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                  title="Editar Personal"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStaff(u.id, u.name)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                                  title="Eliminar Personal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 py-8">No hay personal hospitalario registrado.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: GUARDIAS DE SEGURIDAD */}
              {adminSection === 'guardias' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-indigo-400" />
                      Registrar Guardia de Seguridad
                    </h4>
                    <form onSubmit={handleCreateGuard} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Oficial Ramón Pérez"
                          value={newGuardName}
                          onChange={(e) => setNewGuardName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario (Login)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. guardia7"
                          value={newGuardUser}
                          onChange={(e) => setNewGuardUser(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newGuardPass}
                          onChange={(e) => setNewGuardPass(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Registrar Guardia
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Guardias de Seguridad Activos</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {users.filter(u => u.role.name === 'guardia').length > 0 ? (
                        users.filter(u => u.role.name === 'guardia').map(u => (
                          <div key={u.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-slate-405" />
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Usuario: {u.username}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {u.role.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditStaffModal(u)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                  title="Editar Guardia"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStaff(u.id, u.name)}
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                                  title="Eliminar Guardia"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-500 py-8">No hay guardias de seguridad registrados.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: PRESENCIA DE PERSONAL */}
              {adminSection === 'presence' && (
                <div className="space-y-6 text-left">
                  
                  {/* Summary Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Personal en Hospital</p>
                        <p className="text-3xl font-extrabold text-emerald-400 mt-1">{users.filter(u => u.isPresent).length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Personal Fuera de Turno</p>
                        <p className="text-3xl font-extrabold text-slate-300 mt-1">{users.filter(u => !u.isPresent).length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      </div>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3 glass-input px-3 rounded-xl">
                      <Search className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o usuario..."
                        value={presenceSearch}
                        onChange={(e) => setPresenceSearch(e.target.value)}
                        className="w-full h-10 text-xs bg-transparent border-0 text-white outline-none placeholder-slate-500"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol:</span>
                        <select
                          value={presenceRoleFilter}
                          onChange={(e) => setPresenceRoleFilter(e.target.value)}
                          className="h-9 px-2.5 rounded-lg glass-input text-xs text-slate-200 border border-white/5 cursor-pointer bg-slate-950/40"
                        >
                          <option value="all">Todos los Roles</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asistencia:</span>
                        <select
                          value={presenceStatusFilter}
                          onChange={(e) => setPresenceStatusFilter(e.target.value)}
                          className="h-9 px-2.5 rounded-lg glass-input text-xs text-slate-200 border border-white/5 cursor-pointer bg-slate-950/40"
                        >
                          <option value="all">Todos los Estatus</option>
                          <option value="inside">En Hospital (Dentro)</option>
                          <option value="outside">Fuera de Turno (Fuera)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* List of Staff Cards */}
                  <div className="glass-panel rounded-2xl p-6 border border-white/5">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Monitor de Presencia de Personal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                      {users.filter(u => {
                        const matchesSearch = u.name.toLowerCase().includes(presenceSearch.toLowerCase()) ||
                                              u.username.toLowerCase().includes(presenceSearch.toLowerCase());
                        if (!matchesSearch) return false;
                        const matchesRole = presenceRoleFilter === 'all' || u.role.name === presenceRoleFilter;
                        if (!matchesRole) return false;
                        const matchesStatus = presenceStatusFilter === 'all' ||
                                              (presenceStatusFilter === 'inside' && u.isPresent) ||
                                              (presenceStatusFilter === 'outside' && !u.isPresent);
                        return matchesStatus;
                      }).length > 0 ? (
                        users.filter(u => {
                          const matchesSearch = u.name.toLowerCase().includes(presenceSearch.toLowerCase()) ||
                                                u.username.toLowerCase().includes(presenceSearch.toLowerCase());
                          if (!matchesSearch) return false;
                          const matchesRole = presenceRoleFilter === 'all' || u.role.name === presenceRoleFilter;
                          if (!matchesRole) return false;
                          const matchesStatus = presenceStatusFilter === 'all' ||
                                                (presenceStatusFilter === 'inside' && u.isPresent) ||
                                                (presenceStatusFilter === 'outside' && !u.isPresent);
                          return matchesStatus;
                        }).map(u => (
                          <div key={u.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between gap-4 text-xs text-left">
                            <div className="space-y-1">
                              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-400">Usuario: <span className="text-slate-200 font-mono">{u.username}</span></p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {u.role.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className={`border text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${
                                u.isPresent
                                  ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                                  : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.isPresent ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                                {u.isPresent ? 'En Hospital' : 'Fuera'}
                              </span>
                              <button
                                onClick={() => handleTogglePresence(u.id)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                  u.isPresent
                                    ? 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/40'
                                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40'
                                }`}
                                title={u.isPresent ? 'Registrar salida del empleado' : 'Registrar entrada del empleado'}
                              >
                                {u.isPresent ? 'Marcar Salida' : 'Marcar Entrada'}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-2 text-center text-xs text-slate-500 py-12 w-full">
                          <p className="font-semibold text-slate-400">No se encontraron empleados</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">Ningún registro coincide con los filtros aplicados.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: DYNAMIC ROLES */}
              {adminSection === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="md:col-span-5 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Agregar Nuevo Rol
                    </h4>
                    
                    <div className="mb-4 p-3 bg-indigo-950/30 border border-indigo-500/15 rounded-xl text-[10px] text-indigo-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Agregar roles dinámicos aquí impactará de inmediato los permisos y selectores del sistema.</span>
                    </div>

                    <form onSubmit={handleCreateRole} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre del Rol</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. farmaceutico, residente"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descripción</label>
                        <input
                          type="text"
                          placeholder="Ej. Acceso a módulo de farmacia"
                          value={newRoleDesc}
                          onChange={(e) => setNewRoleDesc(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Crear Nuevo Rol
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="md:col-span-7 glass-panel rounded-2xl p-6">
                    <h4 className="font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">Roles de Sistema Activos</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {roles.map(r => (
                        <div key={r.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col gap-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white uppercase tracking-wider text-xs">{r.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {r.id.slice(0,8)}...</span>
                          </div>
                          {r.description && <p className="text-slate-400 italic text-[11px]">"{r.description}"</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        ) : activeTab === 'history' && isAdminOrManager ? (
          
          /* ========================================================
             COMPLETED VISITS HISTORY
             ======================================================== */
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="p-5 border-b border-white/5 bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">Historial Completo de Salidas</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Control de registros cerrados con tiempos de estancia</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Patient Type Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo:</span>
                  <select
                    value={historyTypeFilter}
                    onChange={(e) => setHistoryTypeFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg glass-input text-[11px] text-slate-200 border border-white/5 cursor-pointer bg-slate-950/40"
                  >
                    <option value="all">Todos</option>
                    <option value="visitante">Visitantes</option>
                    <option value="paciente">Pacientes</option>
                    <option value="urgencias">Urgencias</option>
                    <option value="hospitalizaciones">Hospitalizados</option>
                  </select>
                </div>
                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Día:</span>
                  <input
                    type="date"
                    value={historyDateFilter}
                    onChange={(e) => setHistoryDateFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg glass-input text-[11px] text-slate-200 border border-white/5 cursor-pointer bg-slate-950/40"
                  />
                  {historyDateFilter && (
                    <button
                      onClick={() => setHistoryDateFilter('')}
                      className="h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                      title="Limpiar fecha"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950/40">
                    <th className="p-4 pl-6">Nombre de la Persona</th>
                    <th className="p-4">Contacto / Email</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Destino</th>
                    <th className="p-4">Hora Entrada</th>
                    <th className="p-4">Hora Salida</th>
                    <th className="p-4 pr-6 text-center">Duración Estancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {filteredFinishedVisits.length > 0 ? (
                    filteredFinishedVisits.map((visit) => {
                      const entryTime = new Date(visit.checkInTime);
                      const exitTime = new Date(visit.checkOutTime);
                      const diffMs = Math.abs(exitTime - entryTime);
                      const diffMins = Math.floor(diffMs / 1000 / 60);
                      const durationStr = diffMins < 60 
                        ? `${diffMins} min` 
                        : `${Math.floor(diffMins/60)}h ${diffMins%60}min`;

                      return (
                        <tr key={visit.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 pl-6 font-semibold text-slate-200">{visit.patientName}</td>
                          <td className="p-4">
                            {visit.email ? (
                              <button
                                onClick={() => handleViewPatientHistory(visit.email, visit.patientName)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1 text-left cursor-pointer"
                                title="Ver Historial Clínico de Visitas"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                {visit.email}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">No registrado</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
                              {visit.type}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300">{visit.destination}</td>
                          <td className="p-4 font-mono text-[11px] text-slate-400">
                            {entryTime.toLocaleDateString()} {entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-400">
                            {exitTime.toLocaleDateString()} {exitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 pr-6 text-center text-emerald-400 font-bold font-mono">
                            {durationStr}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-500">
                        <p className="font-semibold text-slate-400 text-sm">No hay registros de salida</p>
                        <p className="text-[10px] text-slate-650 mt-0.5">
                          {historyDateFilter || historyTypeFilter !== 'all'
                            ? 'Ninguna salida coincide con los filtros aplicados actualmente.'
                            : 'Aún no se registran salidas en la base de datos.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

      </main>

      {/* Hospitalization Transfer Modal */}
      {showHospitalizeModal && selectedVisitForHosp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 relative border border-indigo-500/20 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Activity className="w-5.5 h-5.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Trasladar a Hospitalización</h3>
                  <p className="text-xs text-slate-400">Promover paciente de urgencia a hospitalización</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHospitalizeModal(false)}
                className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            {/* Patient Info Card */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Urgencias
                </span>
                <span className="text-[10px] text-slate-400">
                  Ingreso: {new Date(selectedVisitForHosp.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{selectedVisitForHosp.patientName}</h4>
              {selectedVisitForHosp.email && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500">Email:</span> {selectedVisitForHosp.email}
                </p>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500">Motivo inicial:</span> "{selectedVisitForHosp.reason}"
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmHospitalization} className="space-y-4">
              
              {/* Destination (Room Number) with Autocomplete */}
              <div className="relative" id="hosp-room-suggestions-container">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Piso y Habitación asignada <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Habitación 302-A"
                    value={hospRoom}
                    onChange={(e) => {
                      setHospRoom(e.target.value);
                      setShowHospRoomSuggestions(true);
                    }}
                    onFocus={() => setShowHospRoomSuggestions(true)}
                    className="w-full h-11 px-4 rounded-lg glass-input text-sm text-white"
                  />
                  {/* Autocomplete rooms dropdown */}
                  {showHospRoomSuggestions && hospRoom.trim() !== '' && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800/40">
                      {getHospRoomSuggestions(hospRoom).length > 0 ? (
                        getHospRoomSuggestions(hospRoom).map((room, index) => (
                          <button
                            type="button"
                            key={index}
                            onMouseDown={() => {
                              setHospRoom(room.number);
                              setShowHospRoomSuggestions(false);
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

              {/* Assign Doctor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Médico a Cargo
                </label>
                <select
                  value={hospDoctorId}
                  onChange={(e) => setHospDoctorId(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg glass-input text-sm text-slate-200"
                >
                  <option value="">Seleccionar médico...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospitalization Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">
                  Estado de la Hospitalización <span className="text-indigo-400">*</span>
                </label>
                <select
                  value={hospStatus}
                  onChange={(e) => setHospStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg glass-input text-sm text-slate-200"
                >
                  <option value="Estable">Estable (Stable)</option>
                  <option value="En Observación">En Observación (Under observation)</option>
                  <option value="Delicado">Delicado (Delicate)</option>
                  <option value="Grave">Grave (Serious)</option>
                  <option value="Crítico">Crítico (Critical)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowHospitalizeModal(false)}
                  className="flex-1 h-11 rounded-lg border border-white/5 bg-slate-900/40 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={hospSubmitting}
                  className="flex-1 h-11 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
                >
                  {hospSubmitting ? 'Procesando...' : 'Confirmar Traslado'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative border border-indigo-500/20 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <FileText className="w-5.5 h-5.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Historial de Visitas del Paciente</h3>
                  <p className="text-xs text-slate-400">
                    Historial de visitas para <span className="text-indigo-400 font-bold">{historyPatientName}</span> ({historyEmail})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            {/* Content */}
            {historyLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Activity className="w-8 h-8 text-indigo-400 pulse-glow" />
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Cargando Historial...</p>
              </div>
            ) : patientHistory.length > 0 ? (
              <div className="space-y-6">
                
                {/* Statistics Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Visitas</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{patientHistory.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Activo Dentro</p>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {patientHistory.filter(h => h.status === 'in house').length > 0 ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Urgencias</p>
                    <p className="text-2xl font-extrabold text-rose-400 mt-1">
                      {patientHistory.filter(h => h.type === 'urgencias').length}
                    </p>
                  </div>
                </div>

                {/* History Log Timeline/Table */}
                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/40 border-b border-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <th className="p-3 pl-4">Fecha</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Destino</th>
                        <th className="p-3">Médico</th>
                        <th className="p-3">Motivo / Caso</th>
                        <th className="p-3 text-center">Estatus</th>
                        <th className="p-3 pr-4 text-right">Estancia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {patientHistory.map((h) => {
                        const entry = new Date(h.checkInTime);
                        const exit = h.checkOutTime ? new Date(h.checkOutTime) : null;
                        const duration = exit 
                          ? `${Math.floor((exit - entry) / 1000 / 60)} min`
                          : '-';

                        const visitors = getVisitorsForVisit(h);

                        return (
                          <span key={h.id} className="table-row-group">
                            <tr className="hover:bg-slate-900/20 transition-colors">
                              <td className="p-3 pl-4 font-mono text-[11px]">
                                {entry.toLocaleDateString()} {entry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  h.type === 'urgencias' 
                                    ? 'bg-rose-500/10 border border-rose-500/10 text-rose-400' 
                                    : h.type === 'paciente' 
                                    ? 'bg-emerald-500/10 border border-emerald-500/10 text-emerald-400'
                                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                                }`}>
                                  {h.type}
                                </span>
                              </td>
                              <td className="p-3 font-medium text-slate-200">{h.destination}</td>
                              <td className="p-3 text-slate-400">{h.doctor?.name || 'N/A'}</td>
                              <td className="p-3 text-slate-400 italic max-w-[180px] truncate" title={h.reason}>
                                "{h.reason}"
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                  h.status === 'in house' ? 'status-badge-in-house' : 'status-badge-out'
                                }`}>
                                  {h.status === 'in house' ? 'dentro' : 'salida'}
                                </span>
                              </td>
                              <td className="p-3 pr-4 text-right font-mono font-bold text-indigo-400">
                                {duration}
                              </td>
                            </tr>
                            
                            {/* Nested visitors list inside history modal if visitors exist */}
                            {visitors.length > 0 && (
                              <tr className="bg-slate-950/20">
                                <td colSpan={7} className="p-3 pl-8 pr-4">
                                  <div className="bg-slate-950/40 rounded-lg p-3 border border-indigo-500/10 space-y-2 text-left">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5" /> Visitantes para esta Estancia ({visitors.length})
                                    </p>
                                    <div className="space-y-1.5 divide-y divide-white/5">
                                      {visitors.map((v) => {
                                        const vEntry = new Date(v.checkInTime);
                                        const vExit = v.checkOutTime ? new Date(v.checkOutTime) : null;
                                        return (
                                          <div key={v.id} className="pt-1.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-300 gap-2">
                                            <span className="font-semibold text-slate-200">
                                              👥 {v.patientName} <span className="text-[9px] font-normal text-slate-400 ml-1.5">({v.reason})</span>
                                            </span>
                                            <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
                                              <span>Entrada: {vEntry.toLocaleDateString()} {vEntry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                              <span>•</span>
                                              <span>
                                                Salida: {vExit 
                                                  ? `${vExit.toLocaleDateString()} ${vExit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                                  : <span className="text-emerald-450 font-bold">Dentro</span>}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </span>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center text-slate-500">
                <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-sm">No se encontraron visitas previas para este correo.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Clinical Expediente / Nurse Log Modal */}
      {showNurseLogModal && selectedVisitForNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative border border-indigo-500/20 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/5 pb-4 mb-6 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                  <FileText className="w-5.5 h-5.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white Outfit">Expediente Clínico de Enfermería</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1 uppercase">
                      <Bed className="w-3.5 h-3.5" /> Hab: {selectedVisitForNurse.destination}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Paciente: <strong className="text-white">{selectedVisitForNurse.patientName}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowNurseLogModal(false)}
                className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer self-start sm:self-center"
              >
                Cerrar
              </button>
            </div>

            {/* Main Grid for EMR: Clinical logs & Visitors */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 text-left">
              
              {/* Left 2 columns: Clinical Logs Timeline */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Activity className="w-4 h-4" /> Evolución y Chequeos Clínicos ({nurseLogs.length})
                </h4>
                {nurseLogsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Activity className="w-8 h-8 text-indigo-400 pulse-glow animate-pulse" />
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Cargando Expediente Clínico...</p>
                  </div>
                ) : nurseLogs.length > 0 ? (
                  <div className="relative border-l border-white/10 ml-4 pl-8 space-y-8 py-2">
                    {nurseLogs.map((log) => {
                      const checkTime = new Date(log.loggedAt);
                      return (
                        <div key={log.id} className="relative">
                          <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border border-slate-950 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 hover:border-indigo-500/15 transition-all duration-300 bg-slate-950/20">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 gap-2 text-xs">
                              <span className="text-indigo-400 font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Chequeo: {checkTime.toLocaleDateString()} a las {checkTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-slate-400 font-medium">
                                Registrado por: <strong className="text-slate-200">{log.nurseName}</strong>
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5" /> Tratamientos
                                </span>
                                <p className="text-xs text-slate-200 mt-1 whitespace-pre-wrap font-medium">{log.treatments}</p>
                              </div>
                              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Plus className="w-3.5 h-3.5" /> Medicación
                                </span>
                                <p className="text-xs text-slate-200 mt-1 whitespace-pre-wrap font-medium">{log.medicines}</p>
                              </div>
                              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> Observaciones
                                </span>
                                <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap font-medium">{log.indications}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                      <Bed className="w-8 h-8 text-slate-650" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base">Sin Registros Clínicos en Bitácora</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                        Este paciente hospitalizado no tiene chequeos, tratamientos ni administración de medicamentos registrados en su expediente.
                      </p>
                    </div>
                    {session && ['enfermero', 'medico', 'administrador', 'manager'].includes(session.role) && (
                      <button
                        onClick={() => {
                          setShowNurseLogModal(false);
                          handleOpenAddNurseLogModal(selectedVisitForNurse);
                        }}
                        className="h-10 px-5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Registrar Primer Chequeo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right column: Visitors */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Users className="w-4 h-4" /> Historial de Visitantes ({getVisitorsForVisit(selectedVisitForNurse).length})
                </h4>
                
                {getVisitorsForVisit(selectedVisitForNurse).length > 0 ? (
                  <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                    {getVisitorsForVisit(selectedVisitForNurse).map((v) => {
                      const vt = new Date(v.checkInTime);
                      const vOut = v.checkOutTime ? new Date(v.checkOutTime) : null;
                      return (
                        <div key={v.id} className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2.5 hover:border-indigo-500/10 transition-all duration-300 bg-slate-950/20">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-extrabold text-xs text-white">👤 {v.patientName}</span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{v.type}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic">"{v.reason}"</p>
                          <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[10px] font-mono text-slate-500">
                            <div className="flex items-center justify-between">
                              <span>Entrada:</span>
                              <span className="text-slate-350">{vt.toLocaleDateString()} {vt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Salida:</span>
                              <span className="text-slate-350">{vOut 
                                ? `${vOut.toLocaleDateString()} ${vOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                : <span className="text-emerald-400 font-extrabold">Dentro</span>}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-950/20 border border-dashed border-white/5 text-center flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-slate-700" />
                    <p className="text-xs text-slate-500">Aún no hay visitas registradas para este paciente.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add Nurse Log Check-up Modal */}
      {showAddNurseLogModal && selectedVisitForNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Plus className="w-5.5 h-5.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white Outfit">Registrar Chequeo Clínico</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Agrega los detalles del chequeo para <span className="text-indigo-400 font-bold">{selectedVisitForNurse.patientName}</span> ({selectedVisitForNurse.destination})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddNurseLogModal(false)}
                className="text-slate-400 hover:text-white border border-white/5 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmNurseLog} className="space-y-5 text-left">
              
              {/* Treatments */}
              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-1.5">
                  Tratamientos / Procedimientos Realizados <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ej. Curación de herida, monitoreo de frecuencia cardíaca, toma de temperatura..."
                  value={newTreatments}
                  onChange={(e) => setNewTreatments(e.target.value)}
                  className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                />
              </div>

              {/* Medicines */}
              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-1.5">
                  Medicamentos / Soluciones Administradas <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ej. Cloruro de Sodio 0.9% 500ml IV, Paracetamol 1g IV dosis única..."
                  value={newMedicines}
                  onChange={(e) => setNewMedicines(e.target.value)}
                  className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                />
              </div>

              {/* Indications */}
              <div>
                <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider mb-1.5">
                  Indicaciones Médicas / Observaciones <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ej. Reposo absoluto, control de líquidos, reportar cualquier cambio en signos vitales..."
                  value={newIndications}
                  onChange={(e) => setNewIndications(e.target.value)}
                  className="w-full p-3 rounded-lg glass-input text-xs resize-none"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider mb-1.5">
                  Fecha y Hora del Chequeo Clínico <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newLoggedAt}
                  onChange={(e) => setNewLoggedAt(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg glass-input text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddNurseLogModal(false)}
                  className="flex-1 h-11 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={nurseSubmitting}
                  className="flex-1 h-11 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
                >
                  {nurseSubmitting ? 'Registrando...' : 'Guardar Chequeo Clínico'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT ROOM MODAL */}
      {showEditRoomModal && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 relative border border-indigo-500/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bed className="w-4 h-4 text-indigo-400" />
                Editar Habitación: {editingRoom.number}
              </h3>
              <button 
                onClick={() => { setShowEditRoomModal(false); setEditingRoom(null); }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateRoom} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Número de Habitación</label>
                <input
                  type="text"
                  required
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ubicación / Piso</label>
                <input
                  type="text"
                  required
                  value={editRoomFloor}
                  onChange={(e) => setEditRoomFloor(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipo de Habitación</label>
                <select
                  value={editRoomType}
                  onChange={(e) => setEditRoomType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-slate-200"
                >
                  <option value="Individual">Individual (Single)</option>
                  <option value="Doble">Doble (Double)</option>
                  <option value="UCI">UCI (ICU)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estado</label>
                <select
                  value={editRoomStatus}
                  onChange={(e) => setEditRoomStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-slate-200"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditRoomModal(false); setEditingRoom(null); }}
                  className="flex-1 h-10 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white font-bold uppercase tracking-wider text-[10px] transition-all duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {showEditDocModal && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 relative border border-indigo-500/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-400" />
                Editar Médico: {editingDoc.name}
              </h3>
              <button 
                onClick={() => { setShowEditDocModal(false); setEditingDoc(null); }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateDoctorAdmin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editDocNameAdmin}
                  onChange={(e) => setEditDocNameAdmin(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Especialidad</label>
                <input
                  type="text"
                  required
                  value={editDocSpecialtyAdmin}
                  onChange={(e) => setEditDocSpecialtyAdmin(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Consultorio Asignado</label>
                <select
                  value={editDocClinicIdAdmin}
                  onChange={(e) => setEditDocClinicIdAdmin(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-slate-200"
                >
                  <option value="">Sin Consultorio Asignado</option>
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Horarios de Atención / Guardia</label>
                <input
                  type="text"
                  placeholder="Ej. Lunes a Viernes 08:00 - 16:00"
                  value={editDocWorkingHoursAdmin}
                  onChange={(e) => setEditDocWorkingHoursAdmin(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="mail@host.com"
                    value={editDocEmailAdmin}
                    onChange={(e) => setEditDocEmailAdmin(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg glass-input text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={editDocPhoneAdmin}
                    onChange={(e) => setEditDocPhoneAdmin(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg glass-input text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="521..."
                    value={editDocWhatsappAdmin}
                    onChange={(e) => setEditDocWhatsappAdmin(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg glass-input text-white text-[11px]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditDocModal(false); setEditingDoc(null); }}
                  className="flex-1 h-10 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white font-bold uppercase tracking-wider text-[10px] transition-all duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditStaffModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 relative border border-indigo-500/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Editar Personal / Guardia: {editingStaff.name}
              </h3>
              <button 
                onClick={() => { setShowEditStaffModal(false); setEditingStaff(null); }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateStaff} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editStaffName}
                  onChange={(e) => setEditStaffName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  required
                  value={editStaffUsername}
                  onChange={(e) => setEditStaffUsername(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rol de Sistema</label>
                <select
                  required
                  value={editStaffRoleId}
                  onChange={(e) => setEditStaffRoleId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-slate-200"
                >
                  <option value="">Selecciona rol...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña (Dejar en blanco para no cambiar)</label>
                <input
                  type="password"
                  placeholder="Nueva contraseña opcional..."
                  value={editStaffPassword}
                  onChange={(e) => setEditStaffPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg glass-input text-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditStaffModal(false); setEditingStaff(null); }}
                  className="flex-1 h-10 rounded-lg border border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white font-bold uppercase tracking-wider text-[10px] transition-all duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 rounded-lg text-slate-950 font-bold uppercase tracking-wider text-[10px] glow-btn-indigo flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="mt-12 py-6 border-t border-white/5 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Aozora Care-Flow. Modo Administración ({session.role}).</p>
      </footer>
    </div>
  );
}
