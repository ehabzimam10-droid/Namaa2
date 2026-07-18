import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SuggestedTask {
  title: string;
  suggestedAmount: number;
  type: 'cash' | 'points' | 'custom';
  reasoning: string;
}

export async function suggestTaskForKid(
  apiKey: string,
  kidData: any,
  fatherNotes?: string
): Promise<SuggestedTask> {
  const prompt = `
    You are a highly intelligent financial coach for Alinma Bank's kids financial literacy application "Namaa".
    Your role is to analyze a child's specific financial and task database profile and suggest a personalized, educational task or responsibility.
    
    Child Profile:
    - Name: ${kidData.name}
    - Age: ${kidData.age}
    - Current Balance: ${kidData.balance} SAR
    - Saved Amount: ${kidData.saved} SAR
    - Points Balance: ${kidData.donationPoints || 0} Points (🌟)
    - Savings Goals: ${JSON.stringify(kidData.savingsGoals || [])}
    - Redeemed Rewards: ${JSON.stringify(kidData.redeemedRewards || [])}
    - Expired/Failed Tasks count: ${(kidData.tasks || []).filter((t: any) => t.status === 'expired' || t.status === 'failed').length}
    - Recent Transaction History: ${JSON.stringify((kidData.transactions || []).slice(0, 10))}
    - Father's Specific Notes: "${fatherNotes || 'None provided'}"
    
    Instruction:
    Analyze this data. Suggest an age-appropriate task for the child.
    - If the child has a high count of expired/failed tasks, suggest a simpler/easier task.
    - If the child's balance is low relative to their savings target, suggest a task with a cash/points reward.
    - If they have excess points (e.g. 100+ points), suggest they visit the Rewards Store to redeem them for Sony PlayStation gift cards (100 pts) or Jarir bookstore coupons (150 pts).
    - If they have excess money, suggest a task involving donation or charity.
    
    You MUST output a clean, strictly typed JSON object in this exact schema:
    {
      "title": "A short, engaging task title in Arabic (e.g. ترتيب الغرفة وترتيب الكتب 🧹)",
      "suggestedAmount": A reasonable reward amount (integer number, e.g. 10 or 15),
      "type": "cash" or "points" or "custom",
      "reasoning": "A concise explanation in Arabic for the father explaining why this task is suggested based on the kid's balance, savings, tasks, or transaction history."
    }
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanedText = text
      .trim()
      .replace(/^```json/i, '')
      .replace(/```$/, '')
      .trim();

    return JSON.parse(cleanedText) as SuggestedTask;
  } catch (err) {
    console.warn('Gemini API failed, falling back to mock recommendation:', err);
    // Mock recommendation fallback
    const isSalem = kidData.name === 'سالم';
    return {
      title: isSalem ? `ترتيب وتنظيم رفوف الكتب والألعاب الخاصة به 📚` : `مساعدة في تنظيف الفناء الخلفي 🌿`,
      suggestedAmount: 15,
      type: 'cash',
      reasoning: `تم اقتراح هذه المهمة بشكل تلقائي (نمط المحاكاة) لأن رصيد ${kidData.name} الحالي منخفض ويحتاج لتعزيز رصيده المتاح لتلبية أهداف الحصالة الخاصة به.`
    };
  }
}

export async function sendGeneralChatMessage(
  apiKey: string,
  message: string,
  familyData: { kids: any[]; projects: any[]; activeLeague?: any }
): Promise<string> {
  const prompt = `
    You are Alinma Bank's expert Financial Family Coach inside the application "Namaa".
    Your role is to guide and advise the father on kids' financial literacy, budgeting, and savings behaviors based on Alinma Bank's core standards.
    
    Family Data:
    - Kids profiles: ${JSON.stringify(familyData.kids || [])}
    - Family projects: ${JSON.stringify(familyData.projects || [])}
    - Active Family League: ${JSON.stringify(familyData.activeLeague || 'No active league')}
    
    Father's message: "${message}"
    
    Answer the father's message in Arabic. Keep responses concise, professional, and helpful. Return plain text (no markdown formatting like asterisks or hashtags if possible, just clean, well-spaced Arabic text).
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('Gemini API failed, falling back to simulated chat reply:', err);
    return `أهلاً بك يا أبو خالد. بصفتي مستشار نماء المالي المساعد، يسعدني التفاعل معك. لم يتم استدعاء خادم Gemini بنجاح (يرجى التحقق من إعداد مفتاح API في بوابة المطورين)، ولكن يسعدني إخبارك أن أبناءك سالم وخالد يبدون التزاماً ممتازاً بالادخار وتحديات الحصالة الذكية!`;
  }
}

