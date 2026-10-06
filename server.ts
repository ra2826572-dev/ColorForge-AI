import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GeminiProvider, generateSmartPalette } from './src/server/aiProvider';
import { ColorSystem, GenerationHistoryItem, Project, User } from './src/types/colorforge';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Force application/json for all /api routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Local JSON store persistence
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBData {
  users: User[];
  passwords: Record<string, string>; // userId -> password
  projects: Project[];
  history: GenerationHistoryItem[];
}

function loadDB(): DBData {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading db file, reinitializing', e);
    }
  }

  // Seed with initial realistic demo state
  const defaultUserId = 'user_demo_1';
  const defaultUser: User = {
    id: defaultUserId,
    name: 'Alex Vance',
    email: 'alex.vance@studio.design',
    avatar: '/src/assets/images/avatar_designer_user_1791282031801.jpg',
    plan: 'free',
    generationsUsed: 3,
    maxFreeGenerations: 10,
    aiGenerationsUsed: 3,
    maxAiGenerations: 10,
    palettesUsed: 5,
    maxPalettes: 20,
    createdAt: new Date().toISOString(),
  };

  const initialPalette = generateSmartPalette({
    websiteName: 'Apex Cloud Platform',
    category: 'SaaS',
    description: 'High-performance cloud intelligence and developer infrastructure.',
    targetAudience: 'Developers',
    style: 'Modern',
    themePreference: 'both',
    colorPreference: 'Blue',
  });

  const luxePalette = generateSmartPalette({
    websiteName: 'Maison Noir Architectural Studio',
    category: 'Luxury',
    description: 'Bespoke residential architectural firm and high-end design showroom.',
    targetAudience: 'Luxury Customers',
    style: 'Luxury',
    themePreference: 'both',
    colorPreference: 'Purple',
  });

  const defaultProjects: Project[] = [
    {
      id: 'proj_apex_1',
      userId: defaultUserId,
      projectName: 'Apex Cloud Design System',
      websiteName: 'Apex Cloud Platform',
      category: 'SaaS',
      description: 'High-performance cloud intelligence and developer infrastructure.',
      targetAudience: 'Developers',
      style: 'Modern',
      themePreference: 'both',
      colorSystem: initialPalette,
      isFavorite: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'proj_luxe_2',
      userId: defaultUserId,
      projectName: 'Maison Noir Identity',
      websiteName: 'Maison Noir Architectural Studio',
      category: 'Luxury',
      description: 'Bespoke residential architectural firm and high-end design showroom.',
      targetAudience: 'Luxury Customers',
      style: 'Luxury',
      themePreference: 'both',
      colorSystem: luxePalette,
      isFavorite: false,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const defaultHistory: GenerationHistoryItem[] = [
    {
      id: 'hist_1',
      userId: defaultUserId,
      websiteName: 'Apex Cloud Platform',
      category: 'SaaS',
      style: 'Modern',
      promptSummary: 'Modern Developer SaaS with high contrast and indigo accents',
      primaryHex: initialPalette.lightPalette.primary.hex,
      secondaryHex: initialPalette.lightPalette.secondary.hex,
      backgroundHex: initialPalette.lightPalette.background.hex,
      textHex: initialPalette.lightPalette.text.hex,
      colorSystem: initialPalette,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'hist_2',
      userId: defaultUserId,
      websiteName: 'Maison Noir Architectural Studio',
      category: 'Luxury',
      style: 'Luxury',
      promptSummary: 'Deep obsidian and refined violet architectural palette',
      primaryHex: luxePalette.lightPalette.primary.hex,
      secondaryHex: luxePalette.lightPalette.secondary.hex,
      backgroundHex: luxePalette.lightPalette.background.hex,
      textHex: luxePalette.lightPalette.text.hex,
      colorSystem: luxePalette,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const seed: DBData = {
    users: [defaultUser],
    passwords: { [defaultUserId]: 'password123' },
    projects: defaultProjects,
    history: defaultHistory,
  };

  saveDB(seed);
  return seed;
}

function saveDB(data: DBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db file', err);
  }
}

// AI Provider Instance
const aiProvider = new GeminiProvider(process.env.GEMINI_API_KEY);

// ----------------- API ROUTES -----------------

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  const cleanName = (typeof name === 'string' ? name : '').trim();
  const cleanEmail = (typeof email === 'string' ? email : '').trim().toLowerCase();
  const cleanPassword = typeof password === 'string' ? password : '';

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return res.status(400).json({
      success: false,
      error: 'Full name, email, and password are required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address.',
    });
  }

  if (cleanPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters long.',
    });
  }

  const db = loadDB();
  const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({
      success: false,
      error: 'An account with this email already exists.',
    });
  }

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    email: cleanEmail,
    avatar: '/src/assets/images/avatar_founder_user_1791282046459.jpg',
    plan: 'free',
    generationsUsed: 0,
    maxFreeGenerations: 10,
    aiGenerationsUsed: 0,
    maxAiGenerations: 10,
    palettesUsed: 0,
    maxPalettes: 20,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.passwords[newUser.id] = cleanPassword;
  saveDB(db);

  return res.status(201).json({
    success: true,
    user: newUser,
  });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  const cleanEmail = (typeof email === 'string' ? email : '').trim().toLowerCase();
  const cleanPassword = typeof password === 'string' ? password : '';

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.',
    });
  }

  const db = loadDB();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user || db.passwords[user.id] !== cleanPassword) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password credentials.',
    });
  }

  return res.json({
    success: true,
    user,
  });
});

