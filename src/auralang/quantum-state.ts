/**
 * Quantum State Management System
 * 
 * Implements quantum-inspired state management with:
 * - Superposition (multiple simultaneous states)
 * - Entanglement (correlated state changes)
 * - Collapse (observation-triggered state resolution)
 * - Coherence (maintaining quantum properties)
 */

export interface QuantumState {
  id: string;
  name: string;
  superposition: string[];
  probability_amplitudes: Map<string, number>;
  entanglements: EntanglementBond[];
  collapse_conditions: CollapseCondition[];
  coherence_time: number;
  last_observation?: Date;
  collapsed_state?: string;
  metadata: StateMetadata;
}

export interface EntanglementBond {
  target_state_id: string;
  correlation_type: 'positive' | 'negative' | 'custom';
  strength: number; // 0.0 to 1.0
  correlation_function?: (sourceValue: any, targetValue: any) => any;
}

export interface CollapseCondition {
  trigger: 'observation' | 'time' | 'entanglement' | 'threshold' | 'user_interaction';
  parameters: any;
  priority: number;
}

export interface StateMetadata {
  creation_time: Date;
  collapse_count: number;
  entanglement_history: string[];
  performance_metrics: StatePerformanceMetrics;
}

export interface StatePerformanceMetrics {
  coherence_stability: number;
  collapse_efficiency: number;
  entanglement_effectiveness: number;
  observation_impact: number;
}

export interface StateObservation {
  observer_id: string;
  observation_time: Date;
  pre_collapse_probabilities: Map<string, number>;
  collapsed_value: string;
  entanglement_effects: EntanglementEffect[];
}

export interface EntanglementEffect {
  affected_state_id: string;
  previous_value: any;
  new_value: any;
  correlation_strength: number;
}

export class QuantumStateManager {
  private states: Map<string, QuantumState> = new Map();
  private observation_history: Map<string, StateObservation[]> = new Map();
  private entanglement_network: Map<string, Set<string>> = new Map();
  private coherence_monitor: NodeJS.Timer | null = null;

  constructor() {
    this.initializeCoherenceMonitoring();
  }

