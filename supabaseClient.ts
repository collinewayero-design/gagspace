import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval
const getEnv = (key: string, viteKey: string): string => {
  let val = '';
  
  // Check process.env (Node/Webpack/CRA)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[key]) val = process.env[key] as string;
      else if (process.env[viteKey]) val = process.env[viteKey] as string;
    }
  } catch (e) {}

  // Check import.meta.env (Vite native)
  if (!val) {
    try {
      // @ts-ignore
      if (import.meta && import.meta.env && import.meta.env[viteKey]) {
        // @ts-ignore
        val = import.meta.env[viteKey];
      }
    } catch (e) {}
  }

  return val;
};

const supabaseUrl = getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

let supabaseInstance: any;

if (supabaseUrl && supabaseKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
}

// Fallback LocalStorage Mock Client
if (!supabaseInstance) {
  console.warn("Supabase credentials missing. Using LocalStorage mock client for full functionality.");
  
  const LS_PREFIX = 'gigspace_';
  
  // Helper to read/write from localStorage
  const db = {
    get: (table: string) => {
      try {
        const item = localStorage.getItem(LS_PREFIX + table);
        return item ? JSON.parse(item) : [];
      } catch { return []; }
    },
    set: (table: string, data: any[]) => {
      localStorage.setItem(LS_PREFIX + table, JSON.stringify(data));
    }
  };

  // Ensure default admin exists in Mock DB
  const admins = db.get('admins');
  if (admins.length === 0) {
      db.set('admins', [{
          id: 'mock-admin-1',
          email: 'admin@gigspace.com',
          access_code: 'admin123',
          name: 'Demo Admin',
          role: 'owner'
      }]);
  }

  class MockBuilder {
    table: string;
    filters: Array<{type: string, key?: string, value?: any}> = [];
    _order: any = null;

    constructor(table: string) {
      this.table = table;
    }

    select(columns = '*') { return this; }
    
    eq(column: string, value: any) {
      this.filters.push({ type: 'eq', key: column, value });
      return this;
    }
    
    order(column: string, { ascending = true } = {}) {
      this._order = { column, ascending };
      return this;
    }

    single() {
      return this.then(data => {
        return { data: (Array.isArray(data) && data.length > 0) ? data[0] : null, error: null };
      });
    }

    async insert(data: any) {
      const rows = db.get(this.table);
      const newRow = { id: Date.now().toString(), ...data };
      rows.push(newRow);
      db.set(this.table, rows);
      return { data: newRow, error: null, select: () => ({ single: async () => ({ data: newRow, error: null }) }) };
    }

    async update(updates: any) {
       const rows = db.get(this.table);
       let updatedCount = 0;
       
       const newRows = rows.map((row: any) => {
           let match = true;
           for (const f of this.filters) {
               if (f.type === 'eq' && row[f.key!] !== f.value) match = false;
           }
           if (match) {
               updatedCount++;
               return { ...row, ...updates };
           }
           return row;
       });
       
       db.set(this.table, newRows);
       return { data: null, error: null, count: updatedCount };
    }

    async upsert(data: any) {
        const rows = db.get(this.table);
        const existingIndex = rows.findIndex((r: any) => r.id == data.id);
        
        if (existingIndex >= 0) {
            rows[existingIndex] = { ...rows[existingIndex], ...data };
        } else {
            rows.push(data);
        }
        
        db.set(this.table, rows);
        return { data, error: null };
    }

    async delete() {
        let rows = db.get(this.table);
        rows = rows.filter((row: any) => {
             for (const f of this.filters) {
               if (f.type === 'eq' && row[f.key!] === f.value) return false;
             }
             return true;
        });
        db.set(this.table, rows);
        return { data: null, error: null };
    }

    // Thenable interface to execute the query
    then(resolve: any, reject?: any) {
        let rows = db.get(this.table);
        
        // Apply Filters
        for (const f of this.filters) {
            if (f.type === 'eq') {
                rows = rows.filter((r: any) => r[f.key!] == f.value); // Loose equality for ID string/number
            }
        }

        // Apply Order
        if (this._order) {
            rows.sort((a: any, b: any) => {
                const valA = a[this._order.column];
                const valB = b[this._order.column];
                if (valA < valB) return this._order.ascending ? -1 : 1;
                if (valA > valB) return this._order.ascending ? 1 : -1;
                return 0;
            });
        }

        return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
    }
  }

  supabaseInstance = {
    from: (table: string) => new MockBuilder(table),
  } as any;
}

export const supabase = supabaseInstance;