// Auth: Forgot Password simulation
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  // Simulate sending password reset instructions
  return res.json({ success: true, message: `Password reset instructions sent to ${email}.` });
});

// Auth: Reset Password simulation
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password required.' });
  }
  const db = loadDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  db.passwords[user.id] = newPassword;
  saveDB(db);
  return res.json({ success: true, message: 'Password reset successfully.' });
});

// Auth: Update Profile
app.patch('/api/auth/profile', (req, res) => {
  const { userId, name, username, email, avatar } = req.body;
  const db = loadDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (name) user.name = name;
  if (username) user.username = username;
  if (name && !user.username) user.username = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  saveDB(db);
  return res.json({ user });
});

// User Plan Upgrade
app.post('/api/user/upgrade', (req, res) => {
  const { userId, plan } = req.body;
  const db = loadDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  user.plan = plan || 'pro';
  saveDB(db);
  return res.json({ user, message: 'Subscription updated successfully.' });
});

// AI Color Generation
app.post('/api/generate-palette', async (req, res) => {
  const { userId, websiteName, category, description, targetAudience, style, themePreference, colorPreference } = req.body;

  if (!websiteName || !category) {
    return res.status(400).json({ error: 'Website name and category are required.' });
  }

  const db = loadDB();
  const user = db.users.find(u => u.id === userId);

  // Free plan limit check
  if (user && user.plan === 'free' && user.generationsUsed >= user.maxFreeGenerations) {
    return res.status(403).json({
      error: 'You have reached your free plan limit of 5 generations this month. Upgrade to Pro for unlimited generations.',
      limitReached: true,
    });
  }

  try {
    const colorSystem = await aiProvider.generatePalette({
      websiteName,
      category,
      description: description || 'Modern website for ' + websiteName,
      targetAudience: targetAudience || 'General Audience',
      style: style || 'Modern',
      themePreference: themePreference || 'both',
      colorPreference: colorPreference || 'AI Decides',
    });

    // Increment usage
    if (user) {
      user.generationsUsed += 1;
    }

    // Save to history
    const historyItem: GenerationHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || 'anonymous',
      websiteName,
      category,
      style: style || 'Modern',
      promptSummary: `${style || 'Modern'} ${category} palette: ${colorSystem.brandExplanation.brandPersonality}`,
      primaryHex: colorSystem.lightPalette.primary.hex,
      secondaryHex: colorSystem.lightPalette.secondary.hex,
      backgroundHex: colorSystem.lightPalette.background.hex,
      textHex: colorSystem.lightPalette.text.hex,
      colorSystem,
      createdAt: new Date().toISOString(),
    };
    db.history.unshift(historyItem);
    saveDB(db);

    return res.json({
      colorSystem,
      generationsUsed: user ? user.generationsUsed : 1,
      maxFreeGenerations: user ? user.maxFreeGenerations : 5,
    });
  } catch (err: any) {
    console.error('Palette generation route error:', err);
    return res.status(500).json({ error: 'Failed to generate palette: ' + (err.message || 'Server error') });
  }
});

// AI Palette Refinement
app.post('/api/refine-palette', async (req, res) => {
  const { currentSystem, prompt } = req.body;
  if (!currentSystem || !prompt) {
    return res.status(400).json({ error: 'Current system and refinement prompt are required.' });
  }

  try {
    const refined = await aiProvider.refinePalette({ currentSystem, prompt });
    return res.json({ colorSystem: refined });
  } catch (err: any) {
    console.error('Palette refinement error:', err);
    return res.status(500).json({ error: 'Failed to refine palette.' });
  }
});

