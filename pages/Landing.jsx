
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-card rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-background/60">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-accent mb-4 tracking-tight uppercase text-center">ГАЗПРОМНЕФТЬ КАРЬЕРА</h1>
        <div className="text-xl md:text-2xl mb-8 text-center font-body text-muted">
          AI-экосистема карьерного развития, обучения и внутренней мобильности сотрудников.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          <div className="flex flex-col items-center">
            <div className="font-heading text-3xl text-white font-bold">12 450</div>
            <div className="text-muted">Сотрудников</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-heading text-3xl text-white font-bold">320</div>
            <div className="text-muted">Обучающих программ</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-heading text-3xl text-white font-bold">87%</div>
            <div className="text-muted">Готовность к развитию</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
          <button
            className="flex-1 bg-accent text-background font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 shadow-lg hover:bg-accent/80 transition"
            onClick={() => navigate('/dashboard')}
          >
            <Users size={28} /> Сотрудник
          </button>
          <button
            className="flex-1 bg-background border-2 border-accent text-accent font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 shadow-lg hover:bg-accent/10 transition"
            onClick={() => navigate('/dashboard')}
          >
            <Briefcase size={28} /> Администратор
          </button>
        </div>
      </div>
    </div>
  );
}