  /**
   * Create a new quantum state with superposition
   */
  createState(
    name: string,
    superposition: string[],
    initialProbabilities?: Map<string, number>
  ): string {
    const stateId = `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Normalize probabilities to sum to 1.0
    const probabilities = this.normalizeProbabilities(superposition, initialProbabilities);
    
    const quantumState: QuantumState = {
      id: stateId,
      name: name,
      superposition: superposition,
      probability_amplitudes: probabilities,
      entanglements: [],
      collapse_conditions: [
        {
          trigger: 'observation',
          parameters: { auto_collapse: true },
          priority: 1
        }
      ],
      coherence_time: 10000, // 10 seconds default coherence
      metadata: {
        creation_time: new Date(),
        collapse_count: 0,
        entanglement_history: [],
        performance_metrics: {
          coherence_stability: 1.0,
          collapse_efficiency: 1.0,
          entanglement_effectiveness: 1.0,
          observation_impact: 0.0
        }
      }
    };

    this.states.set(stateId, quantumState);
    this.observation_history.set(stateId, []);
    this.entanglement_network.set(stateId, new Set());

    // Start coherence monitoring when first state is created
    if (this.states.size === 1) {
      this.startCoherenceMonitoring();
    }

    return stateId;
  }

  /**
   * Get current state (may trigger collapse if observed)
   */
  async getState(stateId: string, observerId?: string): Promise<QuantumState | null> {
    const state = this.states.get(stateId);
    if (!state) return null;

    // Check if observation should trigger collapse
    if (this.shouldCollapseOnObservation(state) && !state.collapsed_state) {
      await this.collapseState(stateId, observerId);
      return this.states.get(stateId) || null;
    }

    // Update observation impact metrics
    if (state.metadata.performance_metrics) {
      state.metadata.performance_metrics.observation_impact += 0.1;
    }

    return state;
  }

  /**
   * Force collapse of quantum state to specific value
   */
  async collapseState(stateId: string, observerId?: string): Promise<string | null> {
    const state = this.states.get(stateId);
    if (!state || state.collapsed_state) return state?.collapsed_state || null;

    // Select collapsed value based on probability amplitudes
    const collapsedValue = this.selectCollapsedValue(state.probability_amplitudes);
    
    // Record observation
    const observation: StateObservation = {
      observer_id: observerId || 'system',
      observation_time: new Date(),
      pre_collapse_probabilities: new Map(state.probability_amplitudes),
      collapsed_value: collapsedValue,
      entanglement_effects: []
    };

    // Apply entanglement effects
    for (const entanglement of state.entanglements) {
      const effect = await this.applyEntanglementEffect(state, entanglement, collapsedValue);
      if (effect) {
        observation.entanglement_effects.push(effect);
      }
    }

    // Update state
    state.collapsed_state = collapsedValue;
    state.last_observation = observation.observation_time;
    state.metadata.collapse_count++;
    state.metadata.performance_metrics.collapse_efficiency = 
      Math.min(1.0, state.metadata.performance_metrics.collapse_efficiency + 0.05);

    // Store observation
    const history = this.observation_history.get(stateId) || [];
    history.push(observation);
    this.observation_history.set(stateId, history);

    return collapsedValue;
  }

  /**
   * Create entanglement between two quantum states
   */
  entangleStates(
    sourceId: string,
    targetId: string,
    correlationType: 'positive' | 'negative' | 'custom' = 'positive',
    strength: number = 0.8,
    correlationFunction?: (sourceValue: any, targetValue: any) => any
  ): boolean {
    const sourceState = this.states.get(sourceId);
    const targetState = this.states.get(targetId);
    
    if (!sourceState || !targetState) return false;

    // Create entanglement bond
    const entanglement: EntanglementBond = {
      target_state_id: targetId,
      correlation_type: correlationType,
      strength: Math.max(0, Math.min(1, strength)),
      correlation_function: correlationFunction
    };

    sourceState.entanglements.push(entanglement);
    sourceState.metadata.entanglement_history.push(targetId);

    // Update entanglement network
    this.entanglement_network.get(sourceId)?.add(targetId);
    this.entanglement_network.get(targetId)?.add(sourceId);

    // Update performance metrics
    sourceState.metadata.performance_metrics.entanglement_effectiveness = 
      Math.min(1.0, sourceState.metadata.performance_metrics.entanglement_effectiveness + 0.1);

    return true;
  }

  /**
   * Break entanglement between states
   */
  breakEntanglement(sourceId: string, targetId: string): boolean {
    const sourceState = this.states.get(sourceId);
    if (!sourceState) return false;

    const initialLength = sourceState.entanglements.length;
    sourceState.entanglements = sourceState.entanglements.filter(
      e => e.target_state_id !== targetId
    );

    if (sourceState.entanglements.length < initialLength) {
      this.entanglement_network.get(sourceId)?.delete(targetId);
      this.entanglement_network.get(targetId)?.delete(sourceId);
      return true;
    }

    return false;
  }

  /**
   * Update probability amplitudes (quantum interference)
   */
  updateProbabilities(stateId: string, newProbabilities: Map<string, number>): boolean {
    const state = this.states.get(stateId);
    if (!state || state.collapsed_state) return false;

    // Normalize new probabilities
    const normalized = this.normalizeProbabilities(state.superposition, newProbabilities);
    
    // Apply interference effects
    const interfered = this.applyQuantumInterference(state.probability_amplitudes, normalized);
    
    state.probability_amplitudes = interfered;
    
    // Update coherence based on probability change magnitude
    const changemagnitude = this.calculateProbabilityChange(state.probability_amplitudes, interfered);
    state.metadata.performance_metrics.coherence_stability = 
      Math.max(0.1, state.metadata.performance_metrics.coherence_stability - changemagnitude * 0.1);

    return true;
  }

  /**
   * Reset quantum state to superposition
   */
  resetToSuperposition(stateId: string): boolean {
    const state = this.states.get(stateId);
    if (!state) return false;

    // Reset to uniform superposition
    const uniformProbability = 1.0 / state.superposition.length;
    state.probability_amplitudes.clear();
    state.superposition.forEach(value => {
      state.probability_amplitudes.set(value, uniformProbability);
    });

    state.collapsed_state = undefined;
    state.last_observation = undefined;
    
    // Restore coherence
    state.metadata.performance_metrics.coherence_stability = 1.0;

    return true;
  }

  /**
   * Get entanglement network for visualization
   */
  getEntanglementNetwork(): Map<string, Set<string>> {
    return new Map(this.entanglement_network);
  }

  /**
   * Get comprehensive state analytics
   */
  getStateAnalytics(stateId: string): any {
    const state = this.states.get(stateId);
    const observations = this.observation_history.get(stateId);
    
    if (!state) return null;

    return {
      state_info: {
        id: state.id,
        name: state.name,
        current_status: state.collapsed_state ? 'collapsed' : 'superposition',
        coherence_remaining: this.calculateRemainingCoherence(state)
      },
      superposition_analysis: {
        states: state.superposition,
        probabilities: Object.fromEntries(state.probability_amplitudes),
        entropy: this.calculateQuantumEntropy(state.probability_amplitudes)
      },
      entanglement_analysis: {
        entangled_with: state.entanglements.map(e => e.target_state_id),
        entanglement_strength: state.entanglements.map(e => e.strength),
        network_connectivity: this.entanglement_network.get(stateId)?.size || 0
      },
      observation_history: {
        total_observations: observations?.length || 0,
        collapse_count: state.metadata.collapse_count,
        last_observation: state.last_observation,
        observation_impact: state.metadata.performance_metrics.observation_impact
      },
      performance_metrics: state.metadata.performance_metrics
    };
  }

  // Private helper methods

  private normalizeProbabilities(
    superposition: string[],
    probabilities?: Map<string, number>
  ): Map<string, number> {
    const normalized = new Map<string, number>();
    
    if (!probabilities) {
      // Uniform distribution
      const uniform = 1.0 / superposition.length;
      superposition.forEach(state => normalized.set(state, uniform));
      return normalized;
    }

    // Calculate sum and normalize
    let sum = 0;
    superposition.forEach(state => {
      const prob = probabilities.get(state) || 0;
      sum += prob;
    });

    if (sum === 0) {
      // Fallback to uniform if all probabilities are zero
      const uniform = 1.0 / superposition.length;
      superposition.forEach(state => normalized.set(state, uniform));
    } else {
      superposition.forEach(state => {
        const prob = (probabilities.get(state) || 0) / sum;
        normalized.set(state, prob);
      });
    }

    return normalized;
  }

  private selectCollapsedValue(probabilities: Map<string, number>): string {
    const random = Math.random();
    let cumulative = 0;
    
    for (const [state, probability] of probabilities) {
      cumulative += probability;
      if (random <= cumulative) {
        return state;
      }
    }
    
    // Fallback to first state if something goes wrong
    return Array.from(probabilities.keys())[0] || 'unknown';
  }

  private shouldCollapseOnObservation(state: QuantumState): boolean {
    return state.collapse_conditions.some(condition => 
      condition.trigger === 'observation' && 
      condition.parameters.auto_collapse
    );
  }

  private async applyEntanglementEffect(
    sourceState: QuantumState,
    entanglement: EntanglementBond,
    collapsedValue: string
  ): Promise<EntanglementEffect | null> {
    const targetState = this.states.get(entanglement.target_state_id);
    if (!targetState || targetState.collapsed_state) return null;

    const previousValue = targetState.collapsed_state || 'superposition';
    
    // Apply correlation based on entanglement type
    let newValue: string;
    
    if (entanglement.correlation_function) {
      newValue = entanglement.correlation_function(collapsedValue, previousValue);
    } else {
      switch (entanglement.correlation_type) {
        case 'positive':
          newValue = collapsedValue; // Same as source
          break;
        case 'negative':
          // Select opposite or different value
          const availableStates = targetState.superposition.filter(s => s !== collapsedValue);
          newValue = availableStates[Math.floor(Math.random() * availableStates.length)] || collapsedValue;
          break;
        default:
          newValue = collapsedValue;
      }
    }

    // Apply entanglement strength
    const effectProbability = entanglement.strength;
    if (Math.random() < effectProbability) {
      targetState.collapsed_state = newValue;
      targetState.metadata.collapse_count++;
    }

    return {
      affected_state_id: entanglement.target_state_id,
      previous_value: previousValue,
      new_value: newValue,
      correlation_strength: entanglement.strength
    };
  }

  private applyQuantumInterference(
    current: Map<string, number>,
    incoming: Map<string, number>
  ): Map<string, number> {
    const result = new Map<string, number>();
    
    // Apply interference (average with bias toward current state)
    for (const [state, currentProb] of current) {
      const incomingProb = incoming.get(state) || 0;
      const interfered = (currentProb * 0.7) + (incomingProb * 0.3);
      result.set(state, interfered);
    }

    // Renormalize
    const sum = Array.from(result.values()).reduce((a, b) => a + b, 0);
    for (const [state, prob] of result) {
      result.set(state, prob / sum);
    }

    return result;
  }

  private calculateProbabilityChange(
    before: Map<string, number>,
    after: Map<string, number>
  ): number {
    let totalChange = 0;
    for (const [state, beforeProb] of before) {
      const afterProb = after.get(state) || 0;
      totalChange += Math.abs(beforeProb - afterProb);
    }
    return totalChange / before.size;
  }

  private calculateRemainingCoherence(state: QuantumState): number {
    if (state.collapsed_state) return 0;
    
    const elapsed = state.last_observation ? 
      Date.now() - state.last_observation.getTime() : 0;
    
    const remaining = Math.max(0, (state.coherence_time - elapsed) / state.coherence_time);
    return remaining * state.metadata.performance_metrics.coherence_stability;
  }

  private calculateQuantumEntropy(probabilities: Map<string, number>): number {
    let entropy = 0;
    for (const probability of probabilities.values()) {
      if (probability > 0) {
        entropy -= probability * Math.log2(probability);
      }
    }
    return entropy;
  }

  private initializeCoherenceMonitoring(): void {
    // Initialize monitoring (will be started when first state is created)
    this.coherence_monitor = null;
  }

  private startCoherenceMonitoring(): void {
    if (this.coherence_monitor) return;
    
    // Monitor coherence and auto-collapse states that lose coherence
    this.coherence_monitor = setInterval(() => {
      for (const [stateId, state] of this.states) {
        if (state.collapsed_state) continue;
        
        const remainingCoherence = this.calculateRemainingCoherence(state);
        if (remainingCoherence <= 0.1) {
          // Auto-collapse due to decoherence
          this.collapseState(stateId, 'decoherence_monitor');
        }
      }
    }, 1000); // Check every second
  }

  private createExampleStates(): void {
    // Example states will be created on-demand to avoid global scope issues
    // This method is kept for reference but not called during initialization
  }
}