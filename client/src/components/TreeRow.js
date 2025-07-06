import React from 'react';

export default function TreeRow({ node, level, isOpen, onToggle }) {
  return (
    <tr>
      <td style={{ paddingLeft: level * 16 }}>
        {node.children.length > 0 && (
          <button onClick={() => onToggle(node.code)}>
            {isOpen ? '−' : '+'}
          </button>
        )}{' '}
        {node.code}
      </td>
      <td>{Number(node.borc ?? node.debt).toFixed(2)}</td>
      <td>{Number(node.alacak ?? node.credit).toFixed(2)}</td>
    </tr>
  );
}
