import './App.css';
import { useState, useEffect } from 'react';
import { Heatmap } from './HeatMap';

function App() {
  const [listeningData, setListeningData] = useState([]);

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        console.log(csvText)
        const rows = csvText.split("\n").slice(1);
        const parsedData = rows.map((row) => {
          const [Date, Hour, SongName] = row.split(",");
          return { Date, Hour: parseInt(Hour, 10), "Song Name": SongName };
        });
        setListeningData(parsedData);
      });
  }, []);

  return (
    <div style={{paddingBottom: '100px'}}>
      <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
        <Heatmap data={listeningData} />
      </div>
    </div>
  );
}

export default App;
