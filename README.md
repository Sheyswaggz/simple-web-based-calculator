# Simple Web-Based Calculator

A responsive, accessible web-based calculator for basic arithmetic operations with full keyboard support.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Decimal number support
- Clear function
- Responsive design
- Full keyboard input support
- Enhanced accessibility with ARIA attributes and screen reader support
- Visual feedback for keyboard interactions

## Browser Compatibility

The calculator is fully compatible with all modern web browsers and has been extensively tested to ensure consistent functionality and appearance across platforms.

### Supported Browsers

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Google Chrome | 57+ | ✅ Fully Supported |
| Mozilla Firefox | 52+ | ✅ Fully Supported |
| Apple Safari | 10.1+ | ✅ Fully Supported |
| Microsoft Edge | 16+ | ✅ Fully Supported |

### Testing Methodology

The calculator has undergone comprehensive cross-browser compatibility testing including:

- **Manual Testing**: Interactive testing of all calculator features across browsers
- **Automated Testing**: Jest test suite execution in each browser environment
- **Visual Testing**: Screenshot comparison to ensure consistent rendering
- **Performance Testing**: Response time measurements using browser DevTools
- **Accessibility Testing**: Screen reader and keyboard navigation verification

All tests were conducted on multiple operating systems (Windows, macOS, Linux, iOS) and device types (desktop, tablet, mobile) to ensure broad compatibility.

### Test Results

For detailed test results, including:
- Complete compatibility matrix
- Performance benchmarks
- Screenshots from each browser
- Accessibility testing results
- Known issues and limitations

Please refer to [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md)

### Key Compatibility Highlights

- ✅ **100% pass rate** across all tested browsers
- ✅ **No vendor prefixes required** - all CSS features fully supported
- ✅ **Response times < 100ms** in all browsers
- ✅ **Zero console errors** in any browser
- ✅ **Full accessibility support** across all platforms

## Keyboard Shortcuts

The calculator supports full keyboard operation for efficient use:

| Key | Function |
|-----|----------|
| `0-9` | Input digits |
| `+` | Addition operation |
| `-` | Subtraction operation |
| `*` | Multiplication operation |
| `/` | Division operation |
| `Enter` or `=` | Calculate result |
| `Escape` | Clear calculator |
| `.` (Period) | Input decimal point |
| `Tab` | Navigate between buttons |

### Accessibility Features

- **Screen Reader Support**: All interactive elements have descriptive ARIA labels
- **Keyboard Navigation**: Full keyboard access to all calculator functions
- **Live Regions**: Calculation results are announced to screen readers
- **Focus Indicators**: Clear visual indicators show which element has keyboard focus
- **Skip Links**: Quick navigation to main content

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation