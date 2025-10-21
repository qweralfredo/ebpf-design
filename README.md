# eBPF Low-Code Builder

> **Created by Alfredo Rosa** - [LinkedIn Profile](https://www.linkedin.com/in/alfredo-rosa/)
> 
> ⚠️ **Development Status**: This project is currently under active development. The beta version will be available soon.

A modern ReactFlow-based canvas for building eBPF programs visually, based on ReactFlow official examples documentation.

## 🚀 Features

- **ReactFlow v12+**: Implementation with the latest version
- **Custom Nodes**: 
  - AttachmentNode - For program entry points and attachment types
  - ConditionalNode - For conditional logic and branching
  - MapActionNode - For eBPF map operations
  - ReturnActionNode - For program return actions
  - PacketAccessNode - For packet data manipulation
  - VariableNode - For variable storage and manipulation
  - CounterNode - For statistics and counters
- **Custom Edges**:
  - ButtonEdge - Edge with delete button
- **Advanced Controls**: 
  - Add nodes randomly
  - Add node in center
  - Delete selected elements
  - Zoom in/out, Fit View, Center
- **UI Components**:
  - MiniMap with custom colors
  - Controls with custom styling
  - Background with dot pattern
  - Panels for information and controls

## 🛠 Technologies

- React 18.3.1
- @xyflow/react 12.3.2
- Vite 5.4.10
- Tailwind CSS 3.4.4

## 📦 Installation

```bash
cd builder-new
npm install
```

## 🏃‍♂️ Run

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## 🐳 Docker

### Quick Start with Docker

Pull and run the latest image from Docker Hub:

```bash
docker run -d -p 3007:3007 qweralfredo/ebpf-design:latest
```

Then access the application at `http://localhost:3007`

### Using Docker Compose

```bash
docker-compose up -d
```

### Building from Source

```bash
docker build -t ebpf-design .
docker run -d -p 3007:3007 ebpf-design
```

## 📁 Structure

```
src/
├── components/
│   ├── NodeTypes/       # eBPF-specific custom nodes
│   ├── Sidebar.jsx      # Node palette with drag & drop
│   └── ConfigPanel.jsx  # Configuration panel
├── pages/
│   └── EBPFFlowBuilder.jsx # Main flow component
├── data/
│   └── ebpfSpec.js      # eBPF specifications and initial elements
├── utils/
│   └── ebpfGenerator.js # Code generation utilities
├── styles/
│   └── global.css       # Global styles with Tailwind
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

## 🎯 Features

### Available Nodes
- **Program Entry**: Define eBPF program attachment points
- **Conditional Logic**: If/else branching with condition templates
- **Map Operations**: Interact with eBPF maps (lookup, update, delete)
- **Packet Access**: Read/write packet data with bounds checking
- **Variables**: Store and manipulate data with type safety
- **Counters**: Increment statistics and monitoring counters
- **Return Actions**: Program return with verdicts (PASS, DROP, etc.)

### Interactions
- Drag nodes from sidebar to canvas
- Click nodes in sidebar to add to center
- Connect nodes by dragging from handles
- Configure node properties with forms
- Real-time code generation preview

### Controls
- Add nodes dynamically from palette
- Generate eBPF C code from visual flow
- Clear canvas to start fresh
- Toggle sidebar visibility
- Copy/download generated code

## 🎨 Customization

The project is structured for easy customization:

- **Colors**: Defined in Tailwind CSS classes
- **Nodes**: Add new types in `/components/NodeTypes/`
- **Code Generation**: Modify templates in `/utils/ebpfGenerator.js`
- **Specifications**: Update node definitions in `/data/ebpfSpec.js`

## 📚 Based on Documentation

This project follows best practices from ReactFlow official documentation:
- https://reactflow.dev/examples/overview
- https://reactflow.dev/api-reference
- https://reactflow.dev/learn

## 🔧 Build

```bash
npm run build
```

## 📝 Notes

- Uses ReactFlowProvider for accessing flow methods
- Implements modern hooks (useNodesState, useEdgesState, useReactFlow)
- Full TypeScript support (configuration ready)
- Responsive and accessible styling with Tailwind CSS
- Real-time eBPF code generation with validation
- Professional node palette with categorization