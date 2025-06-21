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
            name: 'supabase_schema',
            description: 'Execute raw SQL commands for schema management',
            inputSchema: {
              type: 'object',
              properties: {
                sql: {
                  type: 'string',
                  description: 'Raw SQL command to execute',
                },
                operation: {
                  type: 'string',
                  enum: ['create_table', 'alter_table', 'drop_table', 'create_index', 'raw_sql'],
                  description: 'Type of schema operation',
                },
              },
              required: ['sql'],
            },
          },
          {
            name: 'supabase_table_create',
            description: 'Create a new table with columns and constraints',
            inputSchema: {
              type: 'object',
              properties: {
                table_name: {
                  type: 'string',
                  description: 'Name of the table to create',
                },
                columns: {
                  type: 'array',
                  description: 'Array of column definitions',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Column name' },
                      type: { type: 'string', description: 'Column data type (e.g., TEXT, UUID, INTEGER)' },
                      constraints: { type: 'string', description: 'Column constraints (e.g., NOT NULL, UNIQUE, PRIMARY KEY)' },
                      default: { type: 'string', description: 'Default value' },
                    },
                    required: ['name', 'type'],
                  },
                },
                rls_enabled: {
                  type: 'boolean',
                  description: 'Enable Row Level Security',
                  default: true,
                },
                policies: {
                  type: 'array',
                  description: 'Array of RLS policies to create',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Policy name' },
                      operation: { type: 'string', description: 'Operation (SELECT, INSERT, UPDATE, DELETE)' },
                      condition: { type: 'string', description: 'Policy condition' },
                    },
                  },
                },
              },
              required: ['table_name', 'columns'],
            },
          },
          {
            name: 'supabase_table_info',
            description: 'Get information about existing tables and their structure',
            inputSchema: {
              type: 'object',
              properties: {
                table_name: {
                  type: 'string',
                  description: 'Name of the table to inspect (optional - if not provided, lists all tables)',
                },
                include_columns: {
                  type: 'boolean',
                  description: 'Include column information',
                  default: true,
                },
              },
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
          case 'supabase_schema':
            return await this.handleSchemaOperation(args);
          case 'supabase_table_create':
            return await this.handleTableCreate(args);
          case 'supabase_table_info':
            return await this.handleTableInfo(args);
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

  async handleSchemaOperation(args) {
    const { sql, operation } = args;

    try {
      // Raw SQL 실행을 위해 RPC 함수 사용
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        throw new Error(`Schema operation error: ${error.message}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Schema operation completed successfully. Operation: ${operation || 'raw_sql'}\nResult: ${JSON.stringify(data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Schema operation failed: ${error.message}`);
    }
  }

  async handleTableCreate(args) {
    const { table_name, columns, rls_enabled = true, policies = [] } = args;

    try {
      // 테이블 생성 SQL 구성
      const columnDefinitions = columns.map(col => {
        let definition = `${col.name} ${col.type}`;
        if (col.constraints) {
          definition += ` ${col.constraints}`;
        }
        if (col.default) {
          definition += ` DEFAULT ${col.default}`;
        }
        return definition;
      }).join(', ');

      const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table_name} (${columnDefinitions});`;

      // 테이블 생성
      const { data: createResult, error: createError } = await supabase.rpc('exec_sql', { 
        sql_query: createTableSQL 
      });

      if (createError) {
        throw new Error(`Table creation error: ${createError.message}`);
      }

      let results = [`Table '${table_name}' created successfully.`];

      // RLS 활성화
      if (rls_enabled) {
        const rlsSQL = `ALTER TABLE ${table_name} ENABLE ROW LEVEL SECURITY;`;
        const { error: rlsError } = await supabase.rpc('exec_sql', { sql_query: rlsSQL });
        
        if (rlsError) {
          results.push(`Warning: Could not enable RLS: ${rlsError.message}`);
        } else {
          results.push('Row Level Security enabled.');
        }
      }

      // 정책 생성
      for (const policy of policies) {
        const policySQL = `CREATE POLICY "${policy.name}" ON ${table_name} FOR ${policy.operation} ${policy.condition};`;
        const { error: policyError } = await supabase.rpc('exec_sql', { sql_query: policySQL });
        
        if (policyError) {
          results.push(`Warning: Could not create policy '${policy.name}': ${policyError.message}`);
        } else {
          results.push(`Policy '${policy.name}' created.`);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: results.join('\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Table creation failed: ${error.message}`);
    }
  }

  async handleTableInfo(args) {
    const { table_name, include_columns = true } = args;

    try {
      if (table_name) {
        // 특정 테이블 정보 조회
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('*')
          .eq('table_name', table_name)
          .eq('table_schema', 'public');

        if (error) {
          throw new Error(`Table info error: ${error.message}`);
        }

        let result = { table: data };

        if (include_columns && data && data.length > 0) {
          const { data: columns, error: colError } = await supabase
            .from('information_schema.columns')
            .select('*')
            .eq('table_name', table_name)
            .eq('table_schema', 'public');

          if (colError) {
            result.columns_error = colError.message;
          } else {
            result.columns = columns;
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } else {
        // 모든 테이블 목록 조회
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name, table_type')
          .eq('table_schema', 'public');

        if (error) {
          throw new Error(`Tables list error: ${error.message}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }
    } catch (error) {
      throw new Error(`Table info operation failed: ${error.message}`);
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