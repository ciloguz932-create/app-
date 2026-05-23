import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const require = createRequire(import.meta.url);
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

// Load .env manually
import { readFileSync } from "fs";
try {
  const envContent = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch {}

const { PrismaClient } = await import("../src/generated/prisma/client.js");

const libsql = createClient({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

// ---- Seed data inline ----
const ENGLISH_WORDS = [
  { word: "ambiguous", translation: "belirsiz, çift anlamlı", language: "en", example: "The instructions were ambiguous and confusing." },
  { word: "benevolent", translation: "hayırsever, iyiliksever", language: "en", example: "She had a benevolent smile that put everyone at ease." },
  { word: "candid", translation: "açık sözlü, dürüst", language: "en", example: "I appreciate your candid feedback on my work." },
  { word: "diligent", translation: "çalışkan, gayretli", language: "en", example: "She was diligent in her studies and always met deadlines." },
  { word: "eloquent", translation: "belagatli, etkili konuşan", language: "en", example: "The eloquent speaker moved the crowd with her words." },
  { word: "frugal", translation: "tutumlu", language: "en", example: "Living frugally allowed him to save money for travel." },
  { word: "gratitude", translation: "minnet, şükran", language: "en", example: "She expressed her gratitude with a heartfelt letter." },
  { word: "humility", translation: "alçakgönüllülük", language: "en", example: "True wisdom begins with humility." },
  { word: "intricate", translation: "karmaşık, girift", language: "en", example: "The intricate pattern on the carpet was breathtaking." },
  { word: "jubilant", translation: "sevinçli, coşkulu", language: "en", example: "The team was jubilant after winning the championship." },
  { word: "keen", translation: "istekli, keskin", language: "en", example: "She has a keen interest in astronomy." },
  { word: "lucid", translation: "anlaşılır, berrak", language: "en", example: "His lucid explanation made the concept easy to grasp." },
  { word: "meticulous", translation: "titiz, dikkatli", language: "en", example: "She is meticulous about keeping detailed records." },
  { word: "nuance", translation: "nüans, ince fark", language: "en", example: "Understanding cultural nuances is key to good communication." },
  { word: "perseverance", translation: "sebat, azim", language: "en", example: "Success requires patience and perseverance." },
  { word: "resilient", translation: "esnek, dirençli", language: "en", example: "Children are often remarkably resilient after setbacks." },
  { word: "serene", translation: "sakin, huzurlu", language: "en", example: "The mountain lake was absolutely serene at dawn." },
  { word: "tenacious", translation: "inatçı, kararlı", language: "en", example: "Her tenacious spirit helped her overcome every obstacle." },
  { word: "ubiquitous", translation: "her yerde olan, yaygın", language: "en", example: "Smartphones have become ubiquitous in modern life." },
  { word: "vivid", translation: "canlı, parlak", language: "en", example: "She has vivid memories of her childhood summers." },
  { word: "wistful", translation: "hüzünlü özlemli", language: "en", example: "He gave a wistful look at the old photographs." },
  { word: "yearning", translation: "özlem, derin arzu", language: "en", example: "She felt a deep yearning to return home." },
  { word: "advocate", translation: "savunucu, destekçi", language: "en", example: "She is a strong advocate for children's education." },
  { word: "brevity", translation: "kısalık, özlülük", language: "en", example: "Brevity is the soul of wit." },
  { word: "compassion", translation: "şefkat, merhamet", language: "en", example: "He showed great compassion to those in need." },
  { word: "deduce", translation: "sonuç çıkarmak", language: "en", example: "From the clues, we can deduce what happened." },
  { word: "endeavor", translation: "çaba, girişim", language: "en", example: "Learning a language is a worthwhile endeavor." },
  { word: "flourish", translation: "gelişmek, serpilmek", language: "en", example: "Plants flourish when given the right conditions." },
  { word: "genuine", translation: "gerçek, içten", language: "en", example: "Her genuine smile made everyone feel welcome." },
  { word: "harmonious", translation: "uyumlu, ahenkli", language: "en", example: "The harmonious blend of colors was stunning." },
  { word: "illuminate", translation: "aydınlatmak", language: "en", example: "Her research illuminated previously unknown aspects of history." },
  { word: "inevitable", translation: "kaçınılmaz", language: "en", example: "Change is inevitable in any growing organization." },
  { word: "linger", translation: "oyalanmak, kalmak", language: "en", example: "The smell of coffee lingered in the air." },
  { word: "nourish", translation: "beslemek", language: "en", example: "A good book can nourish the mind." },
  { word: "optimistic", translation: "iyimser", language: "en", example: "Despite the challenges, she remained optimistic." },
  { word: "perceive", translation: "algılamak, fark etmek", language: "en", example: "How we perceive problems affects how we solve them." },
  { word: "profound", translation: "derin, köklü", language: "en", example: "Reading that book had a profound impact on her life." },
  { word: "resilience", translation: "dayanıklılık, esneklik", language: "en", example: "Resilience is the ability to bounce back from adversity." },
  { word: "soothe", translation: "yatıştırmak", language: "en", example: "Music can soothe a troubled mind." },
  { word: "thrive", translation: "gelişmek, başarmak", language: "en", example: "Creative minds thrive in open environments." },
  { word: "valor", translation: "yiğitlik, cesaret", language: "en", example: "The soldier was honored for his valor in battle." },
  { word: "wisdom", translation: "bilgelik", language: "en", example: "Experience brings wisdom that books alone cannot teach." },
  { word: "zeal", translation: "şevk, gayret", language: "en", example: "She approached every task with remarkable zeal." },
  { word: "achieve", translation: "başarmak", language: "en", example: "Hard work helps you achieve your goals." },
  { word: "adapt", translation: "uyum sağlamak", language: "en", example: "Animals adapt to their environment over time." },
  { word: "anticipate", translation: "beklemek, tahmin etmek", language: "en", example: "We anticipate great results from this project." },
  { word: "challenge", translation: "zorluk, meydan okuma", language: "en", example: "Every challenge is an opportunity to grow." },
  { word: "consistent", translation: "tutarlı", language: "en", example: "Consistent practice leads to improvement." },
  { word: "cultivate", translation: "geliştirmek", language: "en", example: "You can cultivate good habits with patience." },
  { word: "devote", translation: "adamak", language: "en", example: "She devoted her life to scientific research." },
  { word: "diverse", translation: "çeşitli", language: "en", example: "The city has a diverse cultural landscape." },
  { word: "endure", translation: "dayanmak, sürmek", language: "en", example: "Great art endures through the ages." },
  { word: "enhance", translation: "geliştirmek, artırmak", language: "en", example: "Travel can enhance your understanding of the world." },
  { word: "explore", translation: "keşfetmek", language: "en", example: "Children naturally love to explore." },
  { word: "foundation", translation: "temel", language: "en", example: "Education is the foundation of opportunity." },
  { word: "freedom", translation: "özgürlük", language: "en", example: "Freedom of expression is fundamental to democracy." },
  { word: "generosity", translation: "cömertlik", language: "en", example: "Her generosity touched everyone around her." },
  { word: "growth", translation: "büyüme, gelişme", language: "en", example: "Personal growth requires honest self-reflection." },
  { word: "inspire", translation: "ilham vermek", language: "en", example: "Great teachers inspire students to think freely." },
  { word: "integrity", translation: "dürüstlük, bütünlük", language: "en", example: "Act with integrity, even when no one is watching." },
  { word: "journey", translation: "yolculuk", language: "en", example: "Learning a language is a lifelong journey." },
  { word: "knowledge", translation: "bilgi", language: "en", example: "Knowledge opens doors that stay closed to ignorance." },
  { word: "legacy", translation: "miras", language: "en", example: "She left behind a lasting legacy of kindness." },
  { word: "mindful", translation: "bilinçli, dikkatli", language: "en", example: "Being mindful helps reduce stress and anxiety." },
  { word: "passion", translation: "tutku", language: "en", example: "Follow your passion and the work will not feel hard." },
  { word: "perspective", translation: "bakış açısı", language: "en", example: "Travel gives you a broader perspective on life." },
  { word: "potential", translation: "potansiyel", language: "en", example: "Every student has the potential to succeed." },
  { word: "purpose", translation: "amaç", language: "en", example: "A sense of purpose gives life meaning." },
  { word: "reflect", translation: "düşünmek, yansıtmak", language: "en", example: "Take time to reflect on your experiences." },
  { word: "transform", translation: "dönüştürmek", language: "en", example: "Education has the power to transform lives." },
  { word: "vision", translation: "vizyon, hayal", language: "en", example: "A clear vision helps guide your decisions." },
  { word: "wonder", translation: "merak, hayranlık", language: "en", example: "Children look at the world with a sense of wonder." },
];

const ARABIC_WORDS = [
  { word: "كِتَاب", translation: "kitap / book", language: "ar", example: "أَقرأُ كِتَاباً كُلَّ أُسبوع." },
  { word: "مَعرِفَة", translation: "bilgi / knowledge", language: "ar", example: "المَعرِفَةُ نُور." },
  { word: "صَبر", translation: "sabır / patience", language: "ar", example: "الصَّبرُ مِفتاحُ الفَرَج." },
  { word: "حُلم", translation: "rüya, hayal / dream", language: "ar", example: "لديه حُلمٌ كَبير." },
  { word: "قَلب", translation: "kalp / heart", language: "ar", example: "القَلبُ السَّليمُ هو الكَنز." },
  { word: "عَقل", translation: "akıl / mind", language: "ar", example: "العَقلُ السَّليمُ في الجِسمِ السَّليم." },
  { word: "وَقت", translation: "zaman / time", language: "ar", example: "الوَقتُ ذَهَب." },
  { word: "أَمل", translation: "umut / hope", language: "ar", example: "لا تَفقِد الأَمَل." },
  { word: "نُور", translation: "ışık / light", language: "ar", example: "العِلمُ نُور." },
  { word: "جَمَال", translation: "güzellik / beauty", language: "ar", example: "جَمَالُ الطَّبيعَة رائِع." },
  { word: "سَعَادَة", translation: "mutluluk / happiness", language: "ar", example: "أَتمَنَّى لَكَ السَّعَادَة." },
  { word: "حُرِّيَّة", translation: "özgürlük / freedom", language: "ar", example: "الحُرِّيَّةُ حَقٌّ لِكُلِّ إِنسَان." },
  { word: "مُستَقبَل", translation: "gelecek / future", language: "ar", example: "المُستَقبَلُ مُشرِق." },
  { word: "إرادَة", translation: "irade / willpower", language: "ar", example: "الإِرادَةُ تُحَقِّقُ المُستَحيل." },
  { word: "ثِقَة", translation: "güven / confidence", language: "ar", example: "الثِّقَةُ بِالنَّفسِ مُهِمَّة." },
  { word: "حِكمَة", translation: "bilgelik / wisdom", language: "ar", example: "الحِكمَةُ تَأتي مِن التَّجرِبَة." },
  { word: "شَجَاعَة", translation: "cesaret / courage", language: "ar", example: "الشَّجَاعَةُ فَضيلَة." },
  { word: "رِحلَة", translation: "yolculuk / journey", language: "ar", example: "الحَيَاةُ رِحلَة جَميلَة." },
  { word: "بَيت", translation: "ev / home", language: "ar", example: "البَيتُ مَكانُ الرَّاحَة." },
  { word: "صَديق", translation: "arkadaş / friend", language: "ar", example: "الصَّديقُ الحَقيقي يَقفُ مَعَكَ." },
  { word: "عَائِلَة", translation: "aile / family", language: "ar", example: "العَائِلَةُ هي الأَهَم." },
  { word: "لُغَة", translation: "dil / language", language: "ar", example: "تَعَلُّمُ اللُّغَاتِ يَفتَحُ العُقُول." },
  { word: "ثَقَافَة", translation: "kültür / culture", language: "ar", example: "الثَّقَافَةُ تُثرِي الحَيَاة." },
  { word: "تَعلُّم", translation: "öğrenme / learning", language: "ar", example: "التَّعَلُّمُ رِحلَةٌ لا تَنتَهي." },
  { word: "نَجَاح", translation: "başarı / success", language: "ar", example: "النَّجَاحُ ثَمَرَةُ الجُهد." },
  { word: "سَلام", translation: "barış / peace", language: "ar", example: "نَتَمَنَّى السَّلامَ لِلعالَم." },
  { word: "قُوَّة", translation: "güç / strength", language: "ar", example: "القُوَّةُ الحَقيقِيَّةُ تَأتي مِن الدَّاخِل." },
  { word: "حَيَاة", translation: "hayat / life", language: "ar", example: "الحَيَاةُ قَصيرَة فأَحسِن قَضَاءَها." },
  { word: "يَوم", translation: "gün / day", language: "ar", example: "كُلُّ يَوم فُرصَة جَديدَة." },
  { word: "ماء", translation: "su / water", language: "ar", example: "الماءُ أَساسُ الحَيَاة." },
  { word: "شَمس", translation: "güneş / sun", language: "ar", example: "تَشرُقُ الشَّمسُ كُلَّ صَبَاح." },
  { word: "مَدينَة", translation: "şehir / city", language: "ar", example: "أَسكُنُ في مَدينَة كَبيرَة." },
  { word: "طَعام", translation: "yemek / food", language: "ar", example: "الطَّعامُ العَرَبي لَذيذ." },
  { word: "مُوسيقى", translation: "müzik / music", language: "ar", example: "المُوسيقى تَلمَسُ الأَروَاح." },
  { word: "فَن", translation: "sanat / art", language: "ar", example: "الفَنُّ لُغَةٌ عالَمِيَّة." },
  { word: "شِعر", translation: "şiir / poetry", language: "ar", example: "الشِّعرُ العَرَبي غَنيٌّ وَعَميق." },
  { word: "تَاريخ", translation: "tarih / history", language: "ar", example: "تَاريخُ العَرَب حَضَارَةٌ عَريقَة." },
  { word: "حُبّ", translation: "aşk, sevgi / love", language: "ar", example: "الحُبُّ أَقوى مِن الكَرَاهِيَة." },
  { word: "عَمَل", translation: "iş / work", language: "ar", example: "العَمَلُ الجادُّ يُؤتي ثِمَاره." },
  { word: "صِحَّة", translation: "sağlık / health", language: "ar", example: "الصِّحَّةُ تاجٌ على رُؤوسِ الأَصِحَّاء." },
  { word: "كَلام", translation: "söz / word, speech", language: "ar", example: "الكَلامُ الطَّيِّبُ صَدَقَة." },
  { word: "قِصَّة", translation: "hikaye / story", language: "ar", example: "أُحِبُّ قِراءَةَ القِصَص." },
  { word: "حَقيقَة", translation: "gerçek / truth", language: "ar", example: "الحَقيقَةُ دائِماً تَنتَصِر." },
  { word: "إِنسَان", translation: "insan / human being", language: "ar", example: "كُلُّ إِنسَانٍ يَستَحِقُّ الكَرامَة." },
  { word: "أُمنِيَة", translation: "dilek / wish", language: "ar", example: "أُمنِيَتي أَن أَزورَ العالَم." },
  { word: "ذاكِرَة", translation: "hafıza / memory", language: "ar", example: "الذَّاكِرَةُ الجَيِّدَة نِعمَة." },
  { word: "طَريق", translation: "yol / path", language: "ar", example: "كُلُّ رِحلَة تَبدَأُ بِخُطوَة." },
  { word: "عَطَاء", translation: "cömertlik / giving", language: "ar", example: "العَطَاءُ يُسعِدُ القَلب." },
  { word: "شُكران", translation: "şükran / gratitude", language: "ar", example: "أُعَبِّرُ عَن شُكرَاني." },
  { word: "إِبداع", translation: "yaratıcılık / creativity", language: "ar", example: "الإِبداعُ لا حُدودَ لَه." },
];

const READING_PASSAGES = [
  {
    title: "The Power of Habit",
    language: "en",
    difficulty: "beginner",
    content: `Habits shape our daily lives in powerful ways. A habit is a routine or behavior that we repeat regularly, often without thinking. Scientists say that about 40% of our daily actions are habits, not conscious decisions.

Good habits can improve our health, relationships, and success. For example, reading every day builds knowledge. Exercising regularly strengthens the body. Sleeping at the same time each night improves energy.

The key to forming a new habit is repetition. If you do something every day for a few weeks, it starts to feel natural. Start with small steps. Instead of trying to run for an hour, begin with just ten minutes. Small wins build confidence and momentum.

Breaking bad habits is harder, but possible. The first step is to notice the habit. Then, find a healthy replacement. If you want to stop eating sweets, keep fruit nearby instead.

Remember: habits are not formed overnight. Be patient with yourself and celebrate small progress.`,
    questions: [
      { question: "What percentage of daily actions are habits?", options: ["20%", "30%", "40%", "50%"], answer: 2 },
      { question: "What is the key to forming a new habit?", options: ["Motivation", "Repetition", "Willpower", "Planning"], answer: 1 },
      { question: "What does the article suggest if you want to stop eating sweets?", options: ["Eat less", "Keep fruit nearby", "Avoid the kitchen", "Drink more water"], answer: 1 },
      { question: "How should you start a new exercise habit?", options: ["Run for an hour", "Join a gym", "Begin with ten minutes", "Exercise with a friend"], answer: 2 },
    ],
  },
  {
    title: "The Importance of Sleep",
    language: "en",
    difficulty: "beginner",
    content: `Sleep is one of the most important things we do every day. When we sleep, our bodies repair themselves and our brains process information from the day. Without enough sleep, we feel tired, irritable, and unable to concentrate.

Adults need between seven and nine hours of sleep each night. Children and teenagers need even more. When we do not get enough sleep, our immune system weakens, making us more likely to get sick.

Good sleep hygiene can help improve the quality of your sleep. Try to go to bed and wake up at the same time every day. Avoid screens for at least one hour before bedtime, as blue light from phones can disrupt sleep. Keep your bedroom cool, dark, and quiet.

Exercise during the day promotes better sleep at night. A relaxing routine, such as reading or listening to calm music, can signal to your body that it is time to rest.

Quality sleep is not a luxury — it is a necessity for a healthy and productive life.`,
    questions: [
      { question: "How many hours of sleep do adults need each night?", options: ["5-6 hours", "7-9 hours", "10-12 hours", "6-7 hours"], answer: 1 },
      { question: "What weakens when we do not get enough sleep?", options: ["Memory", "Eyesight", "Immune system", "Muscles"], answer: 2 },
      { question: "Why avoid screens before bedtime?", options: ["Screens are addictive", "Blue light disrupts sleep", "Screens make you think too much", "Screens cause eye strain"], answer: 1 },
      { question: "What does good sleep hygiene include?", options: ["Sleeping at different times", "Keeping a consistent schedule", "Sleeping less on weekends", "Exercising at night"], answer: 1 },
    ],
  },
  {
    title: "Artificial Intelligence: A New Era",
    language: "en",
    difficulty: "intermediate",
    content: `Artificial intelligence, commonly known as AI, is transforming virtually every aspect of modern life. From recommendation algorithms to sophisticated language models that can write essays and diagnose diseases, AI has moved from the realm of science fiction into our everyday reality.

At its core, AI refers to computer systems that can perform tasks requiring human intelligence. These include recognizing speech, making decisions, translating languages, and identifying patterns in vast datasets. Modern AI achieves this through machine learning — algorithms that improve by analyzing enormous amounts of data.

The economic implications of AI are profound. McKinsey Global Institute estimates that AI could contribute up to 13 trillion dollars to the global economy by 2030. In medicine, AI systems can detect cancers in medical images with accuracy rivaling experienced radiologists. In agriculture, AI-powered drones monitor crop health and optimize irrigation.

However, AI poses significant challenges. Concerns about job displacement are widespread, as automation threatens roles once considered safe. Issues of algorithmic bias demand careful attention. Privacy and the concentration of AI capabilities in a few powerful corporations are further sources of concern.

The path forward requires thoughtful governance and a commitment to ensuring that the benefits of AI are broadly shared.`,
    questions: [
      { question: "What is machine learning?", options: ["Programming every scenario manually", "Algorithms improving by analyzing data", "Robots learning physical skills", "Humans teaching computers manually"], answer: 1 },
      { question: "How much could AI contribute to the global economy by 2030?", options: ["$1 trillion", "$5 trillion", "$13 trillion", "$20 trillion"], answer: 2 },
      { question: "What is algorithmic bias?", options: ["AI preferring certain algorithms", "AI systems perpetuating societal inequalities", "Biased training data only", "AI making mathematical errors"], answer: 1 },
      { question: "In medicine, AI has shown ability to:", options: ["Perform surgeries", "Replace all doctors", "Detect cancers in medical images", "Prescribe medications automatically"], answer: 2 },
    ],
  },
  {
    title: "أَهَمِّيَّةُ القِرَاءَة",
    language: "ar",
    difficulty: "beginner",
    content: `القِرَاءَةُ مِن أَهَمِّ العَادَاتِ الَّتي يُمكِنُ أَن يَكتَسِبَها الإِنسَان. تَفتَحُ القِرَاءَةُ أَمامَنا عَوالِمَ جَديدَة وَتُنَمِّي عُقولَنا. عِندَما نَقرأُ، نَكتَسِبُ مَعلوماتٍ جَديدَة وَنَتَعَلَّمُ كَيفَ يُفَكِّرُ الآخَرُون.

القِرَاءَةُ تُحَسِّنُ مُستَوى اللُّغَة وَتُوَسِّعُ الثَّروَةَ اللُّغَوِيَّة. الشَّخصُ الَّذي يَقرأُ كَثيراً يَستَطيعُ التَّعبيرَ عَن أَفكَارِه بِشَكلٍ أَفضَل. كَذَلِكَ تُقَوِّي القِرَاءَةُ ذَاكِرَتَنا وَتَزيدُ مِن قُدرَتِنا على التَّركيز.

لِلقِرَاءَةِ فَوائِدُ نَفسِيَّةٌ أَيضاً. تُساعِدُنا القِرَاءَةُ على تَقليلِ التَّوَتُّر وَالقَلَق. عِندَما نَنغَمِسُ في قِصَّةٍ جَيِّدَة، نَبتَعِدُ عَن مَشاكِلِ الحَياةِ اليَومِيَّة لِفَترَة.

لِكَي تُصبِحَ القِرَاءَةُ عَادَةً، خَصِّص وَقتاً يَومِيّاً لَها. يُمكِنُ أَن تَبدأَ بِعَشرِ دَقائِق في اليَوم ثُمَّ تَزيدُ المُدَّة تَدريجِيّاً.

القِراءَةُ لَيسَت مُجَرَّد هِوايَة — إِنَّها رِحلَةٌ نَحوَ النُّمُوِّ الشَّخصيِّ وَالمَعرِفَة.`,
    questions: [
      { question: "مَاذا تُحسِّنُ القِرَاءَة؟", options: ["مُستَوى اللُّغَة فَقَط", "الصِّحَّةَ الجِسمِيَّة", "مُستَوى اللُّغَة وَالذَّاكِرَة", "العَلاقات الاجتِماعِيَّة"], answer: 2 },
      { question: "كَيفَ تُساعِدُنا القِرَاءَة نَفسِيّاً؟", options: ["تُزيدُ الطَّاقَة", "تُقَلِّلُ التَّوَتُّر وَالقَلَق", "تُحسِّنُ النَّوم", "تُقوِّي الجِسم"], answer: 1 },
      { question: "كَم دَقيقَة يُوصي المَقال بِالبَدءِ بِها؟", options: ["خَمس دَقائِق", "رُبعُ سَاعَة", "عَشرُ دَقائِق", "نِصفُ سَاعَة"], answer: 2 },
      { question: "مَا الَّذي يَكتَسِبُه الشَّخصُ الَّذي يَقرَأُ كَثيراً؟", options: ["القُدرَة على التَّعبيرِ بِشَكلٍ أَفضَل", "الثَّروَة وَالنَّجاح", "المَعرِفَة التِّقنِيَّة", "الشُّهرَة"], answer: 0 },
    ],
  },
  {
    title: "الذَّكَاءُ الاصطِنَاعيُّ وَمُستَقبَلُ التَّعليم",
    language: "ar",
    difficulty: "intermediate",
    content: `يَشهَدُ العالَمُ اليَومَ ثَورَةً تِكنولوجِيَّةً غَيرَ مَسبوقَة في مَجالِ الذَّكَاءِ الاصطِناعيّ. وَقَد بَدأَ هَذا التَّحوُّلُ الرَّقمِيُّ يُلقي بِظِلالِهِ على قِطاعِ التَّعليمِ بِشَكلٍ مُتَسارِع.

يَستَطيعُ الذَّكاءُ الاصطِناعيُّ تَحليلَ أَسلوبِ تَعلُّمِ كُلِّ طالِبٍ بِشَكلٍ فَرديٍّ وَتَقديمَ مَحتَوى مُناسِبٍ لِاحتِياجاتِه. فَبَدلاً مِن الاعتِمادِ على مَنهَجٍ مَوحَّدٍ، تُتيحُ التِّكنولوجيا الجَديدَة مَسارات تَعلُّمٍ مُخَصَّصَة لِكُلِّ فَرد.

وَقَد أَظهَرَت الدِّراساتُ أَنَّ الطُّلابَ الَّذينَ يَستَخدِمونَ أَدَواتِ الذَّكَاءِ الاصطِناعيِّ يُحَقِّقونَ نَتائِجَ أَفضَل. كَما تُساعِدُ هَذِهِ الأَدَواتُ المُعَلِّمينَ على قَضَاءِ وَقتٍ أَطوَل في التَّفاعُلِ المُباشَرِ مَعَ الطُّلاب.

غَيرَ أَنَّ هَذا التَّحوُّلَ يَحمِلُ تَحدِّيات. يُخشى أَن تَزيدَ الفَجوَةُ الرَّقمِيَّةُ بَينَ مَن يَملِكونَ الوُصولَ إِلى التِّكنولوجيا وَمَن يَفتَقِرونَ إِليها.

إِنَّ مُستَقبَلَ التَّعليمِ سَيَكونُ الشَّراكَةَ الذَّكِيَّة بَينَ التِّكنولوجيا وَالمُعَلِّمِ الإِنساني.`,
    questions: [
      { question: "كَيفَ يُقَدِّمُ الذَّكاءُ الاصطِناعيُّ المَحتَوى التَّعليمي؟", options: ["بِشَكلٍ مَوحَّدٍ", "مُخَصَّصٍ لِكُلِّ طالِب", "عَن طَريقِ الكُتُبِ فَقَط", "بِالفيديوهات فَقَط"], answer: 1 },
      { question: "كَيفَ يُساعِدُ الذَّكاءُ الاصطِناعيُّ المُعَلِّمينَ؟", options: ["يُحَلُّ مَحَلَّهُم", "يُقَلِّلُ الأَعمالَ الإِدارِيَّة", "يُحَضِّرُ الدُّروسَ", "يُصَحِّحُ الامتِحانات فَقَط"], answer: 1 },
      { question: "مَا أَبرَزُ التَّحَدِّياتِ؟", options: ["غَلاءُ التِّكنولوجيا", "الفَجوَةُ الرَّقمِيَّة", "صُعوبَةُ الاستِخدام", "نَقصُ المُعَلِّمين"], answer: 1 },
      { question: "مَا رَأيُ المَقالِ في مُستَقبَلِ التَّعليم؟", options: ["التِّكنولوجيا ستُلغي المُعَلِّمينَ", "المُعَلِّمُ أَهَمّ", "شَراكَة بَين التِّكنولوجيا وَالمُعَلِّم", "الطُّلابُ سَيَتَعَلَّمونَ لِوَحدِهِم"], answer: 2 },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, streak: 0, dailyGoal: 10 },
  });

  let cardCount = 0;
  for (const word of [...ENGLISH_WORDS, ...ARABIC_WORDS]) {
    const existing = await prisma.card.findFirst({
      where: { word: word.word, language: word.language },
    });
    if (!existing) {
      await prisma.card.create({
        data: { word: word.word, translation: word.translation, language: word.language, example: word.example ?? null },
      });
      cardCount++;
    }
  }

  let passageCount = 0;
  for (const passage of READING_PASSAGES) {
    const existing = await prisma.readingPassage.findFirst({ where: { title: passage.title } });
    if (!existing) {
      await prisma.readingPassage.create({
        data: {
          title: passage.title,
          content: passage.content,
          language: passage.language,
          difficulty: passage.difficulty,
          questions: JSON.stringify(passage.questions),
        },
      });
      passageCount++;
    }
  }

  console.log(`✅ Seeded ${cardCount} cards, ${passageCount} passages`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
