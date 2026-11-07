import type { Pandal } from '../types/pandal';
import rawPandalsData from '../data/pandals.json?raw';

/**
 * Service to manage pandal data access.
 * Currently backed by local JSON file (/src/data/pandals.json).
 * Designed for easy migration to Supabase / PostgreSQL in future iterations.
 */
class PandalService {
  private cachedPandals: Pandal[] | null = null;

  /**
   * Helper that strips comments (e.g. `// TODO: verify`)
   * from JSON text without breaking URLs containing `://`.
   */
  private parseJsonWithComments(rawText: string): Pandal[] {
    // Strip `// TODO: ...` and standalone `// ...` comments safely without mangling `http://` or `https://`
    const sanitized = rawText
      .replace(/\/\/\s*TODO:[^\r\n]*/g, '')
      .replace(/(^|[^:])\/\/[^\r\n]*/g, '$1');
    return JSON.parse(sanitized) as Pandal[];
  }

  /**
   * Fetch all pandals.
   * Can be swapped to `await supabase.from('pandals').select('*')` later.
   */
  public async getPandals(): Promise<Pandal[]> {
    if (this.cachedPandals) {
      return this.cachedPandals;
    }

    try {
      const data = this.parseJsonWithComments(rawPandalsData);
      this.cachedPandals = data;
      return data;
    } catch (error) {
      console.error('Failed to parse pandals JSON data:', error);
      return [];
    }
  }

  /**
   * Fetch a single pandal by id.
   */
  public async getPandalById(id: string): Promise<Pandal | undefined> {
    const pandals = await this.getPandals();
    return pandals.find((p) => p.id === id);
  }

  /**
   * Filter pandals in memory.
   */
  public async filterPandals(options: {
    query?: string;
    crowdLevel?: string;
    ecoFriendlyOnly?: boolean;
    area?: string;
  }): Promise<Pandal[]> {
    const list = await this.getPandals();
    return list.filter((pandal) => {
      if (options.query && options.query.trim() !== '') {
        const q = options.query.toLowerCase().trim();
        const matchesName = pandal.name.toLowerCase().includes(q);
        const matchesArea = pandal.area.toLowerCase().includes(q);
        const matchesStation = pandal.nearestStation.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesStation) {
          return false;
        }
      }

      if (options.crowdLevel && options.crowdLevel !== 'All') {
        if (pandal.crowdLevel !== options.crowdLevel) {
          return false;
        }
      }

      if (options.ecoFriendlyOnly && !pandal.ecoFriendly) {
        return false;
      }

      if (options.area && options.area !== 'All Areas') {
        if (pandal.area !== options.area) {
          return false;
        }
      }

      return true;
    });
  }
}

export const pandalService = new PandalService();
