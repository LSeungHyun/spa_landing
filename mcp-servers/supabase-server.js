#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mtowbsogtkpxvysnbdau.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I';

// Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SupabaseMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // 에러 핸들링
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // 사용 가능한 도구 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'supabase_query',
            description: 'Execute a query on Supabase database',
            inputSchema: {
              type: 'object',
              properties: {
                table: {
                  type: 'string',
                  description: 'Table name to query',
                },
                operation: {
                  type: 'string',
                  enum: ['select', 'insert', 'update', 'delete'],
                  description: 'Database operation to perform',
                },
                data: {
                  type: 'object',
                  description: 'Data for insert/update operations',
                },
                filters: {
                  type: 'object',
                  description: 'Filters for select/update/delete operations',
                },
                columns: {
                  type: 'string',
                  description: 'Columns to select (default: *)',
                },
              },
              required: ['table', 'operation'],
            },
          },
          {
            name: 'supabase_auth',
            description: 'Perform authentication operations',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['signUp', 'signIn', 'signOut', 'getUser'],
                  description: 'Authentication action to perform',
                },
                email: {
                  type: 'string',
                  description: 'Email for signUp/signIn',
                },
                password: {
                  type: 'string',
                  description: 'Password for signUp/signIn',
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'supabase_storage',
            description: 'Perform storage operations',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['upload', 'download', 'delete', 'list'],
                  description: 'Storage action to perform',
                },
                bucket: {
                  type: 'string',
                  description: 'Storage bucket name',
                },
                path: {
                  type: 'string',
                  description: 'File path in storage',
                },
              },
              required: ['action', 'bucket'],
            },
          },
        ],
      };
    });

    // 도구 실행 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'supabase_query':
            return await this.handleDatabaseQuery(args);
          case 'supabase_auth':
            return await this.handleAuth(args);
          case 'supabase_storage':
            return await this.handleStorage(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async handleDatabaseQuery(args) {
    const { table, operation, data, filters, columns = '*' } = args;

    try {
      let query = supabase.from(table);

      switch (operation) {
        case 'select':
          query = query.select(columns);
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              query = query.eq(key, value);
            });
          }
          break;

        case 'insert':
          if (!data) throw new Error('Data is required for insert operation');
          query = query.insert(data).select();
          break;

        case 'update':
          if (!data) throw new Error('Data is required for update operation');
          query = query.update(data);
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              query = query.eq(key, value);
            });
          }
          query = query.select();
          break;

        case 'delete':
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              query = query.eq(key, value);
            });
          }
          query = query.delete();
          break;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      const { data: result, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async handleAuth(args) {
    const { action, email, password } = args;

    try {
      let result;

      switch (action) {
        case 'signUp':
          if (!email || !password) {
            throw new Error('Email and password are required for signUp');
          }
          result = await supabase.auth.signUp({ email, password });
          break;

        case 'signIn':
          if (!email || !password) {
            throw new Error('Email and password are required for signIn');
          }
          result = await supabase.auth.signInWithPassword({ email, password });
          break;

        case 'signOut':
          result = await supabase.auth.signOut();
          break;

        case 'getUser':
          result = await supabase.auth.getUser();
          break;

        default:
          throw new Error(`Unsupported auth action: ${action}`);
      }

      if (result.error) {
        throw new Error(`Auth error: ${result.error.message}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Auth operation failed: ${error.message}`);
    }
  }

  async handleStorage(args) {
    const { action, bucket, path } = args;

    try {
      let result;

      switch (action) {
        case 'list':
          result = await supabase.storage.from(bucket).list(path || '');
          break;

        case 'delete':
          if (!path) throw new Error('Path is required for delete operation');
          result = await supabase.storage.from(bucket).remove([path]);
          break;

        default:
          throw new Error(`Unsupported storage action: ${action}`);
      }

      if (result.error) {
        throw new Error(`Storage error: ${result.error.message}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Storage operation failed: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Supabase MCP server running on stdio');
  }
}

const server = new SupabaseMCPServer();
server.run().catch(console.error); 