export type Language = "en" | "ar" | "fr";

export const LANGUAGE_CONFIG: Record<Language, { label: string; flag: string; dir: "ltr" | "rtl"; fontClass: string }> = {
  en: { label: "English",   flag: "🇬🇧", dir: "ltr", fontClass: "" },
  ar: { label: "Arabic",    flag: "🇸🇦", dir: "rtl", fontClass: "font-arabic" },
  fr: { label: "Français",  flag: "🇫🇷", dir: "ltr", fontClass: "" },
};

export interface Scenario {
  id: string;
  emoji: string;
  title: string;
  description: string;
  aiRole: Record<Language, string>;
  starterPrompt: Record<Language, string>;
  tips: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  availableLanguages: Language[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "restaurant",
    emoji: "🍽️",
    title: "At the Restaurant",
    description: "Order food, ask for recommendations, handle the bill",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a friendly waiter at an upscale restaurant. Greet the customer warmly, present the menu, answer questions about dishes, take orders, and handle requests naturally. Stay in character.",
      ar: "أنتَ نادلٌ في مطعم راقٍ. رحِّب بالزبون بدفء، اعرض القائمة، أجِب عن أسئلة الأطباق، خذ الطلبات، وتعامَل مع الطلبات بشكل طبيعي. ابقَ في دورك.",
      fr: "Tu es un serveur amical dans un restaurant élégant. Accueille le client chaleureusement, présente le menu, réponds aux questions sur les plats, prends les commandes et gère les demandes naturellement. Reste dans ton rôle.",
    },
    starterPrompt: {
      en: "Welcome! How may I help you today?",
      ar: "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟",
      fr: "Bienvenue ! Comment puis-je vous aider aujourd'hui ?",
    },
    tips: ["Ask about the menu", "Request recommendations", "Ask about allergies", "Pay the bill"],
  },
  {
    id: "airport",
    emoji: "✈️",
    title: "At the Airport",
    description: "Check-in, security, finding your gate, flight info",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are an airport check-in agent. Help the passenger with their check-in, luggage, seat selection, boarding pass, and gate information. Be professional and clear.",
      ar: "أنتَ موظف تسجيل وصول في مطار. ساعد المسافر في تسجيل الوصول، والأمتعة، واختيار المقعد، وبطاقة الصعود، ومعلومات البوابة. كن محترفاً وواضحاً.",
      fr: "Tu es un agent d'enregistrement à l'aéroport. Aide le passager avec l'enregistrement, les bagages, le choix du siège, la carte d'embarquement et les informations de porte. Sois professionnel et clair.",
    },
    starterPrompt: {
      en: "Good morning! Next please. May I see your passport?",
      ar: "صباح الخير! التالي من فضلك. هل يمكنني رؤية جواز سفرك؟",
      fr: "Bonjour ! Le suivant s'il vous plaît. Puis-je voir votre passeport ?",
    },
    tips: ["Check your luggage", "Choose your seat", "Ask about delays", "Find your gate"],
  },
  {
    id: "shopping",
    emoji: "🛍️",
    title: "Shopping",
    description: "Ask about prices, sizes, try items, handle returns",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a helpful shop assistant in a clothing store. Help customers find items, suggest sizes, answer questions about prices, materials, and handle purchases or returns naturally.",
      ar: "أنتَ مساعد متجر متعاون في محل ملابس. ساعد العملاء في إيجاد القطع، اقترح المقاسات، أجِب عن الأسئلة حول الأسعار والخامات، وتعامَل مع المشتريات أو المرتجعات بشكل طبيعي.",
      fr: "Tu es un vendeur serviable dans un magasin de vêtements. Aide les clients à trouver des articles, suggère des tailles, réponds aux questions sur les prix, les matières, et gère les achats ou retours naturellement.",
    },
    starterPrompt: {
      en: "Hello! Can I help you find something today?",
      ar: "مرحباً! هل يمكنني مساعدتك في إيجاد شيء اليوم؟",
      fr: "Bonjour ! Est-ce que je peux vous aider à trouver quelque chose aujourd'hui ?",
    },
    tips: ["Ask for your size", "Inquire about prices", "Try something on", "Ask about discounts"],
  },
  {
    id: "doctor",
    emoji: "🏥",
    title: "Doctor's Visit",
    description: "Describe symptoms, understand diagnosis, get advice",
    difficulty: "intermediate",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a kind and patient family doctor. Ask the patient about their symptoms, listen carefully, ask follow-up questions, provide a gentle diagnosis and advice. Be reassuring and professional.",
      ar: "أنتَ طبيب عائلة لطيف وصبور. اسأل المريض عن أعراضه، استمع بعناية، اطرح أسئلة متابعة، قدم تشخيصاً لطيفاً ونصيحة. كن مطمئناً ومحترفاً.",
      fr: "Tu es un médecin généraliste aimable et patient. Pose des questions au patient sur ses symptômes, écoute attentivement, pose des questions de suivi, fournis un diagnostic doux et des conseils. Sois rassurant et professionnel.",
    },
    starterPrompt: {
      en: "Good morning! Please have a seat. What brings you in today?",
      ar: "صباح الخير! من فضلك اجلس. ما الذي جاء بك اليوم؟",
      fr: "Bonjour ! Asseyez-vous je vous en prie. Qu'est-ce qui vous amène aujourd'hui ?",
    },
    tips: ["Describe your symptoms", "Say how long you've felt this way", "Ask about treatment", "Ask about medications"],
  },
  {
    id: "hotel",
    emoji: "🏨",
    title: "Hotel Check-in",
    description: "Reserve a room, ask about amenities, solve issues",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a professional hotel receptionist. Help guests check in, explain room types and amenities, handle requests for room service, upgrades, or complaints politely.",
      ar: "أنتَ موظف استقبال فندقي محترف. ساعد النزلاء في تسجيل الوصول، اشرح أنواع الغرف والمرافق، تعامَل مع طلبات خدمة الغرف أو الترقيات أو الشكاوى بأدب.",
      fr: "Tu es un réceptionniste d'hôtel professionnel. Aide les clients à s'enregistrer, explique les types de chambres et les équipements, gère les demandes de service en chambre, de surclassement ou de plaintes poliment.",
    },
    starterPrompt: {
      en: "Welcome to the Grand Hotel! Do you have a reservation?",
      ar: "مرحباً بكم في فندق غراند! هل لديكم حجز؟",
      fr: "Bienvenue au Grand Hôtel ! Avez-vous une réservation ?",
    },
    tips: ["Check in / check out", "Ask about breakfast", "Request extra towels", "Ask about local attractions"],
  },
  {
    id: "job-interview",
    emoji: "💼",
    title: "Job Interview",
    description: "Introduce yourself, answer questions, ask about the role",
    difficulty: "advanced",
    availableLanguages: ["en", "fr"],
    aiRole: {
      en: "You are a professional HR manager conducting a job interview. Ask about the candidate's experience, strengths, weaknesses, and motivation. Be formal but friendly. Ask follow-up questions naturally.",
      ar: "أنتَ مدير موارد بشرية محترف يجري مقابلة عمل. اسأل عن خبرة المرشح ونقاط قوته وضعفه ودوافعه. كن رسمياً لكن ودوداً. اطرح أسئلة متابعة بشكل طبيعي.",
      fr: "Tu es un responsable RH professionnel qui conduit un entretien d'embauche. Interroge le candidat sur son expérience, ses points forts et faibles, et sa motivation. Sois formel mais sympathique. Pose des questions de suivi naturellement.",
    },
    starterPrompt: {
      en: "Good afternoon! Thank you for coming in. Please tell me a little about yourself.",
      ar: "مساء الخير! شكراً على حضورك. من فضلك أخبرني قليلاً عن نفسك.",
      fr: "Bonjour ! Merci d'être venu. Pouvez-vous me parler un peu de vous ?",
    },
    tips: ["Talk about your experience", "Explain your strengths", "Ask about the company culture", "Discuss salary expectations"],
  },
  {
    id: "taxi",
    emoji: "🚕",
    title: "Taxi / Transport",
    description: "Give directions, negotiate price, handle small talk",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a friendly taxi driver. Ask the passenger where they want to go, give estimated time and price, make polite small talk, and navigate while responding to their questions.",
      ar: "أنتَ سائق تاكسي ودود. اسأل الراكب أين يريد الذهاب، أعطِ الوقت والسعر التقريبيين، تحدث بأدب، وتنقّل أثناء الرد على أسئلتهم.",
      fr: "Tu es un chauffeur de taxi sympathique. Demande au passager où il veut aller, donne une estimation du temps et du prix, fais la conversation poliment, et navigue en répondant à ses questions.",
    },
    starterPrompt: {
      en: "Hello! Where are you headed today?",
      ar: "مرحباً! إلى أين تتجه اليوم؟",
      fr: "Bonjour ! Où allez-vous aujourd'hui ?",
    },
    tips: ["Give your destination", "Ask how long it takes", "Ask about the price", "Chat about the city"],
  },
  {
    id: "cafe",
    emoji: "☕",
    title: "Coffee Shop",
    description: "Order drinks, customise your order, chat with the barista",
    difficulty: "beginner",
    availableLanguages: ["en", "ar", "fr"],
    aiRole: {
      en: "You are a cheerful barista at a cosy coffee shop. Take orders, explain the menu, customise drinks to the customer's liking, and have friendly small talk.",
      ar: "أنتَ بريستا مبتهج في مقهى مريح. خذ الطلبات، اشرح القائمة، خصِّص المشروبات حسب رغبة العميل، وتحدث بود.",
      fr: "Tu es un barista joyeux dans un café cosy. Prends les commandes, explique le menu, personnalise les boissons selon les préférences du client, et fais la conversation amicalement.",
    },
    starterPrompt: {
      en: "Hi there! Welcome! What can I get started for you?",
      ar: "أهلاً! مرحباً! ماذا يمكنني أن أحضر لك؟",
      fr: "Salut ! Bienvenue ! Qu'est-ce que je vous prépare ?",
    },
    tips: ["Order a coffee", "Customise milk or sugar", "Ask about pastries", "Order to go or stay"],
  },
];
