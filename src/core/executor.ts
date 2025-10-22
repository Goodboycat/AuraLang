// Execution Orchestrator with Sandboxing and Safety
// Executes plans in a controlled, auditable environment

import type { ExecutionPlan, ExecutionStep } from './planner';

export interface ExecutionResult {
  planId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  steps: StepResult[];
  outputs: Record<string, any>;
  errors: ExecutionError[];
  auditTrail: ExecutionAudit[];
}

export type ExecutionStatus = 
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'timeout';

export interface StepResult {
  stepId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  output?: any;
  error?: string;
  retries: number;
}

export interface ExecutionError {
  stepId?: string;
  type: string;
  message: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface ExecutionAudit {
  timestamp: Date;
  stage: string;
  action: string;
  details: Record<string, any>;
  securityChecks: SecurityCheck[];
}

export interface SecurityCheck {
  checkType: string;
  passed: boolean;
  reason?: string;
}

export interface SandboxConfig {
  maxExecutionTime: number; // milliseconds
  maxMemory: number; // MB
  allowedAPIs: string[];
  deniedPatterns: RegExp[];
  requireApproval: boolean;
}

export class ExecutionOrchestrator {
  private executions: Map<string, ExecutionResult> = new Map();
  private sandboxConfig: SandboxConfig;

