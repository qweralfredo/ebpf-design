import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const MapActionNode = memo(({ id, data, selected }) => {
  const [mapName, setMapName] = useState(data.mapName || 'my_map');
  const [actionType, setActionType] = useState(data.actionType || 'lookup');
  const [keyType, setKeyType] = useState(data.keyType || '__u32');
  const [valueType, setValueType] = useState(data.valueType || '__u64');

  const mapActions = [
    { value: 'lookup', label: 'Lookup Element', helper: 'bpf_map_lookup_elem' },
    { value: 'update', label: 'Update Element', helper: 'bpf_map_update_elem' },
    { value: 'delete', label: 'Delete Element', helper: 'bpf_map_delete_elem' },
    { value: 'lookup_and_delete', label: 'Lookup & Delete', helper: 'bpf_map_lookup_and_delete_elem' },
    { value: 'peek', label: 'Peek Element', helper: 'bpf_map_peek_elem' },
    { value: 'pop', label: 'Pop Element', helper: 'bpf_map_pop_elem' },
    { value: 'push', label: 'Push Element', helper: 'bpf_map_push_elem' },
  ];

  const dataTypes = ['__u8', '__u16', '__u32', '__u64', '__s8', '__s16', '__s32', '__s64', 'struct custom'];

  const handleActionChange = (event) => {
    const newAction = event.target.value;
    setActionType(newAction);
    if (data.onUpdate) {
      data.onUpdate(id, { mapName, actionType: newAction, keyType, valueType });
    }
  };

  const handleMapNameChange = (event) => {
    const newName = event.target.value;
    setMapName(newName);
    if (data.onUpdate) {
      data.onUpdate(id, { mapName: newName, actionType, keyType, valueType });
    }
  };

  const handleKeyTypeChange = (event) => {
    const newKeyType = event.target.value;
    setKeyType(newKeyType);
    if (data.onUpdate) {
      data.onUpdate(id, { mapName, actionType, keyType: newKeyType, valueType });
    }
  };

  const handleValueTypeChange = (event) => {
    const newValueType = event.target.value;
    setValueType(newValueType);
    if (data.onUpdate) {
      data.onUpdate(id, { mapName, actionType, keyType, valueType: newValueType });
    }
  };

  const selectedAction = mapActions.find(action => action.value === actionType);
  const needsValue = ['update', 'push'].includes(actionType);
  const returnsValue = ['lookup', 'lookup_and_delete', 'peek', 'pop'].includes(actionType);

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
          left: '20%',
          width: 12,
          height: 12,
          backgroundColor: '#10b981',
          border: '2px solid #065f46'
        }}
      />
      
      <Handle
        type="target"
        position={Position.Left}
        id="key-input"
        style={{
          top: '50%',
          width: 12,
          height: 12,
          backgroundColor: '#3b82f6',
          border: '2px solid #1e40af'
        }}
      />
      
      {needsValue && (
        <Handle
          type="target"
          position={Position.Left}
          id="value-input"
          style={{
            top: '70%',
            width: 12,
            height: 12,
            backgroundColor: '#8b5cf6',
            border: '2px solid #5b21b6'
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        <div className="font-bold text-sm text-gray-800">Map Operation</div>
      </div>

      {/* Map Name */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Map Name
        </label>
        <input
          type="text"
          value={mapName}
          onChange={handleMapNameChange}
          placeholder="Enter map name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Action Type */}
      <div className="space-y-2 mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Operation
        </label>
        <select
          value={actionType}
          onChange={handleActionChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {mapActions.map((action) => (
            <option key={action.value} value={action.value}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      {/* Data Types */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">
            Key Type
          </label>
          <select
            value={keyType}
            onChange={handleKeyTypeChange}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {dataTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">
            Value Type
          </label>
          <select
            value={valueType}
            onChange={handleValueTypeChange}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {dataTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Helper Function Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">Helper Function:</div>
        <div className="text-gray-600 font-mono">
          {selectedAction?.helper}
        </div>
      </div>

      {/* Verifier Constraints */}
      <div className="mb-4 p-2 bg-yellow-50 rounded text-xs">
        <div className="font-medium text-yellow-800 mb-1">eBPF Verifier Notes:</div>
        <div className="text-yellow-700">
          • Null pointer checks required<br/>
          • Map bounds validation needed<br/>
          • Key/Value alignment enforced
        </div>
      </div>

      {/* Input Labels */}
      <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 whitespace-nowrap">
        Key
      </div>
      
      {needsValue && (
        <div className="absolute -left-16 top-2/3 transform -translate-y-1/2 text-xs text-purple-600 whitespace-nowrap">
          Value
        </div>
      )}

      {/* Output Handles */}
      {returnsValue && (
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
      {returnsValue && (
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-xs text-amber-600 whitespace-nowrap">
          Result
        </div>
      )}
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 whitespace-nowrap">
        Next
      </div>
    </div>
  );
});

MapActionNode.displayName = 'MapActionNode';

export default MapActionNode;