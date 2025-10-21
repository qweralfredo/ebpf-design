import React from 'react';

const AnnotationNode = ({ data }) => {
  return (
    <div style={{
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      maxWidth: '200px',
      color: '#92400e',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        💡 Annotation
      </div>
      <div>
        {data.label || 'This is an annotation node that provides additional context and information.'}
      </div>
    </div>
  );
};

export default AnnotationNode;