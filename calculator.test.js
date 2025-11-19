/**
 * Calculator Comprehensive Test Suite
 * Complete test coverage for production-grade calculator implementation
 * @generated-from: task-id:TASK-003-COMPREHENSIVE-TEST
 * @tests: calculator.js:v1.0.0 - Complete Coverage
 * Coverage Target: >95%
 */

describe('Calculator - Comprehensive Test Suite', () => {
  let calculator;
  let mockDisplay;
  let mockButtonsContainer;

  /**
   * Setup mock DOM elements and calculator instance before each test
   */
  beforeEach(() => {
    // Reset DOM with complete calculator structure
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
    // Cleanup DOM and remove event listeners
    document.body.innerHTML = '';
  });

  // ============================================================================
  // 🚨 ERROR HANDLING TESTS
  // ============================================================================

  describe('Error Handling', () => {
    describe('Division by Zero', () => {
      test('should display error when dividing by zero', () => {
        calculator.appendDigit('5');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Cannot divide by zero');
        expect(mockDisplay.textContent).toBe('Cannot divide by zero');
      });

      test('should prevent further operations after division by zero error', () => {
        calculator.appendDigit('10');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        calculator.appendDigit('5');
        expect(calculator.currentValue).toBe('Cannot divide by zero');
      });

      test('should handle division by zero in chained operations', () => {
        calculator.appendDigit('10');
        calculator.setOperation('+');
        calculator.appendDigit('5');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Cannot divide by zero');
      });

      test('should handle zero divided by zero', () => {
        calculator.appendDigit('0');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Cannot divide by zero');
      });
    });

    describe('Infinity Result Handling', () => {
      test('should handle result approaching infinity', () => {
        calculator.currentValue = '9999999999999999';
        calculator.setOperation('*');
        calculator.currentValue = '9999999999999999';
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Number too large');
      });

      test('should handle negative infinity', () => {
        calculator.currentValue = '-9999999999999999';
        calculator.setOperation('*');
        calculator.currentValue = '9999999999999999';
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Number too large');
      });

      test('should validate number within safe range', () => {
        const result = calculator.validateNumber(Number.MAX_SAFE_INTEGER + 1);
        expect(result).toBe(false);
      });

      test('should validate number below safe range', () => {
        const result = calculator.validateNumber(Number.MIN_SAFE_INTEGER - 1);
        expect(result).toBe(false);
      });
    });

    describe('NaN Result Handling', () => {
      test('should handle NaN in validation', () => {
        const result = calculator.validateNumber(NaN);
        expect(result).toBe(false);
      });

      test('should handle invalid number type', () => {
        const result = calculator.validateNumber('not a number');
        expect(result).toBe(false);
      });

      test('should handle undefined in validation', () => {
        const result = calculator.validateNumber(undefined);
        expect(result).toBe(false);
      });

      test('should handle null in validation', () => {
        const result = calculator.validateNumber(null);
        expect(result).toBe(false);
      });

      test('should handle Infinity in validation', () => {
        const result = calculator.validateNumber(Infinity);
        expect(result).toBe(false);
      });

      test('should handle -Infinity in validation', () => {
        const result = calculator.validateNumber(-Infinity);
        expect(result).toBe(false);
      });
    });

    describe('Error State Management', () => {
      test('should prevent operations in error state', () => {
        calculator.handleError('DIVIDE_BY_ZERO');

        calculator.setOperation('+');
        expect(calculator.operation).toBeNull();
      });

      test('should prevent digit input in error state', () => {
        calculator.handleError('DIVIDE_BY_ZERO');

        calculator.appendDigit('5');
        expect(calculator.currentValue).toBe('Cannot divide by zero');
      });

      test('should allow clear to reset error state', () => {
        calculator.handleError('DIVIDE_BY_ZERO');
        expect(calculator.hasError).toBe(true);

        calculator.clear();
        expect(calculator.hasError).toBe(false);
        expect(calculator.currentValue).toBe('0');
      });

      test('should handle multiple error types', () => {
        const errorTypes = [
          'DIVIDE_BY_ZERO',
          'NUMBER_TOO_LARGE',
          'INVALID_NUMBER',
          'CALCULATION_ERROR',
        ];

        errorTypes.forEach((errorType) => {
          calculator.clear();
          calculator.handleError(errorType);
          expect(calculator.hasError).toBe(true);
          expect(calculator.ERROR_MESSAGES[errorType]).toBeDefined();
        });
      });

      test('should handle unknown error type', () => {
        calculator.handleError('UNKNOWN_ERROR');
        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Calculation error');
      });

      test('should reset previousValue and operation on error', () => {
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.appendDigit('3');

        calculator.handleError('CALCULATION_ERROR');

        expect(calculator.previousValue).toBeNull();
        expect(calculator.operation).toBeNull();
      });
    });

    describe('Error Recovery', () => {
      test('should allow new calculation after clearing error', () => {
        calculator.appendDigit('5');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        calculator.clear();
        calculator.appendDigit('6');
        calculator.setOperation('+');
        calculator.appendDigit('4');
        calculator.calculate();

        expect(calculator.currentValue).toBe('10');
        expect(calculator.hasError).toBe(false);
      });

      test('should maintain display element reference after error', () => {
        calculator.handleError('DIVIDE_BY_ZERO');
        expect(calculator.displayElement).toBe(mockDisplay);
      });
    });
  });

  // ============================================================================
  // ✅ INPUT VALIDATION TESTS
  // ============================================================================

  describe('Input Validation', () => {
    describe('Multiple Decimal Points Prevention', () => {
      test('should prevent multiple decimal points in same number', () => {
        calculator.appendDigit('5');
        calculator.appendDigit('.');
        calculator.appendDigit('2');
        calculator.appendDigit('.');

        expect(calculator.currentValue).toBe('5.2');
      });

      test('should allow decimal point in new number after operation', () => {
        calculator.appendDigit('5');
        calculator.appendDigit('.');
        calculator.appendDigit('2');
        calculator.setOperation('+');
        calculator.appendDigit('3');
        calculator.appendDigit('.');
        calculator.appendDigit('1');

        expect(calculator.currentValue).toBe('3.1');
      });

      test('should validate decimal point correctly', () => {
        calculator.currentValue = '5.2';
        expect(calculator.isValidDecimal()).toBe(false);

        calculator.currentValue = '5';
        expect(calculator.isValidDecimal()).toBe(true);
      });

      test('should handle decimal point at start', () => {
        calculator.appendDigit('.');
        expect(calculator.currentValue).toBe('0.');
      });

      test('should handle decimal point after zero', () => {
        calculator.appendDigit('0');
        calculator.appendDigit('.');
        expect(calculator.currentValue).toBe('0.');
      });

      test('should prevent decimal after existing decimal', () => {
        calculator.appendDigit('1');
        calculator.appendDigit('.');
        calculator.appendDigit('5');
        calculator.appendDigit('.');
        calculator.appendDigit('3');

        expect(calculator.currentValue).toBe('1.53');
      });
    });

    describe('Leading Zeros Handling', () => {
      test('should replace leading zero with digit', () => {
        expect(calculator.currentValue).toBe('0');

        calculator.appendDigit('5');
        expect(calculator.currentValue).toBe('5');
      });

      test('should not add multiple leading zeros', () => {
        calculator.appendDigit('0');
        calculator.appendDigit('0');
        calculator.appendDigit('0');

        expect(calculator.currentValue).toBe('0');
      });

      test('should allow zero after decimal point', () => {
        calculator.appendDigit('1');
        calculator.appendDigit('.');
        calculator.appendDigit('0');
        calculator.appendDigit('0');

        expect(calculator.currentValue).toBe('1.00');
      });

      test('should handle zero in middle of number', () => {
        calculator.appendDigit('1');
        calculator.appendDigit('0');
        calculator.appendDigit('5');

        expect(calculator.currentValue).toBe('105');
      });

      test('should reset to zero after clear', () => {
        calculator.appendDigit('5');
        calculator.clear();

        expect(calculator.currentValue).toBe('0');
      });
    });

    describe('Very Large Number Formatting', () => {
      test('should format very large numbers in exponential notation', () => {
        const largeNumber = 1e16;
        const formatted = calculator.formatNumber(largeNumber);

        expect(formatted).toContain('e');
      });

      test('should handle maximum display length', () => {
        const longNumber = '123456789012345';

        for (const digit of longNumber) {
          calculator.appendDigit(digit);
        }

        expect(calculator.currentValue).toBe(longNumber);

        calculator.appendDigit('6');
        expect(calculator.currentValue).toBe(longNumber);
      });

      test('should format large result with precision', () => {
        const result = 123456789012345;
        const formatted = calculator.formatNumber(result);

        expect(formatted.length).toBeLessThanOrEqual(20);
      });

      test('should handle numbers at MAX_SAFE_INTEGER', () => {
        const result = calculator.validateNumber(Number.MAX_SAFE_INTEGER);
        expect(result).toBe(true);
      });

      test('should reject numbers above MAX_SAFE_INTEGER', () => {
        const result = calculator.validateNumber(Number.MAX_SAFE_INTEGER + 1);
        expect(result).toBe(false);
      });
    });

    describe('Very Small Number Formatting', () => {
      test('should format very small numbers in exponential notation', () => {
        const smallNumber = 1e-16;
        const formatted = calculator.formatNumber(smallNumber);

        expect(formatted).toContain('e');
      });

      test('should handle zero correctly', () => {
        const formatted = calculator.formatNumber(0);
        expect(formatted).toBe('0');
      });

      test('should handle negative small numbers', () => {
        const smallNegative = -1e-16;
        const formatted = calculator.formatNumber(smallNegative);

        expect(formatted).toContain('e');
      });

      test('should handle numbers at MIN_SAFE_INTEGER', () => {
        const result = calculator.validateNumber(Number.MIN_SAFE_INTEGER);
        expect(result).toBe(true);
      });

      test('should reject numbers below MIN_SAFE_INTEGER', () => {
        const result = calculator.validateNumber(Number.MIN_SAFE_INTEGER - 1);
        expect(result).toBe(false);
      });
    });

    describe('Invalid Operation Sequences', () => {
      test('should validate operation symbols', () => {
        expect(calculator.validateOperation('+')).toBe(true);
        expect(calculator.validateOperation('-')).toBe(true);
        expect(calculator.validateOperation('*')).toBe(true);
        expect(calculator.validateOperation('/')).toBe(true);
        expect(calculator.validateOperation('x')).toBe(false);
        expect(calculator.validateOperation('')).toBe(false);
      });

      test('should ignore invalid operation', () => {
        calculator.appendDigit('5');
        calculator.setOperation('invalid');

        expect(calculator.operation).toBeNull();
      });

      test('should handle operation without previous value', () => {
        calculator.currentValue = 'NaN';
        calculator.setOperation('+');

        expect(calculator.operation).toBeNull();
      });

      test('should handle calculate without operation', () => {
        calculator.appendDigit('5');
        calculator.calculate();

        expect(calculator.currentValue).toBe('5');
      });

      test('should handle calculate without previous value', () => {
        calculator.appendDigit('5');
        calculator.operation = '+';
        calculator.previousValue = null;
        calculator.calculate();

        expect(calculator.currentValue).toBe('5');
      });

      test('should handle operation in error state', () => {
        calculator.handleError('CALCULATION_ERROR');
        calculator.setOperation('+');

        expect(calculator.operation).toBeNull();
      });
    });

    describe('Display Value Formatting', () => {
      test('should preserve trailing decimal point', () => {
        calculator.currentValue = '5.';
        const formatted = calculator.formatDisplayValue('5.');

        expect(formatted).toBe('5.');
      });

      test('should format valid number', () => {
        const formatted = calculator.formatDisplayValue('123.45');
        expect(formatted).toBe('123.45');
      });

      test('should handle invalid display value', () => {
        const formatted = calculator.formatDisplayValue('invalid');
        expect(formatted).toBe('0');
      });

      test('should format zero', () => {
        const formatted = calculator.formatDisplayValue('0');
        expect(formatted).toBe('0');
      });
    });
  });

  // ============================================================================
  // 🎯 EDGE CASES TESTS
  // ============================================================================

  describe('Edge Cases', () => {
    describe('Rapid Button Clicks', () => {
      test('should handle rapid number button clicks', () => {
        const button = document.querySelector('[data-number="5"]');

        for (let i = 0; i < 50; i++) {
          button.click();
        }

        expect(calculator.currentValue.length).toBeLessThanOrEqual(15);
        expect(calculator.hasError).toBe(false);
      });

      test('should handle rapid operation button clicks', () => {
        calculator.appendDigit('5');

        const addButton = document.querySelector('[data-operation="+"]');
        const subtractButton = document.querySelector('[data-operation="-"]');

        for (let i = 0; i < 20; i++) {
          addButton.click();
          subtractButton.click();
        }

        expect(calculator.operation).toBe('-');
        expect(calculator.hasError).toBe(false);
      });

      test('should handle rapid equals button clicks', () => {
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.appendDigit('3');

        const equalsButton = document.querySelector('[data-operation="="]');

        for (let i = 0; i < 10; i++) {
          equalsButton.click();
        }

        expect(calculator.currentValue).toBe('8');
        expect(calculator.hasError).toBe(false);
      });

      test('should handle rapid clear button clicks', () => {
        const clearButton = document.querySelector('[data-action="clear"]');

        for (let i = 0; i < 20; i++) {
          calculator.appendDigit('5');
          clearButton.click();
        }

        expect(calculator.currentValue).toBe('0');
        expect(calculator.hasError).toBe(false);
      });

      test('should handle mixed rapid clicks', () => {
        const numButton = document.querySelector('[data-number="5"]');
        const opButton = document.querySelector('[data-operation="+"]');
        const clearButton = document.querySelector('[data-action="clear"]');

        for (let i = 0; i < 10; i++) {
          numButton.click();
          opButton.click();
          clearButton.click();
        }

        expect(calculator.currentValue).toBe('0');
        expect(calculator.hasError).toBe(false);
      });
    });

    describe('Overflow Conditions', () => {
      test('should handle addition overflow', () => {
        calculator.currentValue = String(Number.MAX_SAFE_INTEGER);
        calculator.setOperation('+');
        calculator.currentValue = String(Number.MAX_SAFE_INTEGER);
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Number too large');
      });

      test('should handle multiplication overflow', () => {
        calculator.currentValue = '999999999999999';
        calculator.setOperation('*');
        calculator.currentValue = '999999999999999';
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
      });

      test('should handle exponential growth', () => {
        calculator.appendDigit('2');

        for (let i = 0; i < 60; i++) {
          calculator.setOperation('*');
          calculator.appendDigit('2');
          calculator.calculate();

          if (calculator.hasError) {
            break;
          }
        }

        expect(calculator.hasError).toBe(true);
      });
    });

    describe('Underflow Conditions', () => {
      test('should handle subtraction underflow', () => {
        calculator.currentValue = String(Number.MIN_SAFE_INTEGER);
        calculator.setOperation('-');
        calculator.currentValue = String(Number.MAX_SAFE_INTEGER);
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Number too large');
      });

      test('should handle very small division result', () => {
        calculator.appendDigit('1');
        calculator.setOperation('/');
        calculator.currentValue = '999999999999999';
        calculator.calculate();

        expect(calculator.hasError).toBe(false);
        expect(parseFloat(calculator.currentValue)).toBeGreaterThan(0);
      });
    });

    describe('State Consistency', () => {
      test('should maintain consistent state after error', () => {
        calculator.appendDigit('5');
        calculator.setOperation('/');
        calculator.appendDigit('0');
        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.previousValue).toBeNull();
        expect(calculator.operation).toBeNull();
      });

      test('should maintain consistent state after clear', () => {
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

      test('should maintain consistent state during chained operations', () => {
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.appendDigit('3');
        calculator.setOperation('*');

        expect(calculator.currentValue).toBe('8');
        expect(calculator.operation).toBe('*');
        expect(calculator.shouldResetDisplay).toBe(true);
      });
    });

    describe('Display Element Handling', () => {
      test('should handle missing display element gracefully', () => {
        calculator.displayElement = null;

        expect(() => calculator.updateDisplay()).not.toThrow();
      });

      test('should handle missing buttons container gracefully', () => {
        document.body.innerHTML = '<div class="display">0</div>';
        const newCalc = new Calculator();

        expect(newCalc.displayElement).toBeNull();
      });

      test('should initialize without DOM elements', () => {
        document.body.innerHTML = '';
        const newCalc = new Calculator();

        expect(newCalc.currentValue).toBe('0');
        expect(newCalc.displayElement).toBeNull();
      });
    });

    describe('Button Click Edge Cases', () => {
      test('should handle click on non-button element', () => {
        const event = { target: mockButtonsContainer };
        calculator.handleButtonClick(event);

        expect(calculator.currentValue).toBe('0');
      });

      test('should handle click with no dataset', () => {
        const button = document.createElement('button');
        mockButtonsContainer.appendChild(button);

        const event = { target: button };
        calculator.handleButtonClick(event);

        expect(calculator.currentValue).toBe('0');
      });

      test('should handle button click in error state', () => {
        calculator.handleError('CALCULATION_ERROR');

        const button = document.querySelector('[data-number="5"]');
        button.click();

        expect(calculator.currentValue).toBe('Calculation error');
      });

      test('should allow clear button in error state', () => {
        calculator.handleError('CALCULATION_ERROR');

        const clearButton = document.querySelector('[data-action="clear"]');
        clearButton.click();

        expect(calculator.hasError).toBe(false);
        expect(calculator.currentValue).toBe('0');
      });
    });

    describe('Keyboard Event Edge Cases', () => {
      test('should handle keyboard event without key property', () => {
        const event = new KeyboardEvent('keydown', {});
        const initialValue = calculator.currentValue;

        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });

      test('should handle getButtonForKey with invalid action', () => {
        const button = calculator.getButtonForKey({
          type: 'invalid',
          value: 'test',
        });

        expect(button).toBeNull();
      });

      test('should handle visualFeedback with null button', () => {
        expect(() => calculator.visualFeedback(null)).not.toThrow();
      });

      test('should handle keyboard input without display element', () => {
        calculator.displayElement = null;

        const event = new KeyboardEvent('keydown', { key: '5' });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe('5');
      });
    });

    describe('Calculation Edge Cases', () => {
      test('should handle calculation with invalid current value', () => {
        calculator.previousValue = 5;
        calculator.operation = '+';
        calculator.currentValue = 'invalid';

        calculator.calculate();

        expect(calculator.previousValue).toBe(5);
        expect(calculator.operation).toBe('+');
      });

      test('should handle calculation error exception', () => {
        calculator.previousValue = 5;
        calculator.operation = '+';
        calculator.currentValue = '3';

        // Mock add to throw error
        calculator.add = jest.fn(() => {
          throw new Error('Test error');
        });

        calculator.calculate();

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Calculation error');
      });

      test('should handle null result from divide', () => {
        calculator.previousValue = 5;
        calculator.operation = '/';
        calculator.currentValue = '0';

        calculator.calculate();

        expect(calculator.hasError).toBe(true);
      });
    });

    describe('Number Formatting Edge Cases', () => {
      test('should format number with many decimal places', () => {
        const number = 1.123456789012345;
        const formatted = calculator.formatNumber(number);

        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
      });

      test('should handle negative zero', () => {
        const formatted = calculator.formatNumber(-0);
        expect(formatted).toBe('0');
      });

      test('should handle very long number string', () => {
        const longNumber = '12345678901234567890';
        const formatted = calculator.formatNumber(parseFloat(longNumber));

        expect(formatted.length).toBeLessThanOrEqual(20);
      });
    });
  });

  // ============================================================================
  // 📊 COVERAGE COMPLETION TESTS
  // ============================================================================

  describe('Coverage Completion', () => {
    describe('Arithmetic Operations', () => {
      test('should perform addition correctly', () => {
        const result = calculator.add(5, 3);
        expect(result).toBe(8);
      });

      test('should perform subtraction correctly', () => {
        const result = calculator.subtract(10, 4);
        expect(result).toBe(6);
      });

      test('should perform multiplication correctly', () => {
        const result = calculator.multiply(6, 7);
        expect(result).toBe(42);
      });

      test('should perform division correctly', () => {
        const result = calculator.divide(20, 4);
        expect(result).toBe(5);
      });

      test('should handle division by zero in divide method', () => {
        const result = calculator.divide(5, 0);
        expect(result).toBeNull();
        expect(calculator.hasError).toBe(true);
      });
    });

    describe('Display Error Method', () => {
      test('should display custom error message', () => {
        calculator.displayError('Custom Error');

        expect(calculator.hasError).toBe(true);
        expect(calculator.currentValue).toBe('Custom Error');
        expect(calculator.previousValue).toBeNull();
        expect(calculator.operation).toBeNull();
      });

      test('should update display with error message', () => {
        calculator.displayError('Test Error');
        expect(mockDisplay.textContent).toBe('Test Error');
      });
    });

    describe('isValidNumber Method', () => {
      test('should validate valid positive number', () => {
        expect(calculator.isValidNumber(42)).toBe(true);
      });

      test('should validate valid negative number', () => {
        expect(calculator.isValidNumber(-42)).toBe(true);
      });

      test('should validate zero', () => {
        expect(calculator.isValidNumber(0)).toBe(true);
      });

      test('should reject NaN', () => {
        expect(calculator.isValidNumber(NaN)).toBe(false);
      });

      test('should reject Infinity', () => {
        expect(calculator.isValidNumber(Infinity)).toBe(false);
      });

      test('should reject number above MAX_SAFE_NUMBER', () => {
        expect(calculator.isValidNumber(Number.MAX_SAFE_INTEGER + 1)).toBe(
          false
        );
      });

      test('should reject number below MIN_SAFE_NUMBER', () => {
        expect(calculator.isValidNumber(Number.MIN_SAFE_INTEGER - 1)).toBe(
          false
        );
      });
    });

    describe('Event Listener Setup', () => {
      test('should setup event delegation on DOMContentLoaded', (done) => {
        document.body.innerHTML = '';

        // Simulate loading state
        Object.defineProperty(document, 'readyState', {
          writable: true,
          value: 'loading',
        });

        const newCalc = new Calculator();

        // Trigger DOMContentLoaded
        document.body.innerHTML = `
          <div class="calculator">
            <div class="display">0</div>
            <div class="buttons">
              <button data-number="5">5</button>
            </div>
          </div>
        `;

        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        setTimeout(() => {
          expect(newCalc.displayElement).toBeDefined();
          done();
        }, 100);
      });

      test('should handle Enter key on button', () => {
        const button = document.querySelector('[data-number="5"]');
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        });

        Object.defineProperty(event, 'target', {
          value: button,
          writable: false,
        });

        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        button.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      });

      test('should handle Space key on button', () => {
        const button = document.querySelector('[data-number="5"]');
        const event = new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
        });

        Object.defineProperty(event, 'target', {
          value: button,
          writable: false,
        });

        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        button.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      });
    });

    describe('Operation Chaining', () => {
      test('should chain operations without shouldResetDisplay', () => {
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.shouldResetDisplay = false;
        calculator.appendDigit('3');
        calculator.setOperation('*');

        expect(calculator.currentValue).toBe('8');
        expect(calculator.operation).toBe('*');
      });

      test('should handle operation change with shouldResetDisplay', () => {
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.shouldResetDisplay = true;
        calculator.setOperation('*');

        expect(calculator.operation).toBe('*');
        expect(calculator.previousValue).toBe(5);
      });
    });

    describe('Decimal Handling', () => {
      test('should handle decimal with empty current value', () => {
        calculator.currentValue = '';
        calculator.appendDigit('.');

        expect(calculator.currentValue).toBe('0.');
      });

      test('should build number after decimal', () => {
        calculator.appendDigit('.');
        calculator.appendDigit('5');

        expect(calculator.currentValue).toBe('0.5');
      });
    });

    describe('Visual Feedback Timing', () => {
      test('should remove active class after 150ms', (done) => {
        const button = document.querySelector('[data-number="5"]');

        calculator.visualFeedback(button);

        expect(button.classList.contains('active')).toBe(true);

        setTimeout(() => {
          expect(button.classList.contains('active')).toBe(false);
          done();
        }, 200);
      });
    });

    describe('Calculate with Error Handling', () => {
      test('should not calculate in error state', () => {
        calculator.handleError('CALCULATION_ERROR');
        calculator.previousValue = 5;
        calculator.operation = '+';
        calculator.currentValue = '3';

        calculator.calculate();

        expect(calculator.currentValue).toBe('Calculation error');
      });

      test('should handle unknown operation in calculate', () => {
        calculator.previousValue = 5;
        calculator.operation = 'unknown';
        calculator.currentValue = '3';

        calculator.calculate();

        expect(calculator.currentValue).toBe('3');
      });
    });
  });

  // ============================================================================
  // ⚡ PERFORMANCE TESTS
  // ============================================================================

  describe('Performance Tests', () => {
    test('should handle 1000 operations efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculator.clear();
        calculator.appendDigit('5');
        calculator.setOperation('+');
        calculator.appendDigit('3');
        calculator.calculate();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
      expect(calculator.currentValue).toBe('8');
    });

    test('should handle rapid state changes', () => {
      const startTime = performance.now();

      for (let i = 0; i < 500; i++) {
        calculator.appendDigit(String(i % 10));
        if (i % 10 === 0) calculator.clear();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500);
    });

    test('should update display efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculator.updateDisplay();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });
});