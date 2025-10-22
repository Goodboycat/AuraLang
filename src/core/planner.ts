// Deterministic Planner: IR → Execution Plan
// Uses rule-based system, NOT random LLM outputs

import type { IntentIR } from './intent-parser';

export interface ExecutionPlan {
  id: string;
  intentId: string;
  strategy: PlanStrategy;
  steps: ExecutionStep[];
  estimatedDuration: number; // milliseconds
  estimatedCost: number; // arbitrary units
  resources: ResourceRequirement[];
  auditLog: AuditEntry[];
  generatedAt: Date;
}

export type PlanStrategy = 
  | 'crud_generation'
  | 'api_orchestration'
  | 'data_pipeline'
  | 'ml_workflow'
  | 'custom_execution';

export interface ExecutionStep {
  id: string;
  order: number;
  type: StepType;
  action: string;
  parameters: Record<string, any>;
  dependencies: string[]; // step IDs this depends on
  timeout: number;
  retryPolicy: RetryPolicy;
}

export type StepType = 
  | 'validate'
  | 'generate_code'
  | 'create_resource'
  | 'execute_query'
  | 'api_call'
  | 'transform_data'
  | 'train_model'
  | 'deploy';

export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
}

export interface ResourceRequirement {
  type: 'compute' | 'memory' | 'storage' | 'network';
  amount: number;
  unit: string;
}

export interface AuditEntry {
  timestamp: Date;
  stage: string;
  decision: string;
  reasoning: string;
  alternatives: string[];
}

// Rule-based planner
export class DeterministicPlanner {
  private rules: PlanningRule[] = [];

  constructor() {
    this.initializeRules();
  }

  // Initialize deterministic planning rules
  private initializeRules(): void {
    // Rule 1: CRUD intent pattern
    this.rules.push({
      name: 'crud_detection',
      condition: (ir) => {
        const goal = ir.goal?.toLowerCase() || '';
        return goal.includes('crud') || 
               goal.includes('product catalog') ||
               goal.includes('data management') ||
               (ir.capabilities.some(c => c.includes('create')) &&
                ir.capabilities.some(c => c.includes('read')));
      },
      strategy: 'crud_generation',
      priority: 10,
    });

    // Rule 2: API orchestration pattern
    this.rules.push({
      name: 'api_orchestration',
      condition: (ir) => {
        return ir.capabilities.some(c => 
          c.includes('api') || 
          c.includes('integration') ||
          c.includes('orchestrat')
        );
      },
      strategy: 'api_orchestration',
      priority: 8,
    });

    // Rule 3: Data pipeline pattern
    this.rules.push({
      name: 'data_pipeline',
      condition: (ir) => {
        return ir.capabilities.some(c => 
          c.includes('pipeline') || 
          c.includes('transform') ||
          c.includes('process data')
        );
      },
      strategy: 'data_pipeline',
      priority: 7,
    });

    // Rule 4: ML workflow pattern
    this.rules.push({
      name: 'ml_workflow',
      condition: (ir) => {
        return ir.capabilities.some(c => 
          c.includes('machine learning') || 
          c.includes('train') ||
          c.includes('model') ||
          c.includes('predict')
        );
      },
      strategy: 'ml_workflow',
      priority: 9,
    });
  }

  // Main planning function: IR → Plan
  createPlan(ir: IntentIR): ExecutionPlan {
    const auditLog: AuditEntry[] = [];

    // Step 1: Select strategy using rules
    const strategy = this.selectStrategy(ir, auditLog);

    // Step 2: Generate steps based on strategy
    const steps = this.generateSteps(ir, strategy, auditLog);

    // Step 3: Estimate resources
    const resources = this.estimateResources(steps);

    // Step 4: Calculate duration and cost
    const estimatedDuration = steps.reduce((sum, step) => sum + step.timeout, 0);
    const estimatedCost = this.calculateCost(steps, resources);

    const plan: ExecutionPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      intentId: ir.id,
      strategy,
      steps,
      estimatedDuration,
      estimatedCost,
      resources,
      auditLog,
      generatedAt: new Date(),
    };

    // Add final audit entry
    auditLog.push({
      timestamp: new Date(),
      stage: 'plan_complete',
      decision: `Generated ${steps.length} steps with ${strategy} strategy`,
      reasoning: `Total duration: ${estimatedDuration}ms, cost: ${estimatedCost} units`,
      alternatives: [],
    });

