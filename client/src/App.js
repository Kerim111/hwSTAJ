import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckAndUpdate from './CheckAndUpdate';
import Tree from './components/Tree';


function App() {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastDBping, setLastDBping] = useState(null);
  const [treeData, setTreeData]     = useState([]);
  
  useEffect(() => {
    const load = async () => {
      await CheckAndUpdate(
        lastUpdate,
        setLastUpdate,
        setTreeData,
        setLastDBping
      );
    };
    load();
    const iv = setInterval(load, 20000);
    return () => clearInterval(iv);
  }, [lastUpdate]);

  return (
    <div className="App" style={{ padding: 16 }}>
      <h1>Hesap Ağacı</h1>
      <p>Son Güncelleme (DB Değişiklik): {lastUpdate}</p>
      <p>Son API Ping: {lastDBping}</p>
      <Tree data={treeData} />
    </div>
  );
}

export default App;