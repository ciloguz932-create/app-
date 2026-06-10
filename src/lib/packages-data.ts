// Curated, downloadable content packages: vocabulary + sentence patterns +
// topic readings bundled per language. Installing a package copies the
// vocabulary and patterns into the user's card deck and publishes the
// readings to the shared reading library.

export interface PackageVocab {
  word: string;
  translation: string;
  example?: string;
}

export interface PackagePattern {
  pattern: string;
  meaning: string;
  example: string;
}

export interface PackageReading {
  title: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: { question: string; options: string[]; answer: number }[];
}

export interface ContentPackage {
  id: string;
  title: string;
  description: string;
  language: "en" | "ar" | "fr";
  level: "beginner" | "intermediate" | "advanced";
  emoji: string;
  color: string;
  vocabulary: PackageVocab[];
  patterns: PackagePattern[];
  readings: PackageReading[];
}

export const CONTENT_PACKAGES: ContentPackage[] = [
  {
    id: "en-travel",
    title: "Seyahat İngilizcesi",
    description:
      "Havalimanından otele, restorandan acil durumlara — yurt dışında seni rahat ettirecek temel kelimeler ve hazır kalıplar.",
    language: "en",
    level: "beginner",
    emoji: "✈️",
    color: "#0E7490",
    vocabulary: [
      { word: "boarding pass", translation: "biniş kartı", example: "Please have your boarding pass ready at the gate." },
      { word: "luggage", translation: "bagaj, valiz", example: "My luggage was too heavy, so I paid an extra fee." },
      { word: "customs", translation: "gümrük", example: "We waited in line at customs for half an hour." },
      { word: "departure", translation: "kalkış, gidiş", example: "The departure time has been changed to 9:45." },
      { word: "arrival", translation: "varış, geliş", example: "Our arrival in London was delayed by fog." },
      { word: "reservation", translation: "rezervasyon", example: "I have a reservation under the name Yılmaz." },
      { word: "vacancy", translation: "boş oda", example: "The hotel had no vacancy during the festival." },
      { word: "reception", translation: "resepsiyon", example: "You can leave your key at the reception." },
      { word: "currency exchange", translation: "döviz bürosu", example: "Is there a currency exchange near the station?" },
      { word: "round trip", translation: "gidiş-dönüş", example: "A round trip ticket is cheaper than two singles." },
      { word: "sightseeing", translation: "gezi, tur", example: "We spent the whole day sightseeing in the old town." },
      { word: "itinerary", translation: "gezi planı, güzergah", example: "Our itinerary includes three cities in five days." },
      { word: "refund", translation: "para iadesi", example: "I asked for a refund because the tour was cancelled." },
      { word: "delayed", translation: "rötarlı, gecikmiş", example: "The flight is delayed by two hours." },
      { word: "directions", translation: "yol tarifi", example: "Could you give me directions to the museum?" },
    ],
    patterns: [
      { pattern: "Could you tell me how to get to ...?", meaning: "...'e nasıl gidebilirim, söyler misiniz?", example: "Could you tell me how to get to the train station?" },
      { pattern: "I'd like to check in, please.", meaning: "Giriş yapmak istiyorum, lütfen.", example: "Good evening, I'd like to check in, please. The name is Demir." },
      { pattern: "How much does ... cost?", meaning: "... ne kadar?", example: "How much does a taxi to the airport cost?" },
      { pattern: "Is breakfast included?", meaning: "Kahvaltı dahil mi?", example: "The room looks great — is breakfast included?" },
      { pattern: "I have a connecting flight to ...", meaning: "...'e aktarmalı uçuşum var.", example: "I have a connecting flight to Rome in 50 minutes." },
      { pattern: "Can I get the bill, please?", meaning: "Hesabı alabilir miyim, lütfen?", example: "Everything was delicious. Can I get the bill, please?" },
      { pattern: "I've lost my ...", meaning: "...'imi kaybettim.", example: "Excuse me, I've lost my passport. Who should I talk to?" },
      { pattern: "What time does ... open / close?", meaning: "... kaçta açılıyor / kapanıyor?", example: "What time does the museum close on Sundays?" },
      { pattern: "Do you have anything cheaper?", meaning: "Daha ucuz bir şeyiniz var mı?", example: "This room is a bit expensive. Do you have anything cheaper?" },
      { pattern: "I'm allergic to ...", meaning: "...'e alerjim var.", example: "I'm allergic to peanuts — does this dish contain any?" },
    ],
    readings: [
      {
        title: "A Smooth Trip Through the Airport",
        difficulty: "beginner",
        content: `Airports can feel stressful, but a little preparation makes everything easier. Arrive at least two hours before an international flight. Keep your passport and boarding pass in the same pocket so you never search for them.

At check-in, you drop off your luggage. Most airlines allow one suitcase of about 23 kilograms. If your bag is heavier, you pay an extra fee. After check-in comes security. Put liquids in a small clear bag and take your laptop out of your backpack.

Next, find your gate. Screens around the airport show each flight, its gate number, and its status. The word "delayed" means the plane will leave later than planned; "boarding" means you should go to the gate now.

When you land in a new country, follow the signs to passport control and then to baggage claim. If you cannot find your suitcase, go to the lost luggage desk and show your baggage tag. Finally, at customs, choose the green channel if you have nothing to declare.

Travel becomes much easier when you know these steps — and the English words for each of them.`,
        questions: [
          { question: "How early should you arrive for an international flight?", options: ["30 minutes", "One hour", "At least two hours", "Four hours"], answer: 2 },
          { question: "What does 'boarding' mean on the airport screen?", options: ["The flight is cancelled", "Go to the gate now", "The plane has landed", "The gate has changed"], answer: 1 },
          { question: "Where should you go if your suitcase is missing?", options: ["Passport control", "The green channel", "The lost luggage desk", "The check-in counter"], answer: 2 },
        ],
      },
    ],
  },
  {
    id: "en-daily",
    title: "Günlük Konuşma Kalıpları",
    description:
      "Selamlaşma, küçük sohbet (small talk), rica ve teşekkür — günlük hayatta en sık kullanılan doğal İngilizce kalıpları.",
    language: "en",
    level: "beginner",
    emoji: "💬",
    color: "#A51C30",
    vocabulary: [
      { word: "errand", translation: "ayak işi, kısa iş", example: "I have to run a few errands before noon." },
      { word: "catch up", translation: "hasret gidermek, yetişmek", example: "Let's grab a coffee and catch up this weekend." },
      { word: "hang out", translation: "takılmak, vakit geçirmek", example: "We used to hang out at the park after school." },
      { word: "grab a bite", translation: "bir şeyler atıştırmak", example: "Do you want to grab a bite before the movie?" },
      { word: "swing by", translation: "uğramak", example: "I'll swing by your place around six." },
      { word: "heads up", translation: "ön bilgi, uyarı", example: "Just a heads up — the meeting moved to Friday." },
      { word: "no big deal", translation: "önemli değil, sorun değil", example: "Don't worry about the spill, it's no big deal." },
      { word: "long time no see", translation: "görüşmeyeli uzun zaman oldu", example: "Hey, long time no see! How have you been?" },
      { word: "make it", translation: "yetişmek, gelebilmek", example: "Sorry, I can't make it to dinner tonight." },
      { word: "run late", translation: "gecikmek", example: "Traffic is terrible — I'm running late." },
      { word: "keep in touch", translation: "irtibatta kalmak", example: "It was great meeting you. Let's keep in touch!" },
      { word: "take a rain check", translation: "başka zamana ertelemek", example: "I'm exhausted tonight — can I take a rain check?" },
      { word: "figure out", translation: "çözmek, anlamak", example: "I'm still trying to figure out the new app." },
      { word: "look forward to", translation: "dört gözle beklemek", example: "I look forward to seeing you next week." },
      { word: "small talk", translation: "havadan sudan sohbet", example: "He's great at small talk with strangers." },
    ],
    patterns: [
      { pattern: "How's it going?", meaning: "Nasıl gidiyor?", example: "Hey Sarah! How's it going?" },
      { pattern: "What have you been up to?", meaning: "Nelerle meşguldün?", example: "I haven't seen you in ages — what have you been up to?" },
      { pattern: "Would you mind ...?", meaning: "... rica etsem? (kibar rica)", example: "Would you mind closing the window? It's a bit cold." },
      { pattern: "I was wondering if ...", meaning: "Acaba ... mı diye merak ediyordum.", example: "I was wondering if you could help me move on Saturday." },
      { pattern: "That works for me.", meaning: "Bana uyar.", example: "Seven o'clock at the café? That works for me." },
      { pattern: "I'll let you know.", meaning: "Sana haber veririm.", example: "I'm not sure about Sunday yet — I'll let you know." },
      { pattern: "It's up to you.", meaning: "Sana kalmış / sen bilirsin.", example: "Pizza or sushi? It's up to you." },
      { pattern: "I didn't catch that.", meaning: "Anlayamadım / duyamadım.", example: "Sorry, I didn't catch that — could you say it again?" },
      { pattern: "Speaking of which, ...", meaning: "Bundan bahsetmişken, ...", example: "Speaking of which, did you ever finish that book?" },
      { pattern: "To be honest, ...", meaning: "Dürüst olmak gerekirse, ...", example: "To be honest, I didn't enjoy the movie that much." },
      { pattern: "It slipped my mind.", meaning: "Aklımdan çıkmış.", example: "Oh no, the meeting! It completely slipped my mind." },
      { pattern: "Sounds good!", meaning: "Kulağa hoş geliyor / tamamdır!", example: "Dinner at eight? Sounds good!" },
    ],
    readings: [
      {
        title: "The Art of Small Talk",
        difficulty: "beginner",
        content: `Small talk is light conversation about everyday topics: the weather, weekend plans, food, or sports. Many learners think small talk is unimportant, but it does a big job. It builds trust between people before deeper conversations happen.

Good small talk starts with open questions. Instead of "Did you have a nice weekend?", try "What did you do over the weekend?" Open questions invite longer answers and keep the conversation moving.

Listening matters more than speaking. When someone mentions a detail — a trip, a hobby, a pet — ask about it. People enjoy talking about their own lives, and your questions show genuine interest.

There are also safe topics and risky ones. Weather, travel, food, and entertainment are safe almost everywhere. Money, politics, and personal health are risky with people you have just met.

Finally, learn a few exit lines. "It was great talking to you" or "I should get going, but let's catch up soon" let you leave politely. With a little practice, small talk stops feeling small — it becomes the door to real friendship.`,
        questions: [
          { question: "What is the main job of small talk, according to the text?", options: ["To practice grammar", "To build trust between people", "To fill silence", "To discuss politics"], answer: 1 },
          { question: "Which question style keeps a conversation moving?", options: ["Yes/no questions", "Open questions", "Personal questions", "Rhetorical questions"], answer: 1 },
          { question: "Which topic is described as risky with new people?", options: ["Weather", "Food", "Money", "Travel"], answer: 2 },
        ],
      },
    ],
  },
  {
    id: "en-interview",
    title: "İş Görüşmesi İngilizcesi",
    description:
      "Kendini tanıtma, güçlü yönlerini anlatma ve maaş konuşması — İngilizce mülakatlarda öne çıkaran kelime ve kalıplar.",
    language: "en",
    level: "intermediate",
    emoji: "💼",
    color: "#1D4ED8",
    vocabulary: [
      { word: "strength", translation: "güçlü yön", example: "My greatest strength is staying calm under pressure." },
      { word: "weakness", translation: "zayıf yön", example: "I see public speaking as a weakness I'm actively improving." },
      { word: "accomplish", translation: "başarmak, tamamlamak", example: "We accomplished the migration two weeks ahead of schedule." },
      { word: "deadline", translation: "son teslim tarihi", example: "I've never missed a deadline in my current role." },
      { word: "teamwork", translation: "takım çalışması", example: "Strong teamwork helped us double our output." },
      { word: "leadership", translation: "liderlik", example: "She showed leadership by mentoring the new hires." },
      { word: "initiative", translation: "inisiyatif", example: "He took the initiative to automate the weekly reports." },
      { word: "adaptable", translation: "uyumlu, esnek", example: "I'm adaptable and learn new tools quickly." },
      { word: "achievement", translation: "başarı", example: "My proudest achievement was launching the mobile app." },
      { word: "notice period", translation: "ihbar süresi", example: "My notice period at my current company is one month." },
      { word: "salary expectation", translation: "maaş beklentisi", example: "Could you share the range before I give my salary expectation?" },
      { word: "responsibilities", translation: "sorumluluklar", example: "My responsibilities included budgeting and reporting." },
      { word: "qualification", translation: "nitelik, yeterlilik", example: "She has every qualification listed in the job posting." },
      { word: "references", translation: "referanslar", example: "I can provide references from my last two managers." },
      { word: "career path", translation: "kariyer yolu", example: "What does the career path look like for this position?" },
    ],
    patterns: [
      { pattern: "I have ... years of experience in ...", meaning: "... alanında ... yıl deneyimim var.", example: "I have five years of experience in digital marketing." },
      { pattern: "I'm particularly proud of ...", meaning: "Özellikle ... ile gurur duyuyorum.", example: "I'm particularly proud of reducing costs by 20% last year." },
      { pattern: "In my previous role, I was responsible for ...", meaning: "Önceki görevimde ...'den sorumluydum.", example: "In my previous role, I was responsible for a team of six." },
      { pattern: "One challenge I faced was ... and I solved it by ...", meaning: "Karşılaştığım bir zorluk ...'tu ve bunu ... yaparak çözdüm.", example: "One challenge I faced was a tight deadline, and I solved it by reprioritizing tasks." },
      { pattern: "I thrive in environments where ...", meaning: "... olan ortamlarda başarılı olurum.", example: "I thrive in environments where feedback is direct and frequent." },
      { pattern: "What does success look like in this role?", meaning: "Bu pozisyonda başarı nasıl tanımlanıyor?", example: "Before we finish — what does success look like in this role?" },
      { pattern: "I'm looking for an opportunity to ...", meaning: "... fırsatı arıyorum.", example: "I'm looking for an opportunity to grow into a leadership position." },
      { pattern: "That's a great question.", meaning: "Bu harika bir soru. (düşünme süresi kazandırır)", example: "That's a great question — let me think of a concrete example." },
      { pattern: "My salary expectation is in the range of ...", meaning: "Maaş beklentim ... aralığında.", example: "My salary expectation is in the range of 45 to 50 thousand." },
      { pattern: "When can I expect to hear back?", meaning: "Ne zaman dönüş bekleyebilirim?", example: "Thank you for your time — when can I expect to hear back?" },
    ],
    readings: [
      {
        title: "Answering the Hardest Interview Question",
        difficulty: "intermediate",
        content: `"Tell me about yourself." It sounds simple, yet this opening question decides the tone of the whole interview. Many candidates make the same mistake: they recite their CV line by line. The interviewer has already read it.

A stronger approach is the present-past-future formula. Start with the present: your current role and what you do best. Move to the past: one or two experiences that shaped your skills — ideally with a measurable result, like "I led a project that cut delivery time by 30%." Finish with the future: why this position is the logical next step.

Keep the answer under two minutes. Long answers bury your strengths in detail, while short ones suggest a lack of preparation. Practice out loud, not silently; your mouth needs the rehearsal as much as your mind.

One more secret: tailor the story to the company. If the job values customer contact, highlight customer moments. If it values independence, highlight projects you drove alone. The question may be about you, but the best answer is always about the match between you and the role.`,
        questions: [
          { question: "What common mistake do candidates make with 'Tell me about yourself'?", options: ["Speaking too quietly", "Reciting their CV line by line", "Asking a question back", "Talking about salary"], answer: 1 },
          { question: "What is the recommended structure for the answer?", options: ["Past-present-future", "Present-past-future", "Future-past-present", "Strengths-weaknesses-goals"], answer: 1 },
          { question: "How long should the answer be?", options: ["30 seconds", "Under two minutes", "Five minutes", "As long as needed"], answer: 1 },
        ],
      },
    ],
  },
  {
    id: "en-academic",
    title: "Akademik Yazım Paketi",
    description:
      "Essay, makale ve sunumlarda kullanılan bağlaçlar, geçiş ifadeleri ve akademik kelime dağarcığı.",
    language: "en",
    level: "advanced",
    emoji: "🎓",
    color: "#7C3AED",
    vocabulary: [
      { word: "hypothesis", translation: "hipotez, varsayım", example: "The data did not support our initial hypothesis." },
      { word: "methodology", translation: "yöntem bilimi, metodoloji", example: "The methodology section explains how the survey was conducted." },
      { word: "empirical", translation: "deneysel, ampirik", example: "The claim is backed by strong empirical evidence." },
      { word: "synthesize", translation: "sentezlemek, birleştirmek", example: "A good literature review synthesizes many sources." },
      { word: "implication", translation: "sonuç, çıkarım", example: "The findings have important implications for policy." },
      { word: "criterion", translation: "ölçüt, kriter", example: "Each essay was graded against a clear criterion." },
      { word: "paradigm", translation: "paradigma, model", example: "The discovery caused a paradigm shift in physics." },
      { word: "coherent", translation: "tutarlı, bağdaşık", example: "Your argument must be coherent from start to finish." },
      { word: "cite", translation: "alıntılamak, kaynak göstermek", example: "Always cite the original study, not a summary of it." },
      { word: "plagiarism", translation: "intihal", example: "The university has a zero-tolerance policy on plagiarism." },
      { word: "abstract", translation: "özet (makale özeti)", example: "Read the abstract first to judge if the paper is relevant." },
      { word: "peer review", translation: "hakem değerlendirmesi", example: "The article passed peer review after two revisions." },
    ],
    patterns: [
      { pattern: "This essay argues that ...", meaning: "Bu makale ...'i savunmaktadır.", example: "This essay argues that remote work increases productivity." },
      { pattern: "According to X (2024), ...", meaning: "X'e (2024) göre, ...", example: "According to Chen (2024), sleep quality predicts exam performance." },
      { pattern: "However, this view overlooks ...", meaning: "Ancak bu görüş ...'i göz ardı etmektedir.", example: "However, this view overlooks the role of socioeconomic factors." },
      { pattern: "The findings suggest that ...", meaning: "Bulgular ...'i göstermektedir.", example: "The findings suggest that early intervention is critical." },
      { pattern: "In contrast to previous studies, ...", meaning: "Önceki çalışmaların aksine, ...", example: "In contrast to previous studies, we found no significant effect." },
      { pattern: "It is widely accepted that ...", meaning: "...'in yaygın kabul gördüğü bilinmektedir.", example: "It is widely accepted that exercise improves mental health." },
      { pattern: "Furthermore, ...", meaning: "Ayrıca / dahası, ...", example: "Furthermore, the sample size was larger than in earlier work." },
      { pattern: "Taken together, these results indicate ...", meaning: "Bir bütün olarak, bu sonuçlar ...'i işaret etmektedir.", example: "Taken together, these results indicate a causal relationship." },
      { pattern: "Further research is needed to ...", meaning: "...'i anlamak için daha fazla araştırma gereklidir.", example: "Further research is needed to confirm these effects in adults." },
      { pattern: "In conclusion, ...", meaning: "Sonuç olarak, ...", example: "In conclusion, the evidence supports a cautious optimism." },
    ],
    readings: [
      {
        title: "Why Academic Writing Sounds Different",
        difficulty: "advanced",
        content: `Academic writing is not simply formal writing; it is a distinct genre with its own rules of evidence and voice. Three features separate it from everyday prose: hedging, citation, and structure.

Hedging is the art of calibrated claims. A journalist may write "coffee prevents cancer," but a researcher writes "the data suggest an association between coffee consumption and reduced risk." The hedge is not weakness — it is precision. It tells the reader exactly how much confidence the evidence supports.

Citation, the second feature, turns writing into a conversation. Every claim is anchored to a source, allowing readers to trace, verify, and challenge the argument. This is why plagiarism is treated so severely: it breaks the chain of accountability that makes scholarship trustworthy.

Finally, structure carries the reader. The classic pattern — introduction, literature review, methodology, results, discussion — is predictable by design. Predictability frees the reader's attention for the ideas themselves.

Learners often try to sound academic by using long words. The opposite usually works better: simple words arranged in disciplined structures, with claims sized exactly to the evidence. Clarity, not complexity, is the true register of scholarship.`,
        questions: [
          { question: "What does 'hedging' mean in academic writing?", options: ["Avoiding the topic", "Making calibrated, precise claims", "Using long words", "Hiding weak data"], answer: 1 },
          { question: "Why is plagiarism treated severely, according to the text?", options: ["It is illegal everywhere", "It breaks the chain of accountability", "It wastes the reader's time", "It shortens the paper"], answer: 1 },
          { question: "What is described as the true register of scholarship?", options: ["Complexity", "Formality", "Clarity", "Length"], answer: 2 },
        ],
      },
    ],
  },
  {
    id: "fr-starter",
    title: "Fransızca Başlangıç Paketi",
    description:
      "Selamlaşma, kafe siparişi ve yön sorma — Fransızcaya en doğal yerden başla.",
    language: "fr",
    level: "beginner",
    emoji: "🥐",
    color: "#B45309",
    vocabulary: [
      { word: "bonjour", translation: "merhaba, günaydın", example: "Bonjour madame, comment allez-vous ?" },
      { word: "s'il vous plaît", translation: "lütfen", example: "Un café, s'il vous plaît." },
      { word: "merci beaucoup", translation: "çok teşekkürler", example: "Merci beaucoup pour votre aide !" },
      { word: "excusez-moi", translation: "affedersiniz", example: "Excusez-moi, où est la gare ?" },
      { word: "l'addition", translation: "hesap", example: "L'addition, s'il vous plaît." },
      { word: "le petit déjeuner", translation: "kahvaltı", example: "Le petit déjeuner est servi à huit heures." },
      { word: "la gare", translation: "tren istasyonu", example: "La gare est à dix minutes à pied." },
      { word: "à droite", translation: "sağda, sağa", example: "Tournez à droite après la banque." },
      { word: "à gauche", translation: "solda, sola", example: "La pharmacie est à gauche de l'église." },
      { word: "tout droit", translation: "dümdüz ileri", example: "Continuez tout droit jusqu'au pont." },
      { word: "combien", translation: "ne kadar, kaç", example: "C'est combien, ce fromage ?" },
      { word: "je voudrais", translation: "istiyorum (kibar)", example: "Je voudrais un croissant et un thé." },
      { word: "l'eau", translation: "su", example: "Une bouteille d'eau, s'il vous plaît." },
      { word: "le marché", translation: "pazar, çarşı", example: "Le marché est ouvert le samedi matin." },
      { word: "enchanté", translation: "tanıştığımıza memnun oldum", example: "Enchanté ! Moi, c'est Pierre." },
    ],
    patterns: [
      { pattern: "Je m'appelle ...", meaning: "Benim adım ...", example: "Bonjour, je m'appelle Ayşe." },
      { pattern: "Je ne parle pas bien français.", meaning: "Fransızcayı iyi konuşamıyorum.", example: "Désolée, je ne parle pas bien français. Parlez-vous anglais ?" },
      { pattern: "Où est ... ?", meaning: "... nerede?", example: "Où est la station de métro la plus proche ?" },
      { pattern: "Je voudrais ..., s'il vous plaît.", meaning: "... istiyorum, lütfen.", example: "Je voudrais une baguette, s'il vous plaît." },
      { pattern: "C'est combien ?", meaning: "Bu ne kadar?", example: "Cette carte postale, c'est combien ?" },
      { pattern: "Pouvez-vous répéter, s'il vous plaît ?", meaning: "Tekrar eder misiniz, lütfen?", example: "Pardon, pouvez-vous répéter plus lentement, s'il vous plaît ?" },
      { pattern: "Qu'est-ce que vous me conseillez ?", meaning: "Bana ne tavsiye edersiniz?", example: "Je ne connais pas ce menu — qu'est-ce que vous me conseillez ?" },
      { pattern: "À quelle heure ... ?", meaning: "... saat kaçta?", example: "À quelle heure part le train pour Lyon ?" },
    ],
    readings: [
      {
        title: "Un Matin à Paris",
        difficulty: "beginner",
        content: `Il est huit heures du matin à Paris. Léa entre dans une petite boulangerie près de chez elle. « Bonjour madame ! » dit le boulanger avec un grand sourire. « Bonjour ! Je voudrais un croissant et une baguette, s'il vous plaît », répond Léa.

Le boulanger met le croissant dans un petit sac. « Et avec ceci ? » demande-t-il. « C'est tout, merci. C'est combien ? » « Trois euros cinquante, s'il vous plaît. »

Léa paie et sort dans la rue. Le ciel est bleu et les cafés ouvrent leurs terrasses. Elle s'assoit et commande un café crème. À la table à côté, un touriste demande : « Excusez-moi, où est le musée du Louvre ? » Léa sourit : « Continuez tout droit, puis tournez à gauche après le pont. C'est à quinze minutes à pied. »

« Merci beaucoup ! » dit le touriste. « De rien, bonne journée ! » répond Léa. Elle boit son café et regarde la ville se réveiller. Un matin simple, mais parfait.`,
        questions: [
          { question: "Qu'est-ce que Léa achète à la boulangerie ?", options: ["Un croissant et une baguette", "Deux croissants", "Un gâteau", "Un sandwich"], answer: 0 },
          { question: "Combien coûtent ses achats ?", options: ["Deux euros", "Trois euros cinquante", "Cinq euros", "Quatre euros"], answer: 1 },
          { question: "Où va le touriste ?", options: ["À la gare", "Au musée du Louvre", "À la boulangerie", "À l'hôtel"], answer: 1 },
        ],
      },
    ],
  },
  {
    id: "ar-daily",
    title: "Arapça Günlük Hayat",
    description:
      "Selamlaşma, hal hatır sorma ve alışveriş — günlük Arapçanın en sık kullanılan kelime ve kalıpları.",
    language: "ar",
    level: "beginner",
    emoji: "🌙",
    color: "#047857",
    vocabulary: [
      { word: "السلام عليكم", translation: "selam (size esenlik olsun)", example: "السلام عليكم، كيف حالك؟" },
      { word: "صباح الخير", translation: "günaydın", example: "صباح الخير يا أستاذ!" },
      { word: "مساء الخير", translation: "iyi akşamlar", example: "مساء الخير، تفضل بالجلوس." },
      { word: "شكراً جزيلاً", translation: "çok teşekkür ederim", example: "شكراً جزيلاً على مساعدتك." },
      { word: "عفواً", translation: "rica ederim / affedersiniz", example: "عفواً، أين المحطة؟" },
      { word: "من فضلك", translation: "lütfen", example: "كوب ماء من فضلك." },
      { word: "كم الثمن؟", translation: "fiyatı ne kadar?", example: "هذا الكتاب، كم الثمن؟" },
      { word: "السوق", translation: "çarşı, pazar", example: "أذهب إلى السوق كل يوم جمعة." },
      { word: "الماء", translation: "su", example: "أريد زجاجة ماء باردة." },
      { word: "الخبز", translation: "ekmek", example: "الخبز الطازج لذيذ جداً." },
      { word: "اليوم", translation: "bugün", example: "الطقس جميل اليوم." },
      { word: "غداً", translation: "yarın", example: "سأسافر إلى إسطنبول غداً." },
      { word: "أين", translation: "nerede", example: "أين أقرب مطعم؟" },
      { word: "بكم هذا؟", translation: "bu kaça?", example: "بكم هذا القميص؟" },
      { word: "مع السلامة", translation: "güle güle, hoşça kal", example: "إلى اللقاء، مع السلامة!" },
    ],
    patterns: [
      { pattern: "كيف حالك؟", meaning: "Nasılsın?", example: "أهلاً يا أحمد، كيف حالك؟" },
      { pattern: "أنا بخير، الحمد لله.", meaning: "İyiyim, Allah'a şükür.", example: "كيف حالك؟ — أنا بخير، الحمد لله." },
      { pattern: "ما اسمك؟", meaning: "Adın ne?", example: "ما اسمك؟ — اسمي مريم." },
      { pattern: "أنا من تركيا.", meaning: "Ben Türkiye'denim.", example: "من أين أنت؟ — أنا من تركيا." },
      { pattern: "لا أتكلم العربية جيداً.", meaning: "Arapçayı iyi konuşamıyorum.", example: "عفواً، لا أتكلم العربية جيداً. هل تتكلم الإنجليزية؟" },
      { pattern: "أريد ... من فضلك.", meaning: "... istiyorum, lütfen.", example: "أريد كيلو تفاح من فضلك." },
      { pattern: "هل يمكنك مساعدتي؟", meaning: "Bana yardım edebilir misin?", example: "عفواً، هل يمكنك مساعدتي؟ أنا تائه." },
      { pattern: "غالٍ جداً! هل يوجد أرخص؟", meaning: "Çok pahalı! Daha ucuzu var mı?", example: "مئة ليرة؟ غالٍ جداً! هل يوجد أرخص؟" },
    ],
    readings: [
      {
        title: "في السوق",
        difficulty: "beginner",
        content: `يذهب عمر إلى السوق صباح يوم الجمعة. السوق قريب من بيته، والطقس اليوم جميل. يقول البائع: «صباح الخير! تفضل، عندي فواكه طازجة.»

يسأل عمر: «بكم كيلو التفاح؟» يجيب البائع: «عشر ليرات فقط.» يبتسم عمر ويقول: «أريد كيلوين من فضلك، وكيلو موز أيضاً.»

بعد ذلك، يذهب عمر إلى المخبز. رائحة الخبز الطازج جميلة جداً. يشتري ثلاثة أرغفة ويقول للخباز: «شكراً جزيلاً!» يرد الخباز: «عفواً، مع السلامة!»

في طريق العودة، يقابل عمر صديقه خالد. «السلام عليكم يا خالد! كيف حالك؟» «وعليكم السلام! أنا بخير، الحمد لله. هل تشرب الشاي معي غداً؟» يقول عمر: «فكرة ممتازة! إلى اللقاء غداً.»

يرجع عمر إلى البيت سعيداً. يوم بسيط، لكنه جميل.`,
        questions: [
          { question: "متى يذهب عمر إلى السوق؟", options: ["صباح يوم الجمعة", "مساء يوم السبت", "يوم الأحد", "كل يوم"], answer: 0 },
          { question: "كم كيلو تفاح يشتري عمر؟", options: ["كيلو واحد", "كيلوين", "ثلاثة كيلوات", "نصف كيلو"], answer: 1 },
          { question: "ماذا سيفعل عمر وخالد غداً؟", options: ["يذهبان إلى السوق", "يشربان الشاي", "يلعبان كرة القدم", "يسافران"], answer: 1 },
        ],
      },
    ],
  },
];

export function getPackage(id: string): ContentPackage | undefined {
  return CONTENT_PACKAGES.find((p) => p.id === id);
}
