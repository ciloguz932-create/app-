export interface SeedCard {
  word: string;
  translation: string;
  language: "en" | "ar";
  example?: string;
}

export const ENGLISH_WORDS: SeedCard[] = [
  { word: "ambiguous", translation: "belirsiz, çift anlamlı", language: "en", example: "The instructions were ambiguous and confusing." },
  { word: "benevolent", translation: "hayırsever, iyiliksever", language: "en", example: "She had a benevolent smile that put everyone at ease." },
  { word: "candid", translation: "açık sözlü, dürüst", language: "en", example: "I appreciate your candid feedback on my work." },
  { word: "diligent", translation: "çalışkan, gayretli", language: "en", example: "She was diligent in her studies and always met deadlines." },
  { word: "eloquent", translation: "belagatli, etkili konuşan", language: "en", example: "The eloquent speaker moved the crowd with her words." },
  { word: "frugal", translation: "tutumlu, cimri değil", language: "en", example: "Living frugally allowed him to save money for travel." },
  { word: "gratitude", translation: "minnet, şükran", language: "en", example: "She expressed her gratitude with a heartfelt letter." },
  { word: "humility", translation: "alçakgönüllülük", language: "en", example: "True wisdom begins with humility." },
  { word: "intricate", translation: "karmaşık, girift", language: "en", example: "The intricate pattern on the carpet was breathtaking." },
  { word: "jubilant", translation: "sevinçli, coşkulu", language: "en", example: "The team was jubilant after winning the championship." },
  { word: "keen", translation: "istekli, keskin", language: "en", example: "She has a keen interest in astronomy." },
  { word: "lucid", translation: "anlaşılır, berrak", language: "en", example: "His lucid explanation made the concept easy to grasp." },
  { word: "meticulous", translation: "titiz, dikkatli", language: "en", example: "She is meticulous about keeping detailed records." },
  { word: "nuance", translation: "nüans, ince fark", language: "en", example: "Understanding cultural nuances is key to good communication." },
  { word: "obscure", translation: "belirsiz, az bilinen", language: "en", example: "She found an obscure reference in the ancient manuscript." },
  { word: "perseverance", translation: "sebat, azim", language: "en", example: "Success requires patience and perseverance." },
  { word: "quaint", translation: "şirin, eski moda", language: "en", example: "We stayed in a quaint little village by the sea." },
  { word: "resilient", translation: "esnek, dirençli", language: "en", example: "Children are often remarkably resilient after setbacks." },
  { word: "serene", translation: "sakin, huzurlu", language: "en", example: "The mountain lake was absolutely serene at dawn." },
  { word: "tenacious", translation: "inatçı, kararlı", language: "en", example: "Her tenacious spirit helped her overcome every obstacle." },
  { word: "ubiquitous", translation: "her yerde olan, yaygın", language: "en", example: "Smartphones have become ubiquitous in modern life." },
  { word: "vivid", translation: "canlı, parlak", language: "en", example: "She has vivid memories of her childhood summers." },
  { word: "wistful", translation: "hüzünlü özlemli", language: "en", example: "He gave a wistful look at the old photographs." },
  { word: "exemplary", translation: "örnek teşkil eden", language: "en", example: "Her exemplary conduct earned her widespread respect." },
  { word: "yearning", translation: "özlem, derin arzu", language: "en", example: "She felt a deep yearning to return home." },
  { word: "advocate", translation: "savunucu, destekçi", language: "en", example: "She is a strong advocate for children's education." },
  { word: "brevity", translation: "kısalık, özlülük", language: "en", example: "Brevity is the soul of wit, as Shakespeare wrote." },
  { word: "compassion", translation: "şefkat, merhamet", language: "en", example: "He showed great compassion to those in need." },
  { word: "deduce", translation: "sonuç çıkarmak, çıkarımda bulunmak", language: "en", example: "From the clues, we can deduce what happened." },
  { word: "endeavor", translation: "çaba, girişim", language: "en", example: "Learning a language is a worthwhile endeavor." },
  { word: "flourish", translation: "gelişmek, serpilmek", language: "en", example: "Plants flourish when given the right conditions." },
  { word: "genuine", translation: "gerçek, içten", language: "en", example: "Her genuine smile made everyone feel welcome." },
  { word: "harmonious", translation: "uyumlu, ahenkli", language: "en", example: "The harmonious blend of colors was stunning." },
  { word: "illuminate", translation: "aydınlatmak, açıklamak", language: "en", example: "Her research illuminated previously unknown aspects of history." },
  { word: "immense", translation: "muazzam, devasa", language: "en", example: "The desert stretches for an immense distance." },
  { word: "inevitable", translation: "kaçınılmaz, zorunlu", language: "en", example: "Change is inevitable in any growing organization." },
  { word: "linger", translation: "oyalanmak, kalmak", language: "en", example: "The smell of coffee lingered in the air." },
  { word: "muster", translation: "toplamak, bir araya getirmek", language: "en", example: "She mustered all her courage to speak in public." },
  { word: "nourish", translation: "beslemek, desteklemek", language: "en", example: "A good book can nourish the mind." },
  { word: "optimistic", translation: "iyimser", language: "en", example: "Despite the challenges, she remained optimistic." },
  { word: "perceive", translation: "algılamak, fark etmek", language: "en", example: "How we perceive problems affects how we solve them." },
  { word: "profound", translation: "derin, köklü", language: "en", example: "Reading that book had a profound impact on her life." },
  { word: "radiant", translation: "parlak, ışıl ışıl", language: "en", example: "She had a radiant expression of pure joy." },
  { word: "soothe", translation: "yatıştırmak, teskin etmek", language: "en", example: "Music can soothe a troubled mind." },
  { word: "thrive", translation: "gelişmek, başarıya ulaşmak", language: "en", example: "Creative minds thrive in open environments." },
  { word: "unique", translation: "eşsiz, benzersiz", language: "en", example: "Every person has a unique perspective to offer." },
  { word: "valor", translation: "yiğitlik, cesaret", language: "en", example: "The soldier was honored for his valor in battle." },
  { word: "wisdom", translation: "bilgelik, akıl", language: "en", example: "Experience brings wisdom that books alone cannot teach." },
  { word: "zeal", translation: "şevk, gayret", language: "en", example: "She approached every task with remarkable zeal." },
  { word: "abstract", translation: "soyut, özet", language: "en", example: "The painting was abstract and open to interpretation." },
  { word: "accurate", translation: "doğru, kesin", language: "en", example: "The weather forecast was surprisingly accurate." },
  { word: "achieve", translation: "başarmak, elde etmek", language: "en", example: "Hard work helps you achieve your goals." },
  { word: "adapt", translation: "uyum sağlamak, adapte olmak", language: "en", example: "Animals adapt to their environment over time." },
  { word: "admire", translation: "hayranlık duymak, takdir etmek", language: "en", example: "I admire her dedication to her craft." },
  { word: "anticipate", translation: "beklemek, tahmin etmek", language: "en", example: "We anticipate great results from this project." },
  { word: "balance", translation: "denge, dengelemek", language: "en", example: "Work-life balance is essential for wellbeing." },
  { word: "challenge", translation: "meydan okuma, zorluk", language: "en", example: "Every challenge is an opportunity to grow." },
  { word: "consistent", translation: "tutarlı, istikrarlı", language: "en", example: "Consistent practice leads to improvement." },
  { word: "courage", translation: "cesaret, yiğitlik", language: "en", example: "It takes courage to speak your mind." },
  { word: "cultivate", translation: "yetiştirmek, geliştirmek", language: "en", example: "You can cultivate good habits with patience." },
  { word: "deliberate", translation: "kasıtlı, düşünceli", language: "en", example: "Success requires deliberate and focused effort." },
  { word: "devote", translation: "adamak, vakfetmek", language: "en", example: "She devoted her life to scientific research." },
  { word: "diverse", translation: "çeşitli, farklı", language: "en", example: "The city has a diverse cultural landscape." },
  { word: "endure", translation: "dayanmak, sürmek", language: "en", example: "Great art endures through the ages." },
  { word: "enhance", translation: "geliştirmek, artırmak", language: "en", example: "Travel can enhance your understanding of the world." },
  { word: "explore", translation: "keşfetmek, araştırmak", language: "en", example: "Children naturally love to explore." },
  { word: "foundation", translation: "temel, zemin", language: "en", example: "Education is the foundation of opportunity." },
  { word: "freedom", translation: "özgürlük, serbestlik", language: "en", example: "Freedom of expression is fundamental to democracy." },
  { word: "generosity", translation: "cömertlik, el açıklığı", language: "en", example: "Her generosity touched everyone around her." },
  { word: "growth", translation: "büyüme, gelişme", language: "en", example: "Personal growth requires honest self-reflection." },
  { word: "horizon", translation: "ufuk, olasılık alanı", language: "en", example: "Every morning brings a new horizon." },
  { word: "inspire", translation: "ilham vermek, esinlendirmek", language: "en", example: "Great teachers inspire students to think freely." },
  { word: "integrity", translation: "dürüstlük, bütünlük", language: "en", example: "Act with integrity, even when no one is watching." },
  { word: "journey", translation: "yolculuk, süreç", language: "en", example: "Learning a language is a lifelong journey." },
  { word: "joy", translation: "sevinç, neşe", language: "en", example: "Simple things often bring the greatest joy." },
  { word: "knowledge", translation: "bilgi, bilgelik", language: "en", example: "Knowledge opens doors that stay closed to ignorance." },
  { word: "legacy", translation: "miras, kalıt", language: "en", example: "She left behind a lasting legacy of kindness." },
  { word: "mindful", translation: "bilinçli, dikkatli", language: "en", example: "Being mindful helps reduce stress and anxiety." },
  { word: "momentum", translation: "ivme, güç", language: "en", example: "Once you start, you build momentum quickly." },
  { word: "overcome", translation: "üstesinden gelmek, aşmak", language: "en", example: "She overcame every obstacle with determination." },
  { word: "passion", translation: "tutku, ihtiras", language: "en", example: "Follow your passion and the work won't feel hard." },
  { word: "perspective", translation: "bakış açısı, görüş", language: "en", example: "Travel gives you a broader perspective on life." },
  { word: "potential", translation: "potansiyel, kapasite", language: "en", example: "Every student has the potential to succeed." },
  { word: "purpose", translation: "amaç, niyet", language: "en", example: "A sense of purpose gives life meaning." },
  { word: "reflect", translation: "yansıtmak, düşünmek", language: "en", example: "Take time to reflect on your experiences." },
  { word: "transform", translation: "dönüştürmek, değiştirmek", language: "en", example: "Education has the power to transform lives." },
  { word: "vision", translation: "vizyon, hayal", language: "en", example: "A clear vision helps guide your decisions." },
  { word: "wonder", translation: "merak, hayranlık", language: "en", example: "Children look at the world with a sense of wonder." },
  { word: "yield", translation: "verim vermek, boyun eğmek", language: "en", example: "Patience and effort yield great results." },
];

