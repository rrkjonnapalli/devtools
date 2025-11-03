/**
 * Simple Template Engine with Marko-inspired syntax
 * 
 * Supports:
 * - Variable substitution: ${variable}, ${object.property}, ${array[0].field}
 * - Loops: <for|item| of=arrayName>...</for> or <for|index, item| of=arrayName>...</for>
 * - Conditionals: <if(condition)>...</if>, <else-if(condition)>, <else>
 * - Ternary operators: ${condition ? trueValue : falseValue}
 * 
 * @example
 * const template = `Hello ${name}!
 * <for|ix, emp| of=employees>
 *   ${ix}. ${emp.name} (${emp.role})
 * </for>`;
 * 
 * renderTemplate(template, data);
 */

export interface TemplateRenderResult {
  success: boolean;
  output?: string;
  error?: string;
}

/**
 * Main entry point - renders template with data
 */
export function renderTemplate(
  templateString: string,
  data: Record<string, unknown>
): string {
  return processBlock(templateString, data, 'top');
}

/**
 * Process a block of template content (top-level, loop, or conditional)
 * This is the core processing function that handles all template features
 */
function processBlock(
  content: string,
  context: Record<string, unknown>,
  _level: 'top' | 'loop' | 'conditional',
  itemVar?: string
): string {
  let output = content;
  
  // Step 1: Process <let> statements at this level (with optional itemVar for normalization)
  const blockContext = processLet(output, context, itemVar);
  output = blockContext.output;
  
  // Step 2: If in a loop, normalize all remaining itemVar references
  if (itemVar) {
    output = output.replace(
      new RegExp(`\\b${itemVar}\\.`, 'g'),
      ''
    );
  }
  
  // Step 3: Process loops
  output = processLoops(output, blockContext.context);
  
  // Step 4: Process conditionals
  output = processConditionals(output, blockContext.context);
  
  // Step 5: Replace variables (includes ternary evaluation)
  output = replaceVariables(output, blockContext.context);
  
  return output;
}

/**
 * Process <let> statements and return updated content + context
 * Only processes <let> tags at the current level, not inside nested blocks
 */
function processLet(
  content: string,
  context: Record<string, unknown>,
  itemVar?: string
): { output: string; context: Record<string, unknown> } {
  const newContext = { ...context };
  
  // If no itemVar, we're at top level - need to skip <let> inside <for> blocks
  if (!itemVar) {
    // Split content by <for> blocks and only process <let> outside them
    const segments: string[] = [];
    let lastIndex = 0;
    const forRegex = /<for\s*\|[^|]+\|\s+of=[^>]+>[\s\S]*?<\/for>/g;
    let match;
    
    while ((match = forRegex.exec(content)) !== null) {
      // Process <let> in content before this <for> block
      const beforeFor = content.substring(lastIndex, match.index);
      segments.push(processLetInSegment(beforeFor, newContext));
      
      // Keep <for> block as-is
      segments.push(match[0]);
      lastIndex = match.index + match[0].length;
    }
    
    // Process remaining content after last <for>
    segments.push(processLetInSegment(content.substring(lastIndex), newContext));
    
    const output = segments.join('');
    return { output, context: newContext };
  }
  
  // If we have itemVar, we're inside a loop - process all <let> tags
  const output = processLetInSegment(content, newContext, itemVar);
  
  return { output, context: newContext };
}

/**
 * Process <let> tags in a segment (no nested <for> blocks)
 */
function processLetInSegment(
  segment: string,
  context: Record<string, unknown>,
  itemVar?: string
): string {
  return segment.replace(
    /<let\s+(\w+)\s*=\s*\$\{([^}]+)\}>(\r?\n)?/g,
    (_match, varName, expression) => {
      
      try {
        let expr = expression.trim();
        
        // If in a loop context, normalize itemVar references in the expression
        if (itemVar) {
          expr = expr.replace(new RegExp(`\\b${itemVar}\\.`, 'g'), '');
        }
        
        const value = evaluateExpression(expr, context);
        context[varName] = value;
        return ''; // Remove the <let> tag and trailing newline
      } catch (e) {
        console.log('Error:', e);
        return '';
      }
    }
  );
}

/**
 * Safe version that returns result object instead of throwing
 */
