/**
 * Header Component
 */

export function getHeader(showFeaturesButton: boolean = true): string {
  return `
    <header class="border-b border-purple-500/30 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-aura-purple to-aura-cyan rounded-lg flex items-center justify-center">
                        <i class="fas fa-atom text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold bg-gradient-to-r from-aura-purple to-aura-cyan bg-clip-text text-transparent">
                            AuraLang
                        </h1>
                        <p class="text-sm text-gray-400">Never Done Complex More Easy</p>
                    </div>
                </a>
                <div class="flex items-center space-x-4">
                    ${showFeaturesButton ? `
                    <a href="/features" class="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all transform hover:scale-105">
                        <i class="fas fa-rocket mr-2"></i>105+ Features
                    </a>
                    ` : ''}
                    <button onclick="executeIntent()" class="px-4 py-2 bg-aura-purple hover:bg-purple-600 rounded-lg transition-colors">
                        <i class="fas fa-play mr-2"></i>Run Intent
                    </button>
                    <button onclick="saveCode()" class="px-4 py-2 bg-aura-blue hover:bg-blue-600 rounded-lg transition-colors">
                        <i class="fas fa-save mr-2"></i>Save
                    </button>
                </div>
            </div>
        </div>
    </header>
  `
}
