export function translateSymptomOptions(type: string, value: string): string {
  const translations: { [key: string]: string } = {
    // Hydration
    'hydration.low': 'Poca',
    'hydration.adequate': 'Suficiente',
    'hydration.high': 'Mucha',

    // Sleep
    'sleep.good': 'Bien',
    'sleep.regular': 'Regular',
    'sleep.poor': 'Mal',

    // Weight
    'weight.low': 'Bajo',
    'weight.normal': 'Normal',
    'weight.high': 'Alto',

    // Diet
    'diet.healthy': 'Saludable',
    'diet.fast food': 'Comida rápida',
    'diet.greasy': 'Mucha grasa',
    'diet.skipped': 'No comió',

    // Mood
    'mood.happy': 'Feliz',
    'mood.calm': 'Tranquilo',
    'mood.apathetic': 'Apático',
    'mood.irritable': 'Irritable',
    'mood.stressed': 'Estresado',
    'mood.sad': 'Triste',

    // Energy
    'energy.high': 'Alta',
    'energy.medium': 'Media',
    'energy.low': 'Baja',

    // Body Pain
    'bodyPain.muscular': 'Muscular',
    'bodyPain.joint': 'Articular',
    'bodyPain.back': 'De espalda',
    'bodyPain.neck': 'De cuello',

    // Blood Pressure
    'bloodPressure.high': 'Alta',
    'bloodPressure.low': 'Baja',

    // Physical Activity
    'physicalActivity.none': 'Ninguna',
    'physicalActivity.light': 'Ligera',
    'physicalActivity.moderate': 'Moderada',
    'physicalActivity.intense': 'Intensa',
  };

  return translations[`${type}.${value}`] ?? value;
}

export function translateSymptomSections(section: string): string {
  const translations: { [key: string]: string } = {
    // Hydration
    hydration: 'hidratación',

    // Sleep
    sleep: 'sueño',

    // Weight
    weight: 'peso',

    // Diet
    diet: 'dieta',

    // Energy
    energy: 'energía',

    // Body Pain
    bodyPain: 'dolor físico',

    // Blood Pressure
    bloodPressure: 'presión arterial',

    // Physical Activity
    physicalActivity: 'actividad física',
  };

  return translations[`${section}`] ?? section;
}
