import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Import AuraLang core modules
import { IntentEngine } from './auralang/intent-engine'
import { QuantumStateManager } from './auralang/quantum-state'
import { DataFlowOptimizer } from './auralang/dataflow-optimizer'
import { NeuralArchitecture } from './auralang/neural-architecture'

// Import comprehensive API routes
import apiRoutes from './api-routes'

const app = new Hono()

// Enable CORS for frontend-backend communication
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Initialize AuraLang engines
const intentEngine = new IntentEngine()
const quantumState = new QuantumStateManager()
const dataFlowOptimizer = new DataFlowOptimizer()
const neuralArch = new NeuralArchitecture()

// Mount all 105+ feature API routes
app.route('/api', apiRoutes)

// Legacy AuraLang API routes (kept for backwards compatibility)
app.post('/api/intent/execute', async (c) => {
  const intentDeclaration = await c.req.json()
  const result = await intentEngine.execute(intentDeclaration)
  return c.json(result)
})

app.post('/api/quantum/collapse', async (c) => {
  const { stateId } = await c.req.json()
  const result = await quantumState.collapseState(stateId)
  return c.json(result)
})

app.get('/api/quantum/state/:id', async (c) => {
  const stateId = c.req.param('id')
  const state = await quantumState.getState(stateId)
  return c.json(state)
})

app.post('/api/dataflow/optimize', async (c) => {
  const flowDefinition = await c.req.json()
  const optimizedFlow = await dataFlowOptimizer.optimize(flowDefinition)
  return c.json(optimizedFlow)
})

app.post('/api/neural/evolve', async (c) => {
  const architectureSpec = await c.req.json()
  const evolvedArch = await neuralArch.evolve(architectureSpec)
  return c.json(evolvedArch)
})

