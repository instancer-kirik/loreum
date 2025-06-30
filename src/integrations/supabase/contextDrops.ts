import { supabase } from './client';

export interface ContextDrop {
  id: string;
  name: string;
  description?: string;
  raw_content: string;
  conversation_context: string;
  participants: string[];
  annotations: EntityAnnotation[];
  tags: string[];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  message_count: number;
  annotation_count: number;
  participant_count: number;
}

export interface EntityAnnotation {
  id: string;
  text: string;
  entity_type: 'character' | 'mechanic' | 'system' | 'location' | 'item' | 'concept' | 'other';
  entity_id?: string;
  notes?: string;
  start_pos: number;
  end_pos: number;
  color?: string;
}

export interface ContextDropCreate {
  name: string;
  description?: string;
  raw_content: string;
  conversation_context?: string;
  participants?: string[];
  annotations?: EntityAnnotation[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ContextDropUpdate {
  name?: string;
  description?: string;
  raw_content?: string;
  conversation_context?: string;
  participants?: string[];
  annotations?: EntityAnnotation[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  conversation_context: string;
  created_at: Date;
  annotation_count: number;
  message_count: number;
  search_rank: number;
}

class ContextDropService {
  private transformFromDb(data: any): ContextDrop {
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      participants: data.participants || [],
      annotations: data.annotations || [],
      tags: data.tags || [],
      metadata: data.metadata || {}
    };
  }

  async getAll(limit = 50, offset = 0): Promise<ContextDrop[]> {
    const { data, error } = await supabase
      .from('context_drops')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch context drops: ${error.message}`);
    }

    return data.map(this.transformFromDb);
  }

  async getById(id: string): Promise<ContextDrop | null> {
    const { data, error } = await supabase
      .from('context_drops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch context drop: ${error.message}`);
    }

    return this.transformFromDb(data);
  }

  async create(contextDrop: ContextDropCreate): Promise<ContextDrop> {
    const { data, error } = await supabase
      .from('context_drops')
      .insert([{
        name: contextDrop.name,
        description: contextDrop.description,
        raw_content: contextDrop.raw_content,
        conversation_context: contextDrop.conversation_context || 'general',
        participants: contextDrop.participants || [],
        annotations: contextDrop.annotations || [],
        tags: contextDrop.tags || [],
        metadata: contextDrop.metadata || {}
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create context drop: ${error.message}`);
    }

    return this.transformFromDb(data);
  }

  async update(id: string, updates: ContextDropUpdate): Promise<ContextDrop> {
    const { data, error } = await supabase
      .from('context_drops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update context drop: ${error.message}`);
    }

    return this.transformFromDb(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('context_drops')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete context drop: ${error.message}`);
    }
  }

  async search(searchTerm: string, limit = 20, offset = 0): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .rpc('search_context_drops', {
        search_term: searchTerm,
        limit_count: limit,
        offset_count: offset
      });

    if (error) {
      throw new Error(`Failed to search context drops: ${error.message}`);
    }

    return data.map((item: any) => ({
      ...item,
      created_at: new Date(item.created_at)
    }));
  }

  async getByContext(context: string, limit = 20): Promise<ContextDrop[]> {
    const { data, error } = await supabase
      .rpc('get_context_drops_by_context', {
        context_name: context,
        limit_count: limit
      });

    if (error) {
      throw new Error(`Failed to fetch context drops by context: ${error.message}`);
    }

    return data.map(this.transformFromDb);
  }

  async getByTag(tag: string, limit = 20): Promise<ContextDrop[]> {
    const { data, error } = await supabase
      .from('context_drops')
      .select('*')
      .contains('tags', [tag])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch context drops by tag: ${error.message}`);
    }

    return data.map(this.transformFromDb);
  }

  async getEntities(dropId: string): Promise<EntityAnnotation[]> {
    const { data, error } = await supabase
      .rpc('get_context_drop_entities', {
        drop_id: dropId
      });

    if (error) {
      throw new Error(`Failed to fetch context drop entities: ${error.message}`);
    }

    return data;
  }

  async getStats(): Promise<{
    total: number;
    contexts: string[];
    recentCount: number;
    totalAnnotations: number;
  }> {
    // Get total count
    const { count: total, error: countError } = await supabase
      .from('context_drops')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Failed to get context drop count: ${countError.message}`);
    }

    // Get unique contexts
    const { data: contextData, error: contextError } = await supabase
      .from('context_drops')
      .select('conversation_context')
      .not('conversation_context', 'is', null);

    if (contextError) {
      throw new Error(`Failed to get contexts: ${contextError.message}`);
    }

    const contexts = [...new Set(contextData.map(d => d.conversation_context))];

    // Get recent count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentCount, error: recentError } = await supabase
      .from('context_drops')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (recentError) {
      throw new Error(`Failed to get recent context drop count: ${recentError.message}`);
    }

    // Get total annotations
    const { data: annotationData, error: annotationError } = await supabase
      .from('context_drops')
      .select('annotation_count');

    if (annotationError) {
      throw new Error(`Failed to get annotation count: ${annotationError.message}`);
    }

    const totalAnnotations = annotationData.reduce((sum, item) => sum + (item.annotation_count || 0), 0);

    return {
      total: total || 0,
      contexts,
      recentCount: recentCount || 0,
      totalAnnotations
    };
  }

  // Helper method to parse chat messages from raw content
  parseMessages(rawContent: string): Array<{ role: 'user' | 'assistant'; content: string }> {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    const lines = rawContent.split('\n');
    let currentMessage: { role: 'user' | 'assistant'; content: string } | null = null;
    
    for (const line of lines) {
      if (line.startsWith('**User:**') || line.startsWith('**You:**')) {
        if (currentMessage) messages.push(currentMessage);
        currentMessage = { role: 'user', content: line.replace(/^\*\*(?:User|You):\*\*\s*/, '') };
      } else if (line.startsWith('**ChatGPT:**') || line.startsWith('**Assistant:**')) {
        if (currentMessage) messages.push(currentMessage);
        currentMessage = { role: 'assistant', content: line.replace(/^\*\*(?:ChatGPT|Assistant):\*\*\s*/, '') };
      } else if (currentMessage) {
        currentMessage.content += '\n' + line;
      } else {
        // If no role marker found, treat as assistant message
        currentMessage = { role: 'assistant', content: line };
      }
    }
    
    if (currentMessage) messages.push(currentMessage);
    return messages.filter(m => m.content.trim());
  }
}

export const contextDropService = new ContextDropService();