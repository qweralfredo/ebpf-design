# V86 Integration Plugin Documentation

## Overview

The **V86Integration** component provides native integration between eBPF Builder and v86 (x86 JavaScript emulator running in the browser). This allows developers to test eBPF programs in a full Arch Linux environment without any installation.

## Features

### 1. Test in v86
- Copies setup command to clipboard
- Opens v86 with Arch Linux in new tab
- Shows step-by-step instructions
- localStorage integration for code persistence

### 2. Open v86 (Arch Linux)
- Direct link to v86 environment
- Fast access without data transfer
- New tab opens automatically

### 3. Copy Setup Command
- Generates complete setup command chain
- One-click clipboard copy
- Reusable for manual setup

## Architecture

### Component Structure

```
V86Integration
├── State Management
│   └── localStorage (code persistence)
├── Functions
│   ├── openV86() - Opens v86 in new tab
│   ├── generateV86Script() - Creates command chain
│   ├── copyToClipboard() - Handles clipboard operations
│   └── testInV86() - Orchestrates full flow
└── UI Components
    ├── Info Section (purple gradient)
    ├── Action Buttons (3x)
    ├── Instructions Box
    └── Performance Note
```

### Data Flow

```
User Flow
    ↓
Click "Test in v86"
    ↓
Save code to localStorage
    ↓
Copy command to clipboard
    ↓
Show instructions alert
    ↓
Open v86 in new tab (1s delay)
    ↓
User pastes command
    ↓
Development server starts
    ↓
Access at localhost:3007
```

## Technical Implementation

### Component Props

```jsx
V86Integration({
  generatedCode,      // eBPF code to test
  language = 'c'      // Programming language (default: 'c')
})
```

### localStorage Keys

```javascript
'ebpf-generated-code' // Stores generated eBPF code
'ebpf-code-language'  // Stores language identifier
```

### Setup Command Structure

```bash
git clone https://github.com/qweralfredo/ebpf-design.git && \
cd ebpf-design && \
npm install && \
npm run dev
```

## Integration Points

### 1. DeployModal Integration

**File**: `src/components/DeployModal.jsx`

```jsx
import V86Integration from './V86Integration';

// In JSX:
<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
  <V86Integration generatedCode={generatedCode} language="c" />
</div>
```

### 2. Code Generation