export interface KidSpendingEvaluation {
  kidName: string;
  suggestedScore: number;
  reasoning: string;
}

export async function evaluateKidsSpending(
  apiKey: string,
  kidsData: any[],
  startDate?: string,
  endDate?: string
): Promise<KidSpendingEvaluation[]> {
  const startTime = startDate ? new Date(startDate).getTime() : 0;
  const endTime = endDate ? new Date(endDate).getTime() : Infinity;

  const filteredKids = kidsData.map(kid => {
    const filteredTx = (kid.transactions || []).filter((tx: any) => {
      const txTime = new Date(tx.date).getTime();
      return txTime >= startTime && txTime <= endTime;
    });

    const filteredTasks = (kid.tasks || []).filter((task: any) => {
      const taskTime = new Date(task.createdAt || task.endDate || '').getTime();
      if (isNaN(taskTime)) return false;
      return taskTime >= startTime && taskTime <= endTime;
    });

    return {
      ...kid,
      transactions: filteredTx,
      tasks: filteredTasks
    };
  });

  const prompt = `
    You are a highly intelligent financial auditor for Alinma Bank's family banking application "Namaa".
    Your role is to analyze the daily purchases and transactions of the kids during their active league challenge to evaluate their spending habits.
    
    Kids Data (including transactions in the active league period):
    ${JSON.stringify(filteredKids)}
    
    Please evaluate the "Spending Management" score for each kid on a scale from 0 to 100.
    1. Act as a strict auditor. Determine if their spending is 'طبيعي ومستدام' (normal and sustainable) or 'مسرف وتبذيري' (profligate and wasteful).
    2. If a kid has excessive daily transactions on consumer purchases such as sweets, junk food, toys, or video games, deduct points from their 100 Spending Score dynamically.
    3. If they managed their allowance wisely, saved most of it, or donated a portion of it, award a high score (85-100) and mark it as 'طبيعي ومستدام'.
    
    You MUST output a strict JSON array matching this exact schema:
    [
      {
        "kidName": "Name of the kid (string)",
        "suggestedScore": An integer between 0 and 100,
        "reasoning": "A concise explanation in Arabic (1-2 sentences) justifying the score based on their transactions, explicitly stating if they were 'طبيعي ومستدام' or 'مسرف وتبذيري'."
      }
    ]
    
    Output ONLY the parseable JSON array. Do not include markdown codeblocks (like \`\`\`json) or any additional text.
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanedText = text
      .trim()
      .replace(/^```json/i, '')
      .replace(/```$/, '')
      .trim();

    return JSON.parse(cleanedText) as KidSpendingEvaluation[];
  } catch (err) {
    console.warn('Gemini spending evaluation failed, falling back to mock evaluation:', err);
    return filteredKids.map(kid => {
      const spent = (kid.transactions || [])
        .filter((tx: any) => tx.type === 'withdrawal' && !tx.title.includes('حصالة') && !tx.title.includes('استثمار') && !tx.title.includes('تبرع'))
        .reduce((sum: number, tx: any) => sum + tx.amount, 0);
      const allowance = kid.allowance || 100;
      const pct = Math.min(100, Math.round((spent / allowance) * 100));
      const score = Math.max(0, 100 - pct);

      return {
        kidName: kid.name,
        suggestedScore: score,
        reasoning: `(نمط محاكاة احتياطي) تم تقييم إدارة المصروف لـ ${kid.name} بـ ${score} بناءً على نسبة الإنفاق الاستهلاكي الفعلي لديه (${spent} ريال من أصل ${allowance} ريال).`
      };
    });
  }
}

export async function get3DVillageAdvice(
  apiKey: string,
  kidName: string,
  levels: { bank: number; farm: number; market: number; windmill: number },
  balance: number,
  age: number
): Promise<string> {
  const prompt = `
    You are Alinma Bank's expert Financial Advisor "Smart Village Advisor" (مستشار القرية الذكي).
    You are advising a child named ${kidName} who is ${age} years old and has a current balance of ${balance} SAR.
    They are playing a 3D Village building game that reflects their actual financial behaviors:
    - Bank Level (الادخار): ${levels.bank}/5
    - Farm Level (التبرع/العمل الخيري): ${levels.farm}/5
    - Market Level (الاستثمار): ${levels.market}/5
    - Windmill Level (إنجاز المهام): ${levels.windmill}/5
    
    Instruction:
    Provide a highly encouraging, friendly, and brief advice in Arabic (1-3 sentences maximum).
    Address the child directly. Praise their strengths (buildings with high levels e.g. 4 or 5) and suggest realistic actions to improve their weaker areas (buildings with levels 1, 2, or 3). Mention Alinma Bank's values of smart saving, charity, and investment in an engaging, gamified way!
    Avoid markdown headers and keep the text clean, well-spaced Arabic.
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('Gemini 3D Village advice failed, falling back to mock advice:', err);
    // Mock advisor fallback
    const weakBuildings = [];
    if (levels.bank <= 3) weakBuildings.push('البنك العائلي 💰 (الادخار)');
    if (levels.farm <= 3) weakBuildings.push('واحة التبرعات 💚 (الخير)');
    if (levels.market <= 3) weakBuildings.push('سوق الاستثمار 📈 (النمو)');
    if (levels.windmill <= 3) weakBuildings.push('طاحونة المهام 🌀 (الالتزام)');

    if (weakBuildings.length === 0) {
      return `مذهل يا بطل ${kidName}! قريتك ثلاثية الأبعاد مكتملة في قمة مستواها الأسطوري 🏰✨. أنت نموذج مثالي في الادخار، الاستثمار، التبرع، والالتزام بالمهام. واصل هذا الأداء الرائع مع مصرف الإنماء!`;
    } else {
      return `قريتك ثلاثية الأبعاد تبدو رائعة يا ${kidName}! 🍃 ولكن لتجعل قصرك المركزي في أقصى قوته، حاول تطوير ${weakBuildings[0]} عن طريق زيادة نشاطك فيه. كل خطوة مالية ذكية تخطوها اليوم تبني قريتك ومستقبلك!`;
    }
  }
}