export function renderTemplateSafe(
  templateString: string,
  data: Record<string, unknown>
): TemplateRenderResult {
  try {
    const output = renderTemplate(templateString, data);
    return { success: true, output };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get nested value from object using dot notation (e.g., "user.profile.name")
 * Also supports array access: "items[0].name" → "items.0.name"
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
  const keys = normalizedPath.split('.');
  
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Parse a value from string - handles numbers, strings, or variable references
 */
function parseValue(expr: string, context: Record<string, unknown>): unknown {
  const trimmed = expr.trim();
  
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  
  if (/^['"].*['"]$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }
  
  return getNestedValue(context, trimmed);
}

/**
 * Evaluate a comparison expression (e.g., "age > 18", "status === 'active'")
 */
function evaluateComparison(
  leftValue: unknown,
  operator: string,
  rightValue: unknown
): boolean {
  switch (operator) {
    case '===': return leftValue === rightValue;
    case '!==': return leftValue !== rightValue;
    case '==': return leftValue == rightValue;
    case '!=': return leftValue != rightValue;
    case '<': return (leftValue as number) < (rightValue as number);
    case '>': return (leftValue as number) > (rightValue as number);
    case '<=': return (leftValue as number) <= (rightValue as number);
    case '>=': return (leftValue as number) >= (rightValue as number);
    default: return false;
  }
}

/**
 * Evaluate a condition expression (e.g., "isActive", "!isDeleted", "age > 18")
 */
function evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
  const comparisonMatch = condition.match(/^(.+?)\s*(===|!==|==|!=|<=|>=|<|>)\s*(.+)$/);
  
  if (comparisonMatch) {
    const [, leftExpr, operator, rightExpr] = comparisonMatch;
    const leftValue = getNestedValue(context, leftExpr.trim());
    const rightValue = parseValue(rightExpr, context);
    return evaluateComparison(leftValue, operator, rightValue);
  }
  
  // Simple boolean check with optional negation
  const isNegated = condition.startsWith('!');
  const varName = condition.replace(/^!/, '');
  const value = getNestedValue(context, varName);
  return isNegated ? !value : !!value;
}

// ============================================================================
// VARIABLE REPLACEMENT
// ============================================================================

/**
 * Replace all ${...} variables in string
 * Supports: ${var}, ${obj.prop}, ${condition ? true : false}
 */
function replaceVariables(str: string, data: Record<string, unknown>): string {
  return str.replace(/\$\{([^}]+)\}/g, (_match, expression) => {
    try {
      return evaluateExpression(expression.trim(), data);
    } catch {
      return '';
    }
  });
}

/**
 * Evaluate an expression inside ${}
 * Handles: variables, ternary operators
 */
function evaluateExpression(expr: string, context: Record<string, unknown>): string {
  // Check for ternary: condition ? trueValue : falseValue
  const ternaryMatch = expr.match(/^(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$/);
  
  if (ternaryMatch) {
    const [, condition, trueExpr, falseExpr] = ternaryMatch;
    const conditionResult = evaluateCondition(condition.trim(), context);
    const resultExpr = conditionResult ? trueExpr.trim() : falseExpr.trim();
    
    // If result is a string literal, return without quotes
    if (/^['"].*['"]$/.test(resultExpr)) {
      return resultExpr.slice(1, -1);
    }
    
    const value = getNestedValue(context, resultExpr);
    return value !== undefined && value !== null ? String(value) : '';
  }
  
  // Simple variable lookup
  const value = getNestedValue(context, expr);
  return value !== undefined && value !== null ? String(value) : '';
}

// ============================================================================
// LOOPS
// ============================================================================

/**
 * Process all <for|item| of=array>...</for> loops
 * Supports: <for|item| of=arr> and <for|index, item| of=arr>
 */
function processLoops(str: string, data: Record<string, unknown>): string {
  const loopRegex = /<for\s*\|(?:(\w+),\s*)?(\w+)\|\s+of=["']?(\w+(?:\.\w+|\[\d+\])*)["']?>([\s\S]*?)<\/for>/g;
  
  return str.replace(loopRegex, (_match, indexVar, itemVar, arrayPath, content) => {
    try {
      const array = getNestedValue(data, arrayPath);
      if (!Array.isArray(array)) return '';
      
      // Only trim the immediate newline after <for> and before </for>
      // Preserve any blank lines within the content
      let trimmedContent = content;
      if (trimmedContent.startsWith('\n')) {
        trimmedContent = trimmedContent.substring(1);
      }
      if (trimmedContent.endsWith('\n')) {
        trimmedContent = trimmedContent.substring(0, trimmedContent.length - 1);
      }
      
      return array.map((item, index) => {
        return renderLoopIteration(trimmedContent, item, itemVar, index, indexVar);
      }).join('\n');
    } catch (e) {
      console.error('Loop error:', e);
      return '';
    }
  });
}

/**
 * Render one iteration of a loop
 */
function renderLoopIteration(
  content: string,
  item: unknown,
  itemVar: string,
  index: number,
  indexVar?: string
): string {
  let output = content;
  
  // Step 1: Replace index variable if present
  if (indexVar) {
    const indexRegex = new RegExp(`\\$\\{${indexVar}\\}`, 'g');
    output = output.replace(indexRegex, String(index));
  }
  
  // Step 2: Process this loop iteration as a block (pass itemVar for normalization)
  return processBlock(output, item as Record<string, unknown>, 'loop', itemVar);
}

// ============================================================================
// CONDITIONALS
// ============================================================================

/**
 * Process all top-level <if(...)>...</if> conditionals
 */
function processConditionals(str: string, data: Record<string, unknown>): string {
  const ifRegex = /<if\(([^)]+)\)>([\s\S]*?)<\/if>/g;
  
  return str.replace(ifRegex, (_match, condition, content) => {
    try {
      return evaluateIfElseChain(content, condition.trim(), data);
    } catch {
      return '';
    }
  });
}

/**
 * Evaluate if/else-if/else chain and return the matching content
 */
function evaluateIfElseChain(
  content: string,
  initialCondition: string,
  context: Record<string, unknown>
): string {
  const branches = parseIfElseBranches(content, initialCondition);
  
  for (const branch of branches) {
    if (branch.type === 'else') {
      // Process the else branch content as a block
      return processBlock(branch.content, context, 'conditional');
    }
    
    if (evaluateCondition(branch.condition!, context)) {
      // Process the matching branch content as a block
      return processBlock(branch.content, context, 'conditional');
    }
  }
  
  return '';
}

/**
 * Parse if/else-if/else structure into separate branches
 */
function parseIfElseBranches(
  content: string,
  initialCondition: string
): Array<{ type: 'if' | 'else-if' | 'else'; condition?: string; content: string }> {
  const branches: Array<{ type: 'if' | 'else-if' | 'else'; condition?: string; content: string }> = [];
  const tags: Array<{ type: 'else-if' | 'else'; pos: number; condition?: string; tagLength: number }> = [];
  
  // Find all <else-if(...)> tags
  const elseIfRegex = /<else-if\(([^)]+)\)>/g;
  let match;
  while ((match = elseIfRegex.exec(content)) !== null) {
    tags.push({
      type: 'else-if',
      pos: match.index,
      condition: match[1],
      tagLength: match[0].length
    });
  }
  
  // Find <else> tag
  const elseMatch = content.match(/<else>/);
  if (elseMatch && elseMatch.index !== undefined) {
    tags.push({
      type: 'else',
      pos: elseMatch.index,
      tagLength: '<else>'.length
    });
  }
  
  // Sort tags by position
  tags.sort((a, b) => a.pos - b.pos);
  
  // Build branches
  if (tags.length === 0) {
    // Simple if with no else-if or else
    branches.push({ type: 'if', condition: initialCondition, content });
  } else {
    // First branch (if)
    branches.push({
      type: 'if',
      condition: initialCondition,
      content: content.substring(0, tags[0].pos)
    });
    
    // Subsequent branches (else-if/else)
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const nextTag = tags[i + 1];
      const startPos = tag.pos + tag.tagLength;
      const endPos = nextTag ? nextTag.pos : content.length;
      
      branches.push({
        type: tag.type,
        condition: tag.condition,
        content: content.substring(startPos, endPos)
      });
    }
  }
  
  return branches;
}
