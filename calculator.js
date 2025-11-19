/**
 * Calculator - Production-grade calculator implementation
 * Handles arithmetic operations with comprehensive error handling and state management
 * @generated-from: task-id:TASK-003
 * @modifies: calculator.js:v1.0.0
 */

class Calculator {
  /**
   * Initialize calculator with default state
   */
  constructor() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.displayElement = null;
    this.hasError = false;

    this.MAX_DISPLAY_LENGTH = 15;
    this.MAX_SAFE_NUMBER = Number.MAX_SAFE_INTEGER;
    this.MIN_SAFE_NUMBER = Number.MIN_SAFE_INTEGER;

    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners on DOM ready
   */
  initializeEventListeners() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventDelegation());
    } else {
      this.setupEventDelegation();
    }
  }

  /**
   * Setup event delegation for all button clicks
   */
  setupEventDelegation() {
    this.displayElement = document.querySelector('.display');
    const buttonsContainer = document.querySelector('.buttons');

    if (!this.displayElement || !buttonsContainer) {
      return;
    }

    buttonsContainer.addEventListener('click', (event) => {
      this.handleButtonClick(event);
    });

    buttonsContainer.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleButtonClick(event);
      }
    });

    this.updateDisplay();
  }

  /**
   * Handle button click events using event delegation
   * @param {Event} event - Click event
   */
  handleButtonClick(event) {
    const button = event.target.closest('button');
    if (!button) {
      return;
    }

    if (this.hasError && !button.dataset.action) {
      return;
    }

    const number = button.dataset.number;
    const operation = button.dataset.operation;
    const action = button.dataset.action;

    if (number !== undefined) {
      this.appendDigit(number);
    } else if (operation !== undefined) {
      if (operation === '=') {
        this.calculate();
      } else {
        this.setOperation(operation);
      }
    } else if (action === 'clear') {
      this.clear();
    }
  }

  /**
   * Append digit to current value
   * @param {string} digit - Digit or decimal point to append
   */
  appendDigit(digit) {
    if (this.hasError) {
      return;
    }

    if (this.shouldResetDisplay) {
      this.currentValue = '0';
      this.shouldResetDisplay = false;
    }

    if (digit === '.') {
      if (this.currentValue.includes('.')) {
        return;
      }
      if (this.currentValue === '0' || this.currentValue === '') {
        this.currentValue = '0.';
      } else {
        this.currentValue += '.';
      }
    } else {
      if (this.currentValue === '0') {
        this.currentValue = digit;
      } else {
        if (this.currentValue.replace(/[^0-9]/g, '').length >= this.MAX_DISPLAY_LENGTH) {
          return;
        }
        this.currentValue += digit;
      }
    }

    this.updateDisplay();
  }

  /**
   * Set operation and store previous value
   * @param {string} op - Operation symbol (+, -, *, /)
   */
  setOperation(op) {
    if (this.hasError) {
      return;
    }

    const current = parseFloat(this.currentValue);
    if (isNaN(current)) {
      return;
    }

    if (this.previousValue !== null && this.operation !== null && !this.shouldResetDisplay) {
      this.calculate();
      if (this.hasError) {
        return;
      }
    }

    this.previousValue = parseFloat(this.currentValue);
    this.operation = op;
    this.shouldResetDisplay = true;
  }

  /**
   * Perform calculation based on stored operation
   */
  calculate() {
    if (this.hasError) {
      return;
    }

    if (this.previousValue === null || this.operation === null) {
      return;
    }

    const prev = this.previousValue;
    const current = parseFloat(this.currentValue);

    if (isNaN(current)) {
      return;
    }

    let result;

    try {
      switch (this.operation) {
        case '+':
          result = this.add(prev, current);
          break;
        case '-':
          result = this.subtract(prev, current);
          break;
        case '*':
          result = this.multiply(prev, current);
          break;
        case '/':
          result = this.divide(prev, current);
          break;
        default:
          return;
      }

      if (result === null) {
        return;
      }

      if (!this.isValidNumber(result)) {
        this.displayError('Number too large');
        return;
      }

      this.currentValue = this.formatNumber(result);
      this.previousValue = null;
      this.operation = null;
      this.shouldResetDisplay = true;
      this.updateDisplay();
    } catch (error) {
      this.displayError('Calculation error');
    }
  }

  /**
   * Add two numbers
   * @param {number} a - First operand
   * @param {number} b - Second operand
   * @returns {number} Sum
   */
  add(a, b) {
    return a + b;
  }

  /**
   * Subtract two numbers
   * @param {number} a - First operand
   * @param {number} b - Second operand
   * @returns {number} Difference
   */
  subtract(a, b) {
    return a - b;
  }

  /**
   * Multiply two numbers
   * @param {number} a - First operand
   * @param {number} b - Second operand
   * @returns {number} Product
   */
  multiply(a, b) {
    return a * b;
  }

  /**
   * Divide two numbers with zero check
   * @param {number} a - Dividend
   * @param {number} b - Divisor
   * @returns {number|null} Quotient or null if division by zero
   */
  divide(a, b) {
    if (b === 0) {
      this.displayError('Cannot divide by zero');
      return null;
    }
    return a / b;
  }

  /**
   * Clear calculator state
   */
  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.hasError = false;
    this.updateDisplay();
  }

  /**
   * Update display with current value
   */
  updateDisplay() {
    if (!this.displayElement) {
      return;
    }

    const displayValue = this.hasError ? this.currentValue : this.formatDisplayValue(this.currentValue);
    this.displayElement.textContent = displayValue;
  }

  /**
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber(num) {
    if (num === 0) {
      return '0';
    }

    const absNum = Math.abs(num);
    
    if (absNum >= 1e10 || (absNum < 1e-6 && absNum !== 0)) {
      return num.toExponential(6);
    }

    const str = num.toString();
    if (str.length > this.MAX_DISPLAY_LENGTH) {
      const rounded = Number(num.toPrecision(10));
      return rounded.toString();
    }

    return str;
  }

  /**
   * Format value for display (handles trailing decimals)
   * @param {string} value - Value to format
   * @returns {string} Formatted display value
   */
  formatDisplayValue(value) {
    if (value.endsWith('.')) {
      return value;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      return '0';
    }

    return this.formatNumber(num);
  }

  /**
   * Display error message
   * @param {string} message - Error message to display
   */
  displayError(message) {
    this.hasError = true;
    this.currentValue = message;
    this.previousValue = null;
    this.operation = null;
    this.updateDisplay();
  }

  /**
   * Validate if number is within safe range
   * @param {number} num - Number to validate
   * @returns {boolean} True if valid
   */
  isValidNumber(num) {
    return (
      !isNaN(num) &&
      isFinite(num) &&
      num <= this.MAX_SAFE_NUMBER &&
      num >= this.MIN_SAFE_NUMBER
    );
  }
}

const calculator = new Calculator();