import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SuggestedTask {
  title: string;
  suggestedAmount: number;
  type: 'cash' | 'points';
  reasoning: string;
}

export async function suggestTaskForKid(
  apiKey: string,
  kidData: any,
  fatherNotes?: string
): Promise<SuggestedTask> {
  const prompt = `
    You are a financial coach for Alinma Bank's kids financial literacy application "Namaa".
    Your role is to analyze a child's financial profile and suggest a personalized, educational house task or financial responsibility.
    
    Child Profile:
    - Name: ${kidData.name}
    - Age: ${kidData.age}
    - Balance: ${kidData.balance} SAR
    - Savings Goals: ${JSON.stringify(kidData.savingsGoals || [])}
    - Recent Transactions: ${JSON.stringify((kidData.transactions || []).slice(0, 5))}
    - Father's specific instructions/notes: "${fatherNotes || 'None provided'}"
    
    Based on this, suggest a task that helps them:
    - Earn money if their balance is low.
    - Practice delayed gratification if they have a savings goal.
    - Encourage charity if they have excess money.
    - Fits their age.
    
    You MUST output a JSON object in this exact schema:
    {
      "title": "A short, engaging task title in Arabic (e.g., ترتيب الغرفة وترتيب الكتب 🧹)",
      "suggestedAmount": A reasonable reward amount (integer number, e.g. 10 or 15),
      "type": "cash" or "points",
      "reasoning": "A concise explanation in Arabic for the father explaining why this task is suggested based on the kid's financial status."
    }
    
    Output ONLY the JSON object. Do not include markdown codeblocks (like \`\`\`json) or any additional text.
  `;

  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash', // التعديل هنا
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean potential json block markers if returned despite mime-type config
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
  familyData: { kids: any[]; projects: any[] }
): Promise<string> {
  const prompt = `
    You are Alinma Bank's expert Financial Family Coach inside the application "Namaa".
    Your role is to guide and advise the father on kids' financial literacy, budgeting, and savings behaviors based on Alinma Bank's core standards.
    
    Family Data:
    - Kids profiles: ${JSON.stringify(familyData.kids || [])}
    - Family projects: ${JSON.stringify(familyData.projects || [])}
    
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

