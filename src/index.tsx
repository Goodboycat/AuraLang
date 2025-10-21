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

// Import view components
import { getHomePage } from './views/home'
import { getFeaturesPage } from './views/features'

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
  return c.html(getHomePage())
})

// Features showcase page
app.get('/features', (c) => {
  return c.html(getFeaturesPage())
})

export default app