  constructor(config?: Partial<SandboxConfig>) {
    this.sandboxConfig = {
      maxExecutionTime: 300000, // 5 minutes
      maxMemory: 512, // 512 MB
      allowedAPIs: ['fetch', 'crypto', 'console'],
      deniedPatterns: [
        /eval\(/,
        /Function\(/,
        /process\.exit/,
        /require\(/,
        /import\(/,
        /child_process/,
        /fs\./,
      ],
      requireApproval: true,
      ...config,
    };
  }

  // Execute a plan with full safety checks
  async executePlan(plan: ExecutionPlan): Promise<ExecutionResult> {
    const result: ExecutionResult = {
      planId: plan.id,
      status: 'pending',
      startedAt: new Date(),
      steps: [],
      outputs: {},
      errors: [],
      auditTrail: [],
    };

    this.executions.set(plan.id, result);

    try {
      // Step 1: Pre-execution security checks
      const securityPassed = await this.performSecurityChecks(plan, result);
      if (!securityPassed) {
        result.status = 'failed';
        result.errors.push({
          type: 'security_violation',
          message: 'Plan failed security checks',
          timestamp: new Date(),
          recoverable: false,
        });
        return result;
      }

      // Step 2: Human approval (if required)
      if (this.sandboxConfig.requireApproval) {
        const approved = await this.requestApproval(plan);
        if (!approved) {
          result.status = 'cancelled';
          result.errors.push({
            type: 'approval_denied',
            message: 'Plan execution was not approved',
            timestamp: new Date(),
            recoverable: false,
          });
          return result;
        }
      }

      // Step 3: Execute steps in order
      result.status = 'running';
      
      for (const step of plan.steps) {
        const stepResult = await this.executeStep(step, plan, result);
        result.steps.push(stepResult);

        if (stepResult.status === 'failed') {
          result.status = 'failed';
          result.errors.push({
            stepId: step.id,
            type: 'step_failure',
            message: stepResult.error || 'Step failed',
            timestamp: new Date(),
            recoverable: false,
          });
          break;
        }

        // Store step output for dependencies
        if (stepResult.output) {
          result.outputs[step.id] = stepResult.output;
        }
      }

      // Step 4: Mark as complete if no failures
      if (result.status === 'running') {
        result.status = 'success';
      }

    } catch (error) {
      result.status = 'failed';
      result.errors.push({
        type: 'execution_error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        recoverable: false,
      });
    } finally {
      result.completedAt = new Date();
      result.duration = result.completedAt.getTime() - result.startedAt.getTime();

      result.auditTrail.push({
        timestamp: new Date(),
        stage: 'execution_complete',
        action: 'finalize',
        details: {
          status: result.status,
          duration: result.duration,
          stepsCompleted: result.steps.filter(s => s.status === 'success').length,
        },
        securityChecks: [],
      });
    }

    return result;
  }

  // Perform security checks before execution
  private async performSecurityChecks(plan: ExecutionPlan, result: ExecutionResult): Promise<boolean> {
    const checks: SecurityCheck[] = [];

    // Check 1: Execution time within limits
    if (plan.estimatedDuration > this.sandboxConfig.maxExecutionTime) {
      checks.push({
        checkType: 'execution_time',
        passed: false,
        reason: `Estimated duration ${plan.estimatedDuration}ms exceeds limit ${this.sandboxConfig.maxExecutionTime}ms`,
      });
    } else {
      checks.push({
        checkType: 'execution_time',
        passed: true,
      });
    }

    // Check 2: Resource requirements
    const memoryReq = plan.resources.find(r => r.type === 'memory');
    if (memoryReq && memoryReq.amount > this.sandboxConfig.maxMemory) {
      checks.push({
        checkType: 'memory_limit',
        passed: false,
        reason: `Memory requirement ${memoryReq.amount}MB exceeds limit ${this.sandboxConfig.maxMemory}MB`,
      });
    } else {
      checks.push({
        checkType: 'memory_limit',
        passed: true,
      });
    }

    // Check 3: Scan for dangerous patterns
    let hasDangerousCode = false;
    for (const step of plan.steps) {
      const codeStr = JSON.stringify(step.parameters);
      for (const pattern of this.sandboxConfig.deniedPatterns) {
        if (pattern.test(codeStr)) {
          checks.push({
            checkType: 'code_scan',
            passed: false,
            reason: `Step ${step.id} contains denied pattern: ${pattern}`,
          });
          hasDangerousCode = true;
          break;
        }
      }
    }

    if (!hasDangerousCode) {
      checks.push({
        checkType: 'code_scan',
        passed: true,
      });
    }

    result.auditTrail.push({
      timestamp: new Date(),
      stage: 'security_check',
      action: 'validate_plan',
      details: { plan: plan.id },
      securityChecks: checks,
    });

    return checks.every(c => c.passed);
  }

  // Request human approval (simulated)
  private async requestApproval(plan: ExecutionPlan): Promise<boolean> {
    // In production, this would trigger a UI approval flow
    // For now, auto-approve low-risk plans
    const riskScore = plan.estimatedCost;
    
    if (riskScore < 100) {
      return true; // Auto-approve low-risk
    }

    // High-risk plans would require manual approval
    // This is where you'd integrate with approval UI
    console.log(`Approval required for plan ${plan.id} (risk score: ${riskScore})`);
    return true; // For demo, auto-approve
  }

  // Execute a single step in sandbox
  private async executeStep(step: ExecutionStep, plan: ExecutionPlan, result: ExecutionResult): Promise<StepResult> {
    const stepResult: StepResult = {
      stepId: step.id,
      status: 'running',
      startedAt: new Date(),
      retries: 0,
    };

    try {
      // Check dependencies
      const depsResolved = this.checkDependencies(step, result);
      if (!depsResolved) {
        throw new Error('Dependencies not resolved');
      }

      // Execute with timeout
      const output = await this.runStepInSandbox(step, result.outputs);
      
      stepResult.output = output;
      stepResult.status = 'success';

    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error instanceof Error ? error.message : 'Unknown error';

      // Retry logic
      if (stepResult.retries < step.retryPolicy.maxAttempts) {
        stepResult.retries++;
        await this.sleep(step.retryPolicy.backoffMs * Math.pow(step.retryPolicy.backoffMultiplier, stepResult.retries - 1));
        return this.executeStep(step, plan, result);
      }
    } finally {
      stepResult.completedAt = new Date();
      stepResult.duration = stepResult.completedAt.getTime() - stepResult.startedAt.getTime();
    }

    result.auditTrail.push({
      timestamp: new Date(),
      stage: 'step_execution',
      action: step.action,
      details: {
        stepId: step.id,
        type: step.type,
        status: stepResult.status,
        duration: stepResult.duration,
      },
      securityChecks: [],
    });

    return stepResult;
  }

  // Run step in isolated sandbox
  private async runStepInSandbox(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    // This is a simplified sandbox - in production use proper isolation (VM, container, etc.)
    
    switch (step.type) {
      case 'validate':
        return this.validateStep(step, context);
      case 'generate_code':
        return this.generateCodeStep(step, context);
      case 'create_resource':
        return this.createResourceStep(step, context);
      case 'execute_query':
        return this.executeQueryStep(step, context);
      case 'api_call':
        return this.apiCallStep(step, context);
      case 'transform_data':
        return this.transformDataStep(step, context);
      case 'train_model':
        return this.trainModelStep(step, context);
      case 'deploy':
        return this.deployStep(step, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  // Step implementations (simplified for demo)
  private async validateStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { validated: true, intentId: step.parameters.intentId };
  }

  private async generateCodeStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { 
      generated: true,
      code: `// Generated code for ${step.action}`,
      action: step.action,
    };
  }

  private async createResourceStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return {
      created: true,
      resourceId: `resource_${Date.now()}`,
      type: step.action,
    };
  }

  private async executeQueryStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { executed: true, results: [] };
  }

  private async apiCallStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { called: true, response: {} };
  }

  private async transformDataStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { transformed: true, records: 0 };
  }

  private async trainModelStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { trained: true, modelId: `model_${Date.now()}`, accuracy: 0.95 };
  }

  private async deployStep(step: ExecutionStep, context: Record<string, any>): Promise<any> {
    return { 
      deployed: true,
      url: `https://deployed-${Date.now()}.example.com`,
      status: 'active',
    };
  }

  private checkDependencies(step: ExecutionStep, result: ExecutionResult): boolean {
    return step.dependencies.every(depId => {
      const depStep = result.steps.find(s => s.stepId === depId);
      return depStep && depStep.status === 'success';
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get execution result
  getExecution(planId: string): ExecutionResult | undefined {
    return this.executions.get(planId);
  }

  // Get all executions
  getAllExecutions(): ExecutionResult[] {
    return Array.from(this.executions.values());
  }
}

export const executor = new ExecutionOrchestrator();
