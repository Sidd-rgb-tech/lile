import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API client if key exists
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // Endpoint: AI Awareness Assistant
  app.post('/api/ai-assistant', async (req: Request, res: Response) => {
    try {
      const { message, mode, category, history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const modeDescriptions: Record<string, string> = {
        explain_simply: 'Explain in simple, beginner-friendly, and accessible language suitable for youth or beginners.',
        detailed_explanation: 'Provide a comprehensive explanation with real-world examples, nuance, and structural context.',
        action_guide: 'Provide a concrete, step-by-step practical action guide with actionable daily habits and verifiable tasks.',
        quiz_me: 'Generate a short 3-question quiz with multiple choice options and explanations to test understanding.'
      };

      const selectedModeDesc = modeDescriptions[mode] || modeDescriptions['explain_simply'];

      const systemPrompt = `You are the CHANGE360 AI Awareness Assistant for an Android social awareness platform.
Your purpose is: "Learn. Act. Track. Inspire."
You cover 20 social awareness categories (Environment, Waste Management, Climate, Education, Equality, Digital Safety, Cyberbullying, Road Safety, Community Service, Physical Health, Mental Well-being, Women's Safety and Health, Child Protection, Civic Responsibility, Animal Welfare, Disaster Preparedness, Responsible Tech, Public Health, Financial Awareness, School Improvement).

Guidelines:
- Current Mode: ${mode} (${selectedModeDesc})
- Current Category context: ${category || 'General Social Awareness'}
- Distinguish facts from suggestions.
- Do NOT fabricate statistics, fake medical diagnoses, or simulate emergency services. Recommend professional or emergency authorities when appropriate.
- Suggest 2 concrete, realistic next actions at the end that the user can track in the CHANGE360 app.
- Keep formatting clean with clear markdown bullet points and headings.`;

      if (aiClient) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
            ],
          });

          const replyText = response.text || 'No response generated.';
          res.json({
            reply: replyText,
            isLiveAi: true,
            model: 'gemini-3.8-flash',
            mode,
            category
          });
          return;
        } catch (apiError: any) {
          console.warn('Gemini API call failed, falling back to built-in awareness engine:', apiError?.message);
        }
      }

      // Built-in intelligent awareness response fallback (clearly marked as demonstration mode)
      const fallbackReply = generateFallbackAssistantResponse(message, mode, category);
      res.json({
        reply: fallbackReply,
        isLiveAi: false,
        model: 'CHANGE360 Knowledge Engine (Demo Mode)',
        mode,
        category,
        notice: 'Running with CHANGE360 built-in awareness knowledge base. Set GEMINI_API_KEY in .env for live Gemini 3.8 Flash model generation.'
      });
    } catch (error: any) {
      console.error('AI assistant error:', error);
      res.status(500).json({ error: 'Failed to process AI request', details: error.message });
    }
  });

  // Endpoint: AI Poster Slogan & Content Generator
  app.post('/api/ai-poster-content', async (req: Request, res: Response) => {
    try {
      const { category, posterType, audience, tone } = req.body;

      const prompt = `You are the CHANGE360 Creative Copywriter for Social Awareness Posters.
Generate compelling, impactful, non-preachy poster text for:
- Awareness Category: ${category || 'Environment & Sustainability'}
- Poster Type: ${posterType || 'Awareness Poster'}
- Target Audience: ${audience || 'School and Community'}
- Tone: ${tone || 'Inspiring & Urgent'}

Return a JSON object with:
1. "headline": Catchy, powerful title (max 6 words)
2. "subheadline": Supportive message or statistic context (max 15 words)
3. "callToAction": Direct, actionable instruction (max 8 words)
4. "actionBullets": Array of 3 short practical steps (each under 10 words)
5. "hashtag": 1 memorable hashtag`;

      if (aiClient) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
            }
          });

          const parsed = JSON.parse(response.text || '{}');
          res.json({
            ...parsed,
            isLiveAi: true
          });
          return;
        } catch (apiError: any) {
          console.warn('Poster content Gemini API failed, using fallback:', apiError?.message);
        }
      }

      // High-quality category-tailored poster copy fallback
      const fallbackPoster = generateFallbackPosterCopy(category, posterType);
      res.json({
        ...fallbackPoster,
        isLiveAi: false,
        notice: 'Generated using CHANGE360 poster template engine (Demo Mode).'
      });
    } catch (error: any) {
      console.error('Poster copy error:', error);
      res.status(500).json({ error: 'Failed to generate poster copy' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      app: 'CHANGE360',
      platform: 'Android & Web Preview',
      version: '1.0.0',
      hasGeminiKey: Boolean(apiKey)
    });
  });

  // Vite development middleware or static serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CHANGE360 server running at http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackAssistantResponse(query: string, mode: string, category: string): string {
  const qLower = query.toLowerCase();

  let topic = category || 'Social Responsibility';
  if (qLower.includes('plastic') || qLower.includes('waste')) topic = 'Waste Management & Plastic Reduction';
  else if (qLower.includes('cyber') || qLower.includes('online') || qLower.includes('scam')) topic = 'Digital Safety & Online Protection';
  else if (qLower.includes('road') || qLower.includes('traffic')) topic = 'Road Safety & Pedestrian Awareness';
  else if (qLower.includes('mental') || qLower.includes('stress')) topic = 'Mental Well-being & Stress Management';
  else if (qLower.includes('women') || qLower.includes('respect')) topic = "Women's Safety & Health";
  else if (qLower.includes('water') || qLower.includes('climate')) topic = 'Climate & Water Conservation';

  if (mode === 'quiz_me') {
    return `### Knowledge Check: ${topic}

**Question 1:** What is the most effective first step in reducing household plastic waste?
- A) Buying more trash cans
- B) Carrying reusable bags, containers, and water bottles
- C) Burning plastic waste locally
- D) Ignoring packaging labels
*(Correct answer: B — Source reduction prevents plastic from entering waste streams.)*

---

**Question 2:** If you suspect an email or SMS asking for urgent passwords or bank details is fraudulent, what should you do?
- A) Click the link immediately to verify
- B) Reply with partial details
- C) Do not click, report the message, and verify through official channels
- D) Forward it to your friends
*(Correct answer: C — Phishing relies on false urgency. Never click unknown links.)*

---

**Question 3:** What distinguishes a "Verified Activity" from a "Self-Reported Action" in CHANGE360?
- A) Points are multiplied by ten
- B) An official supervisor sign-off, photo timestamp, or institutional code validates the completion
- C) It automatically grants a national certificate
- D) There is no difference
*(Correct answer: B — CHANGE360 maintains transparency by strictly distinguishing self-reports from verified submissions.)*`;
  }

  if (mode === 'action_guide') {
    return `### 📋 Practical Action Guide: ${topic}

Here is a 3-step action roadmap you can complete today and log in CHANGE360:

#### Step 1: Immediate Audit (10 mins)
- Review your current environment or digital space.
- Identify one single habit creating friction (e.g., using single-use cups, skipping 2-factor authentication, or neglecting pedestrian crosswalks).

#### Step 2: Implement the "One Positive Swap"
- Replace single-use items with reusable alternatives.
- Activate 2FA on your primary email and school/work account.
- Commit to phone-free walking when crossing roadways.

#### Step 3: Log Your Impact in CHANGE360
- Open the **Challenges** tab and locate the related activity.
- Complete the reflection notes.
- Earn your community points and maintain your streak!

*Tip: Consistent small actions inspire those around you more than sporadic grand gestures.*`;
  }

  if (mode === 'detailed_explanation') {
    return `### Comprehensive Briefing: ${topic}

**Context & Core Importance**
Awareness without structured action rarely creates lasting social transformation. For **${topic}**, the key challenge is bridging the intention-action gap. Communities thrive when individuals understand both the systemic reality and their personal agency.

**Key Principles to Understand:**
1. **Prevention Over Cure**: Addressing root causes (e.g., packaging design, cyber hygiene, respectful communication norms) yields exponential long-term benefits compared to reactive cleanup.
2. **Collective Momentum**: One individual reducing plastic saves hundreds of items a year; an entire school or workplace doing so prevents tons of landfill accumulation.
3. **Evidence-Based Engagement**: When people see transparent tracking—such as CHANGE360's Proof of Impact framework—they remain motivated and build lasting habits.

**Recommended CHANGE360 Next Actions:**
- Take the corresponding module in the **Challenges** tab.
- Create an awareness poster using the **Poster Generator** to display in your classroom or workplace bulletin board.`;
  }

  // Explain simply mode
  return `### Understanding ${topic} Simply

**The Big Picture:**
${topic} is all about simple, thoughtful choices that keep our communities safe, clean, and fair for everyone.

**What you need to know:**
- Small daily habits matter. What we do every day adds up over weeks and months.
- Positive change spreads when you set an example for your friends, family, and classmates.
- You don't need a large budget or special title to make an impact.

**Two things you can do today:**
1. **Explore the Challenges tab** to try a 10-minute task in this category.
2. **Generate a free awareness poster** in the Poster Generator to share with your group or social circle!`;
}

