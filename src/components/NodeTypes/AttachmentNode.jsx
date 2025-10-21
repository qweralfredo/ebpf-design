import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const AttachmentNode = memo(({ id, data, selected }) => {
  const [attachType, setAttachType] = useState(data.attachType || 'XDP_RX');

  const attachmentTypes = [
    { value: 'XDP_RX', label: 'XDP RX (Network ingress)' },
    { value: 'XDP_TX', label: 'XDP TX (Network egress)' },
    { value: 'TC_INGRESS', label: 'TC Ingress (Traffic control)' },
    { value: 'TC_EGRESS', label: 'TC Egress (Traffic control)' },
    { value: 'KPROBE', label: 'KPROBE (Kernel function entry)' },
    { value: 'KRETPROBE', label: 'KRETPROBE (Kernel function return)' },
    { value: 'TRACEPOINT', label: 'Tracepoint' },
    { value: 'SOCKET_FILTER', label: 'Socket Filter' },
  ];

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setAttachType(newType);
    // Update node data
    if (data.onUpdate) {
      data.onUpdate(id, { attachType: newType });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[280px]`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Program Entry Point</div>
      </div>

      {/* Attachment Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          Attachment Type
        </label>
        <select
          value={attachType}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {attachmentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mt-2 text-xs text-gray-600">
        {attachType === 'XDP_RX' && 'Hook at network device receive path'}
        {attachType === 'XDP_TX' && 'Hook at network device transmit path'}
        {attachType === 'TC_INGRESS' && 'Traffic control at ingress'}
        {attachType === 'TC_EGRESS' && 'Traffic control at egress'}
        {attachType === 'KPROBE' && 'Probe kernel function entry'}
        {attachType === 'KRETPROBE' && 'Probe kernel function return'}
        {attachType === 'TRACEPOINT' && 'Static kernel tracepoint'}
        {attachType === 'SOCKET_FILTER' && 'Socket-level packet filtering'}
      </div>

      {/* Context Information */}
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">Context Available:</div>
        {attachType.startsWith('XDP') && (
          <div className="text-gray-600">
            • Packet data (xdp_md)<br/>
            • Network device info<br/>
            • Packet metadata
          </div>
        )}
        {attachType.startsWith('TC') && (
          <div className="text-gray-600">
            • SKB (socket buffer)<br/>
            • Traffic control info<br/>
            • Queueing discipline data
          </div>
        )}
        {attachType.includes('PROBE') && (
          <div className="text-gray-600">
            • Function arguments<br/>
            • Kernel context<br/>
            • Process information
          </div>
        )}
        {attachType === 'TRACEPOINT' && (
          <div className="text-gray-600">
            • Tracepoint arguments<br/>
            • Event context<br/>
            • System state
          </div>
        )}
        {attachType === 'SOCKET_FILTER' && (
          <div className="text-gray-600">
            • Socket buffer<br/>
            • Socket information<br/>
            • Network headers
          </div>
        )}
      </div>

      {/* Control Flow Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="control-flow"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#10b981',
          border: '2px solid #065f46'
        }}
      />
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
        Control Flow
      </div>
    </div>
  );
});

AttachmentNode.displayName = 'AttachmentNode';

export default AttachmentNode;