export async function getKingdomAdvice(
  apiKey: string,
  levels: { treasury: number; garden: number; harbor: number; tower: number },
  kids: any[]
): Promise<string> {
  const prompt = `
    You are Alinma Bank's expert Financial Advisor "Family Kingdom Advisor" (مستشار المملكة المالي).
    You are advising a father about his family's joint financial kingdom state:
    - Treasury Level (خزينة المملكة - الادخار): ${levels.treasury}/5
    - Royal Gardens Level (الحدائق الملكية - العمل الخيري): ${levels.garden}/5
    - Trade Harbor Level (ميناء التجارة - الاستثمار): ${levels.harbor}/5
    - Wisdom Tower Level (برج الحكمة - المهام): ${levels.tower}/5
    
    Kids status: ${JSON.stringify(kids.map(k => ({ name: k.name, balance: k.balance, bank: k.bank_level, farm: k.farm_level, market: k.market_level, tasks: k.tasks_level })))}
    
    Instruction:
    Provide a professional, encouraging, and highly actionable analysis in Arabic (2-3 sentences max).
    Address the father. Tell him which area of the family kingdom is strongest and which one is lagging. Give him 1 clear educational advice on how to encourage his children (e.g. Salem, Khalid) to improve the weaker areas (e.g. by assigning tasks or setting savings challenges).
    Keep it in clean, well-spaced Arabic. No markdown.
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('Gemini Kingdom advice failed, falling back to mock advice:', err);
    // Fallback advice
    const lagging = [];
    if (levels.treasury <= 3) lagging.push('الادخار 💰');
    if (levels.garden <= 3) lagging.push('العمل الخيري 💚');
    if (levels.harbor <= 3) lagging.push('الاستثمار 📈');
    if (levels.tower <= 3) lagging.push('المهام 🌀');

    if (lagging.length > 0) {
      return `مرحباً يا أبو خالد. تظهر قريتك المشتركة توازناً جيداً، ولكن يمكنك تحفيز الأبناء على تعزيز ${lagging[0]} من خلال إسناد مهام جديدة أو إنشاء تحديات حصالة مشتركة لرفع مستوى المملكة الموحدة!`;
    } else {
      return `أهلاً بك يا أبو خالد. تهانينا! قريتكم العائلية الموحدة في قمتها الأسطورية وتكشف عن سلوك مالي مثالي ومستدام لأبنائك. واصل تشجيعهم ورعايتهم المتميزة!`;
    }
  }
}