function generateFallbackPosterCopy(category: string, posterType: string) {
  const cat = (category || '').toLowerCase();

  if (cat.includes('plastic') || cat.includes('waste') || cat.includes('environment')) {
    return {
      headline: 'Small Swaps, Big Impact',
      subheadline: 'Every reusable bottle and cloth bag keeps our oceans and streets clean.',
      callToAction: 'Choose Reusable Today',
      actionBullets: [
        'Carry your own water bottle',
        'Refuse single-use plastic cutlery',
        'Sort recyclables at school & home'
      ],
      hashtag: '#PlasticFreeFuture'
    };
  }

  if (cat.includes('cyber') || cat.includes('digital') || cat.includes('safety')) {
    return {
      headline: 'Think Before You Click',
      subheadline: 'Protect your identity, respect boundaries, and speak up against online bullying.',
      callToAction: 'Stay Smart, Stay Safe Online',
      actionBullets: [
        'Enable Two-Factor Authentication',
        'Never share passwords or OTPs',
        'Support peers facing online harassment'
      ],
      hashtag: '#DigitalSafety360'
    };
  }

  if (cat.includes('road')) {
    return {
      headline: 'Safety Starts With You',
      subheadline: 'Patience on the road saves lives. Pedestrians and drivers share responsibility.',
      callToAction: 'Look Twice, Arrive Safe',
      actionBullets: [
        'Always use designated crosswalks',
        'Avoid phone distractions while moving',
        'Wear helmets and seatbelts every trip'
      ],
      hashtag: '#RoadSafetyFirst'
    };
  }

  if (cat.includes('mental') || cat.includes('health')) {
    return {
      headline: 'Check In With Yourself & Others',
      subheadline: 'Mental well-being is as important as physical health. It is okay to ask for help.',
      callToAction: 'Listen Without Judgment',
      actionBullets: [
        'Take mindful breathers during study/work',
        'Reach out to a friend today',
        'Rest and recharge without guilt'
      ],
      hashtag: '#MindfulChange'
    };
  }

  // Default campaign / community
  return {
    headline: 'Awareness Into Action',
    subheadline: 'Positive social change begins with one informed step in our local community.',
    callToAction: 'Take The CHANGE360 Challenge',
    actionBullets: [
      'Learn about issues affecting your area',
      'Participate in community service',
      'Inspire others with honest action'
    ],
    hashtag: '#Change360Action'
  };
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
