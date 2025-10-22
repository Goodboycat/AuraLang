// Header Component
export function renderHeader(): string {
  return `
    <header class="border-b border-purple-500/30 bg-black/20 backdrop-blur-lg">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-aura-purple to-aura-cyan rounded-lg flex items-center justify-center">
              <i class="fas fa-atom text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-aura-purple to-aura-cyan bg-clip-text text-transparent">
                AuraLang MVP
              </h1>
              <p class="text-sm text-gray-400">Intent → Plan → Execute (Deterministic)</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button id="executeBtn" class="px-4 py-2 bg-aura-purple hover:bg-purple-600 rounded-lg transition-colors">
              <i class="fas fa-play mr-2"></i>Execute Intent
            </button>
            <button id="clearBtn" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <i class="fas fa-trash mr-2"></i>Clear
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
