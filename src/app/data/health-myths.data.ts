import { IconBase } from '../utils/icons';

const { icons } = new (class extends IconBase {})();

export const HEALTH_MYTHS = [
  {
    id: 'sed-no-hidratacion',
    icon: icons.GlassWaterIcon,
    myth: 'Si no tengo sed, no necesito tomar agua',
    reality:
      'La sed es un síntoma tardío de deshidratación. En faenas, hay que hidratarse antes de tener sed.',
    color: 'bg-sky-100 text-sky-600',
    bgMuted: 'bg-sky-50',
  },
  {
    id: 'sueno-4h',
    icon: icons.BedDoubleIcon,
    myth: 'Dormir 4 horas igual me sirve',
    reality:
      'Dormir menos de 6 horas afecta tu concentración y aumenta el riesgo de accidentes.',
    color: 'bg-indigo-100 text-indigo-600',
    bgMuted: 'bg-indigo-50',
  },
  {
    id: 'no-sol-no-quema',
    icon: icons.SunIcon,
    myth: 'Solo los que trabajan en altura se queman con el sol',
    reality:
      'La radiación UV está presente aunque no lo sientas. Incluso en sombra o con frío.',
    color: 'bg-orange-100 text-orange-600',
    bgMuted: 'bg-orange-50',
  },
  {
    id: 'audifonos-protegen',
    icon: icons.HeadphonesIcon,
    myth: 'Si uso audífonos no me tengo que preocupar del ruido',
    reality:
      'Solo los protectores auditivos certificados te protegen del daño progresivo.',
    color: 'bg-blue-100 text-blue-600',
    bgMuted: 'bg-blue-50',
  },
  {
    id: 'estres-normal',
    icon: icons.BrainIcon,
    myth: 'El estrés es parte del trabajo, no se puede hacer nada al respecto',
    reality:
      'Hay técnicas efectivas para controlarlo y mejorar tu rendimiento.',
    color: 'bg-pink-100 text-pink-600',
    bgMuted: 'bg-pink-50',
  },
];

export type HealthMyth = (typeof HEALTH_MYTHS)[number];
