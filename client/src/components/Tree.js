import React, { useState } from 'react';
import TreeRow from './TreeRow';

export default function Tree({ data }) {
  const [expanded, setExpanded] = useState(new Set());

  // Gelen veri nesne ise diziye çevir
  const roots = (!Array.isArray(data) && data && typeof data === 'object')
    ? Object.values(data)
    : data || [];

  const toggle = code => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const renderNodes = (nodes, level = 0) =>
    nodes.flatMap(node => {
      const isOpen = expanded.has(node.code);
      const row = (
        <TreeRow
          key={node.code}
          node={node}
          level={level}
          isOpen={isOpen}
          onToggle={toggle}
        />
      );
      return isOpen
        ? [row, ...renderNodes(node.children, level + 1)]
        : [row];
    });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
      <table style={{ borderSpacing: '0px' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 64px' }}>Code</th>
            <th style={{ padding: '8px 64px' }}>Borç</th>
            <th style={{ padding: '8px 64px' }}>Alacak</th>
          </tr>
        </thead>
        <tbody>
          {renderNodes(roots)}
        </tbody>
      </table>
    </div>
  );
}
