// AuraLang MVP Client Application
class AuraLangApp {
  constructor() {
    this.currentIR = null;
    this.currentPlan = null;
    this.currentExecution = null;
    this.init();
  }

  init() {
    // Setup event listeners
    document.getElementById('executeBtn')?.addEventListener('click', () => this.executeIntent());
    document.getElementById('clearBtn')?.addEventListener('click', () => this.clearOutput());
    document.getElementById('validateBtn')?.addEventListener('click', () => this.validateIntent());
    document.getElementById('parseBtn')?.addEventListener('click', () => this.parseIntent());
    document.getElementById('showIR')?.addEventListener('click', () => this.showIR());
    document.getElementById('showPlan')?.addEventListener('click', () => this.showPlan());
    document.getElementById('showAudit')?.addEventListener('click', () => this.showAudit());

    // Setup code editor listeners
    const editor = document.getElementById('intentCode');
    if (editor) {
      editor.addEventListener('input', () => this.updateStats());
      this.updateStats();
    }
  }

  updateStats() {
    const code = document.getElementById('intentCode')?.value || '';
    const lines = code.split('\n').length;
    const chars = code.length;
    
    document.getElementById('lineCount').textContent = `${lines} lines`;
    document.getElementById('charCount').textContent = `${chars} characters`;
  }

  async validateIntent() {
    const code = document.getElementById('intentCode')?.value;
    if (!code) {
      this.log('❌ No intent code to validate', 'error');
      return;
    }

    this.log('🔍 Validating intent...', 'info');
    
    try {
      const response = await fetch('/api/intent/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const result = await response.json();
      
      if (result.valid) {
        this.log('✅ Intent is valid', 'success');
        this.updateStatus('parserStatus', 'success');
      } else {
        this.log(`❌ Validation errors:\n${result.errors.join('\n')}`, 'error');
        this.updateStatus('parserStatus', 'error');
      }
    } catch (error) {
      this.log(`❌ Validation failed: ${error.message}`, 'error');
      this.updateStatus('parserStatus', 'error');
    }
  }

  async parseIntent() {
    const code = document.getElementById('intentCode')?.value;
    if (!code) {
      this.log('❌ No intent code to parse', 'error');
      return;
    }

    this.log('⚙️ Parsing intent...', 'info');
    this.updateStatus('parserStatus', 'loading');
    
    try {
      const response = await fetch('/api/intent/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const result = await response.json();
      this.currentIR = result.ir;
      
      this.log('✅ Parsing complete!', 'success');
      this.log(`📝 IR ID: ${result.ir.id}`, 'info');
      this.log(`🎯 Intent: ${result.ir.name}`, 'info');
      this.log(`📊 Complexity: ${result.ir.metadata.complexity_score}`, 'info');
      
      document.getElementById('tokenCount').textContent = result.tokens.length;
      document.getElementById('astNodes').textContent = this.countASTNodes(result.ast);
      document.getElementById('irStatus').textContent = result.ir.id.substr(0, 12) + '...';
      
      this.updateStatus('parserStatus', 'success');
    } catch (error) {
      this.log(`❌ Parsing failed: ${error.message}`, 'error');
      this.updateStatus('parserStatus', 'error');
    }
  }

  async executeIntent() {
    const code = document.getElementById('intentCode')?.value;
    if (!code) {
      this.log('❌ No intent code to execute', 'error');
      return;
    }

    this.clearOutput();
    this.log('🚀 Starting execution pipeline...', 'info');
    
    // Step 1: Parse
    await this.parseIntent();
    if (!this.currentIR) return;

    // Step 2: Plan
    this.log('\n🧠 Generating execution plan...', 'info');
    this.updateStatus('plannerStatus', 'loading');
    
    try {
      const planResponse = await fetch('/api/intent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ir: this.currentIR })
      });

      const planResult = await planResponse.json();
      this.currentPlan = planResult.plan;
      
      this.log(`✅ Plan generated!`, 'success');
      this.log(`📋 Strategy: ${planResult.plan.strategy}`, 'info');
      this.log(`🔢 Steps: ${planResult.plan.steps.length}`, 'info');
      this.log(`⏱️ Est. Duration: ${planResult.plan.estimatedDuration}ms`, 'info');
      this.log(`💰 Est. Cost: ${planResult.plan.estimatedCost} units`, 'info');
      
      document.getElementById('strategy').textContent = planResult.plan.strategy;
      document.getElementById('stepCount').textContent = planResult.plan.steps.length;
      document.getElementById('estDuration').textContent = `${planResult.plan.estimatedDuration}ms`;
      
      this.updateStatus('plannerStatus', 'success');
      
      // Step 3: Execute
      this.log('\n⚡ Executing plan...', 'info');
      this.updateStatus('executionStatus', 'loading');
      
      const execResponse = await fetch('/api/intent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: this.currentPlan })
      });

      const execResult = await execResponse.json();
      this.currentExecution = execResult.result;
      
      this.log(`\n✅ Execution ${execResult.result.status}!`, execResult.result.status === 'success' ? 'success' : 'error');
      this.log(`⏱️ Duration: ${execResult.result.duration}ms`, 'info');
      this.log(`✔️ Steps completed: ${execResult.result.steps.filter(s => s.status === 'success').length}/${execResult.result.steps.length}`, 'info');
      
      document.getElementById('securityChecks').textContent = execResult.result.auditTrail.filter(a => a.securityChecks.length > 0)[0]?.securityChecks.every(c => c.passed) ? 'Passed' : 'Failed';
      document.getElementById('stepsCompleted').textContent = `${execResult.result.steps.filter(s => s.status === 'success').length}/${execResult.result.steps.length}`;
      document.getElementById('execStatus').textContent = execResult.result.status;
      
      this.updateStatus('executionStatus', execResult.result.status === 'success' ? 'success' : 'error');
      
      if (execResult.result.errors.length > 0) {
        this.log('\n❌ Errors:', 'error');
        execResult.result.errors.forEach(err => {
          this.log(`  • ${err.message}`, 'error');
        });
      }
      
    } catch (error) {
      this.log(`❌ Execution failed: ${error.message}`, 'error');
      this.updateStatus('plannerStatus', 'error');
      this.updateStatus('executionStatus', 'error');
    }
  }

