import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const PacketAccessNode = memo(({ id, data, selected }) => {
  const [accessType, setAccessType] = useState(data.accessType || 'read');
  const [dataType, setDataType] = useState(data.dataType || 'ethernet');
  const [fieldName, setFieldName] = useState(data.fieldName || 'protocol');

  const accessTypes = [
    { value: 'read', label: 'Read Field', description: 'Read data from packet' },
    { value: 'write', label: 'Write Field', description: 'Modify packet data' },
    { value: 'validate', label: 'Validate Bounds', description: 'Check packet boundaries' },
  ];

  const dataTypes = {
    ethernet: {
      label: 'Ethernet Header',
      fields: ['h_dest', 'h_source', 'h_proto'],
      size: 14
    },
    ipv4: {
      label: 'IPv4 Header',
      fields: ['version', 'ihl', 'protocol', 'saddr', 'daddr', 'tot_len'],
      size: 20
    },
    ipv6: {
      label: 'IPv6 Header', 
      fields: ['version', 'priority', 'flow_lbl', 'payload_len', 'nexthdr', 'saddr', 'daddr'],
      size: 40
    },
    tcp: {
      label: 'TCP Header',
      fields: ['source', 'dest', 'seq', 'ack_seq', 'window', 'check'],
      size: 20
    },
    udp: {
      label: 'UDP Header',
      fields: ['source', 'dest', 'len', 'check'],
      size: 8
    }
  };

  const handleAccessTypeChange = (event) => {
    const newType = event.target.value;
    setAccessType(newType);
    if (data.onUpdate) {
      data.onUpdate(id, { accessType: newType, dataType, fieldName });
    }
  };

  const handleDataTypeChange = (event) => {
    const newDataType = event.target.value;
    setDataType(newDataType);
    // Reset field to first available
    const newField = dataTypes[newDataType].fields[0];
    setFieldName(newField);
    if (data.onUpdate) {
      data.onUpdate(id, { accessType, dataType: newDataType, fieldName: newField });
    }
  };

  const handleFieldChange = (event) => {
    const newField = event.target.value;
    setFieldName(newField);
    if (data.onUpdate) {
      data.onUpdate(id, { accessType, dataType, fieldName: newField });
    }
  };

  const currentDataType = dataTypes[dataType];
  const needsInput = accessType === 'write';
  const hasOutput = accessType === 'read';

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

      {needsInput && (
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
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Packet Access</div>
      </div>

      {/* Access Type */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Operation
        </label>
        <select
          value={accessType}
          onChange={handleAccessTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {accessTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Data Type */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Header Type
        </label>
        <select
          value={dataType}
          onChange={handleDataTypeChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {Object.entries(dataTypes).map(([key, type]) => (
            <option key={key} value={key}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Field Selection */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Field
        </label>
        <select
          value={fieldName}
          onChange={handleFieldChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {currentDataType.fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      {/* Header Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">Header Info:</div>
        <div className="text-gray-600">
          Size: {currentDataType.size} bytes<br/>
          Fields: {currentDataType.fields.length} available
        </div>
      </div>

      {/* Bounds Checking Warning */}
      <div className="mb-4 p-2 bg-orange-50 rounded text-xs">
        <div className="font-medium text-orange-800 mb-1">eBPF Safety:</div>
        <div className="text-orange-700">
          • Packet bounds must be verified<br/>
          • Use data_end - data for length checks<br/>
          • Invalid access causes program rejection
        </div>
      </div>

      {/* Generated Code Preview */}
      <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
        <div className="font-medium text-blue-800 mb-1">Code Preview:</div>
        <div className="text-blue-700 font-mono text-xs">
          {accessType === 'read' && `${dataType}_hdr->${fieldName}`}
          {accessType === 'write' && `${dataType}_hdr->${fieldName} = value`}
          {accessType === 'validate' && `data + ${currentDataType.size} <= data_end`}
        </div>
      </div>

      {/* Input Labels */}
      {needsInput && (
        <div className="absolute -left-16 top-3/5 transform -translate-y-1/2 text-xs text-purple-600 whitespace-nowrap">
          Value
        </div>
      )}

      {/* Output Handles */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id="value-output"
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
          {fieldName}
        </div>
      )}

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 whitespace-nowrap">
        Next
      </div>
    </div>
  );
});

PacketAccessNode.displayName = 'PacketAccessNode';

export default PacketAccessNode;