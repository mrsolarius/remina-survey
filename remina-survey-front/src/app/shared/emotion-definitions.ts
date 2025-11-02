export type EmotionKey =
  | 'awe'
  | 'fear'
  | 'contentment'
  | 'anger'
  | 'amusement'
  | 'disgust'
  | 'serenity'
  | 'sadness'
  | 'excitement'
  | 'anxiety';

export interface EmotionDefinition {
  label: string;
  description: string;
}

export const EMOTION_DEFINITIONS: Record<EmotionKey, EmotionDefinition> = {
  awe: {
    label: "Émerveillement",
    description: "L'émerveillement peut être défini comme un état associé à l'étonnement et à la contemplation. Lorsqu'un individu ressent cette émotion, son esprit s'enrichit et sa compréhension de l'Univers se développe. C'est une émotion qui immobilise et donne envie d'explorer tous les détails de l'expérience vécue."
  },
  amusement: {
    label: "Amusement",
    description: "L'amusement est une émotion associée au jeu et à l'humour, elle apparaît généralement quand un individu souhaite rire et plaisanter avec les autres."
  },
  excitement: {
    label: "Excitation",
    description: "L'excitation est une réponse positive donnée face à la nouveauté et aux nouveaux défis. Elle apparaît quand un objectif est perçu comme intéressant et place les individus dans les dispositions adéquates pour réagir aux différents stimuli de l'environnement."
  },
  contentment: {
    label: "Contentement",
    description: "La satisfaction entraîne un sentiment d'accomplissement. Elle apparaît quand les besoins d'une personne sont accomplis. Elle amène l'individu à se sentir uni avec ce qui l'entoure et lui permet d'évaluer l'environnement comme sûr."
  },
  serenity: {
    label: "Sérénité",
    description: "La sérénité est un sentiment qui peut être associée au calme et à la tranquillité. Nous définissons la sérénité par l'absence d'anxiété et de tension interne et par l'habilité pour un individu d'apprécier les expériences vécus."
  },
  fear: {
    label: "Peur",
    description: "La peur est une émotion provoquée par ce qui peut être perçu comme une menace. Elle cause des réponses comportementales comme la fuite, la tétanisation ou la dissimulation pour éviter cette menace."
  },
  anger: {
    label: "Colère",
    description: "La colère est une émotion qui apparaît en réponse à une menace ou à des injustices, quand quelque chose ou quelqu'un est responsable de cette situation. Elle motive les gens à se protéger et à combattre."
  },
  sadness: {
    label: "Tristesse",
    description: "La tristesse est une réponse émotionnelle associée à la perte irrévocable de quelque chose perçu comme important et aimé. Elle combine les sentiments liés à la perte, à l'impuissance et peut entraîner des pleurs."
  },
  disgust: {
    label: "Dégoût",
    description: "Le dégoût correspond au sentiment de répulsion et le besoin d'éviter une situation ou un objet considéré comme déplaisant."
  },
  anxiety: {
    label: "Anxiété",
    description: "L'anxiété se caractérise par un long sentiment d'inquiétude, des ruminations et des plaintes somatiques comme des tensions musculaires ou de la fatigue en réponse à des événements anticipés."
  }
};
