import { StudentLevel } from '../types';

export interface BmiResult {
  bmi: number;
  classification: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return {
      bmi: 0,
      classification: 'Dados insuficientes',
      colorClass: 'text-slate-400',
      badgeBg: 'bg-slate-800',
      badgeText: 'text-slate-300',
      description: 'Informe peso e altura válidos.',
    };
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return {
      bmi,
      classification: 'Abaixo do peso',
      colorClass: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 border-sky-500/20',
      badgeText: 'text-sky-400',
      description: 'Recomenda-se ganho de massa magra e suporte calórico adequado.',
    };
  } else if (bmi < 25.0) {
    return {
      bmi,
      classification: 'Peso normal / Saudável',
      colorClass: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
      badgeText: 'text-emerald-400',
      description: 'Faixa de peso saudável conforme os parâmetros da OMS.',
    };
  } else if (bmi < 30.0) {
    return {
      bmi,
      classification: 'Sobrepeso',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20',
      badgeText: 'text-amber-400',
      description: 'Recomenda-se controle calórico e rotina de treinos aeróbicos e resistidos.',
    };
  } else if (bmi < 35.0) {
    return {
      bmi,
      classification: 'Obesidade Grau I',
      colorClass: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 border-orange-500/20',
      badgeText: 'text-orange-400',
      description: 'Acompanhamento nutricional e treinos progressivos de baixo impacto nas articulações.',
    };
  } else if (bmi < 40.0) {
    return {
      bmi,
      classification: 'Obesidade Grau II',
      colorClass: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/20',
      badgeText: 'text-rose-400',
      description: 'Acompanhamento multiprofissional essencial e plano de exercícios seguro.',
    };
  } else {
    return {
      bmi,
      classification: 'Obesidade Grau III',
      colorClass: 'text-red-500',
      badgeBg: 'bg-red-500/10 border-red-500/20',
      badgeText: 'text-red-400',
      description: 'Necessário acompanhamento clínico e adaptação cuidadosa de cargas.',
    };
  }
}

export function calculateWaterIntake(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 2000;
  return Math.round(weightKg * 35); // 35ml por kg de peso
}

export function getLevelBadge(level: StudentLevel) {
  switch (level) {
    case 'Iniciante':
      return {
        label: 'Iniciante',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        dotClass: 'bg-emerald-400',
      };
    case 'Intermediário':
      return {
        label: 'Intermediário',
        badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
        dotClass: 'bg-blue-400',
      };
    case 'Avançado':
      return {
        label: 'Avançado',
        badgeClass: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
        dotClass: 'bg-purple-400',
      };
  }
}
