import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const CounterNode = memo(({ id, data, selected }) => {
  const [counterName, setCounterName] = useState(data.counterName || 'counter');
  const [operation, setOperation] = useState(data.operation || 'increment');
  const [counterType, setCounterType] = useState(data.counterType || 'simple');

  const operations = [
    { value: 'increment', label: 'Increment Counter', needsValue: false },
    { value: 'add', label: 'Add Value', needsValue: true },
    { value: 'set', label: 'Set Value', needsValue: true },
    { value: 'get', label: 'Get Value', needsValue: false },
  ];

  const counterTypes = [
    { value: 'simple', label: 'Simple Counter', description: 'Basic increment/decrement counter' },
    { value: 'per_cpu', label: 'Per-CPU Counter', description: 'Separate counter per CPU core' },
    { value: 'hash', label: 'Hash Counter', description: 'Keyed counters for different flows' },
    { value: 'array', label: 'Array Counter', description: 'Fixed-size array of counters' },
  ];

  const handleCounterNameChange = (event) => {
    const newName = event.target.value;
    setCounterName(newName);
    if (data.onUpdate) {
      data.onUpdate(id, { counterName: newName, operation, counterType });
    }
  };

  const handleOperationChange = (event) => {
    const newOperation = event.target.value;
    setOperation(newOperation);
    if (data.onUpdate) {
      data.onUpdate(id, { counterName, operation: newOperation, counterType });
    }
  };

  const handleCounterTypeChange = (event) => {
    const newType = event.target.value;
    setCounterType(newType);
    if (data.onUpdate) {
      data.onUpdate(id, { counterName, operation, counterType: newType });
    }
  };

  const selectedOperation = operations.find(op => op.value === operation);
  const selectedType = counterTypes.find(type => type.value === counterType);
  const needsValueInput = selectedOperation?.needsValue || false;
  const hasOutput = operation === 'get';

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[300px]`}>
      {/* Input Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="control-flow-in"
        style={{
          left: '25%',
          width: 12,
          height: 12,
          backgroundColor: '#10b981',
          border: '2px solid #065f46'
        }}
      />

      {counterType === 'hash' && (
        <Handle
          type="target"
          position={Position.Left}
          id="key-input"
          style={{
            top: '40%',
            width: 12,
            height: 12,
            backgroundColor: '#3b82f6',
            border: '2px solid #1e40af'
          }}
        />
      )}

      {needsValueInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="value-input"
          style={{
            top: '60%',
            width: 12,
            height: 12,
            backgroundColor: '#8b5cf6',
            border: '2px solid #5b21b6'
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Counter/Statistics</div>
      </div>

      {/* Counter Name */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Counter Name
        </label>
        <input
          type="text"
          value={counterName}
          onChange={handleCounterNameChange}
          placeholder="Enter counter name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Counter Type */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Counter Type
        </label>
        <select
          value={counterType}
          onChange={handleCounterTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {counterTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <div className="text-xs text-gray-600">
          {selectedType?.description}
        </div>
      </div>

      {/* Operation */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Operation
        </label>
        <select
          value={operation}
          onChange={handleOperationChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {operations.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      {/* Map Definition Preview */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">Map Definition:</div>
        <div className="text-gray-600 font-mono">
          {counterType === 'simple' && `BPF_MAP_TYPE_PERCPU_ARRAY`}
          {counterType === 'per_cpu' && `BPF_MAP_TYPE_PERCPU_HASH`}
          {counterType === 'hash' && `BPF_MAP_TYPE_HASH`}
          {counterType === 'array' && `BPF_MAP_TYPE_ARRAY`}
        </div>
      </div>

      {/* Code Preview */}
      <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
        <div className="font-medium text-blue-800 mb-1">Operation Code:</div>
        <div className="text-blue-700 font-mono">
          {operation === 'increment' && '__sync_fetch_and_add(&counter, 1)'}
          {operation === 'add' && '__sync_fetch_and_add(&counter, value)'}
          {operation === 'set' && 'bpf_map_update_elem(map, &key, &value, 0)'}
          {operation === 'get' && 'bpf_map_lookup_elem(map, &key)'}
        </div>
      </div>

      {/* Performance Notes */}
      <div className="mb-4 p-2 bg-green-50 rounded text-xs">
        <div className="font-medium text-green-800 mb-1">Performance:</div>
        <div className="text-green-700">
          {counterType === 'per_cpu' && '• Reduced contention across CPUs'}
          {counterType === 'simple' && '• Fastest for single counters'}
          {counterType === 'hash' && '• Good for flow-based counting'}
          {counterType === 'array' && '• Fastest lookup by index'}
        </div>
      </div>

      {/* Input Labels */}
      {counterType === 'hash' && (
        <div className="absolute -left-12 top-2/5 transform -translate-y-1/2 text-xs text-blue-600 whitespace-nowrap">
          Key
        </div>
      )}
      
      {needsValueInput && (
        <div className="absolute -left-12 top-3/5 transform -translate-y-1/2 text-xs text-purple-600 whitespace-nowrap">
          Value
        </div>
      )}

      {/* Output Handles */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id="counter-output"
          style={{
            top: '50%',
            width: 12,
            height: 12,
            backgroundColor: '#f59e0b',
            border: '2px solid #d97706'
          }}
        />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="control-flow-out"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#10b981',
          border: '2px solid #065f46'
        }}
      />

      {/* Output Labels */}
      {hasOutput && (
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-xs text-amber-600 whitespace-nowrap">
          Count
        </div>
      )}

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 whitespace-nowrap">
        Next
      </div>
    </div>
  );
});

CounterNode.displayName = 'CounterNode';

export default CounterNode;