import { AngleMode } from '../types/calculator';

export interface EvaluationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

export class ExpressionEvaluatorTS {
  public evaluate(expression: string, angleMode: AngleMode): EvaluationResult {
    const trimmed = expression.trim();
    if (!trimmed) {
      return { success: true, value: 0, formatted: '0' };
    }

    try {
      const tokens = this.tokenize(trimmed);
      const rpn = this.shuntingYard(tokens);
      const result = this.evaluateRPN(rpn, angleMode);

      if (isNaN(result) || !isFinite(result)) {
        return { success: false, error: 'Undefined / Out of Domain' };
      }

      return {
        success: true,
        value: result,
        formatted: this.formatResult(result)
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Syntax Error';
      return { success: false, error: msg };
    }
  }

  public formatResult(value: number): string {
    if (Math.abs(value) < 1e-12 && value !== 0) {
      return value.toExponential(6);
    }
    if (Math.abs(value) >= 1e12) {
      return value.toExponential(6);
    }
    if (Number.isInteger(value)) {
      return value.toString();
    }
    // Round to precision and strip trailing zeros
    const str = value.toFixed(8);
    return str.replace(/\.?0+$/, '');
  }

  private tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'PI')
      .replace(/√/g, 'sqrt');

    while (i < sanitized.length) {
      const c = sanitized[i];

      if (/\s/.test(c)) {
        i++;
        continue;
      }

      if (/[0-9.]/.test(c)) {
        let numStr = '';
        while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
          numStr += sanitized[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
        continue;
      }

      if (c === '(') {
        // Implicit multiplication e.g. 2(3) or pi(
        if (tokens.length > 0) {
          const last = tokens[tokens.length - 1];
          if (last.type === 'NUMBER' || last.type === 'RIGHT_PAREN' || last.type === 'CONST') {
            tokens.push({ type: 'OPERATOR', symbol: '*', prec: 2, rightAssoc: false });
          }
        }
        tokens.push({ type: 'LEFT_PAREN' });
        i++;
        continue;
      }

      if (c === ')') {
        tokens.push({ type: 'RIGHT_PAREN' });
        i++;
        continue;
      }

      if (['+', '-', '*', '/', '%', '^', '!'].includes(c)) {
        const isUnaryMinus =
          c === '-' &&
          (tokens.length === 0 ||
            tokens[tokens.length - 1].type === 'LEFT_PAREN' ||
            tokens[tokens.length - 1].type === 'OPERATOR');

        if (isUnaryMinus) {
          tokens.push({ type: 'NUMBER', value: 0 });
          tokens.push({ type: 'OPERATOR', symbol: '-', prec: 2, rightAssoc: false });
        } else {
          let prec = 1;
          if (['*', '/', '%'].includes(c)) prec = 2;
          if (c === '^') prec = 3;
          if (c === '!') prec = 4;
          const rightAssoc = c === '^';
          tokens.push({ type: 'OPERATOR', symbol: c, prec, rightAssoc });
        }
        i++;
        continue;
      }

      if (/[a-zA-Z]/.test(c)) {
        let nameStr = '';
        while (i < sanitized.length && /[a-zA-Z0-9]/.test(sanitized[i])) {
          nameStr += sanitized[i];
          i++;
        }
        const upper = nameStr.toUpperCase();
        if (upper === 'PI') {
          if (tokens.length > 0 && (tokens[tokens.length - 1].type === 'NUMBER' || tokens[tokens.length - 1].type === 'RIGHT_PAREN')) {
            tokens.push({ type: 'OPERATOR', symbol: '*', prec: 2, rightAssoc: false });
          }
          tokens.push({ type: 'CONST', symbol: 'PI', value: Math.PI });
        } else if (upper === 'E') {
          if (tokens.length > 0 && (tokens[tokens.length - 1].type === 'NUMBER' || tokens[tokens.length - 1].type === 'RIGHT_PAREN')) {
            tokens.push({ type: 'OPERATOR', symbol: '*', prec: 2, rightAssoc: false });
          }
          tokens.push({ type: 'CONST', symbol: 'E', value: Math.E });
        } else {
          if (tokens.length > 0 && (tokens[tokens.length - 1].type === 'NUMBER' || tokens[tokens.length - 1].type === 'RIGHT_PAREN')) {
            tokens.push({ type: 'OPERATOR', symbol: '*', prec: 2, rightAssoc: false });
          }
          tokens.push({ type: 'FUNCTION', name: nameStr.toLowerCase() });
        }
        continue;
      }

      i++;
    }

    return tokens;
  }

