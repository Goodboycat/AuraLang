// Realistic Intent Parser: Text → Tokens → AST → IR
// This is a production-ready parser, not aspirational

export interface Token {
  type: 'keyword' | 'identifier' | 'string' | 'array' | 'brace' | 'colon' | 'comma';
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  value?: any;
  children?: ASTNode[];
  metadata?: Record<string, any>;
}

// Intermediate Representation (IR) - deterministic, executable format
export interface IntentIR {
  id: string;
  type: 'intent';
  name: string;
  goal?: string;
  capabilities: string[];
  constraints: string[];
  successCriteria?: string;
  architecture?: Record<string, any>;
  metadata: {
    parsed_at: Date;
    source_lines: number;
    complexity_score: number;
  };
}

export class IntentParser {
  // Lexer: text → tokens
  tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let line = 1;
    let column = 1;
    let i = 0;

    while (i < code.length) {
      const char = code[i];

      // Skip whitespace
      if (char === ' ' || char === '\t') {
        i++;
        column++;
        continue;
      }

      // Handle newlines
      if (char === '\n') {
        i++;
        line++;
        column = 1;
        continue;
      }

      // Skip comments
      if (char === '#') {
        while (i < code.length && code[i] !== '\n') {
          i++;
        }
        continue;
      }

      // Handle braces
      if (char === '{' || char === '}') {
        tokens.push({ type: 'brace', value: char, line, column });
        i++;
        column++;
        continue;
      }

      // Handle brackets
      if (char === '[' || char === ']') {
        tokens.push({ type: 'array', value: char, line, column });
        i++;
        column++;
        continue;
      }

      // Handle colons
      if (char === ':') {
        tokens.push({ type: 'colon', value: char, line, column });
        i++;
        column++;
        continue;
      }

      // Handle commas
      if (char === ',') {
        tokens.push({ type: 'comma', value: char, line, column });
        i++;
        column++;
        continue;
      }

      // Handle strings
      if (char === '"' || char === "'") {
        const quote = char;
        let value = '';
        i++;
        column++;
        
        while (i < code.length && code[i] !== quote) {
          if (code[i] === '\\' && i + 1 < code.length) {
            value += code[i + 1];
            i += 2;
            column += 2;
          } else {
            value += code[i];
            i++;
            column++;
          }
        }
        
        i++; // Skip closing quote
        column++;
        tokens.push({ type: 'string', value, line, column: column - value.length });
        continue;
      }

      // Handle identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        let value = '';
        const startColumn = column;
        
        while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
          value += code[i];
          i++;
          column++;
        }

        const keywords = ['intent', 'goal', 'capabilities', 'constraints', 'architecture', 'success_criteria'];
        const type = keywords.includes(value) ? 'keyword' : 'identifier';
        
        tokens.push({ type, value, line, column: startColumn });
        continue;
      }

      // Unknown character - skip it
      i++;
      column++;
    }

    return tokens;
  }

  // Parser: tokens → AST
  parse(tokens: Token[]): ASTNode {
    let position = 0;

    const peek = (): Token | undefined => tokens[position];
    const consume = (): Token => tokens[position++];
    const expect = (type: string, value?: string): Token => {
      const token = consume();
      if (token.type !== type || (value && token.value !== value)) {
        throw new Error(`Parse error at ${token.line}:${token.column}: expected ${type}${value ? ` '${value}'` : ''}, got ${token.type} '${token.value}'`);
      }
      return token;
    };

    const parseArray = (): string[] => {
      expect('array', '[');
      const items: string[] = [];
      
      while (peek() && peek()!.value !== ']') {
        if (peek()!.type === 'string') {
          items.push(consume().value);
        }
        if (peek()?.value === ',') {
          consume();
        }
      }
      
      expect('array', ']');
      return items;
    };

    const parseObject = (): Record<string, any> => {
      expect('brace', '{');
      const obj: Record<string, any> = {};
      
      while (peek() && peek()!.value !== '}') {
        if (peek()!.type === 'identifier' || peek()!.type === 'keyword') {
          const key = consume().value;
          expect('colon');
          
          if (peek()!.value === '[') {
            obj[key] = parseArray();
          } else if (peek()!.value === '{') {
            obj[key] = parseObject();
          } else if (peek()!.type === 'string') {
            obj[key] = consume().value;
          } else if (peek()!.type === 'identifier') {
            obj[key] = consume().value;
          }
        }
        
        if (peek()?.value === ',') {
          consume();
        }
      }
      
      expect('brace', '}');
      return obj;
    };

    // Start parsing
    expect('keyword', 'intent');
    const name = expect('identifier').value;
    const body = parseObject();

    return {
      type: 'IntentDeclaration',
      value: name,
      children: [
        {
          type: 'Body',
          value: body,
        },
      ],
    };
  }

  // Generate IR: AST → IR (intermediate representation)
  generateIR(ast: ASTNode): IntentIR {
    if (ast.type !== 'IntentDeclaration') {
      throw new Error('Invalid AST: expected IntentDeclaration');
    }

    const body = ast.children?.[0]?.value || {};
    
    // Calculate complexity score based on structure
    const capabilityCount = (body.capabilities || []).length;
    const constraintCount = (body.constraints || []).length;
    const hasArchitecture = !!body.architecture;
    const complexityScore = capabilityCount * 2 + constraintCount + (hasArchitecture ? 10 : 0);

    return {
      id: `intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'intent',
      name: ast.value as string,
      goal: body.goal,
      capabilities: body.capabilities || [],
      constraints: body.constraints || [],
      successCriteria: body.success_criteria,
      architecture: body.architecture,
      metadata: {
        parsed_at: new Date(),
        source_lines: 0, // Will be set by caller
        complexity_score: complexityScore,
      },
    };
  }

  // Main entry point: code string → IR
  parseIntent(code: string): IntentIR {
    try {
      const tokens = this.tokenize(code);
      const ast = this.parse(tokens);
      const ir = this.generateIR(ast);
      
      // Set source lines
      ir.metadata.source_lines = code.split('\n').length;
      
      return ir;
    } catch (error) {
      throw new Error(`Intent parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate IR structure
  validateIR(ir: IntentIR): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!ir.name || ir.name.trim() === '') {
      errors.push('Intent must have a name');
    }

    if (!ir.goal || ir.goal.trim() === '') {
      errors.push('Intent must have a goal');
    }

    if (!ir.capabilities || ir.capabilities.length === 0) {
      errors.push('Intent must have at least one capability');
    }

    if (ir.metadata.complexity_score > 50) {
      errors.push('Intent is too complex (score > 50). Consider breaking it down.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const intentParser = new IntentParser();
