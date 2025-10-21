import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const ConditionalNode = memo(({ id, data, selected }) => {
  const [condition, setCondition] = useState(data.condition || '');
  const [conditionType, setConditionType] = useState(data.conditionType || 'packet');

  const conditionTemplates = {
    packet: [
      'packet.protocol == IPPROTO_TCP',
      'packet.protocol == IPPROTO_UDP',
      'packet.protocol == IPPROTO_ICMP',
      'packet.src_port == 80',
      'packet.dst_port == 443',
      'packet.length > 1500',
    ],
    process: [
      'process.pid > 1000',
      'process.uid == 0',
      'process.comm == "nginx"',
      'process.ppid == init_pid',
    ],
    system: [
      'syscall.nr == __NR_openat',
      'cpu.id < 4',
      'time.now > threshold',
      'memory.usage > limit',
    ],
  };

  const handleConditionChange = (event) => {
    const newCondition = event.target.value;
    setCondition(newCondition);
    if (data.onUpdate) {
      data.onUpdate(id, { condition: newCondition, conditionType });
    }
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setConditionType(newType);
    if (data.onUpdate) {
      data.onUpdate(id, { condition, conditionType: newType });
    }
  };

  const handleTemplateSelect = (template) => {
    setCondition(template);
    if (data.onUpdate) {
      data.onUpdate(id, { condition: template, conditionType });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[320px]`}>
      {/* Control Flow Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="control-flow-in"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#10b981',
          border: '2px solid #065f46'
        }}
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Conditional Logic</div>
      </div>

      {/* Condition Type Selector */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Condition Type
        </label>
        <select
          value={conditionType}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="packet">Packet/Network</option>
          <option value="process">Process/Task</option>
          <option value="system">System/Kernel</option>
        </select>
      </div>

      {/* Condition Input */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Condition Expression
        </label>
        <textarea
          value={condition}
          onChange={handleConditionChange}
          placeholder="Enter condition (e.g., packet.protocol == IPPROTO_TCP)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows="2"
        />
      </div>

      {/* Template Suggestions */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Common Patterns
        </label>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {conditionTemplates[conditionType].map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateSelect(template)}
              className="w-full text-left px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 truncate"
              title={template}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Info */}
      {condition && (
        <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
          <div className="font-medium text-blue-800 mb-1">Validation:</div>
          <div className="text-blue-700">
            {condition.includes('==') && '✓ Equality check - eBPF verifier safe'}
            {condition.includes('>') && '✓ Comparison - bounds check required'}
            {condition.includes('<') && '✓ Comparison - bounds check required'}
            {condition.includes('&&') && '✓ Logical AND - multiple conditions'}
            {condition.includes('||') && '✓ Logical OR - multiple conditions'}
          </div>
        </div>
      )}

      {/* Output Handles Container */}
      <div className="relative mt-4">
        {/* True Branch Handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          style={{
            left: '25%',
            width: 12,
            height: 12,
            backgroundColor: '#22c55e',
            border: '2px solid #15803d'
          }}
        />
        
        {/* False Branch Handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          style={{
            left: '75%',
            width: 12,
            height: 12,
            backgroundColor: '#ef4444',
            border: '2px solid #dc2626'
          }}
        />
        
        {/* Labels */}
        <div className="absolute -bottom-6 left-1/4 transform -translate-x-1/2 text-xs text-green-600 font-medium whitespace-nowrap">
          True
        </div>
        <div className="absolute -bottom-6 left-3/4 transform -translate-x-1/2 text-xs text-red-600 font-medium whitespace-nowrap">
          False
        </div>
      </div>
    </div>
  );
});

ConditionalNode.displayName = 'ConditionalNode';

export default ConditionalNode;