  private shuntingYard(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const stack: Token[] = [];

    for (const token of tokens) {
      if (token.type === 'NUMBER' || token.type === 'CONST') {
        output.push(token);
      } else if (token.type === 'FUNCTION') {
        stack.push(token);
      } else if (token.type === 'OPERATOR') {
        while (stack.length > 0) {
          const top = stack[stack.length - 1];
          if (
            top.type === 'OPERATOR' &&
            ((!token.rightAssoc && token.prec <= top.prec) ||
              (token.rightAssoc && token.prec < top.prec))
          ) {
            output.push(stack.pop()!);
          } else if (top.type === 'FUNCTION') {
            output.push(stack.pop()!);
          } else {
            break;
          }
        }
        stack.push(token);
      } else if (token.type === 'LEFT_PAREN') {
        stack.push(token);
      } else if (token.type === 'RIGHT_PAREN') {
        while (stack.length > 0 && stack[stack.length - 1].type !== 'LEFT_PAREN') {
          output.push(stack.pop()!);
        }
        if (stack.length > 0 && stack[stack.length - 1].type === 'LEFT_PAREN') {
          stack.pop();
        }
        if (stack.length > 0 && stack[stack.length - 1].type === 'FUNCTION') {
          output.push(stack.pop()!);
        }
      }
    }

    while (stack.length > 0) {
      const top = stack.pop()!;
      if (top.type !== 'LEFT_PAREN' && top.type !== 'RIGHT_PAREN') {
        output.push(top);
      }
    }

    return output;
  }

  private evaluateRPN(tokens: Token[], angleMode: AngleMode): number {
    const stack: number[] = [];

    for (const token of tokens) {
      if (token.type === 'NUMBER') {
        stack.push(token.value);
      } else if (token.type === 'CONST') {
        stack.push(token.value);
      } else if (token.type === 'OPERATOR') {
        if (token.symbol === '!') {
          const a = stack.pop();
          if (a === undefined) throw new Error('Invalid factorial');
          stack.push(this.factorial(a));
        } else {
          const b = stack.pop();
          const a = stack.pop();
          if (a === undefined || b === undefined) throw new Error('Missing operand');

          switch (token.symbol) {
            case '+': stack.push(a + b); break;
            case '-': stack.push(a - b); break;
            case '*': stack.push(a * b); break;
            case '/':
              if (b === 0) throw new Error('Cannot divide by zero');
              stack.push(a / b);
              break;
            case '%': stack.push(a % b); break;
            case '^': stack.push(Math.pow(a, b)); break;
          }
        }
      } else if (token.type === 'FUNCTION') {
        const a = stack.pop();
        if (a === undefined) throw new Error(`Missing argument for ${token.name}`);

        const rad = angleMode === 'DEG' ? (a * Math.PI) / 180 : a;

        switch (token.name) {
          case 'sin': stack.push(Math.sin(rad)); break;
          case 'cos': stack.push(Math.cos(rad)); break;
          case 'tan': {
            const val = Math.tan(rad);
            if (Math.abs(val) > 1e15) throw new Error('Undefined (Asymptote)');
            stack.push(val);
            break;
          }
          case 'asin': {
            if (a < -1 || a > 1) throw new Error('asin domain error [-1, 1]');
            const res = Math.asin(a);
            stack.push(angleMode === 'DEG' ? (res * 180) / Math.PI : res);
            break;
          }
          case 'acos': {
            if (a < -1 || a > 1) throw new Error('acos domain error [-1, 1]');
            const res = Math.acos(a);
            stack.push(angleMode === 'DEG' ? (res * 180) / Math.PI : res);
            break;
          }
          case 'atan': {
            const res = Math.atan(a);
            stack.push(angleMode === 'DEG' ? (res * 180) / Math.PI : res);
            break;
          }
          case 'sinh': stack.push(Math.sinh(a)); break;
          case 'cosh': stack.push(Math.cosh(a)); break;
          case 'tanh': stack.push(Math.tanh(a)); break;
          case 'log':
          case 'log10': {
            if (a <= 0) throw new Error('log domain error (> 0)');
            stack.push(Math.log10(a));
            break;
          }
          case 'ln': {
            if (a <= 0) throw new Error('ln domain error (> 0)');
            stack.push(Math.log(a));
            break;
          }
          case 'sqrt': {
            if (a < 0) throw new Error('√ domain error (≥ 0)');
            stack.push(Math.sqrt(a));
            break;
          }
          case 'cbrt': stack.push(Math.cbrt(a)); break;
          case 'abs': stack.push(Math.abs(a)); break;
          case 'exp': stack.push(Math.exp(a)); break;
          default:
            throw new Error(`Unknown function: ${token.name}`);
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression format');
    }

    return stack[0];
  }

  private factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
    if (n > 170) throw new Error('Factorial overflow');
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }
}

type Token =
  | { type: 'NUMBER'; value: number }
  | { type: 'CONST'; symbol: string; value: number }
  | { type: 'OPERATOR'; symbol: string; prec: number; rightAssoc: boolean }
  | { type: 'FUNCTION'; name: string }
  | { type: 'LEFT_PAREN' }
  | { type: 'RIGHT_PAREN' };

export const evaluatorTS = new ExpressionEvaluatorTS();