// Color Analyzer
app.post('/api/analyze-color', async (req, res) => {
  const { colorInput } = req.body;
  if (!colorInput) {
    return res.status(400).json({ error: 'Color input (HEX, RGB, or HSL) is required.' });
  }

  try {
    const analysis = await aiProvider.analyzeColor({ colorInput });
    return res.json({ analysis });
  } catch (err: any) {
    console.error('Color analyzer error:', err);
    return res.status(500).json({ error: 'Failed to analyze color.' });
  }
});

// AI Website Layout Generation Endpoint
app.post('/api/generate-layout', async (req, res) => {
  const { colors, websiteType, websiteName } = req.body;
  if (!colors || !websiteType) {
    return res.status(400).json({ error: 'Colors and website type are required.' });
  }

  return res.json({
    success: true,
    websiteType,
    websiteName: websiteName || 'ColorForge AI',
    colors,
    timestamp: new Date().toISOString(),
  });
});

// Projects CRUD
app.get('/api/projects', (req, res) => {
  const userId = (req.query.userId as string) || 'user_demo_1';
  const db = loadDB();
  let userProjects = db.projects.filter(p => p.userId === userId);

  // If new user has no projects, seed default starter systems for them
  if (userProjects.length === 0 && db.projects.length > 0) {
    const starterSeed = db.projects.slice(0, 2).map((p, idx) => ({
      ...p,
      id: `proj_${userId}_${idx}_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    db.projects.push(...starterSeed);
    saveDB(db);
    userProjects = starterSeed;
  }

  return res.json({ projects: userProjects });
});

app.post('/api/projects', (req, res) => {
  const { userId, projectName, websiteName, category, description, targetAudience, style, themePreference, colorSystem } = req.body;
  if (!projectName || !colorSystem) {
    return res.status(400).json({ error: 'Project name and color system are required.' });
  }

  const db = loadDB();
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || 'user_demo_1',
    projectName,
    websiteName: websiteName || colorSystem.websiteName,
    category: category || colorSystem.category,
    description: description || colorSystem.description,
    targetAudience: targetAudience || colorSystem.targetAudience,
    style: style || colorSystem.style,
    themePreference: themePreference || colorSystem.themePreference,
    colorSystem,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.unshift(newProject);
  saveDB(db);
  return res.json({ project: newProject });
});

app.patch('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { projectName, colorSystem, isFavorite } = req.body;
  const db = loadDB();
  const proj = db.projects.find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  if (projectName !== undefined) proj.projectName = projectName;
  if (colorSystem !== undefined) proj.colorSystem = colorSystem;
  if (isFavorite !== undefined) proj.isFavorite = isFavorite;
  proj.updatedAt = new Date().toISOString();

  saveDB(db);
  return res.json({ project: proj });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.projects = db.projects.filter(p => p.id !== id);
  saveDB(db);
  return res.json({ success: true, id });
});

app.post('/api/projects/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const proj = db.projects.find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const duplicated: Project = {
    ...JSON.parse(JSON.stringify(proj)),
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    projectName: `${proj.projectName} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.unshift(duplicated);
  saveDB(db);
  return res.json({ project: duplicated });
});

// History CRUD
app.get('/api/history', (req, res) => {
  const userId = (req.query.userId as string) || 'user_demo_1';
  const db = loadDB();
  let userHistory = db.history.filter(h => h.userId === userId);

  if (userHistory.length === 0 && db.history.length > 0) {
    const starterHist = db.history.slice(0, 2).map((h, idx) => ({
      ...h,
      id: `hist_${userId}_${idx}_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
    }));
    db.history.push(...starterHist);
    saveDB(db);
    userHistory = starterHist;
  }

  return res.json({ history: userHistory });
});

app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.history = db.history.filter(h => h.id !== id);
  saveDB(db);
  return res.json({ success: true, id });
});

// 404 catch-all for /api/* to guarantee JSON response and prevent HTML fallthrough
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.path} not found.`,
  });
});

// Global API error handler ensuring no HTML error page is returned
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api/')) {
    console.error('API Error Exception:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An internal server error occurred.',
    });
  }
  next(err);
});

// ----------------- VITE / STATIC SERVING -----------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ColorForge AI] Server active on http://0.0.0.0:${PORT} (env: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