export const ARABIC_WORDS: SeedCard[] = [
  { word: "كِتَاب", translation: "kitap / book", language: "ar", example: "أَقرأُ كِتَاباً كُلَّ أُسبوع — I read a book every week." },
  { word: "مَعرِفَة", translation: "bilgi, öğrenme / knowledge", language: "ar", example: "المَعرِفَةُ نُور — Knowledge is light." },
  { word: "صَبر", translation: "sabır / patience", language: "ar", example: "الصَّبرُ مِفتاحُ الفَرَج — Patience is the key to relief." },
  { word: "حُلم", translation: "rüya, hayal / dream", language: "ar", example: "لديه حُلمٌ كَبير — He has a big dream." },
  { word: "قَلب", translation: "kalp / heart", language: "ar", example: "القَلبُ السَّليمُ هو الكَنز — A sound heart is a treasure." },
  { word: "عَقل", translation: "akıl, zihin / mind", language: "ar", example: "العَقلُ السَّليمُ في الجِسمِ السَّليم — A sound mind in a sound body." },
  { word: "وَقت", translation: "zaman / time", language: "ar", example: "الوَقتُ ذَهَب — Time is gold." },
  { word: "أَمل", translation: "umut / hope", language: "ar", example: "لا تَفقِد الأَمَل — Don't lose hope." },
  { word: "نُور", translation: "ışık / light", language: "ar", example: "العِلمُ نُور — Knowledge is light." },
  { word: "جَمَال", translation: "güzellik / beauty", language: "ar", example: "جَمَالُ الطَّبيعَة رائِع — The beauty of nature is amazing." },
  { word: "سَعَادَة", translation: "mutluluk / happiness", language: "ar", example: "أَتمَنَّى لَكَ السَّعَادَة — I wish you happiness." },
  { word: "حُرِّيَّة", translation: "özgürlük / freedom", language: "ar", example: "الحُرِّيَّةُ حَقٌّ لِكُلِّ إِنسَان — Freedom is every person's right." },
  { word: "شُكران", translation: "şükran, teşekkür / gratitude", language: "ar", example: "أُعَبِّرُ عَن شُكرَاني — I express my gratitude." },
  { word: "مُستَقبَل", translation: "gelecek / future", language: "ar", example: "المُستَقبَلُ مُشرِق — The future is bright." },
  { word: "إرادَة", translation: "irade, istek / willpower", language: "ar", example: "الإِرادَةُ تُحَقِّقُ المُستَحيل — Willpower achieves the impossible." },
  { word: "ثِقَة", translation: "güven / confidence", language: "ar", example: "الثِّقَةُ بِالنَّفسِ مُهِمَّة — Self-confidence is important." },
  { word: "حِكمَة", translation: "hikmet, bilgelik / wisdom", language: "ar", example: "الحِكمَةُ تَأتي مِن التَّجرِبَة — Wisdom comes from experience." },
  { word: "شَجَاعَة", translation: "cesaret / courage", language: "ar", example: "الشَّجَاعَةُ فَضيلَة — Courage is a virtue." },
  { word: "عَطَاء", translation: "cömertlik, verme / giving", language: "ar", example: "العَطَاءُ يُسعِدُ القَلب — Giving makes the heart happy." },
  { word: "رِحلَة", translation: "yolculuk / journey", language: "ar", example: "الحَيَاةُ رِحلَة جَميلَة — Life is a beautiful journey." },
  { word: "بَيت", translation: "ev / house, home", language: "ar", example: "البَيتُ مَكانُ الرَّاحَة — Home is a place of comfort." },
  { word: "صَديق", translation: "arkadaş / friend", language: "ar", example: "الصَّديقُ الحَقيقي يَقفُ مَعَكَ — A true friend stands by you." },
  { word: "عَائِلَة", translation: "aile / family", language: "ar", example: "العَائِلَةُ هي الأَهَم — Family is most important." },
  { word: "لُغَة", translation: "dil / language", language: "ar", example: "تَعَلُّمُ اللُّغَاتِ يَفتَحُ العُقُول — Learning languages opens minds." },
  { word: "ثَقَافَة", translation: "kültür / culture", language: "ar", example: "الثَّقَافَةُ تُثرِي الحَيَاة — Culture enriches life." },
  { word: "تَعلُّم", translation: "öğrenme / learning", language: "ar", example: "التَّعَلُّمُ رِحلَةٌ لا تَنتَهي — Learning is an endless journey." },
  { word: "نَجَاح", translation: "başarı / success", language: "ar", example: "النَّجَاحُ ثَمَرَةُ الجُهد — Success is the fruit of effort." },
  { word: "إِبداع", translation: "yaratıcılık / creativity", language: "ar", example: "الإِبداعُ لا حُدودَ لَه — Creativity knows no limits." },
  { word: "تَعاوُن", translation: "işbirliği / cooperation", language: "ar", example: "التَّعاوُنُ يُحَقِّقُ الأَهداف — Cooperation achieves goals." },
  { word: "سَلام", translation: "barış / peace", language: "ar", example: "نَتَمَنَّى السَّلامَ لِلعالَم — We wish peace to the world." },
  { word: "طَريق", translation: "yol / path, way", language: "ar", example: "كُلُّ رِحلَة تَبدَأُ بِخُطوَة — Every journey begins with a step." },
  { word: "قُوَّة", translation: "güç, kuvvet / strength", language: "ar", example: "القُوَّةُ الحَقيقِيَّةُ تَأتي مِن الدَّاخِل — True strength comes from within." },
  { word: "حَيَاة", translation: "hayat / life", language: "ar", example: "الحَيَاةُ قَصيرَة فأَحسِن قَضَاءَها — Life is short, spend it well." },
  { word: "يَوم", translation: "gün / day", language: "ar", example: "كُلُّ يَوم فُرصَة جَديدَة — Every day is a new opportunity." },
  { word: "ضَوء", translation: "ışık / light", language: "ar", example: "في نِهَايَةِ النَّفَق ضَوء — There's light at the end of the tunnel." },
  { word: "ماء", translation: "su / water", language: "ar", example: "الماءُ أَساسُ الحَيَاة — Water is the basis of life." },
  { word: "شَمس", translation: "güneş / sun", language: "ar", example: "تَشرُقُ الشَّمسُ كُلَّ صَبَاح — The sun rises every morning." },
  { word: "قَمَر", translation: "ay / moon", language: "ar", example: "يُضيءُ القَمَرُ الليلَ بِنُوره — The moon illuminates the night." },
  { word: "سَماء", translation: "gökyüzü / sky", language: "ar", example: "السَّماءُ زَرقاءُ جَميلَة — The sky is beautifully blue." },
  { word: "بَحر", translation: "deniz / sea", language: "ar", example: "يُحِبُّ الجُلوسَ قُربَ البَحر — He loves sitting by the sea." },
  { word: "جَبَل", translation: "dağ / mountain", language: "ar", example: "تَسلَّقَ الجَبَلَ بِصَعوبَة — He climbed the mountain with difficulty." },
  { word: "مَدينَة", translation: "şehir / city", language: "ar", example: "أَسكُنُ في مَدينَة كَبيرَة — I live in a big city." },
  { word: "قَرية", translation: "köy / village", language: "ar", example: "القَريَةُ هادِئَةٌ وَجَميلَة — The village is quiet and beautiful." },
  { word: "طَعام", translation: "yemek / food", language: "ar", example: "الطَّعامُ العَرَبي لَذيذ — Arabic food is delicious." },
  { word: "شَاي", translation: "çay / tea", language: "ar", example: "يَشرَبُ الشَّايَ كُلَّ صَبَاح — He drinks tea every morning." },
  { word: "قَهوَة", translation: "kahve / coffee", language: "ar", example: "القَهوَةُ العَرَبيَّةُ لَها طَعمٌ مُميَّز — Arabic coffee has a distinctive flavor." },
  { word: "مُوسيقى", translation: "müzik / music", language: "ar", example: "المُوسيقى تَلمَسُ الأَروَاح — Music touches the souls." },
  { word: "فَن", translation: "sanat / art", language: "ar", example: "الفَنُّ لُغَةٌ عالَمِيَّة — Art is a universal language." },
  { word: "شِعر", translation: "şiir / poetry", language: "ar", example: "الشِّعرُ العَرَبي غَنيٌّ وَعَميق — Arabic poetry is rich and deep." },
  { word: "تَاريخ", translation: "tarih / history", language: "ar", example: "تَاريخُ العَرَب حَضَارَةٌ عَريقَة — Arab history is an ancient civilization." },
  { word: "مُستَقبَل", translation: "gelecek / future", language: "ar", example: "نَبني مُستَقبَلاً أَفضَل — We build a better future." },
  { word: "حُبّ", translation: "aşk, sevgi / love", language: "ar", example: "الحُبُّ أَقوى مِن الكَرَاهِيَة — Love is stronger than hatred." },
  { word: "عَمَل", translation: "iş, çalışma / work", language: "ar", example: "العَمَلُ الجادُّ يُؤتي ثِمَاره — Hard work bears fruit." },
  { word: "دِرَاسَة", translation: "çalışma, eğitim / study", language: "ar", example: "الدِّرَاسَةُ تَفتَحُ أَبواب المُستَقبَل — Study opens doors to the future." },
  { word: "صِحَّة", translation: "sağlık / health", language: "ar", example: "الصِّحَّةُ تاجٌ على رُؤوسِ الأَصِحَّاء — Health is a crown worn by the healthy." },
  { word: "طَبيعَة", translation: "doğa / nature", language: "ar", example: "الطَّبيعَةُ مِرآةُ الله — Nature is the mirror of God." },
  { word: "كَلام", translation: "söz, kelam / speech, word", language: "ar", example: "الكَلامُ الطَّيِّبُ صَدَقَة — A kind word is charity." },
  { word: "ذاكِرَة", translation: "hafıza / memory", language: "ar", example: "الذَّاكِرَةُ الجَيِّدَة نِعمَة — Good memory is a blessing." },
  { word: "قِصَّة", translation: "hikaye / story", language: "ar", example: "أُحِبُّ قِراءَةَ القِصَص — I love reading stories." },
  { word: "حَقيقَة", translation: "gerçek, hakikat / truth", language: "ar", example: "الحَقيقَةُ دائِماً تَنتَصِر — Truth always triumphs." },
  { word: "إِنسَان", translation: "insan / human being", language: "ar", example: "كُلُّ إِنسَانٍ يَستَحِقُّ الكَرامَة — Every human deserves dignity." },
  { word: "أَرض", translation: "toprak, yer / earth, land", language: "ar", example: "الأَرضُ تُعطي لِمَن يَزرَعُها — The earth gives to those who cultivate it." },
  { word: "أُمنِيَة", translation: "dilek, temenni / wish", language: "ar", example: "أُمنِيَتي أَن أَزورَ العالَم — My wish is to travel the world." },
];

