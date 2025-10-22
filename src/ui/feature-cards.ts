// Feature Cards Component
export function renderFeatureCards(): string {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-aura-purple transition-colors">
        <div class="flex items-center mb-4">
          <i class="fas fa-code text-aura-purple text-2xl mr-3"></i>
          <h3 class="font-bold">Intent Parser</h3>
        </div>
        <p class="text-gray-300 text-sm">Text → Tokens → AST → IR (Real parsing)</p>
      </div>
      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 hover:border-aura-cyan transition-colors">
        <div class="flex items-center mb-4">
          <i class="fas fa-brain text-aura-cyan text-2xl mr-3"></i>
          <h3 class="font-bold">Rule Engine</h3>
        </div>
        <p class="text-gray-300 text-sm">Deterministic planning with audit trail</p>
      </div>
      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-aura-blue transition-colors">
        <div class="flex items-center mb-4">
          <i class="fas fa-atom text-aura-blue text-2xl mr-3"></i>
          <h3 class="font-bold">Probabilistic State</h3>
        </div>
        <p class="text-gray-300 text-sm">Quantum-inspired state management</p>
      </div>
      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-quantum-glow transition-colors">
        <div class="flex items-center mb-4">
          <i class="fas fa-shield-alt text-quantum-glow text-2xl mr-3"></i>
          <h3 class="font-bold">Sandboxed Execution</h3>
        </div>
        <p class="text-gray-300 text-sm">Safe execution with approval gates</p>
      </div>
    </div>
  `;
}