The component works with:
- `generatedCode` prop from parent component
- Multi-language support (via parent's language selection)
- localStorage persistence for cross-tab access

### 3. User Workflow Integration

```
eBPF Builder
    ↓
Create Flow & Generate Code
    ↓
Open Deploy Modal
    ↓
Choose: WebVM | v86 | Download
    ↓
Click "Test in v86"
    ↓
v86 Environment (Full Linux)
```

## Usage Examples

### Basic Usage

```jsx
<V86Integration 
  generatedCode={ebpfSourceCode} 
  language="c" 
/>
```

### With Different Languages

```jsx
// The component handles all supported languages:
// c, cpp, rust, go, python, zig

<V86Integration 
  generatedCode={multiLanguageCode} 
  language="rust" 
/>
```

### Complete Integration Example

```jsx
// In parent component
const [generatedCode, setGeneratedCode] = useState('');
const [language, setLanguage] = useState('c');

// In render
<V86Integration 
  generatedCode={generatedCode} 
  language={language} 
/>
```

## UI Components

### Info Section
- Purple gradient background
- Icon + title "Test in v86 (Arch Linux)"
- Description of functionality
- Performance note

### Action Buttons

1. **Test in v86** (Primary)
   - Gradient purple button
   - Disabled if no code
   - Full workflow trigger

2. **Open v86 (Arch Linux) →** (Secondary)
   - Direct link button
   - Opens v86 immediately
   - No code transfer

3. **Copy Setup Command** (Utility)
   - Copy to clipboard
   - Feedback alert
   - Manual setup option

### Instructions Box
- Numbered list (1-5 steps)
- Clear step descriptions
- User-friendly guidance

### Performance Note
- Yellow warning box
- v86 vs WebVM comparison
- Guidance on when to use each

## Event Handlers

### testInV86()
```javascript
// 1. Save code to localStorage
localStorage.setItem('ebpf-generated-code', generatedCode);
localStorage.setItem('ebpf-code-language', language);

// 2. Copy command
const setupCommand = generateV86Script();
copyToClipboard(setupCommand);

// 3. Show instructions
alert('✅ Comando de setup copiado!...');

// 4. Open v86 (after 1 second)
setTimeout(() => openV86(), 1000);
```

### copyToClipboard(text)
```javascript
navigator.clipboard.writeText(text);
alert('📋 Comando copiado para clipboard!');
```

### openV86()
```javascript
window.open('https://copy.sh/v86/?profile=archlinux', '_blank');
```

### generateV86Script()
```javascript
[
  'git clone https://github.com/qweralfredo/ebpf-design.git',
  'cd ebpf-design',
  'npm install',
  'npm run dev'
].join(' && ')
```

## Styling

### Color Scheme
- **Primary**: Purple (#9333ea)
- **Background**: purple-50, pink-50
- **Border**: purple-200
- **Text**: purple-900

### Responsive Design
- Full width buttons
- Consistent spacing
- Mobile-friendly layout
- Clear visual hierarchy

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WebAssembly | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| clipboard API | ✅ | ✅ | ✅ | ✅ |
| window.open | ✅ | ✅ | ✅ | ✅ |

## Performance Considerations

### Advantages
- ✅ No installation overhead
- ✅ Browser-native execution
- ✅ Instant accessibility
- ✅ Cross-platform compatibility

### Limitations
- ⚠️ WebAssembly emulation (slower than native)
- ⚠️ Initial boot time (30-60 seconds)
- ⚠️ Network dependency for initial load
- ⚠️ Browser memory overhead

## Troubleshooting

### Button Disabled
**Cause**: No code generated  
**Solution**: Create nodes and generate code first

### Command Not Copied
**Cause**: Browser clipboard restrictions  
**Solution**: Check browser permissions or use manual copy

### v86 Won't Load
**Cause**: Slow network or large downloads  
**Solution**: Wait longer or check internet connection

### Code Not Persisting
**Cause**: localStorage might be disabled  
**Solution**: Enable cookies/storage in browser settings

## Future Enhancements

1. **Code Snippets** - Store commonly used patterns
2. **Templates** - Pre-configured v86 environments
3. **Real-time Sync** - Live code updates in v86
4. **Performance Metrics** - Show system stats during execution
5. **Multi-Tab Sync** - Coordinate multiple v86 instances
6. **Custom Profiles** - User-configured v86 setups
7. **Debugging Tools** - Enhanced error reporting
8. **Code Sharing** - Generate shareable v86 sessions

## Related Components

- **WebVMIntegration** - Alpine Linux WebVM alternative
- **DeployModal** - Parent component
- **CodeViewer** - Code display integration
- **MultiLanguageGenerator** - Code generation

## Configuration Files

### Package.json Dependencies
```json
{
  "react": "^18.3.1",
  "lucide-react": "^latest"
}
```

### Browser APIs Used
- `window.open()` - Open new tabs
- `navigator.clipboard` - Clipboard access
- `localStorage` - Client-side storage
- `setTimeout()` - Async timing

## Security Considerations

✅ **No backend communication** - All operations client-side  
✅ **No data transmission** - Code stored locally only  
✅ **Safe v86 URLs** - Direct links to trusted domain  
✅ **Read-only code sharing** - localStorage not exposed  

## Documentation Links

- [V86 Project](https://github.com/copy/v86)
- [Arch Linux](https://archlinux.org/)
- [eBPF Builder](https://github.com/qweralfredo/ebpf-design)
- [V86 Usage Guide](./V86.md)
- [WebVM Integration](./WEBVM-INTEGRATION.md)

---

**Component Status**: ✅ Production Ready  
**Last Updated**: 2025-10-25  
**Maintainer**: eBPF Builder Team
