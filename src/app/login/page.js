'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ShieldAlert, LogIn, Lock, User, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to staff dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

      {/* Back to Home Link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg border border-white/5 bg-slate-900/40 hover:bg-slate-800/40"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Portal Público</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow border line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>

        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Activity className="w-6 h-6 text-emerald-400 pulse-glow" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-display">Acceso de Personal</h2>
          <p className="text-xs text-slate-400 mt-1">Control de Visitas del Hospital</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error de Acceso</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="Ej. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl glass-input text-sm"
              />
              <User className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl glass-input text-sm"
              />
              <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-xl text-slate-950 font-bold uppercase tracking-wider text-xs glow-btn-emerald flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Validando credenciales...' : 'Iniciar Sesión'}
            <LogIn className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* Help Tip */}
        <div className="mt-8 text-center text-[10px] text-slate-500 border-t border-white/5 pt-4">
          <p>¿Primera vez ingresando? Usa las credenciales de semilla:</p>
          <p className="mt-1 font-mono text-slate-400">Usuario: <strong className="text-emerald-400">admin</strong> / Contraseña: <strong className="text-emerald-400">adminpassword</strong></p>
        </div>

      </div>
    </div>
  );
}
