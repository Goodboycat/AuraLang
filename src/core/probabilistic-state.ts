// Probabilistic State Manager (Quantum-Inspired)
// This is a metaphor - NOT actual quantum computing
// Implements weighted state vectors with collapse triggers

export interface StateVector {
  states: Map<string, number>; // state name → probability weight
  normalized: boolean;
}

export interface ProbabilisticState {
  id: string;
  name: string;
  vector: StateVector;
  entanglements: Entanglement[];
  collapseRules: CollapseRule[];
  history: StateSnapshot[];
  metadata: {
    created: Date;
    lastCollapsed?: Date;
    collapseCount: number;
  };
}

export interface Entanglement {
  targetStateId: string;
  correlation: number; // -1 to 1 (negative = anti-correlated)
  type: 'direct' | 'conditional';
}

export interface CollapseRule {
  trigger: CollapseTrigger;
  mode: 'immediate' | 'eventual';
  handler?: (state: ProbabilisticState) => string;
}

export type CollapseTrigger = 
  | 'ui_observation'
  | 'api_read'
  | 'timeout'
  | 'manual'
  | 'threshold';

export interface StateSnapshot {
  timestamp: Date;
  vector: StateVector;
  trigger?: string;
  collapsedTo?: string;
}

export class ProbabilisticStateManager {
  private states: Map<string, ProbabilisticState> = new Map();

