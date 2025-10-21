import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const ReturnActionNode = memo(({ id, data, selected }) => {
  const [returnValue, setReturnValue] = useState(data.returnValue || 'XDP_PASS');
  const [returnType, setReturnType] = useState(data.returnType || 'XDP');

  const returnOptions = {
    XDP: [
      { value: 'XDP_PASS', label: 'XDP_PASS - Allow packet to continue' },
      { value: 'XDP_DROP', label: 'XDP_DROP - Drop the packet' },
      { value: 'XDP_ABORTED', label: 'XDP_ABORTED - Drop with error' },
      { value: 'XDP_TX', label: 'XDP_TX - Transmit packet' },
      { value: 'XDP_REDIRECT', label: 'XDP_REDIRECT - Redirect packet' },
    ],
    TC: [
      { value: 'TC_ACT_OK', label: 'TC_ACT_OK - Continue processing' },
      { value: 'TC_ACT_SHOT', label: 'TC_ACT_SHOT - Drop packet' },
      { value: 'TC_ACT_STOLEN', label: 'TC_ACT_STOLEN - Consume packet' },
      { value: 'TC_ACT_REDIRECT', label: 'TC_ACT_REDIRECT - Redirect' },
    ],
    PROBE: [
      { value: '0', label: '0 - Success' },
      { value: '-1', label: '-1 - Error' },
    ]
  };

  const handleReturnValueChange = (event) => {
    const newValue = event.target.value;
    setReturnValue(newValue);
    if (data.onUpdate) {
      data.onUpdate(id, { returnValue: newValue, returnType });
    }
  };

  const handleReturnTypeChange = (event) => {
    const newType = event.target.value;
    setReturnType(newType);
    // Reset return value to first option of new type
    const newValue = returnOptions[newType][0].value;
    setReturnValue(newValue);
    if (data.onUpdate) {
      data.onUpdate(id, { returnValue: newValue, returnType: newType });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[280px]`}>
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
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Program Return</div>
      </div>

      {/* Return Type Selector */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Program Type
        </label>
        <select
          value={returnType}
          onChange={handleReturnTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="XDP">XDP (Network)</option>
          <option value="TC">TC (Traffic Control)</option>
          <option value="PROBE">PROBE (Kernel Probe)</option>
        </select>
      </div>

      {/* Return Value Selector */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Return Value
        </label>
        <select
          value={returnValue}
          onChange={handleReturnValueChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {returnOptions[returnType].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Description */}
      <div className="p-2 bg-blue-50 rounded text-xs">
        <div className="font-medium text-blue-800 mb-1">Action:</div>
        <div className="text-blue-700">
          {returnValue === 'XDP_PASS' && 'Allow packet to continue through network stack'}
          {returnValue === 'XDP_DROP' && 'Drop packet silently at driver level'}
          {returnValue === 'XDP_ABORTED' && 'Drop packet and increment error counter'}
          {returnValue === 'XDP_TX' && 'Transmit packet back out same interface'}
          {returnValue === 'XDP_REDIRECT' && 'Redirect packet to another interface'}
          {returnValue === 'TC_ACT_OK' && 'Continue normal traffic control processing'}
          {returnValue === 'TC_ACT_SHOT' && 'Drop packet at traffic control layer'}
          {returnValue === 'TC_ACT_STOLEN' && 'Consume packet, prevent further processing'}
          {returnValue === 'TC_ACT_REDIRECT' && 'Redirect packet to different queue/interface'}
          {returnValue === '0' && 'Successful probe execution'}
          {returnValue === '-1' && 'Error in probe execution'}
        </div>
      </div>

      {/* Performance Note */}
      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
        <div className="font-medium text-yellow-800 mb-1">Performance Note:</div>
        <div className="text-yellow-700">
          This terminates program execution.<br/>
          Ensure all required processing is complete.
        </div>
      </div>
    </div>
  );
});

ReturnActionNode.displayName = 'ReturnActionNode';

export default ReturnActionNode;