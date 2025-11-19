/**
 * Calculator Test Suite
 * Comprehensive unit tests for production-grade calculator implementation
 * @generated-from: task-id:TASK-003-TEST
 * @tests: calculator.js:v1.0.0
 * Coverage Target: >90%
 */

describe('Calculator', () => {
  let calculator;
  let mockDisplay;
  let mockButtonsContainer;

  /**
   * Setup mock DOM elements before each test
   */
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="calculator">
        <div class="display">0</div>
        <div class="buttons">
          <button data-number="0">0</button>
          <button data-number="1">1</button>
          <button data-number="2">2</button>
          <button data-number="3">3</button>
          <button data-number="4">4</button>
          <button data-number="5">5</button>
          <button data-number="6">6</button>
          <button data-number="7">7</button>
          <button data-number="8">8</button>
          <button data-number="9">9</button>
          <button data-number=".">.</button>
          <button data-operation="+">+</button>
          <button data-operation="-">-</button>
          <button data-operation="*">×</button>
          <button data-operation="/">÷</button>
          <button data-operation="=">=</button>
          <button data-action="clear">C</button>
        </div>
      </div>
    `;

    mockDisplay = document.querySelector('.display');
    mockButtonsContainer = document.querySelector('.buttons');

    // Create new calculator instance
    calculator = new Calculator();
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
  });

  // ============================================================================
  // 🏗️ INITIALIZATION TESTS
  // ============================================================================

  describe('Initialization', () => {
    test('should initialize with default state', () => {
      expect(calculator.currentValue).toBe('0');
      expect(calculator.previousValue).toBeNull();
      expect(calculator.operation).toBeNull();
      expect(calculator.shouldResetDisplay).toBe(false);
      expect(calculator.hasError).toBe(false);
    });

    test('should set correct constants', () => {
      expect(calculator.MAX_DISPLAY_LENGTH).toBe(15);
      expect(calculator.MAX_SAFE_NUMBER).toBe(Number.MAX_SAFE_INTEGER);
      expect(calculator.MIN_SAFE_NUMBER).toBe(Number.MIN_SAFE_INTEGER);
    });

    test('should initialize display element reference', () => {
      expect(calculator.displayElement).toBe(mockDisplay);
    });

    test('should display initial value of 0', () => {
      expect(mockDisplay.textContent).toBe('0');
    });
  });

  // ============================================================================
  // 🔢 DIGIT INPUT TESTS
  // ============================================================================

  describe('Digit Input', () => {
    test('should append single digit to display', () => {
      calculator.appendDigit('5');
      expect(calculator.currentValue).toBe('5');
      expect(mockDisplay.textContent).toBe('5');
    });

    test('should append multiple digits', () => {
      calculator.appendDigit('1');
      calculator.appendDigit('2');
      calculator.appendDigit('3');
      expect(calculator.currentValue).toBe('123');
      expect(mockDisplay.textContent).toBe('123');
    });

    test('should replace leading zero with digit', () => {
      calculator.appendDigit('7');
      expect(calculator.currentValue).toBe('7');
    });

    test('should handle zero input correctly', () => {
      calculator.appendDigit('0');
      expect(calculator.currentValue).toBe('0');
      calculator.appendDigit('0');
      expect(calculator.currentValue).toBe('0');
    });

    test('should build multi-digit numbers', () => {
      calculator.appendDigit('9');
      calculator.appendDigit('8');
      calculator.appendDigit('7');
      calculator.appendDigit('6');
      expect(calculator.currentValue).toBe('9876');
    });

    test('should respect maximum display length', () => {
      const longNumber = '123456789012345';
      for (const digit of longNumber) {
        calculator.appendDigit(digit);
      }
      expect(calculator.currentValue).toBe(longNumber);

      calculator.appendDigit('6');
      expect(calculator.currentValue).toBe(longNumber);
    });

    test('should not accept input when in error state', () => {
      calculator.hasError = true;
      calculator.currentValue = 'Error';
      calculator.appendDigit('5');
      expect(calculator.currentValue).toBe('Error');
    });
  });

  // ============================================================================
  // 🔘 DECIMAL INPUT TESTS
  // ============================================================================

  describe('Decimal Input', () => {
    test('should add decimal point to number', () => {
      calculator.appendDigit('5');
      calculator.appendDigit('.');
      expect(calculator.currentValue).toBe('5.');
    });

    test('should add 0 before decimal if starting with decimal', () => {
      calculator.appendDigit('.');
      expect(calculator.currentValue).toBe('0.');
    });

    test('should prevent multiple decimal points', () => {
      calculator.appendDigit('5');
      calculator.appendDigit('.');
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      expect(calculator.currentValue).toBe('5.2');
    });

    test('should allow decimal after integer', () => {
      calculator.appendDigit('1');
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      expect(calculator.currentValue).toBe('12.5');
    });

    test('should handle decimal in fresh state', () => {
      calculator.clear();
      calculator.appendDigit('.');
      expect(calculator.currentValue).toBe('0.');
    });
  });

  // ============================================================================
  // ➕ ADDITION TESTS
  // ============================================================================

  describe('Addition', () => {
    test('should add two positive integers', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.calculate();
      expect(calculator.currentValue).toBe('8');
    });

    test('should add positive and negative numbers', () => {
      const result = calculator.add(10, -5);
      expect(result).toBe(5);
    });

    test('should add two negative numbers', () => {
      const result = calculator.add(-5, -3);
      expect(result).toBe(-8);
    });

    test('should add decimal numbers', () => {
      calculator.appendDigit('1');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBe(4);
    });

    test('should add zero correctly', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('0');
      calculator.calculate();
      expect(calculator.currentValue).toBe('5');
    });

    test('should handle large number addition', () => {
      const result = calculator.add(999999, 1);
      expect(result).toBe(1000000);
    });
  });

  // ============================================================================
  // ➖ SUBTRACTION TESTS
  // ============================================================================

  describe('Subtraction', () => {
    test('should subtract two positive numbers', () => {
      calculator.appendDigit('8');
      calculator.setOperation('-');
      calculator.appendDigit('3');
      calculator.calculate();
      expect(calculator.currentValue).toBe('5');
    });

    test('should handle negative result', () => {
      calculator.appendDigit('3');
      calculator.setOperation('-');
      calculator.appendDigit('8');
      calculator.calculate();
      expect(calculator.currentValue).toBe('-5');
    });

    test('should subtract negative numbers', () => {
      const result = calculator.subtract(5, -3);
      expect(result).toBe(8);
    });

    test('should subtract decimals', () => {
      calculator.appendDigit('5');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.setOperation('-');
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBe(3);
    });

    test('should subtract to zero', () => {
      calculator.appendDigit('5');
      calculator.setOperation('-');
      calculator.appendDigit('5');
      calculator.calculate();
      expect(calculator.currentValue).toBe('0');
    });
  });

  // ============================================================================
  // ✖️ MULTIPLICATION TESTS
  // ============================================================================

  describe('Multiplication', () => {
    test('should multiply two positive numbers', () => {
      calculator.appendDigit('6');
      calculator.setOperation('*');
      calculator.appendDigit('7');
      calculator.calculate();
      expect(calculator.currentValue).toBe('42');
    });

    test('should multiply by zero', () => {
      calculator.appendDigit('5');
      calculator.setOperation('*');
      calculator.appendDigit('0');
      calculator.calculate();
      expect(calculator.currentValue).toBe('0');
    });

    test('should multiply negative numbers', () => {
      const result = calculator.multiply(-5, -3);
      expect(result).toBe(15);
    });

    test('should multiply positive and negative', () => {
      const result = calculator.multiply(5, -3);
      expect(result).toBe(-15);
    });

    test('should multiply decimals', () => {
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.setOperation('*');
      calculator.appendDigit('4');
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBe(10);
    });

    test('should handle large multiplication', () => {
      const result = calculator.multiply(1000, 1000);
      expect(result).toBe(1000000);
    });
  });

  // ============================================================================
  // ➗ DIVISION TESTS
  // ============================================================================

  describe('Division', () => {
    test('should divide two positive numbers', () => {
      calculator.appendDigit('8');
      calculator.setOperation('/');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(calculator.currentValue).toBe('4');
    });

    test('should handle division by zero', () => {
      calculator.appendDigit('5');
      calculator.setOperation('/');
      calculator.appendDigit('0');
      calculator.calculate();
      expect(calculator.hasError).toBe(true);
      expect(calculator.currentValue).toBe('Cannot divide by zero');
    });

    test('should divide with decimal result', () => {
      calculator.appendDigit('5');
      calculator.setOperation('/');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBe(2.5);
    });

    test('should divide negative numbers', () => {
      const result = calculator.divide(-10, -2);
      expect(result).toBe(5);
    });

    test('should divide positive by negative', () => {
      const result = calculator.divide(10, -2);
      expect(result).toBe(-5);
    });

    test('should return null on division by zero', () => {
      const result = calculator.divide(10, 0);
      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // 🔄 OPERATION CHAINING TESTS
  // ============================================================================

  describe('Operation Chaining', () => {
    test('should chain multiple operations', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.setOperation('*');
      expect(calculator.currentValue).toBe('8');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(calculator.currentValue).toBe('16');
    });

    test('should handle operation change before second operand', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.setOperation('*');
      expect(calculator.operation).toBe('*');
      expect(calculator.previousValue).toBe(5);
    });

    test('should reset display after operation', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      expect(calculator.shouldResetDisplay).toBe(true);
      calculator.appendDigit('3');
      expect(calculator.currentValue).toBe('3');
    });
  });

  // ============================================================================
  // 🟰 EQUALS FUNCTIONALITY TESTS
  // ============================================================================

  describe('Equals Functionality', () => {
    test('should complete operation on equals', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.calculate();
      expect(calculator.currentValue).toBe('8');
      expect(calculator.operation).toBeNull();
      expect(calculator.previousValue).toBeNull();
    });

    test('should do nothing if no operation set', () => {
      calculator.appendDigit('5');
      calculator.calculate();
      expect(calculator.currentValue).toBe('5');
    });

    test('should do nothing if no previous value', () => {
      calculator.calculate();
      expect(calculator.currentValue).toBe('0');
    });

    test('should allow new operation after equals', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.calculate();
      calculator.setOperation('*');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(calculator.currentValue).toBe('16');
    });
  });

  // ============================================================================
  // 🧹 CLEAR FUNCTIONALITY TESTS
  // ============================================================================

  describe('Clear Functionality', () => {
    test('should reset all state on clear', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.clear();

      expect(calculator.currentValue).toBe('0');
      expect(calculator.previousValue).toBeNull();
      expect(calculator.operation).toBeNull();
      expect(calculator.shouldResetDisplay).toBe(false);
      expect(calculator.hasError).toBe(false);
    });

    test('should clear error state', () => {
      calculator.displayError('Test Error');
      calculator.clear();
      expect(calculator.hasError).toBe(false);
      expect(calculator.currentValue).toBe('0');
    });

    test('should update display to 0 after clear', () => {
      calculator.appendDigit('9');
      calculator.appendDigit('9');
      calculator.clear();
      expect(mockDisplay.textContent).toBe('0');
    });
  });

  // ============================================================================
  // 🎯 EDGE CASES TESTS
  // ============================================================================

  describe('Edge Cases', () => {
    test('should handle very large numbers', () => {
      const largeNum = 999999999999999;
      calculator.currentValue = largeNum.toString();
      calculator.setOperation('+');
      calculator.appendDigit('1');
      calculator.calculate();
      expect(calculator.hasError).toBe(false);
    });

    test('should handle very small decimals', () => {
      calculator.currentValue = '0.000001';
      calculator.setOperation('+');
      calculator.currentValue = '0.000001';
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBeCloseTo(0.000002, 6);
    });

    test('should handle number overflow', () => {
      calculator.currentValue = Number.MAX_SAFE_INTEGER.toString();
      calculator.setOperation('+');
      calculator.currentValue = '1000000';
      calculator.calculate();
      expect(calculator.hasError).toBe(true);
    });

    test('should validate number safety', () => {
      expect(calculator.isValidNumber(100)).toBe(true);
      expect(calculator.isValidNumber(Infinity)).toBe(false);
      expect(calculator.isValidNumber(NaN)).toBe(false);
      expect(calculator.isValidNumber(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });

    test('should format very large numbers in scientific notation', () => {
      const formatted = calculator.formatNumber(12345678901234);
      expect(formatted).toContain('e');
    });

    test('should format very small numbers in scientific notation', () => {
      const formatted = calculator.formatNumber(0.0000001);
      expect(formatted).toContain('e');
    });

    test('should handle rapid button clicks', () => {
      for (let i = 0; i < 20; i++) {
        calculator.appendDigit('1');
      }
      expect(calculator.currentValue.length).toBeLessThanOrEqual(15);
    });

    test('should handle NaN in calculation', () => {
      calculator.currentValue = 'invalid';
      calculator.setOperation('+');
      expect(calculator.operation).toBeNull();
    });
  });

  // ============================================================================
  // 🎨 DISPLAY FORMATTING TESTS
  // ============================================================================

  describe('Display Formatting', () => {
    test('should format zero correctly', () => {
      const formatted = calculator.formatNumber(0);
      expect(formatted).toBe('0');
    });

    test('should preserve trailing decimal point', () => {
      calculator.currentValue = '5.';
      const formatted = calculator.formatDisplayValue('5.');
      expect(formatted).toBe('5.');
    });

    test('should format regular numbers', () => {
      const formatted = calculator.formatNumber(123.45);
      expect(formatted).toBe('123.45');
    });

    test('should handle long decimal precision', () => {
      const formatted = calculator.formatNumber(1.123456789012345);
      expect(formatted.length).toBeLessThanOrEqual(15);
    });

    test('should return 0 for invalid display value', () => {
      const formatted = calculator.formatDisplayValue('invalid');
      expect(formatted).toBe('0');
    });
  });

  // ============================================================================
  // ❌ ERROR HANDLING TESTS
  // ============================================================================

  describe('Error Handling', () => {
    test('should display error message', () => {
      calculator.displayError('Test Error');
      expect(calculator.hasError).toBe(true);
      expect(calculator.currentValue).toBe('Test Error');
      expect(mockDisplay.textContent).toBe('Test Error');
    });

    test('should clear state on error', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.displayError('Error');
      expect(calculator.previousValue).toBeNull();
      expect(calculator.operation).toBeNull();
    });

    test('should prevent operations in error state', () => {
      calculator.displayError('Error');
      calculator.setOperation('+');
      expect(calculator.operation).toBeNull();
    });

    test('should handle calculation errors', () => {
      calculator.appendDigit('5');
      calculator.setOperation('/');
      calculator.appendDigit('0');
      calculator.calculate();
      expect(calculator.hasError).toBe(true);
    });

    test('should recover from error with clear', () => {
      calculator.displayError('Error');
      calculator.clear();
      expect(calculator.hasError).toBe(false);
      calculator.appendDigit('5');
      expect(calculator.currentValue).toBe('5');
    });
  });

  // ============================================================================
  // 🖱️ EVENT HANDLING TESTS
  // ============================================================================

  describe('Event Handling', () => {
    test('should handle number button click', () => {
      const button = document.querySelector('[data-number="5"]');
      button.click();
      expect(calculator.currentValue).toBe('5');
    });

    test('should handle operation button click', () => {
      const numButton = document.querySelector('[data-number="5"]');
      const opButton = document.querySelector('[data-operation="+"]');
      numButton.click();
      opButton.click();
      expect(calculator.operation).toBe('+');
    });

    test('should handle clear button click', () => {
      calculator.appendDigit('5');
      const clearButton = document.querySelector('[data-action="clear"]');
      clearButton.click();
      expect(calculator.currentValue).toBe('0');
    });

    test('should handle equals button click', () => {
      const num1 = document.querySelector('[data-number="5"]');
      const op = document.querySelector('[data-operation="+"]');
      const num2 = document.querySelector('[data-number="3"]');
      const equals = document.querySelector('[data-operation="="]');

      num1.click();
      op.click();
      num2.click();
      equals.click();

      expect(calculator.currentValue).toBe('8');
    });

    test('should ignore clicks on non-button elements', () => {
      const container = document.querySelector('.buttons');
      const initialValue = calculator.currentValue;
      container.click();
      expect(calculator.currentValue).toBe(initialValue);
    });

    test('should handle keyboard Enter key', () => {
      const button = document.querySelector('[data-number="5"]');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(event);
      expect(calculator.currentValue).toBe('5');
    });

    test('should handle keyboard Space key', () => {
      const button = document.querySelector('[data-number="5"]');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      button.dispatchEvent(event);
      expect(calculator.currentValue).toBe('5');
    });

    test('should prevent default on keyboard events', () => {
      const button = document.querySelector('[data-number="5"]');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      button.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // 🏗️ DOM INITIALIZATION TESTS
  // ============================================================================

  describe('DOM Initialization', () => {
    test('should handle missing display element gracefully', () => {
      document.body.innerHTML = '<div class="buttons"></div>';
      const calc = new Calculator();
      expect(calc.displayElement).toBeNull();
    });

    test('should handle missing buttons container gracefully', () => {
      document.body.innerHTML = '<div class="display">0</div>';
      const calc = new Calculator();
      expect(calc.displayElement).toBeTruthy();
    });

    test('should not update display if element missing', () => {
      calculator.displayElement = null;
      expect(() => calculator.updateDisplay()).not.toThrow();
    });

    test('should initialize on DOMContentLoaded', (done) => {
      document.body.innerHTML = '';
      Object.defineProperty(document, 'readyState', {
        writable: true,
        value: 'loading',
      });

      const calc = new Calculator();

      document.addEventListener('DOMContentLoaded', () => {
        expect(calc.displayElement).toBeDefined();
        done();
      });

      document.dispatchEvent(new Event('DOMContentLoaded'));
    });
  });

  // ============================================================================
  // 🔢 ARITHMETIC OPERATION UNIT TESTS
  // ============================================================================

  describe('Arithmetic Operations (Pure Functions)', () => {
    test('add should return sum of two numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
      expect(calculator.add(-2, 3)).toBe(1);
      expect(calculator.add(-2, -3)).toBe(-5);
      expect(calculator.add(0, 0)).toBe(0);
    });

    test('subtract should return difference of two numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
      expect(calculator.subtract(3, 5)).toBe(-2);
      expect(calculator.subtract(-5, -3)).toBe(-2);
      expect(calculator.subtract(0, 0)).toBe(0);
    });

    test('multiply should return product of two numbers', () => {
      expect(calculator.multiply(2, 3)).toBe(6);
      expect(calculator.multiply(-2, 3)).toBe(-6);
      expect(calculator.multiply(-2, -3)).toBe(6);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    test('divide should return quotient of two numbers', () => {
      expect(calculator.divide(6, 2)).toBe(3);
      expect(calculator.divide(-6, 2)).toBe(-3);
      expect(calculator.divide(-6, -2)).toBe(3);
      expect(calculator.divide(5, 2)).toBe(2.5);
    });
  });

  // ============================================================================
  // 🎭 COMPLEX WORKFLOW TESTS
  // ============================================================================

  describe('Complex Workflows', () => {
    test('should handle complete calculation workflow', () => {
      // 5 + 3 = 8
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.calculate();
      expect(calculator.currentValue).toBe('8');

      // 8 * 2 = 16
      calculator.setOperation('*');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(calculator.currentValue).toBe('16');

      // 16 - 6 = 10
      calculator.setOperation('-');
      calculator.appendDigit('6');
      calculator.calculate();
      expect(calculator.currentValue).toBe('10');

      // 10 / 2 = 5
      calculator.setOperation('/');
      calculator.appendDigit('2');
      calculator.calculate();
      expect(calculator.currentValue).toBe('5');
    });

    test('should handle decimal workflow', () => {
      calculator.appendDigit('1');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('2');
      calculator.appendDigit('.');
      calculator.appendDigit('5');
      calculator.calculate();
      expect(parseFloat(calculator.currentValue)).toBe(4);
    });

    test('should handle error recovery workflow', () => {
      calculator.appendDigit('5');
      calculator.setOperation('/');
      calculator.appendDigit('0');
      calculator.calculate();
      expect(calculator.hasError).toBe(true);

      calculator.clear();
      expect(calculator.hasError).toBe(false);

      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');
      calculator.calculate();
      expect(calculator.currentValue).toBe('8');
    });
  });

  // ============================================================================
  // ⚡ PERFORMANCE TESTS
  // ============================================================================

  describe('Performance', () => {
    test('should handle rapid sequential operations efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        calculator.appendDigit('1');
        calculator.setOperation('+');
        calculator.appendDigit('1');
        calculator.calculate();
        calculator.clear();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });

    test('should handle many digit inputs efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculator.clear();
        calculator.appendDigit('1');
        calculator.appendDigit('2');
        calculator.appendDigit('3');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500); // Should complete in < 500ms
    });
  });

  // ============================================================================
  // 🛡️ SECURITY & VALIDATION TESTS
  // ============================================================================

  describe('Security & Validation', () => {
    test('should sanitize invalid number inputs', () => {
      calculator.currentValue = 'invalid';
      calculator.setOperation('+');
      expect(calculator.operation).toBeNull();
    });

    test('should prevent code injection through display', () => {
      calculator.currentValue = '<script>alert("xss")</script>';
      calculator.updateDisplay();
      expect(mockDisplay.textContent).toBe('<script>alert("xss")</script>');
      expect(mockDisplay.innerHTML).not.toContain('<script>');
    });

    test('should validate number ranges', () => {
      expect(calculator.isValidNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(calculator.isValidNumber(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
      expect(calculator.isValidNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(calculator.isValidNumber(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
    });

    test('should handle Infinity safely', () => {
      expect(calculator.isValidNumber(Infinity)).toBe(false);
      expect(calculator.isValidNumber(-Infinity)).toBe(false);
    });
  });
});