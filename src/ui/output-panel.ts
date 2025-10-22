// Output Panel Component
export function renderOutputPanel(): string {
  return `
    <div class="bg-black/30 backdrop-blur-lg rounded-xl border border-cyan-500/30">
      <div class="border-b border-cyan-500/30 p-4 flex items-center justify-between">
        <h3 class="font-bold flex items-center">
          <i class="fas fa-terminal mr-2 text-aura-cyan"></i>
          Execution Output
        </h3>
        <div class="flex space-x-2">
          <button id="showIR" class="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs">IR</button>
          <button id="showPlan" class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">Plan</button>
          <button id="showAudit" class="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">Audit</button>
        </div>
      </div>
      <div class="p-4">
        <div id="output" class="h-96 bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-auto">
          <div class="text-cyan-400 font-mono text-sm">
            <div class="mb-2">🚀 AuraLang MVP - Production Ready</div>
            <div class="mb-2">📡 Intent Parser: Real lexer & parser</div>
            <div class="mb-2">🧠 Planner: Deterministic rule engine</div>
            <div class="mb-2">🛡️ Executor: Sandboxed with security checks</div>
            <div class="mb-2">⚛️ State: Probabilistic (quantum-inspired)</div>
            <div class="text-green-400 mt-4">✅ Ready to execute intents</div>
            <div class="mt-4 text-gray-500">> Enter intent and click "Execute Intent"</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
