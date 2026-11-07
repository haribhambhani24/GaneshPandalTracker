import type { Circuit } from '../types/circuit';
import circuitsData from '../data/circuits.json';

class CircuitService {
  private circuits: Circuit[] = circuitsData as Circuit[];

  public async getCircuits(): Promise<Circuit[]> {
    return this.circuits;
  }

  public async getCircuitById(id: string): Promise<Circuit | undefined> {
    return this.circuits.find((c) => c.id === id);
  }
}

export const circuitService = new CircuitService();

