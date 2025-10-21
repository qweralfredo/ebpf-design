import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const VariableNode = memo(({ id, data, selected }) => {
  const [variableName, setVariableName] = useState(data.variableName || 'var');
  const [variableType, setVariableType] = useState(data.variableType || '__u32');
  const [operation, setOperation] = useState(data.operation || 'declare');
  const [initialValue, setInitialValue] = useState(data.initialValue || '0');

  const dataTypes = [
    '__u8', '__u16', '__u32', '__u64', 
    '__s8', '__s16', '__s32', '__s64',
    'void *', 'struct sk_buff *', 'struct xdp_md *'
  ];

  const operations = [
    { value: 'declare', label: 'Declare Variable', needsInput: false },
    { value: 'assign', label: 'Assign Value', needsInput: true },
    { value: 'increment', label: 'Increment', needsInput: false },
    { value: 'decrement', label: 'Decrement', needsInput: false },
    { value: 'add', label: 'Add Value', needsInput: true },
    { value: 'subtract', label: 'Subtract Value', needsInput: true },
  ];

  const handleVariableNameChange = (event) => {
    const newName = event.target.value;
    setVariableName(newName);
    if (data.onUpdate) {
      data.onUpdate(id, { variableName: newName, variableType, operation, initialValue });
    }
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setVariableType(newType);
    if (data.onUpdate) {
      data.onUpdate(id, { variableName, variableType: newType, operation, initialValue });
    }
  };

  const handleOperationChange = (event) => {
    const newOperation = event.target.value;
    setOperation(newOperation);
    if (data.onUpdate) {
      data.onUpdate(id, { variableName, variableType, operation: newOperation, initialValue });
    }
  };

  const handleValueChange = (event) => {
    const newValue = event.target.value;
    setInitialValue(newValue);
    if (data.onUpdate) {
      data.onUpdate(id, { variableName, variableType, operation, initialValue: newValue });
    }
  };

  const selectedOperation = operations.find(op => op.value === operation);
  const needsInput = selectedOperation?.needsInput || false;

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[280px]`}>
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

      {needsInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="value-input"
          style={{
            top: '60%',
            width: 12,
            height: 12,
            backgroundColor: '#3b82f6',
            border: '2px solid #1e40af'
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Variable</div>
      </div>

      {/* Variable Name */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Variable Name
        </label>
        <input
          type="text"
          value={variableName}
          onChange={handleVariableNameChange}
          placeholder="Enter variable name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Variable Type */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Data Type
        </label>
        <select
          value={variableType}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {dataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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

      {/* Initial/Assignment Value */}
      {(operation === 'declare' || operation === 'assign') && (
        <div className="space-y-2 mb-3">
          <label className="block text-xs font-medium text-gray-700">
            {operation === 'declare' ? 'Initial Value' : 'Assignment Value'}
          </label>
          <input
            type="text"
            value={initialValue}
            onChange={handleValueChange}
            placeholder="Enter value"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Code Preview */}
      <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
        <div className="font-medium text-blue-800 mb-1">Generated Code:</div>
        <div className="text-blue-700 font-mono">
          {operation === 'declare' && `${variableType} ${variableName} = ${initialValue};`}
          {operation === 'assign' && `${variableName} = ${initialValue};`}
          {operation === 'increment' && `${variableName}++;`}
          {operation === 'decrement' && `${variableName}--;`}
          {operation === 'add' && `${variableName} += value;`}
          {operation === 'subtract' && `${variableName} -= value;`}
        </div>
      </div>

      {/* eBPF Stack Limits Warning */}
      <div className="mb-4 p-2 bg-yellow-50 rounded text-xs">
        <div className="font-medium text-yellow-800 mb-1">eBPF Constraints:</div>
        <div className="text-yellow-700">
          • Stack limit: 512 bytes total<br/>
          • No global variables allowed<br/>
          • Use maps for persistent storage
        </div>
      </div>

      {/* Input Label */}
      {needsInput && (
        <div className="absolute -left-12 top-3/5 transform -translate-y-1/2 text-xs text-blue-600 whitespace-nowrap">
          Value
        </div>
      )}

      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="variable-output"
        style={{
          top: '50%',
          width: 12,
          height: 12,
          backgroundColor: '#06b6d4',
          border: '2px solid #0891b2'
        }}
      />

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
      <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-xs text-cyan-600 whitespace-nowrap">
        {variableName}
      </div>

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 whitespace-nowrap">
        Next
      </div>
    </div>
  );
});

VariableNode.displayName = 'VariableNode';

export default VariableNode;