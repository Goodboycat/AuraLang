// Editor Panel Component
export function renderEditorPanel(): string {
  return `
    <div class="bg-black/30 backdrop-blur-lg rounded-xl border border-purple-500/30">
      <div class="border-b border-purple-500/30 p-4">
        <h3 class="font-bold flex items-center">
          <i class="fas fa-code mr-2 text-aura-purple"></i>
          Intent Editor
        </h3>
      </div>
      <div class="p-4">
        <textarea 
          id="intentCode" 
          class="w-full h-96 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-aura-purple focus:outline-none resize-none" 
          placeholder="Enter your AuraLang intent here..."
        >intent build_crud {
  goal: "Create a simple product catalog API",
  capabilities: [
    "create products",
    "read products",
    "update products",
    "delete products",
    "list with pagination"
  ],
  constraints: [
    "validate input data",
    "require authentication",
    "audit all changes"
  ],
  success_criteria: "Functioning REST API with tests"
}</textarea>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            <span id="lineCount">10 lines</span> • 
            <span id="charCount">0 characters</span>
          </div>
          <div class="flex space-x-2">
            <button id="validateBtn" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              Validate
            </button>
            <button id="parseBtn" class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
              Parse
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
