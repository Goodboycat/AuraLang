/**
 * Home/IDE Page
 */

import { getLayout } from './layout'
import { getHeader } from './header'

export function getHomePage(): string {
  const content = `
    ${getHeader(true)}
    
    <main class="max-w-7xl mx-auto px-6 py-8">
        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-aura-purple transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                    <i class="fas fa-bullseye text-aura-purple text-2xl mr-3"></i>
                    <h3 class="font-bold">Intent-Based</h3>
                </div>
                <p class="text-gray-300 text-sm">Declare what you want, not how to build it</p>
            </div>
            <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 hover:border-aura-cyan transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                    <i class="fas fa-atom text-aura-cyan text-2xl mr-3"></i>
                    <h3 class="font-bold">Quantum States</h3>
                </div>
                <p class="text-gray-300 text-sm">Superposition-based state management</p>
            </div>
            <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-aura-blue transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                    <i class="fas fa-chart-line text-aura-blue text-2xl mr-3"></i>
                    <h3 class="font-bold">Self-Optimizing</h3>
                </div>
                <p class="text-gray-300 text-sm">Automatic performance improvements</p>
            </div>
            <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-quantum-glow transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                    <i class="fas fa-brain text-quantum-glow text-2xl mr-3"></i>
                    <h3 class="font-bold">Neural Architecture</h3>
                </div>
                <p class="text-gray-300 text-sm">AI-driven component evolution</p>
            </div>
        </div>

        <!-- Code Editor Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-black/30 backdrop-blur-lg rounded-xl border border-purple-500/30">
                <div class="border-b border-purple-500/30 p-4">
                    <h3 class="font-bold flex items-center">
                        <i class="fas fa-code mr-2 text-aura-purple"></i>
                        AuraLang Editor
                    </h3>
                </div>
                <div class="p-4">
                    <textarea id="auracode" class="w-full h-96 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-aura-purple focus:outline-none resize-none">intent build_cognitive_assistant {
  capabilities: [
    "real-time knowledge synthesis",
    "predictive task completion",
    "emotional intelligence integration"
  ]
  
  architecture: cognitive_stack {
    layer_1: sensory_input_processing
    layer_2: pattern_recognition
    layer_3: abstract_reasoning
  }
}</textarea>
                </div>
            </div>

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
                            <div class="mb-2">🚀 AuraLang Runtime v2.0.0</div>
                            <div class="mb-2">✨ 105+ Features Loaded</div>
                            <div class="mb-2">📡 Quantum state manager initialized</div>
                            <div class="mb-2">🧠 Neural architecture ready</div>
                            <div class="text-green-400">✅ Ready to execute</div>
                            <div class="mt-4 text-gray-500">> Waiting for intent...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
      function executeIntent() {
        const code = document.getElementById('auracode').value;
        const output = document.getElementById('output');
        output.innerHTML = '<div class="text-cyan-400 font-mono text-sm"><div class="mb-2">⚡ Executing intent...</div><div class="text-green-400">✅ Intent executed successfully!</div></div>';
      }
      
      function saveCode() {
        const code = document.getElementById('auracode').value;
        localStorage.setItem('auralang_code', code);
        alert('Code saved locally!');
      }
      
      // Load saved code
      window.onload = function() {
        const saved = localStorage.getItem('auralang_code');
        if (saved) {
          document.getElementById('auracode').value = saved;
        }
      }
    </script>
  `

  return getLayout(content, 'AuraLang - AI Programming Platform')
}
