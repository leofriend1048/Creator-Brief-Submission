export type Tables = {
  public_links: {
    Row: {
      id: string
      url_key: string
      script_text: string
      status: 'pending' | 'completed'
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      url_key: string
      script_text: string
      status?: 'pending' | 'completed'
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      url_key?: string
      script_text?: string
      status?: 'pending' | 'completed'
      created_at?: string
      updated_at?: string
    }
  }
  uploads: {
    Row: {
      id: string
      public_link_id: string
      file_path: string
      file_name: string
      file_size: number
      transcription: string | null
      validation_report: Record<string, any> | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      public_link_id: string
      file_path: string
      file_name: string
      file_size: number
      transcription?: string | null
      validation_report?: Record<string, any> | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      public_link_id?: string
      file_path?: string
      file_name?: string
      file_size?: number
      transcription?: string | null
      validation_report?: Record<string, any> | null
      created_at?: string
      updated_at?: string
    }
  }
  audit_logs: {
    Row: {
      id: string
      public_link_id: string
      action: string
      details: Record<string, any> | null
      created_at: string
    }
    Insert: {
      id?: string
      public_link_id: string
      action: string
      details?: Record<string, any> | null
      created_at?: string
    }
    Update: {
      id?: string
      public_link_id?: string
      action?: string
      details?: Record<string, any> | null
      created_at?: string
    }
  }
}