/**
 * Calculator Keyboard Input Test Suite
 * Comprehensive tests for keyboard event handling and input processing
 * @generated-from: task-id:TASK-003-KEYBOARD-TEST
 * @tests: calculator.js:v1.0.0 - Keyboard Input Module
 * Coverage Target: >90%
 */

describe('Keyboard Input', () => {
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
  // 🔢 NUMBER KEY INPUT TESTS
  // ============================================================================

  describe('Number Key Input (0-9)', () => {
    test('should handle single digit key press (0)', () => {
      const event = new KeyboardEvent('keydown', { key: '0' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('0');
      expect(mockDisplay.textContent).toBe('0');
    });

    test('should handle single digit key press (1-9)', () => {
      const testCases = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

      testCases.forEach((digit) => {
        calculator.clear();
        const event = new KeyboardEvent('keydown', { key: digit });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(digit);
        expect(mockDisplay.textContent).toBe(digit);
      });
    });

    test('should build multi-digit number from sequential key presses', () => {
      const digits = ['1', '2', '3', '4', '5'];

      digits.forEach((digit) => {
        const event = new KeyboardEvent('keydown', { key: digit });
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('12345');
      expect(mockDisplay.textContent).toBe('12345');
    });

    test('should replace leading zero with digit key', () => {
      expect(calculator.currentValue).toBe('0');

      const event = new KeyboardEvent('keydown', { key: '7' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('7');
    });

    test('should handle rapid number key presses', () => {
      const startTime = performance.now();

      for (let i = 0; i < 50; i++) {
        const event = new KeyboardEvent('keydown', { key: '5' });
        document.dispatchEvent(event);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500);
      expect(calculator.currentValue.length).toBeLessThanOrEqual(15);
    });

    test('should respect maximum display length on keyboard input', () => {
      const longSequence = '123456789012345';

      for (const digit of longSequence) {
        const event = new KeyboardEvent('keydown', { key: digit });
        document.dispatchEvent(event);
      }

      expect(calculator.currentValue).toBe(longSequence);

      const extraEvent = new KeyboardEvent('keydown', { key: '6' });
      document.dispatchEvent(extraEvent);

      expect(calculator.currentValue).toBe(longSequence);
    });

    test('should handle zero key press multiple times', () => {
      const event1 = new KeyboardEvent('keydown', { key: '0' });
      document.dispatchEvent(event1);
      expect(calculator.currentValue).toBe('0');

      const event2 = new KeyboardEvent('keydown', { key: '0' });
      document.dispatchEvent(event2);
      expect(calculator.currentValue).toBe('0');
    });

    test('should build number after operation key press', () => {
      const num1Event = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(num1Event);

      const opEvent = new KeyboardEvent('keydown', { key: '+' });
      document.dispatchEvent(opEvent);

      const num2Event = new KeyboardEvent('keydown', { key: '3' });
      document.dispatchEvent(num2Event);

      expect(calculator.currentValue).toBe('3');
      expect(calculator.previousValue).toBe(5);
      expect(calculator.operation).toBe('+');
    });
  });

  // ============================================================================
  // ➕➖✖️➗ OPERATION KEY INPUT TESTS
  // ============================================================================

  describe('Operation Key Input (+, -, *, /)', () => {
    test('should handle addition key (+)', () => {
      const numEvent = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(numEvent);

      const opEvent = new KeyboardEvent('keydown', { key: '+' });
      document.dispatchEvent(opEvent);

      expect(calculator.operation).toBe('+');
      expect(calculator.previousValue).toBe(5);
      expect(calculator.shouldResetDisplay).toBe(true);
    });

    test('should handle subtraction key (-)', () => {
      const numEvent = new KeyboardEvent('keydown', { key: '8' });
      document.dispatchEvent(numEvent);

      const opEvent = new KeyboardEvent('keydown', { key: '-' });
      document.dispatchEvent(opEvent);

      expect(calculator.operation).toBe('-');
      expect(calculator.previousValue).toBe(8);
    });

    test('should handle multiplication key (*)', () => {
      const numEvent = new KeyboardEvent('keydown', { key: '6' });
      document.dispatchEvent(numEvent);

      const opEvent = new KeyboardEvent('keydown', { key: '*' });
      document.dispatchEvent(opEvent);

      expect(calculator.operation).toBe('*');
      expect(calculator.previousValue).toBe(6);
    });

    test('should handle division key (/)', () => {
      const numEvent = new KeyboardEvent('keydown', { key: '9' });
      document.dispatchEvent(numEvent);

      const opEvent = new KeyboardEvent('keydown', { key: '/' });
      document.dispatchEvent(opEvent);

      expect(calculator.operation).toBe('/');
      expect(calculator.previousValue).toBe(9);
    });

    test('should chain operations with keyboard input', () => {
      // 5 + 3 * 2
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: '*' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('8');
      expect(calculator.operation).toBe('*');
    });

    test('should handle operation key change before second operand', () => {
      const num1Event = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(num1Event);

      const op1Event = new KeyboardEvent('keydown', { key: '+' });
      document.dispatchEvent(op1Event);

      const op2Event = new KeyboardEvent('keydown', { key: '*' });
      document.dispatchEvent(op2Event);

      expect(calculator.operation).toBe('*');
      expect(calculator.previousValue).toBe(5);
    });

    test('should prevent operation in error state', () => {
      calculator.displayError('Test Error');

      const opEvent = new KeyboardEvent('keydown', { key: '+' });
      document.dispatchEvent(opEvent);

      expect(calculator.operation).toBeNull();
    });

    test('should provide visual feedback for operation keys', () => {
      const button = document.querySelector('[data-operation="+"]');
      const classListSpy = jest.spyOn(button.classList, 'add');

      const event = new KeyboardEvent('keydown', { key: '+' });
      document.dispatchEvent(event);

      expect(classListSpy).toHaveBeenCalledWith('active');
    });
  });

  // ============================================================================
  // 🟰 ENTER KEY (EQUALS) TESTS
  // ============================================================================

  describe('Enter Key (Equals)', () => {
    test('should calculate result on Enter key press', () => {
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('8');
      expect(calculator.operation).toBeNull();
      expect(calculator.previousValue).toBeNull();
    });

    test('should handle equals key (=) as alternative to Enter', () => {
      const events = [
        { key: '6' },
        { key: '*' },
        { key: '7' },
        { key: '=' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('42');
    });

    test('should do nothing on Enter if no operation set', () => {
      const numEvent = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(numEvent);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      expect(calculator.currentValue).toBe('5');
      expect(calculator.operation).toBeNull();
    });

    test('should handle Enter key in error state', () => {
      calculator.displayError('Error');

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      expect(calculator.currentValue).toBe('Error');
      expect(calculator.hasError).toBe(true);
    });

    test('should allow new calculation after Enter', () => {
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: 'Enter' },
        { key: '*' },
        { key: '2' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('16');
    });

    test('should prevent default behavior on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should provide visual feedback for Enter key', () => {
      const button = document.querySelector('[data-operation="="]');
      const classListSpy = jest.spyOn(button.classList, 'add');

      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(classListSpy).toHaveBeenCalledWith('active');
    });
  });

  // ============================================================================
  // 🧹 ESCAPE KEY (CLEAR) TESTS
  // ============================================================================

  describe('Escape Key (Clear)', () => {
    test('should clear calculator on Escape key press', () => {
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: 'Escape' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('0');
      expect(calculator.previousValue).toBeNull();
      expect(calculator.operation).toBeNull();
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    test('should clear error state on Escape', () => {
      calculator.displayError('Test Error');

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(calculator.hasError).toBe(false);
      expect(calculator.currentValue).toBe('0');
    });

    test('should reset display to 0 on Escape', () => {
      const events = [
        { key: '9' },
        { key: '9' },
        { key: '9' },
        { key: 'Escape' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(mockDisplay.textContent).toBe('0');
    });

    test('should allow new input after Escape', () => {
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
        { key: 'Escape' },
        { key: '7' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('7');
    });

    test('should prevent default behavior on Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should provide visual feedback for Escape key', () => {
      const button = document.querySelector('[data-action="clear"]');
      const classListSpy = jest.spyOn(button.classList, 'add');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(classListSpy).toHaveBeenCalledWith('active');
    });
  });

  // ============================================================================
  // 🔘 DECIMAL POINT KEY TESTS
  // ============================================================================

  describe('Decimal Point Key', () => {
    test('should add decimal point on period key press', () => {
      const events = [
        { key: '5' },
        { key: '.' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('5.');
    });

    test('should add 0 before decimal if starting with period', () => {
      const event = new KeyboardEvent('keydown', { key: '.' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('0.');
    });

    test('should prevent multiple decimal points via keyboard', () => {
      const events = [
        { key: '5' },
        { key: '.' },
        { key: '2' },
        { key: '.' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('5.2');
    });

    test('should build decimal number from keyboard', () => {
      const events = [
        { key: '1' },
        { key: '2' },
        { key: '.' },
        { key: '5' },
        { key: '6' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('12.56');
    });

    test('should handle decimal in calculation workflow', () => {
      const events = [
        { key: '1' },
        { key: '.' },
        { key: '5' },
        { key: '+' },
        { key: '2' },
        { key: '.' },
        { key: '5' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(parseFloat(calculator.currentValue)).toBe(4);
    });
  });

  // ============================================================================
  // ❌ INVALID KEY HANDLING TESTS
  // ============================================================================

  describe('Invalid Key Handling', () => {
    test('should ignore alphabetic keys', () => {
      const invalidKeys = ['a', 'b', 'c', 'x', 'y', 'z', 'A', 'Z'];

      invalidKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should ignore special characters', () => {
      const invalidKeys = ['!', '@', '#', '$', '%', '^', '&', '(', ')'];

      invalidKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should ignore function keys', () => {
      const functionKeys = ['F1', 'F2', 'F12', 'Tab', 'Shift', 'Control', 'Alt'];

      functionKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should ignore arrow keys', () => {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      arrowKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should not prevent default for invalid keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    test('should ignore space key (except on buttons)', () => {
      const initialValue = calculator.currentValue;

      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe(initialValue);
    });
  });

  // ============================================================================
  // ⚡ RAPID KEY PRESS TESTS
  // ============================================================================

  describe('Rapid Key Presses', () => {
    test('should handle rapid number key presses without errors', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        const event = new KeyboardEvent('keydown', { key: '5' });
        document.dispatchEvent(event);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
      expect(calculator.hasError).toBe(false);
    });

    test('should handle rapid operation key presses', () => {
      calculator.appendDigit('5');

      const operations = ['+', '-', '*', '/'];
      operations.forEach((op) => {
        const event = new KeyboardEvent('keydown', { key: op });
        document.dispatchEvent(event);
      });

      expect(calculator.operation).toBe('/');
      expect(calculator.hasError).toBe(false);
    });

    test('should handle alternating number and operation keys', () => {
      const keys = ['5', '+', '3', '-', '2', '*', '4', '/', '2'];

      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);
      });

      expect(calculator.hasError).toBe(false);
      expect(calculator.operation).toBe('/');
    });

    test('should handle rapid Enter key presses', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      calculator.appendDigit('3');

      for (let i = 0; i < 10; i++) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(event);
      }

      expect(calculator.currentValue).toBe('8');
      expect(calculator.hasError).toBe(false);
    });

    test('should handle rapid Escape key presses', () => {
      for (let i = 0; i < 20; i++) {
        calculator.appendDigit('5');
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
      }

      expect(calculator.currentValue).toBe('0');
      expect(calculator.hasError).toBe(false);
    });

    test('should maintain state consistency during rapid input', () => {
      const events = [
        { key: '1' },
        { key: '2' },
        { key: '+' },
        { key: '3' },
        { key: '4' },
        { key: 'Enter' },
      ];

      // Repeat sequence rapidly
      for (let i = 0; i < 5; i++) {
        calculator.clear();
        events.forEach((eventData) => {
          const event = new KeyboardEvent('keydown', eventData);
          document.dispatchEvent(event);
        });
      }

      expect(calculator.currentValue).toBe('46');
      expect(calculator.hasError).toBe(false);
    });
  });

  // ============================================================================
  // 🎭 KEYBOARD EVENT OBJECT MOCKING TESTS
  // ============================================================================

  describe('KeyboardEvent Object Mocking', () => {
    test('should handle KeyboardEvent with all properties', () => {
      const event = new KeyboardEvent('keydown', {
        key: '5',
        code: 'Digit5',
        keyCode: 53,
        which: 53,
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('5');
    });

    test('should extract key property from event', () => {
      const event = new KeyboardEvent('keydown', { key: '7' });

      expect(event.key).toBe('7');

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('7');
    });

    test('should handle event with modifier keys (should be ignored)', () => {
      const event = new KeyboardEvent('keydown', {
        key: '5',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      });

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('5');
    });

    test('should handle event bubbling correctly', () => {
      const event = new KeyboardEvent('keydown', {
        key: '3',
        bubbles: true,
      });

      const bubbleSpy = jest.spyOn(event, 'stopPropagation');
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('3');
    });

    test('should handle event with target element', () => {
      const button = document.querySelector('[data-number="5"]');
      const event = new KeyboardEvent('keydown', {
        key: '5',
        target: button,
      });

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('5');
    });

    test('should handle event with timestamp', () => {
      const event = new KeyboardEvent('keydown', {
        key: '9',
        timeStamp: Date.now(),
      });

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('9');
    });
  });

  // ============================================================================
  // 🎯 VISUAL FEEDBACK TESTS
  // ============================================================================

  describe('Visual Feedback for Keyboard Input', () => {
    test('should add active class to button on key press', () => {
      const button = document.querySelector('[data-number="5"]');
      const classListSpy = jest.spyOn(button.classList, 'add');

      const event = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(event);

      expect(classListSpy).toHaveBeenCalledWith('active');
    });

    test('should remove active class after timeout', (done) => {
      const button = document.querySelector('[data-number="5"]');

      const event = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(event);

      expect(button.classList.contains('active')).toBe(true);

      setTimeout(() => {
        expect(button.classList.contains('active')).toBe(false);
        done();
      }, 200);
    });

    test('should provide feedback for all operation keys', () => {
      const operations = ['+', '-', '*', '/'];

      operations.forEach((op) => {
        calculator.clear();
        calculator.appendDigit('5');

        const button = document.querySelector(`[data-operation="${op}"]`);
        const classListSpy = jest.spyOn(button.classList, 'add');

        const event = new KeyboardEvent('keydown', { key: op });
        document.dispatchEvent(event);

        expect(classListSpy).toHaveBeenCalledWith('active');
      });
    });

    test('should not provide feedback for invalid keys', () => {
      const buttons = document.querySelectorAll('button');
      const spies = Array.from(buttons).map((btn) =>
        jest.spyOn(btn.classList, 'add')
      );

      const event = new KeyboardEvent('keydown', { key: 'x' });
      document.dispatchEvent(event);

      spies.forEach((spy) => {
        expect(spy).not.toHaveBeenCalledWith('active');
      });
    });

    test('should handle visual feedback when button not found', () => {
      // Mock scenario where button doesn't exist
      const originalQuerySelector = document.querySelector;
      document.querySelector = jest.fn(() => null);

      const event = new KeyboardEvent('keydown', { key: '5' });

      expect(() => document.dispatchEvent(event)).not.toThrow();

      document.querySelector = originalQuerySelector;
    });
  });

  // ============================================================================
  // 🔄 COMPLETE KEYBOARD WORKFLOW TESTS
  // ============================================================================

  describe('Complete Keyboard Workflows', () => {
    test('should complete full calculation using only keyboard', () => {
      const events = [
        { key: '1' },
        { key: '5' },
        { key: '+' },
        { key: '2' },
        { key: '5' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('40');
    });

    test('should handle complex calculation workflow', () => {
      // (12.5 + 7.5) * 2 / 4 = 10
      const events = [
        { key: '1' },
        { key: '2' },
        { key: '.' },
        { key: '5' },
        { key: '+' },
        { key: '7' },
        { key: '.' },
        { key: '5' },
        { key: '*' },
        { key: '2' },
        { key: '/' },
        { key: '4' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(parseFloat(calculator.currentValue)).toBe(10);
    });

    test('should handle error and recovery via keyboard', () => {
      // Division by zero, then clear and new calculation
      const events = [
        { key: '5' },
        { key: '/' },
        { key: '0' },
        { key: 'Enter' },
        { key: 'Escape' },
        { key: '3' },
        { key: '+' },
        { key: '2' },
        { key: 'Enter' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.currentValue).toBe('5');
      expect(calculator.hasError).toBe(false);
    });

    test('should handle mixed mouse and keyboard input', () => {
      // Start with keyboard
      const keyEvent1 = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(keyEvent1);

      // Continue with mouse
      const button = document.querySelector('[data-operation="+"]');
      button.click();

      // Back to keyboard
      const keyEvent2 = new KeyboardEvent('keydown', { key: '3' });
      document.dispatchEvent(keyEvent2);

      const keyEvent3 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyEvent3);

      expect(calculator.currentValue).toBe('8');
    });

    test('should maintain state across multiple keyboard operations', () => {
      const operations = [
        { keys: ['5', '+', '3', 'Enter'], expected: '8' },
        { keys: ['*', '2', 'Enter'], expected: '16' },
        { keys: ['-', '6', 'Enter'], expected: '10' },
        { keys: ['/', '2', 'Enter'], expected: '5' },
      ];

      operations.forEach(({ keys, expected }) => {
        keys.forEach((key) => {
          const event = new KeyboardEvent('keydown', { key });
          document.dispatchEvent(event);
        });
        expect(calculator.currentValue).toBe(expected);
      });
    });
  });

  // ============================================================================
  // 🛡️ EDGE CASES AND SECURITY TESTS
  // ============================================================================

  describe('Keyboard Input Edge Cases', () => {
    test('should handle null key value', () => {
      const event = new KeyboardEvent('keydown', { key: null });
      const initialValue = calculator.currentValue;

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe(initialValue);
    });

    test('should handle undefined key value', () => {
      const event = new KeyboardEvent('keydown', { key: undefined });
      const initialValue = calculator.currentValue;

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe(initialValue);
    });

    test('should handle empty string key', () => {
      const event = new KeyboardEvent('keydown', { key: '' });
      const initialValue = calculator.currentValue;

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe(initialValue);
    });

    test('should handle very long key string', () => {
      const longKey = 'a'.repeat(1000);
      const event = new KeyboardEvent('keydown', { key: longKey });
      const initialValue = calculator.currentValue;

      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe(initialValue);
    });

    test('should handle unicode characters', () => {
      const unicodeKeys = ['€', '£', '¥', '©', '®', '™'];

      unicodeKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should handle emoji keys', () => {
      const emojiKeys = ['😀', '🎉', '🔢', '➕', '➖'];

      emojiKeys.forEach((key) => {
        calculator.clear();
        const initialValue = calculator.currentValue;

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        expect(calculator.currentValue).toBe(initialValue);
      });
    });

    test('should handle case sensitivity correctly', () => {
      const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event1);
      expect(calculator.currentValue).toBe('0');

      calculator.appendDigit('5');

      const event2 = new KeyboardEvent('keydown', { key: 'escape' });
      document.dispatchEvent(event2);
      expect(calculator.currentValue).toBe('5'); // Should not clear
    });
  });

  // ============================================================================
  // ⚡ PERFORMANCE AND STRESS TESTS
  // ============================================================================

  describe('Keyboard Input Performance', () => {
    test('should handle 1000 sequential key presses efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculator.clear();
        const event = new KeyboardEvent('keydown', { key: '5' });
        document.dispatchEvent(event);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Should complete in < 2 seconds
      expect(calculator.hasError).toBe(false);
    });

    test('should handle rapid alternating key types', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        const keys = ['5', '+', '3', 'Enter', 'Escape'];
        keys.forEach((key) => {
          const event = new KeyboardEvent('keydown', { key });
          document.dispatchEvent(event);
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });

    test('should not leak memory with repeated key events', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      for (let i = 0; i < 500; i++) {
        const event = new KeyboardEvent('keydown', { key: '5' });
        document.dispatchEvent(event);
        calculator.clear();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (< 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  // ============================================================================
  // 🎯 INTEGRATION WITH EXISTING FUNCTIONALITY
  // ============================================================================

  describe('Keyboard Integration with Calculator State', () => {
    test('should respect shouldResetDisplay flag on keyboard input', () => {
      calculator.appendDigit('5');
      calculator.setOperation('+');
      expect(calculator.shouldResetDisplay).toBe(true);

      const event = new KeyboardEvent('keydown', { key: '3' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('3');
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    test('should respect hasError flag on keyboard input', () => {
      calculator.displayError('Error');

      const event = new KeyboardEvent('keydown', { key: '5' });
      document.dispatchEvent(event);

      expect(calculator.currentValue).toBe('Error');
    });

    test('should update display correctly after keyboard input', () => {
      const event = new KeyboardEvent('keydown', { key: '7' });
      document.dispatchEvent(event);

      expect(mockDisplay.textContent).toBe('7');
    });

    test('should maintain previousValue during keyboard operations', () => {
      const events = [
        { key: '5' },
        { key: '+' },
        { key: '3' },
      ];

      events.forEach((eventData) => {
        const event = new KeyboardEvent('keydown', eventData);
        document.dispatchEvent(event);
      });

      expect(calculator.previousValue).toBe(5);
      expect(calculator.currentValue).toBe('3');
    });
  });
});