  // Create a new probabilistic state
  createState(config: {
    name: string;
    initialStates: Record<string, number>; // state → weight
    collapseRules?: CollapseRule[];
    entanglements?: Entanglement[];
  }): ProbabilisticState {
    const vector = this.createVector(config.initialStates);
    
    const state: ProbabilisticState = {
      id: `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      vector,
      entanglements: config.entanglements || [],
      collapseRules: config.collapseRules || [],
      history: [{
        timestamp: new Date(),
        vector: this.cloneVector(vector),
      }],
      metadata: {
        created: new Date(),
        collapseCount: 0,
      },
    };

    this.states.set(state.id, state);
    return state;
  }

  // Create and normalize a state vector
  private createVector(states: Record<string, number>): StateVector {
    const stateMap = new Map<string, number>();
    let total = 0;

    // Sum all weights
    for (const [name, weight] of Object.entries(states)) {
      if (weight < 0) {
        throw new Error(`Negative weight not allowed for state: ${name}`);
      }
      stateMap.set(name, weight);
      total += weight;
    }

    // Normalize to probabilities (sum = 1)
    if (total > 0) {
      for (const [name, weight] of stateMap.entries()) {
        stateMap.set(name, weight / total);
      }
    }

    return {
      states: stateMap,
      normalized: true,
    };
  }

  // Collapse state to a single value
  collapseState(stateId: string, trigger: CollapseTrigger, force?: string): string {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    // Check if collapse is allowed by rules
    const rule = state.collapseRules.find(r => r.trigger === trigger);
    if (!rule && !force) {
      throw new Error(`No collapse rule defined for trigger: ${trigger}`);
    }

    // Determine collapsed value
    let collapsedValue: string;
    
    if (force) {
      // Force to specific state
      if (!state.vector.states.has(force)) {
        throw new Error(`Forced state ${force} not in state vector`);
      }
      collapsedValue = force;
    } else if (rule?.handler) {
      // Use custom handler
      collapsedValue = rule.handler(state);
    } else {
      // Sample from probability distribution
      collapsedValue = this.sampleFromDistribution(state.vector);
    }

    // Update state to collapsed value
    const newVector = this.createVector({ [collapsedValue]: 1.0 });
    state.vector = newVector;
    state.metadata.lastCollapsed = new Date();
    state.metadata.collapseCount++;

    // Add to history
    state.history.push({
      timestamp: new Date(),
      vector: this.cloneVector(newVector),
      trigger,
      collapsedTo: collapsedValue,
    });

    // Handle entanglements
    this.propagateCollapse(state, collapsedValue);

    return collapsedValue;
  }

  // Sample from probability distribution
  private sampleFromDistribution(vector: StateVector): string {
    const random = Math.random();
    let cumulative = 0;

    for (const [stateName, probability] of vector.states.entries()) {
      cumulative += probability;
      if (random <= cumulative) {
        return stateName;
      }
    }

    // Fallback to highest probability state
    return Array.from(vector.states.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  // Propagate collapse to entangled states
  private propagateCollapse(state: ProbabilisticState, collapsedValue: string): void {
    for (const entanglement of state.entanglements) {
      const targetState = this.states.get(entanglement.targetStateId);
      if (!targetState) continue;

      // Adjust target state probabilities based on correlation
      const newWeights: Record<string, number> = {};
      
      for (const [targetStateName, prob] of targetState.vector.states.entries()) {
        // Positive correlation: increase probability of similar states
        // Negative correlation: decrease probability of similar states
        const adjustment = entanglement.correlation > 0 ? 1.2 : 0.8;
        newWeights[targetStateName] = prob * adjustment;
      }

      targetState.vector = this.createVector(newWeights);
      
      // Add to history
      targetState.history.push({
        timestamp: new Date(),
        vector: this.cloneVector(targetState.vector),
        trigger: `entanglement_from_${state.id}`,
      });
    }
  }

  // Get current state (observe without collapse)
  observeState(stateId: string): StateVector {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    return this.cloneVector(state.vector);
  }

  // Get most likely state without collapsing
  getMostLikelyState(stateId: string): string {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    return Array.from(state.vector.states.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  // Get state history
  getHistory(stateId: string): StateSnapshot[] {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    return [...state.history];
  }

  // Update state probabilities (without collapse)
  updateProbabilities(stateId: string, updates: Record<string, number>): void {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    // Merge updates with current states
    const current: Record<string, number> = {};
    for (const [name, prob] of state.vector.states.entries()) {
      current[name] = prob;
    }

    for (const [name, weight] of Object.entries(updates)) {
      current[name] = weight;
    }

    // Create new normalized vector
    state.vector = this.createVector(current);

    // Add to history
    state.history.push({
      timestamp: new Date(),
      vector: this.cloneVector(state.vector),
    });
  }

  // Create entanglement between two states
  entangleStates(state1Id: string, state2Id: string, correlation: number): void {
    const state1 = this.states.get(state1Id);
    const state2 = this.states.get(state2Id);

    if (!state1 || !state2) {
      throw new Error('Both states must exist to create entanglement');
    }

    if (correlation < -1 || correlation > 1) {
      throw new Error('Correlation must be between -1 and 1');
    }

    // Add bidirectional entanglement
    state1.entanglements.push({
      targetStateId: state2Id,
      correlation,
      type: 'direct',
    });

    state2.entanglements.push({
      targetStateId: state1Id,
      correlation,
      type: 'direct',
    });
  }

  // Get all states
  getAllStates(): ProbabilisticState[] {
    return Array.from(this.states.values());
  }

  // Delete state
  deleteState(stateId: string): boolean {
    return this.states.delete(stateId);
  }

  // Export state for visualization
  exportForVisualization(stateId: string): {
    id: string;
    name: string;
    states: Array<{ name: string; probability: number }>;
    entanglements: Array<{ target: string; correlation: number }>;
    collapsed: boolean;
    mostLikely: string;
  } {
    const state = this.states.get(stateId);
    if (!state) {
      throw new Error(`State not found: ${stateId}`);
    }

    const stateArray = Array.from(state.vector.states.entries())
      .map(([name, probability]) => ({ name, probability }))
      .sort((a, b) => b.probability - a.probability);

    const collapsed = stateArray.length === 1 || stateArray[0].probability === 1.0;
    const mostLikely = stateArray[0].name;

    return {
      id: state.id,
      name: state.name,
      states: stateArray,
      entanglements: state.entanglements.map(e => ({
        target: e.targetStateId,
        correlation: e.correlation,
      })),
      collapsed,
      mostLikely,
    };
  }

  private cloneVector(vector: StateVector): StateVector {
    return {
      states: new Map(vector.states),
      normalized: vector.normalized,
    };
  }
}

export const probabilisticStateManager = new ProbabilisticStateManager();