// Main AuraLang IDE interface
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AuraLang - Next-Generation AI Programming Language</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'aura-purple': '#8B5CF6',
                  'aura-blue': '#3B82F6',
                  'aura-cyan': '#06B6D4',
                  'quantum-glow': '#A855F7'
                },
                animation: {
                  'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite',
                  'data-flow': 'data-flow 3s ease-in-out infinite'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen text-white">
        <!-- Header -->
        <header class="border-b border-purple-500/30 bg-black/20 backdrop-blur-lg">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-aura-purple to-aura-cyan rounded-lg flex items-center justify-center">
                            <i class="fas fa-atom text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-aura-purple to-aura-cyan bg-clip-text text-transparent">
                                AuraLang
                            </h1>
                            <p class="text-sm text-gray-400">Never Done Complex More Easy</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button onclick="window.location.href='/features'" class="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all transform hover:scale-105">
                            <i class="fas fa-rocket mr-2"></i>105+ Features
                        </button>
                        <button class="px-4 py-2 bg-aura-purple hover:bg-purple-600 rounded-lg transition-colors">
                            <i class="fas fa-play mr-2"></i>Run Intent
                        </button>
                        <button class="px-4 py-2 bg-aura-blue hover:bg-blue-600 rounded-lg transition-colors">
                            <i class="fas fa-save mr-2"></i>Save
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-6 py-8">
            <!-- Feature Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-aura-purple transition-colors">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-bullseye text-aura-purple text-2xl mr-3"></i>
                        <h3 class="font-bold">Intent-Based</h3>
                    </div>
                    <p class="text-gray-300 text-sm">Declare what you want, not how to build it</p>
                </div>
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 hover:border-aura-cyan transition-colors">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-atom text-aura-cyan text-2xl mr-3"></i>
                        <h3 class="font-bold">Quantum States</h3>
                    </div>
                    <p class="text-gray-300 text-sm">Superposition-based state management</p>
                </div>
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-aura-blue transition-colors">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-chart-line text-aura-blue text-2xl mr-3"></i>
                        <h3 class="font-bold">Self-Optimizing</h3>
                    </div>
                    <p class="text-gray-300 text-sm">Automatic performance improvements</p>
                </div>
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-quantum-glow transition-colors">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-brain text-quantum-glow text-2xl mr-3"></i>
                        <h3 class="font-bold">Neural Architecture</h3>
                    </div>
                    <p class="text-gray-300 text-sm">AI-driven component evolution</p>
                </div>
            </div>

            <!-- Code Editor Area -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- AuraLang Code Editor -->
                <div class="bg-black/30 backdrop-blur-lg rounded-xl border border-purple-500/30">
                    <div class="border-b border-purple-500/30 p-4">
                        <h3 class="font-bold flex items-center">
                            <i class="fas fa-code mr-2 text-aura-purple"></i>
                            AuraLang Editor
                        </h3>
                    </div>
                    <div class="p-4">
                        <textarea id="auracode" class="w-full h-96 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-aura-purple focus:outline-none resize-none" placeholder="Enter your AuraLang code here...">intent build_cognitive_assistant {
  capabilities: [
    "real-time knowledge synthesis",
    "predictive task completion", 
    "emotional intelligence integration",
    "cross-domain reasoning"
  ]
  
  architecture: cognitive_stack {
    layer_1: sensory_input_processing
    layer_2: pattern_recognition_cross_domain
    layer_3: abstract_reasoning
    layer_4: creative_synthesis
    layer_5: ethical_constraint_application
  }
  
  training: multi_modal_continuous_learning
  
  # Beyond current LLMs
  special_features: [
    "maintains coherent long-term context (1M+ tokens)",
    "understands and generates novel concepts",
    "self-corrects reasoning errors",
    "collaborates with other AI instances"
  ]
}</textarea>
                    </div>
                </div>

                <!-- Output/Visualization -->
                <div class="bg-black/30 backdrop-blur-lg rounded-xl border border-cyan-500/30">
                    <div class="border-b border-cyan-500/30 p-4">
                        <h3 class="font-bold flex items-center">
                            <i class="fas fa-terminal mr-2 text-aura-cyan"></i>
                            Execution Output
                        </h3>
                    </div>
                    <div class="p-4">
                        <div id="output" class="h-96 bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-auto">
                            <div class="text-cyan-400 font-mono text-sm">
                                <div class="mb-2">🚀 AuraLang Runtime v1.0.0</div>
                                <div class="mb-2">📡 Initializing quantum state manager...</div>
                                <div class="mb-2">🧠 Loading neural architecture patterns...</div>
                                <div class="mb-2">⚡ Dataflow optimizer ready</div>
                                <div class="text-green-400">✅ Ready to execute intents</div>
                                <div class="mt-4 text-gray-500">> Waiting for intent execution...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Real-time System Status -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-green-400">Quantum States</h4>
                        <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Active Superpositions:</span>
                            <span class="text-green-400">3</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Collapsed States:</span>
                            <span class="text-blue-400">7</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Entanglements:</span>
                            <span class="text-purple-400">12</span>
                        </div>
                    </div>
                </div>

                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-blue-400">Optimization</h4>
                        <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Performance Gain:</span>
                            <span class="text-green-400">+340%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Memory Efficiency:</span>
                            <span class="text-blue-400">92%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Auto-optimizations:</span>
                            <span class="text-purple-400">156</span>
                        </div>
                    </div>
                </div>

                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-purple-400">Neural Evolution</h4>
                        <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Architecture Changes:</span>
                            <span class="text-green-400">23</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Learning Rate:</span>
                            <span class="text-blue-400">0.0032</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Evolution Cycles:</span>
                            <span class="text-purple-400">1,247</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Documentation Section -->
            <div class="mt-8 bg-black/30 backdrop-blur-lg rounded-xl border border-gray-500/30">
                <div class="border-b border-gray-500/30 p-4">
                    <h3 class="font-bold flex items-center">
                        <i class="fas fa-book mr-2 text-gray-400"></i>
                        AuraLang Documentation
                    </h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-bold mb-3 text-aura-purple">Core Concepts</h4>
                            <ul class="space-y-2 text-sm text-gray-300">
                                <li>• <strong>Intent Declarations:</strong> Define goals, not implementations</li>
                                <li>• <strong>Quantum States:</strong> Superposition-based state management</li>
                                <li>• <strong>Auto-optimization:</strong> Continuous performance improvements</li>
                                <li>• <strong>Neural Evolution:</strong> AI-driven architecture changes</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold mb-3 text-aura-cyan">Example Patterns</h4>
                            <ul class="space-y-2 text-sm text-gray-300">
                                <li>• <code class="bg-gray-800 px-2 py-1 rounded">intent</code> - Declare system goals</li>
                                <li>• <code class="bg-gray-800 px-2 py-1 rounded">state</code> - Quantum state definitions</li>
                                <li>• <code class="bg-gray-800 px-2 py-1 rounded">dataflow</code> - Optimized data pipelines</li>
                                <li>• <code class="bg-gray-800 px-2 py-1 rounded">component</code> - Neural architectures</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/auralang-ide.js"></script>
    </body>
    </html>
  `)
})

// Features showcase page
app.get('/features', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AuraLang - 105+ Revolutionary Features</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .gradient-animate {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
        </style>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        <!-- Header -->
        <header class="border-b border-purple-500/30 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <button onclick="window.location.href='/'" class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-atom text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                AuraLang
                            </h1>
                            <p class="text-xs text-gray-400">105+ Revolutionary Features</p>
                        </div>
                    </button>
                    <a href="/" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                        <i class="fas fa-code mr-2"></i>Back to IDE
                    </a>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-12">
            <!-- Hero Section -->
            <div class="text-center mb-16">
                <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent gradient-animate">
                    105+ Revolutionary Features
                </h1>
                <p class="text-xl text-gray-300 mb-8">The World's Most Advanced Free AI Programming Platform</p>
                <div class="flex justify-center space-x-4">
                    <div class="bg-black/40 rounded-lg px-6 py-3 backdrop-blur-lg border border-purple-500/30">
                        <div class="text-3xl font-bold text-purple-400">105+</div>
                        <div class="text-sm text-gray-400">Features</div>
                    </div>
                    <div class="bg-black/40 rounded-lg px-6 py-3 backdrop-blur-lg border border-cyan-500/30">
                        <div class="text-3xl font-bold text-cyan-400">10</div>
                        <div class="text-sm text-gray-400">Service Layers</div>
                    </div>
                    <div class="bg-black/40 rounded-lg px-6 py-3 backdrop-blur-lg border border-pink-500/30">
                        <div class="text-3xl font-bold text-pink-400">100%</div>
                        <div class="text-sm text-gray-400">Free</div>
                    </div>
                </div>
            </div>

            <!-- Features Grid -->
            <div class="space-y-12">
                <!-- Phase 1: Authentication & User Management -->
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30">
                    <h2 class="text-3xl font-bold mb-6 flex items-center text-purple-400">
                        <i class="fas fa-user-shield mr-3"></i>
                        Phase 1: Authentication & User Management (Features 1-10)
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Multi-Provider Auth</strong> - Email, Google, GitHub, Microsoft, Apple</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>JWT Sessions</strong> - Secure token-based authentication</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>2FA</strong> - Two-factor authentication with TOTP</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Biometric Auth</strong> - Fingerprint & face recognition</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Magic Links</strong> - Passwordless authentication</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>OAuth Integration</strong> - Social login providers</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>RBAC</strong> - Role-based access control</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>User Profiles</strong> - Customizable user profiles</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Achievements</strong> - Gamification system</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Analytics</strong> - User activity analytics</div></div>
                    </div>
                </div>

                <!-- Phase 2: Project Management -->
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-cyan-500/30">
                    <h2 class="text-3xl font-bold mb-6 flex items-center text-cyan-400">
                        <i class="fas fa-folder-open mr-3"></i>
                        Phase 2: Project Management & Collaboration (Features 11-20)
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Multi-Project Workspace</strong> - Organize multiple projects</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Version Control</strong> - Git-like versioning</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Templates</strong> - Pre-built project templates</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Real-time Collab</strong> - Live collaboration</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Sharing & Forking</strong> - Share and fork projects</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Search & Discovery</strong> - Find public projects</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Analytics</strong> - Project insights</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Export/Import</strong> - JSON, ZIP, Git</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Comments</strong> - Code discussions</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Stars & Bookmarks</strong> - Save favorites</div></div>
                    </div>
                </div>

                <!-- Phase 3: AI Intelligence -->
                <div class="bg-black/30 backdrop-blur-lg rounded-xl p-8 border border-pink-500/30">
                    <h2 class="text-3xl font-bold mb-6 flex items-center text-pink-400">
                        <i class="fas fa-brain mr-3"></i>
                        Phase 3: AI Code Intelligence (Features 21-30)
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Auto-Complete</strong> - Intelligent code completion</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Code Generation</strong> - AI-powered code creation</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Refactoring</strong> - Smart code refactoring</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Bug Detection</strong> - Real-time bug finding</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Quality Analysis</strong> - Code quality metrics</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Documentation</strong> - Auto-generated docs</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Pattern Recognition</strong> - Detect design patterns</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Code Review</strong> - AI code reviewer</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Code Search</strong> - Semantic code search</div></div>
                        <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-400 mt-1"></i><div><strong>Formatting</strong> - Intelligent code formatting</div></div>
                    </div>
                </div>

                <!-- Continue with remaining phases... -->
                <div class="text-center py-8">
                    <p class="text-xl text-gray-300 mb-4">...and 75+ more cutting-edge features!</p>
                    <div class="flex flex-wrap justify-center gap-3">
                        <span class="px-4 py-2 bg-purple-600/30 rounded-full text-sm border border-purple-500/30">Visualization & Analytics</span>
                        <span class="px-4 py-2 bg-cyan-600/30 rounded-full text-sm border border-cyan-500/30">Marketplace & Plugins</span>
                        <span class="px-4 py-2 bg-blue-600/30 rounded-full text-sm border border-blue-500/30">Cloud Deployment</span>
                        <span class="px-4 py-2 bg-green-600/30 rounded-full text-sm border border-green-500/30">Mobile & PWA</span>
                        <span class="px-4 py-2 bg-pink-600/30 rounded-full text-sm border border-pink-500/30">Enterprise & Teams</span>
                        <span class="px-4 py-2 bg-purple-600/30 rounded-full text-sm border border-purple-500/30">Advanced AI</span>
                        <span class="px-4 py-2 bg-yellow-600/30 rounded-full text-sm border border-yellow-500/30">Blockchain & Web3</span>
                        <span class="px-4 py-2 bg-red-600/30 rounded-full text-sm border border-red-500/30">AR/VR & Holographics</span>
                        <span class="px-4 py-2 bg-indigo-600/30 rounded-full text-sm border border-indigo-500/30">Quantum Computing</span>
                        <span class="px-4 py-2 bg-orange-600/30 rounded-full text-sm border border-orange-500/30">IoT & Edge Computing</span>
                    </div>
                </div>

                <!-- Call to Action -->
                <div class="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl p-12 text-center">
                    <h2 class="text-4xl font-bold mb-4">Start Building The Future Today</h2>
                    <p class="text-xl mb-8">100% Free • No Credit Card Required • All Features Unlocked</p>
                    <a href="/" class="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                        <i class="fas fa-rocket mr-2"></i>Launch IDE
                    </a>
                </div>
            </div>
        </main>

        <footer class="border-t border-purple-500/30 mt-16 py-8">
            <div class="max-w-7xl mx-auto px-6 text-center text-gray-400">
                <p>AuraLang - The World's Best Free AI Programming Platform</p>
                <p class="text-sm mt-2">Built with ❤️ for the future of AI-driven development</p>
            </div>
        </footer>
    </body>
    </html>
  `)
})

export default app