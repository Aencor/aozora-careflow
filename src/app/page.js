import Link from 'next/link';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  Clock, 
  Users, 
  ArrowRight, 
  Shield, 
  Award,
  Lock,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Pill
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-[#070b13] text-[#f8fafc] antialiased overflow-x-hidden min-h-screen relative">
      
      {/* Dynamic light glows in background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-500/3 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-40 bg-[#070b13]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Activity className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1 sm:gap-1.5 font-display">
                Aozora <span className="text-sky-400 font-extrabold">Care-Flow</span>
              </h1>
              <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Trazabilidad & Seguridad Clínica</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/kiosk"
              className="hidden sm:inline-flex items-center h-9 px-3 sm:px-4 text-[10px] sm:text-xs font-bold rounded-lg border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300"
            >
              Quiosco Público
            </Link>
 
            <Link 
              href="/login"
              className="inline-flex items-center h-9 px-2.5 sm:px-4 text-[10px] sm:text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300"
            >
              Acceso Personal
            </Link>
 
            <Link 
              href="/showcase"
              className="inline-flex items-center h-9 px-2.5 sm:px-4 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] glow-btn-sky"
            >
              Demo En Vivo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl w-full mx-auto px-6 pt-16 pb-20 text-center space-y-8 relative">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] font-bold uppercase tracking-wider animate-bounce">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Inspirado en el cuidado real y la seguridad humana</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-display">
          Porque cada segundo en un hospital cuenta, y <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400">cada descuido cuesta.</span>
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
          Aozora Care-Flow transforma el caótico registro manual de visitas y la falta de coordinación en un ecosistema digital, seguro y en tiempo real. Cuidamos la trazabilidad clínica y devolvemos la tranquilidad a las familias.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            href="/showcase"
            className="px-8 h-12 rounded-xl bg-sky-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-sky-400 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center gap-2 cursor-pointer glow-btn-sky"
          >
            <span>Probar Simulador Interactivo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/kiosk"
            className="px-8 h-12 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer"
          >
            Ver Quiosco de Entrada
          </Link>
        </div>
      </section>

      {/* THE STORY (Human Core) */}
      <section className="max-w-4xl w-full mx-auto px-6 pb-24">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/10 relative overflow-hidden bg-gradient-to-br from-[#0c1222] via-[#070b13] to-[#070b13] shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <HeartHandshake className="w-7 h-7 text-indigo-400" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center gap-2">
                La Promesa detrás de Aozora: <span className="text-sky-400 font-light">"Cielo Azul"</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-light">
                "Este proyecto nace de una experiencia personal profunda: un momento de extrema vulnerabilidad cuando mi hijo enfrentó complicaciones críticas al nacer debido a fallas de comunicación y la falta de trazabilidad clínica en tiempo real. 
                Además del inmenso peligro para el recién nacido, la falta de coordinación y control en los accesos y relevos clínicos resultó en <strong className="text-sky-300">graves secuelas y complicaciones médicas severas principalmente para su madre</strong>. Estas fallas clínicas y administrativas no solo pusieron en riesgo su vida y salud física, sino que <strong className="text-sky-300">afectaron profundamente su salud mental y bienestar emocional</strong> debido a la desatención y la incertidumbre.
                <br /><br />
                De por sí, la estancia en un hospital es un momento de incertidumbre y dolor para cualquier familia; añadir errores de seguimiento o vacíos en el registro clínico agrava esa carga de forma intolerable. Es una vivencia sumamente difícil y traumática que <strong className="text-rose-400">no quisiéramos que se repitiera jamás para ninguna madre ni para ningún paciente</strong>.
                <br /><br />
                Aozora Care-Flow fue concebido bajo una promesa solemne: transformar la tecnología hospitalaria para evitar que otras familias pasen por problemas de este tipo. Es un ecosistema diseñado con amor y rigor técnico para salvaguardar la seguridad operativa del paciente, facilitando una estancia transparente, segura y libre de errores humanos prevenibles."
              </p>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2 block">
                — Enrique Contreras, Creador de Aozora
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES (Empathy-based features) */}
      <section className="max-w-6xl w-full mx-auto px-6 pb-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Diseñado para responder a tus verdaderas preocupaciones
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm font-light">
            En un hospital, la tranquilidad empieza cuando sabes que todo está coordinado y bajo control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Card 1: Entradas */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#090e1a]/40 hover:border-sky-500/20 transition-all duration-300 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-5.5 h-5.5 text-sky-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Entradas en 15 Segundos sin Filas</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Olvídate de las firmas manuales insalubres en libretas viejas. Con un pase QR automatizado en el celular, las visitas registran su entrada y salida en segundos, aliviando las colas en recepción y reduciendo el estrés en las puertas.
              </p>
            </div>
          </div>

          {/* Card 2: Trazabilidad Clinica */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#090e1a]/40 hover:border-indigo-500/20 transition-all duration-300 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Trazabilidad Clínica Sin Papeles</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                El ingreso de un paciente en recepción abre un expediente digital dinámico. El diagnóstico y la receta que registra el médico tratante viajan instantáneamente a la bitácora de enfermería. Cero papeles extraviados, cero indicaciones perdidas.
              </p>
            </div>
          </div>

          {/* Card 3: Seguridad Zonas */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#090e1a]/40 hover:border-purple-500/20 transition-all duration-300 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-5.5 h-5.5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Seguridad y Respeto a Zonas Críticas</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Asegura que áreas de alta vulnerabilidad (como neonatología, UCIs y quirófanos) tengan pases asociados estrictamente autorizados que expiran al hacer el Check-Out. Sabrás siempre quién está, dónde y con qué propósito.
              </p>
            </div>
          </div>

          {/* Card 4: Telemetría Admin */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#090e1a]/40 hover:border-teal-500/20 transition-all duration-300 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Users className="w-5.5 h-5.5 text-teal-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Telemetría en Vivo de Ocupación</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Los administradores generales y jefes médicos ven el mapa de aforo en vivo. Monitorea la disponibilidad de habitaciones y camas, y optimiza los tiempos de espera promedio para garantizar un trato digno e inmediato.
              </p>
            </div>
          </div>


          {/* Card 5: Farmacia */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#090e1a]/40 hover:border-sky-500/20 transition-all duration-300 flex gap-4 md:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Pill className="w-5.5 h-5.5 text-sky-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Farmacia e Inventario Integrados</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                La enfermera solicita medicamentos directamente desde el expediente del paciente. El farmacéutico los ve en su consola de despacho, los entrega y el inventario se descuenta en tiempo real. Cero llamadas, cero malentendidos, trazabilidad farmacológica completa desde la prescripción hasta la entrega.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* PORTALS EXPLORATION TEASER */}
      <section className="max-w-6xl w-full mx-auto px-6 pb-24 text-center">
        <div className="glass-panel p-10 sm:p-12 rounded-3xl border border-white/5 bg-gradient-to-r from-[#090e1b] to-[#070b13] relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/3 rounded-full blur-3xl"></div>
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display max-w-xl mx-auto leading-tight">
            Explora Aozora a través de sus portales de trabajo
          </h3>
          
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Nuestra demo interactiva te permite simular en tiempo real el flujo completo de una visita ingresada por un **Guardia**, atendida por un **Médico**, cuidada por una **Enfermera** y monitoreada por el **Administrador**.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto pt-4 text-left">
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center space-y-1">
              <div className="text-sm">🛡️</div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Guardia</p>
              <p className="text-[9px] text-slate-500">Check-in QR inmediato</p>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center space-y-1">
              <div className="text-sm">🩺</div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Médico</p>
              <p className="text-[9px] text-slate-500">Receta y diagnóstico</p>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center space-y-1">
              <div className="text-sm">💊</div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Enfermería</p>
              <p className="text-[9px] text-slate-500">Bitácora de cuidados</p>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center space-y-1">
              <div className="text-sm">🧪</div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Farmacia</p>
              <p className="text-[9px] text-slate-500">Despacho e inventario</p>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl text-center space-y-1">
              <div className="text-sm">📊</div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Director</p>
              <p className="text-[9px] text-slate-500">Control de camas y aforo</p>
            </div>
          </div>

          <div className="pt-6">
            <Link 
              href="/showcase"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-sky-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider hover:bg-sky-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] glow-btn-sky"
            >
              <span>Abrir Demostración Comercial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#05080e] text-slate-500 text-xs">
        <div className="max-w-6xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <span className="font-bold text-white text-sm font-display uppercase tracking-wider">Aozora Care-Flow</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/kiosk" className="hover:text-white transition-colors">Quiosco de Registro</Link>
            <Link href="/showcase" className="hover:text-white transition-colors">Simulador Comercial</Link>
            <Link href="/login" className="hover:text-white transition-colors">Acceso Interno</Link>
          </div>

          <p className="text-[10px] text-slate-650">
            &copy; {new Date().getFullYear()} Aozora Care-Flow. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
