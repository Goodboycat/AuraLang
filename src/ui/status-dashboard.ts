// Status Dashboard Component
export function renderStatusDashboard(): string {
  return `
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-green-400">Parser Status</h4>
          <div id="parserStatus" class="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Tokens Parsed:</span>
            <span id="tokenCount" class="text-green-400">0</span>
          </div>
          <div class="flex justify-between">
            <span>AST Nodes:</span>
            <span id="astNodes" class="text-blue-400">0</span>
          </div>
          <div class="flex justify-between">
            <span>IR Generated:</span>
            <span id="irStatus" class="text-purple-400">-</span>
          </div>
        </div>
      </div>

      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-blue-400">Planner Status</h4>
          <div id="plannerStatus" class="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Strategy:</span>
            <span id="strategy" class="text-green-400">-</span>
          </div>
          <div class="flex justify-between">
            <span>Steps Generated:</span>
            <span id="stepCount" class="text-blue-400">0</span>
          </div>
          <div class="flex justify-between">
            <span>Est. Duration:</span>
            <span id="estDuration" class="text-purple-400">-</span>
          </div>
        </div>
      </div>

      <div class="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-purple-400">Execution Status</h4>
          <div id="executionStatus" class="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Security Checks:</span>
            <span id="securityChecks" class="text-green-400">-</span>
          </div>
          <div class="flex justify-between">
            <span>Steps Completed:</span>
            <span id="stepsCompleted" class="text-blue-400">0/0</span>
          </div>
          <div class="flex justify-between">
            <span>Status:</span>
            <span id="execStatus" class="text-purple-400">Idle</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