  showIR() {
    if (!this.currentIR) {
      this.log('❌ No IR available. Parse intent first.', 'error');
      return;
    }
    
    this.clearOutput();
    this.log('📝 Intermediate Representation (IR):', 'info');
    this.log(JSON.stringify(this.currentIR, null, 2), 'code');
  }

  showPlan() {
    if (!this.currentPlan) {
      this.log('❌ No plan available. Execute intent first.', 'error');
      return;
    }
    
    this.clearOutput();
    this.log('📋 Execution Plan:', 'info');
    this.log(JSON.stringify(this.currentPlan, null, 2), 'code');
  }

  showAudit() {
    if (!this.currentExecution) {
      this.log('❌ No execution available. Execute intent first.', 'error');
      return;
    }
    
    this.clearOutput();
    this.log('🔍 Audit Trail:', 'info');
    this.currentExecution.auditTrail.forEach((entry, index) => {
      this.log(`\n[${index + 1}] ${entry.stage.toUpperCase()}`, 'info');
      this.log(`  Action: ${entry.action}`, 'info');
      if (entry.securityChecks.length > 0) {
        this.log(`  Security Checks:`, 'info');
        entry.securityChecks.forEach(check => {
          this.log(`    ${check.passed ? '✅' : '❌'} ${check.checkType}${check.reason ? ': ' + check.reason : ''}`, check.passed ? 'success' : 'error');
        });
      }
    });
  }

  clearOutput() {
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = '<div class="text-gray-400 font-mono text-sm">Output cleared. Ready for new execution.</div>';
    }
    
    this.updateStatus('parserStatus', 'idle');
    this.updateStatus('plannerStatus', 'idle');
    this.updateStatus('executionStatus', 'idle');
  }

  log(message, type = 'info') {
    const output = document.getElementById('output');
    if (!output) return;
    
    const colors = {
      info: 'text-cyan-400',
      success: 'text-green-400',
      error: 'text-red-400',
      code: 'text-yellow-400'
    };
    
    const line = document.createElement('div');
    line.className = `${colors[type] || colors.info} font-mono text-sm mb-1 whitespace-pre-wrap`;
    line.textContent = message;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  updateStatus(elementId, status) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const colors = {
      idle: 'bg-gray-500',
      loading: 'bg-yellow-400 animate-pulse',
      success: 'bg-green-400',
      error: 'bg-red-400'
    };
    
    element.className = `w-3 h-3 rounded-full ${colors[status] || colors.idle}`;
  }

  countASTNodes(ast) {
    if (!ast) return 0;
    let count = 1;
    if (ast.children) {
      ast.children.forEach(child => {
        count += this.countASTNodes(child);
      });
    }
    return count;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AuraLangApp());
} else {
  new AuraLangApp();
}
