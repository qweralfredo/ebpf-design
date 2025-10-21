// Initial nodes for the ReactFlow canvas
export const initialNodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Start Node' },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '8px',
    },
  },
  {
    id: '2',
    type: 'annotation',
    position: { x: 50, y: 100 },
    data: { 
      label: 'This is an annotation node that provides context and explanations for the flow.' 
    },
  },
  {
    id: '3',
    type: 'tools',
    position: { x: 250, y: 120 },
    data: { label: 'Node with Toolbar' },
  },
  {
    id: '4',
    type: 'resizer',
    position: { x: 450, y: 120 },
    data: { label: 'Resizable Node' },
    style: {
      width: 150,
      height: 80,
    },
  },
  {
    id: '5',
    type: 'circle',
    position: { x: 150, y: 250 },
    data: { label: 'Circle' },
  },
  {
    id: '6',
    type: 'textinput',
    position: { x: 350, y: 250 },
    data: { label: 'Type something...' },
  },
  {
    id: '7',
    type: 'output',
    position: { x: 250, y: 380 },
    data: { label: 'End Node' },
    style: {
      background: '#ef4444',
      color: 'white',
      border: '2px solid #dc2626',
      borderRadius: '8px',
    },
  },
  {
    id: '8',
    position: { x: 550, y: 50 },
    data: { label: 'Regular Node' },
    style: {
      background: '#f3f4f6',
      border: '2px solid #9ca3af',
      borderRadius: '8px',
    },
  },
];

// Initial edges for the ReactFlow canvas
export const initialEdges = [
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'button',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'e3-6',
    source: '3',
    target: '6',
    style: { stroke: '#f59e0b', strokeWidth: 2 },
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 },
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    style: { stroke: '#ef4444', strokeWidth: 2 },
  },
  {
    id: 'e1-8',
    source: '1',
    target: '8',
    type: 'step',
    style: { stroke: '#6b7280', strokeWidth: 2 },
  },
];