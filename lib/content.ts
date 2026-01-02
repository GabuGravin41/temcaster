
export interface Facet {
  name: string;
  description: string;
}

export interface TraitDetail {
  title: string;
  shortDesc: string;
  fullDesc: string;
  facets: Facet[];
}

export const TRAIT_DETAILS: Record<string, TraitDetail> = {
  'N': {
    title: "Neuroticism",
    shortDesc: "The tendency to experience negative feelings.",
    fullDesc: "Neuroticism refers to the tendency to experience negative feelings. People who are high in Neuroticism may feel that something dangerous is about to happen and tend to experience intense emotions. Low scorers are generally calm, composed, and unflappable.",
    facets: [
      { name: "Anxiety", description: "The 'fight-or-flight' system. High scorers often feel like something dangerous is about to happen." },
      { name: "Anger", description: "The tendency to feel enraged or resentful when things do not go one's way." },
      { name: "Depression", description: "The tendency to feel sad, dejected, and discouraged." },
      { name: "Self-Consciousness", description: "Sensitivity about what others think; concern about rejection and ridicule." },
      { name: "Immoderation", description: "Difficulty resisting strong cravings and urges; orientation toward short-term pleasures." },
      { name: "Vulnerability", description: "Experience of panic, confusion, and helplessness when under pressure." }
    ]
  },
  'E': {
    title: "Extraversion",
    shortDesc: "Marked by pronounced engagement with the external world.",
    fullDesc: "Extraversion is marked by pronounced engagement with the external world. High scorers are sociable, outgoing, energetic, and lively. They enjoy being around people. Low scorers (introverts) need less stimulation and more privacy.",
    facets: [
      { name: "Friendliness", description: "Genuinely liking other people and openly demonstrating positive feelings." },
      { name: "Gregariousness", description: "Finding the company of others pleasantly stimulating and rewarding." },
      { name: "Assertiveness", description: "Liking to speak out, take charge, and direct the activities of others." },
      { name: "Activity Level", description: "Leading fast-paced, busy lives; moving about quickly and vigorously." },
      { name: "Excitement-Seeking", description: "Easily bored without high levels of stimulation; taking risks and seeking thrills." },
      { name: "Cheerfulness", description: "Experience of positive mood and feelings like happiness, enthusiasm, and joy." }
    ]
  },
  'O': {
    title: "Openness to Experience",
    shortDesc: "Distinguishes imaginative, creative people from conventional people.",
    fullDesc: "Openness to Experience describes a dimension of cognitive style that distinguishes imaginative, creative people from down-to-earth, conventional people. High scorers enjoy novelty, variety, and change. Low scorers prefer plain, straightforward, and obvious things.",
    facets: [
      { name: "Imagination", description: "Using fantasy as a way of creating a richer, more interesting world." },
      { name: "Artistic Interests", description: "Appreciation of natural and artificial beauty and absorption in artistic events." },
      { name: "Emotionality", description: "Good access to and awareness of one's own feelings." },
      { name: "Adventurousness", description: "Eagerness to try new activities, travel, and experience different things." },
      { name: "Intellect", description: "Love of playing with ideas and open-mindedness to new and unusual concepts." },
      { name: "Liberalism", description: "Readiness to challenge authority, convention, and traditional values." }
    ]
  },
  'A': {
    title: "Agreeableness",
    shortDesc: "Concern with cooperation and social harmony.",
    fullDesc: "Agreeableness reflects individual differences in concern with cooperation and social harmony. Agreeable individuals value getting along with others and are generally considerate, kind, generous, trusting, and trustworthy.",
    facets: [
      { name: "Trust", description: "Assuming that most people are fair, honest, and have good intentions." },
      { name: "Morality", description: "Seeing no need for pretense or manipulation; being candid, frank, and sincere." },
      { name: "Altruism", description: "Finding helping other people genuinely rewarding and self-fulfilling." },
      { name: "Cooperation", description: "Disliking confrontations and being willing to compromise." },
      { name: "Modesty", description: "Disliking claiming superiority over others; humble." },
      { name: "Sympathy", description: "Being tenderhearted, compassionate, and easily moved to pity." }
    ]
  },
  'C': {
    title: "Conscientiousness",
    shortDesc: "The way in which we control, regulate, and direct our impulses.",
    fullDesc: "Conscientiousness concerns the way in which we control, regulate, and direct our impulses. High scorers set clear goals and pursue them with determination. They are regarded as reliable and hard-working.",
    facets: [
      { name: "Self-Efficacy", description: "Confidence in one's ability to accomplish things." },
      { name: "Orderliness", description: "Being well-organized, keeping lists, and living according to schedules." },
      { name: "Dutifulness", description: "A strong sense of moral obligation and duty." },
      { name: "Achievement-Striving", description: "Striving hard to achieve excellence and recognition." },
      { name: "Self-Discipline", description: "The ability to persist at difficult or unpleasant tasks until completion." },
      { name: "Cautiousness", description: "The disposition to think through possibilities and consequences before acting." }
    ]
  }
};