export interface ReadingPassage {
  title: string;
  content: string;
  language: "en" | "ar";
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
}

export const READING_PASSAGES: ReadingPassage[] = [
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
      {
        question: "What percentage of daily actions are habits, according to scientists?",
        options: ["20%", "30%", "40%", "50%"],
        answer: 2,
      },
      {
        question: "What is the key to forming a new habit?",
        options: ["Motivation", "Repetition", "Willpower", "Planning"],
        answer: 1,
      },
      {
        question: "What does the article suggest if you want to stop eating sweets?",
        options: ["Eat less", "Keep fruit nearby", "Avoid the kitchen", "Drink more water"],
        answer: 1,
      },
      {
        question: "According to the article, how should you start a new exercise habit?",
        options: ["Run for an hour", "Join a gym", "Begin with ten minutes", "Exercise with a friend"],
        answer: 2,
      },
    ],
  },
  {
    title: "The Importance of Sleep",
    language: "en",
    difficulty: "beginner",
    content: `Sleep is one of the most important things we do every day. When we sleep, our bodies repair themselves and our brains process information from the day. Without enough sleep, we feel tired, irritable, and unable to concentrate.

Adults need between seven and nine hours of sleep each night. Children and teenagers need even more. When we do not get enough sleep, our immune system weakens, making us more likely to get sick. Long-term sleep deprivation can lead to serious health problems, including heart disease and diabetes.

Good sleep hygiene can help improve the quality of your sleep. Try to go to bed and wake up at the same time every day, even on weekends. Avoid screens for at least one hour before bedtime, as the blue light from phones and computers can disrupt sleep. Keep your bedroom cool, dark, and quiet.

Exercise during the day promotes better sleep at night. However, avoid intense exercise close to bedtime. A relaxing routine, such as reading or listening to calm music, can signal to your body that it is time to rest.

Quality sleep is not a luxury — it is a necessity for a healthy and productive life.`,
    questions: [
      {
        question: "How many hours of sleep do adults need each night?",
        options: ["5-6 hours", "7-9 hours", "10-12 hours", "6-7 hours"],
        answer: 1,
      },
      {
        question: "What weakens when we do not get enough sleep?",
        options: ["Memory", "Eyesight", "Immune system", "Muscles"],
        answer: 2,
      },
      {
        question: "Why should you avoid screens before bedtime?",
        options: ["Screens are addictive", "Blue light disrupts sleep", "Screens make you think too much", "Screens cause eye strain"],
        answer: 1,
      },
      {
        question: "What does good sleep hygiene include?",
        options: ["Sleeping at different times", "Keeping a consistent schedule", "Sleeping less on weekends", "Exercising at night"],
        answer: 1,
      },
    ],
  },
  {
    title: "Artificial Intelligence: A New Era",
    language: "en",
    difficulty: "intermediate",
    content: `Artificial intelligence, commonly known as AI, is transforming virtually every aspect of modern life. From the recommendation algorithms that suggest what to watch on streaming platforms to the sophisticated language models that can write essays, compose music, and diagnose diseases, AI has moved from the realm of science fiction into our everyday reality.

At its core, AI refers to computer systems that can perform tasks that typically require human intelligence. These include recognizing speech, making decisions, translating languages, and identifying patterns in vast datasets. Modern AI systems achieve this through machine learning — a process where algorithms improve their performance by analyzing enormous amounts of data, rather than being explicitly programmed for every scenario.

The economic implications of AI are profound. McKinsey Global Institute estimates that AI could contribute up to $13 trillion to the global economy by 2030. Industries from healthcare to agriculture are being revolutionized. In medicine, AI systems can detect cancers in medical images with accuracy rivaling experienced radiologists. In agriculture, AI-powered drones monitor crop health and optimize irrigation.

However, AI also poses significant challenges. Concerns about job displacement are widespread, as automation threatens roles that were once considered safe from technological substitution. Issues of algorithmic bias — where AI systems perpetuate or amplify existing societal inequalities — demand careful attention. Privacy, security, and the concentration of AI capabilities in a small number of powerful corporations are further sources of legitimate concern.

The path forward requires thoughtful governance, inclusive design, and a commitment to ensuring that the benefits of AI are broadly shared.`,
    questions: [
      {
        question: "What is machine learning, according to the article?",
        options: ["Programming every scenario manually", "Algorithms improving by analyzing data", "Robots learning physical skills", "Humans teaching computers manually"],
        answer: 1,
      },
      {
        question: "How much could AI contribute to the global economy by 2030, per McKinsey?",
        options: ["$1 trillion", "$5 trillion", "$13 trillion", "$20 trillion"],
        answer: 2,
      },
      {
        question: "What is 'algorithmic bias'?",
        options: ["AI preferring certain algorithms", "AI systems perpetuating societal inequalities", "Biased training data only", "AI making mathematical errors"],
        answer: 1,
      },
      {
        question: "In medicine, AI has shown ability to:",
        options: ["Perform surgeries", "Replace all doctors", "Detect cancers in medical images", "Prescribe medications automatically"],
        answer: 2,
      },
    ],
  },
  {
    title: "أَهَمِّيَّةُ القِرَاءَة",
    language: "ar",
    difficulty: "beginner",
    content: `القِرَاءَةُ مِن أَهَمِّ العَادَاتِ الَّتي يُمكِنُ أَن يَكتَسِبَها الإِنسَان. تَفتَحُ القِرَاءَةُ أَمامَنا عَوالِمَ جَديدَة وَتُنَمِّي عُقولَنا. عِندَما نَقرأُ، نَكتَسِبُ مَعلوماتٍ جَديدَة وَنَتَعَلَّمُ كَيفَ يُفَكِّرُ الآخَرُون.

القِرَاءَةُ تُحَسِّنُ مُستَوى اللُّغَة وَتُوَسِّعُ الثَّروَةَ اللُّغَوِيَّة. الشَّخصُ الَّذي يَقرأُ كَثيراً يَستَطيعُ التَّعبيرَ عَن أَفكَارِه بِشَكلٍ أَفضَل. كَذَلِكَ تُقَوِّي القِرَاءَةُ ذَاكِرَتَنا وَتَزيدُ مِن قُدرَتِنا على التَّركيز.

لِلقِرَاءَةِ فَوائِدُ نَفسِيَّةٌ أَيضاً. تُساعِدُنا القِرَاءَةُ على تَقليلِ التَّوَتُّر وَالقَلَق. عِندَما نَنغَمِسُ في قِصَّةٍ جَيِّدَة، نَبتَعِدُ عَن مَشاكِلِ الحَياةِ اليَومِيَّة لِفَترَة.

لِكَي تُصبِحَ القِرَاءَةُ عَادَةً، خَصِّص وَقتاً يَومِيّاً لَها. يُمكِنُ أَن تَبدأَ بِعَشرِ دَقائِق في اليَوم ثُمَّ تَزيدُ المُدَّة تَدريجِيّاً. اِختَر كُتُباً تُثيرُ اهتِمامَكَ حَتَّى تَستَمتِعَ بِالقِرَاءَة.

القِراءَةُ لَيسَت مُجَرَّد هِوايَة — إِنَّها رِحلَةٌ نَحوَ النُّمُوِّ الشَّخصيِّ وَالمَعرِفَة.`,
    questions: [
      {
        question: "مَاذا تُحسِّنُ القِرَاءَة؟",
        options: ["مُستَوى اللُّغَة فَقَط", "الصِّحَّةَ الجِسمِيَّة", "مُستَوى اللُّغَة وَالذَّاكِرَة", "العَلاقات الاجتِماعِيَّة"],
        answer: 2,
      },
      {
        question: "كَيفَ تُساعِدُنا القِرَاءَة نَفسِيّاً؟",
        options: ["تُزيدُ الطَّاقَة", "تُقَلِّلُ التَّوَتُّر وَالقَلَق", "تُحسِّنُ النَّوم", "تُقوِّي الجِسم"],
        answer: 1,
      },
      {
        question: "كَم دَقيقَة يُوصي المَقال بِالبَدءِ بِها يَومِيّاً؟",
        options: ["خَمس دَقائِق", "رُبعُ سَاعَة", "عَشرُ دَقائِق", "نِصفُ سَاعَة"],
        answer: 2,
      },
      {
        question: "مَا الَّذي يَكتَسِبُه الشَّخصُ الَّذي يَقرَأُ كَثيراً؟",
        options: ["القُدرَة على التَّعبيرِ بِشَكلٍ أَفضَل", "الثَّروَة وَالنَّجاح", "المَعرِفَة التِّقنِيَّة", "الشُّهرَة"],
        answer: 0,
      },
    ],
  },
  {
    title: "الذَّكَاءُ الاصطِنَاعيُّ وَمُستَقبَلُ التَّعليم",
    language: "ar",
    difficulty: "intermediate",
    content: `يَشهَدُ العالَمُ اليَومَ ثَورَةً تِكنولوجِيَّةً غَيرَ مَسبوقَة في مَجالِ الذَّكَاءِ الاصطِناعيّ. وَقَد بَدأَ هَذا التَّحوُّلُ الرَّقمِيُّ يُلقي بِظِلالِهِ على قِطاعِ التَّعليمِ بِشَكلٍ مُتَسارِع.

يَستَطيعُ الذَّكاءُ الاصطِناعيُّ تَحليلَ أَسلوبِ تَعلُّمِ كُلِّ طالِبٍ بِشَكلٍ فَرديٍّ وَتَقديمَ مَحتَوى مُناسِبٍ لِاحتِياجاتِه. فَبَدلاً مِن الاعتِمادِ على مَنهَجٍ مَوحَّدٍ لِجَميعِ الطُّلاب، تُتيحُ التِّكنولوجيا الجَديدَة مَسارات تَعلُّمٍ مُخَصَّصَة لِكُلِّ فَرد.

وَقَد أَظهَرَت الدِّراساتُ أَنَّ الطُّلابَ الَّذينَ يَستَخدِمونَ أَدَواتِ الذَّكَاءِ الاصطِناعيِّ في التَّعلُّمِ يُحَقِّقونَ نَتائِجَ أَفضَل مِن نَظَرائِهِم. كَما تُساعِدُ هَذِهِ الأَدَواتُ المُعَلِّمينَ على قَضَاءِ وَقتٍ أَطوَل في التَّفاعُلِ المُباشَرِ مَعَ الطُّلاب، بَعدَ أَن تُقلِّلَ الأَعمالَ الإِدارِيَّةَ عَلَيهِم.

غَيرَ أَنَّ هَذا التَّحوُّلَ يَحمِلُ في طَيَّاتِهِ تَحدِّيات جَسيمَة. يُخشى أَن تَزيدَ الفَجوَةُ الرَّقمِيَّةُ بَينَ مَن يَملِكونَ الوُصولَ إِلى التِّكنولوجيا وَمَن يَفتَقِرونَ إِليها. وَتَبرُزُ مَخاوِفُ حَولَ الاعتِمادِ المُفرِطِ على الأَجهِزَة وَضَعفِ مَهَاراتِ التَّفكيرِ النَّقديّ.

إِنَّ مُستَقبَلَ التَّعليمِ لَن يَكونَ إِمَّا تِكنولوجِيا أَو مُعَلِّماً إِنسانِيّاً — بَل سَيَكونُ الشَّراكَةَ الذَّكِيَّة بَينَهُما.`,
    questions: [
      {
        question: "كَيفَ يُقَدِّمُ الذَّكاءُ الاصطِناعيُّ المَحتَوى التَّعليمي؟",
        options: ["بِشَكلٍ مَوحَّدٍ لِجَميعِ الطُّلاب", "مُخَصَّصٍ لِكُلِّ طالِبٍ على حِدَة", "عَن طَريقِ الكُتُبِ الرَّقمِيَّة", "مِن خِلالِ الفيديوهات فَقَط"],
        answer: 1,
      },
      {
        question: "كَيفَ يُساعِدُ الذَّكاءُ الاصطِناعيُّ المُعَلِّمينَ؟",
        options: ["يُحَلُّ مَحَلَّهُم بالكامِل", "يُقَلِّلُ الأَعمالَ الإِدارِيَّة", "يُحَضِّرُ الدُّروسَ عَنهُم", "يُصَحِّحُ الامتِحانات فَقَط"],
        answer: 1,
      },
      {
        question: "مَا أَبرَزُ التَّحَدِّياتِ الَّتي يَذكُرُها المَقال؟",
        options: ["غَلاءُ التِّكنولوجيا", "الفَجوَةُ الرَّقمِيَّة وَضَعفُ التَّفكيرِ النَّقديّ", "صُعوبَةُ الاستِخدام", "نَقصُ المُعَلِّمين"],
        answer: 1,
      },
      {
        question: "مَا رَأيُ المَقالِ في مُستَقبَلِ التَّعليم؟",
        options: ["التِّكنولوجيا ستُلغي المُعَلِّمينَ", "المُعَلِّمُ الإِنساني أَهَمّ", "شَراكَة بَين التِّكنولوجيا وَالمُعَلِّم", "الطُّلابُ سَيَتَعَلَّمونَ لِوَحدِهِم"],
        answer: 2,
      },
    ],
  },
];
