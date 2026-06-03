import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, ChevronRight, Shield } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function Login() {
  const navigate  = useNavigate();
  const { loginAs } = useMode();

  const handleEmployee = () => {
    loginAs('employee');
    navigate('/dashboard');
  };

  const handleManager = () => {
    loginAs('manager');
    navigate('/manager/team');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #F4F6F9 0%, #E8F0FA 100%)' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <img
          src="/logo.png"
          alt="Газпром нефть"
          width={220}
          height={66}
          style={{ objectFit: 'contain' }}
        />
        <div className="font-semibold text-xs tracking-widest" style={{ color: '#003366' }}>
          КАРЬЕРНЫЙ НАВИГАТОР
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-card-hover border border-border p-8 w-full max-w-lg">
        <h1 className="text-xl font-bold text-dark text-center mb-2">Выберите режим входа</h1>
        <p className="text-sm text-secondary text-center mb-8">
          Выберите тип аккаунта для продолжения работы
        </p>

        <div className="space-y-3">
          {/* Employee */}
          <button
            onClick={handleEmployee}
            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:border-accent hover:bg-accent-light/30 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
              <User size={22} className="text-accent group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark text-base">Войти как сотрудник</p>
              <p className="text-sm text-secondary mt-0.5">
                Карьерный путь, обучение, ИПР и личная аналитика
              </p>
            </div>
            <ChevronRight size={18} className="text-muted group-hover:text-accent transition-colors flex-shrink-0" />
          </button>

          {/* Manager */}
          <button
            onClick={handleManager}
            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:bg-[#EEF2F8] transition-all group text-left"
            style={{ '--hover-border': '#003366' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#003366'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#DDE1E9'}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ backgroundColor: '#EEF2F8' }}
              ref={el => {
                if (!el) return;
                el.closest('button').addEventListener('mouseenter', () => {
                  el.style.backgroundColor = '#003366';
                  el.querySelector('svg').style.color = '#ffffff';
                });
                el.closest('button').addEventListener('mouseleave', () => {
                  el.style.backgroundColor = '#EEF2F8';
                  el.querySelector('svg').style.color = '#003366';
                });
              }}
            >
              <Users size={22} style={{ color: '#003366' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark text-base">Войти как руководитель</p>
              <p className="text-sm text-secondary mt-0.5">
                Управление командой, ИПР, ротация и аналитика развития
              </p>
            </div>
            <ChevronRight size={18} className="text-muted flex-shrink-0" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-8 justify-center">
          <Shield size={13} className="text-muted" />
          <p className="text-xs text-muted">Корпоративная система · Газпромнефть © 2026</p>
        </div>
      </div>

      {/* Demo note */}
      <p className="text-xs text-muted mt-6 text-center">
        Демо-версия · Данные являются тестовыми
      </p>
    </div>
  );
}