    return plan;
  }

  // Select strategy using deterministic rules
  private selectStrategy(ir: IntentIR, auditLog: AuditEntry[]): PlanStrategy {
    const matchedRules = this.rules
      .filter(rule => rule.condition(ir))
      .sort((a, b) => b.priority - a.priority);

    if (matchedRules.length === 0) {
      auditLog.push({
        timestamp: new Date(),
        stage: 'strategy_selection',
        decision: 'custom_execution',
        reasoning: 'No matching rules found, using custom execution',
        alternatives: [],
      });
      return 'custom_execution';
    }

    const selectedRule = matchedRules[0];
    const alternatives = matchedRules.slice(1).map(r => r.name);

    auditLog.push({
      timestamp: new Date(),
      stage: 'strategy_selection',
      decision: selectedRule.strategy,
      reasoning: `Matched rule: ${selectedRule.name} (priority: ${selectedRule.priority})`,
      alternatives,
    });

    return selectedRule.strategy;
  }

  // Generate execution steps based on strategy
  private generateSteps(ir: IntentIR, strategy: PlanStrategy, auditLog: AuditEntry[]): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    let order = 0;

    // Always start with validation
    steps.push(this.createStep({
      order: order++,
      type: 'validate',
      action: 'validate_intent',
      parameters: { intentId: ir.id },
      dependencies: [],
    }));

    switch (strategy) {
      case 'crud_generation':
        steps.push(...this.generateCRUDSteps(ir, order));
        break;
      case 'api_orchestration':
        steps.push(...this.generateAPISteps(ir, order));
        break;
      case 'data_pipeline':
        steps.push(...this.generatePipelineSteps(ir, order));
        break;
      case 'ml_workflow':
        steps.push(...this.generateMLSteps(ir, order));
        break;
      case 'custom_execution':
        steps.push(...this.generateCustomSteps(ir, order));
        break;
    }

    auditLog.push({
      timestamp: new Date(),
      stage: 'step_generation',
      decision: `Generated ${steps.length} steps`,
      reasoning: `Using ${strategy} strategy template`,
      alternatives: ['Could add optimization steps', 'Could add monitoring steps'],
    });

    return steps;
  }

  private generateCRUDSteps(ir: IntentIR, startOrder: number): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    
    steps.push(this.createStep({
      order: startOrder++,
      type: 'generate_code',
      action: 'generate_schema',
      parameters: { entityName: ir.name, capabilities: ir.capabilities },
      dependencies: ['step_0'], // depends on validation
    }));

    steps.push(this.createStep({
      order: startOrder++,
      type: 'create_resource',
      action: 'create_database',
      parameters: { schemaId: 'schema_from_step_1' },
      dependencies: ['step_1'],
    }));

    steps.push(this.createStep({
      order: startOrder++,
      type: 'generate_code',
      action: 'generate_endpoints',
      parameters: { operations: ['create', 'read', 'update', 'delete'] },
      dependencies: ['step_2'],
    }));

    steps.push(this.createStep({
      order: startOrder++,
      type: 'deploy',
      action: 'deploy_api',
      parameters: { endpoints: 'from_step_3' },
      dependencies: ['step_3'],
    }));

    return steps;
  }

  private generateAPISteps(ir: IntentIR, startOrder: number): ExecutionStep[] {
    return [
      this.createStep({
        order: startOrder++,
        type: 'api_call',
        action: 'orchestrate_apis',
        parameters: { capabilities: ir.capabilities },
        dependencies: ['step_0'],
      }),
    ];
  }

  private generatePipelineSteps(ir: IntentIR, startOrder: number): ExecutionStep[] {
    return [
      this.createStep({
        order: startOrder++,
        type: 'transform_data',
        action: 'create_pipeline',
        parameters: { transforms: ir.capabilities },
        dependencies: ['step_0'],
      }),
    ];
  }

  private generateMLSteps(ir: IntentIR, startOrder: number): ExecutionStep[] {
    return [
      this.createStep({
        order: startOrder++,
        type: 'train_model',
        action: 'train_ml_model',
        parameters: { capabilities: ir.capabilities },
        dependencies: ['step_0'],
      }),
    ];
  }

  private generateCustomSteps(ir: IntentIR, startOrder: number): ExecutionStep[] {
    return [
      this.createStep({
        order: startOrder++,
        type: 'execute_query',
        action: 'custom_execution',
        parameters: { intent: ir },
        dependencies: ['step_0'],
      }),
    ];
  }

  private createStep(partial: Partial<ExecutionStep>): ExecutionStep {
    return {
      id: `step_${partial.order}`,
      order: partial.order || 0,
      type: partial.type || 'execute_query',
      action: partial.action || 'unknown',
      parameters: partial.parameters || {},
      dependencies: partial.dependencies || [],
      timeout: 30000, // 30 seconds default
      retryPolicy: {
        maxAttempts: 3,
        backoffMs: 1000,
        backoffMultiplier: 2,
      },
    };
  }

  private estimateResources(steps: ExecutionStep[]): ResourceRequirement[] {
    return [
      { type: 'compute', amount: steps.length * 100, unit: 'ms' },
      { type: 'memory', amount: steps.length * 128, unit: 'MB' },
      { type: 'storage', amount: 10, unit: 'MB' },
      { type: 'network', amount: 5, unit: 'MB' },
    ];
  }

  private calculateCost(steps: ExecutionStep[], resources: ResourceRequirement[]): number {
    let cost = 0;
    
    // Cost per step type
    const stepCosts: Record<StepType, number> = {
      validate: 1,
      generate_code: 10,
      create_resource: 15,
      execute_query: 5,
      api_call: 8,
      transform_data: 12,
      train_model: 50,
      deploy: 20,
    };

    steps.forEach(step => {
      cost += stepCosts[step.type] || 5;
    });

    // Add resource costs
    resources.forEach(resource => {
      if (resource.type === 'compute') cost += resource.amount * 0.01;
      if (resource.type === 'memory') cost += resource.amount * 0.001;
    });

    return Math.round(cost * 100) / 100;
  }
}

interface PlanningRule {
  name: string;
  condition: (ir: IntentIR) => boolean;
  strategy: PlanStrategy;
  priority: number;
}

export const planner = new DeterministicPlanner();
