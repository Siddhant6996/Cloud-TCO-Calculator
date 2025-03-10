import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from 'chart.js/auto';

const CloudPlatformCalculator = () => {
  const [computeHours, setComputeHours] = useState(0);
  const [storageGB, setStorageGB] = useState(0);
  const [backupDataGB, setBackupDataGB] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);
  const [osSelection, setOsSelection] = useState({ osType: 'Windows', numLicenses: 0 }); 
  const [totalCosts, setTotalCosts] = useState({
    AWS: { compute: 0, storage: 0, archive: 0, backup: 0, networking: 0, total: 0, os: 0 },
    Azure: { compute: 0, storage: 0, archive: 0, backup: 0, networking: 0, total: 0, os: 0 },
    GCP: { compute: 0, storage: 0, archive: 0, backup: 0, networking: 0, total: 0, os: 0 },
    Oracle: { compute: 0, storage: 0, archive: 0, backup: 0, networking: 0, total: 0, os: 0 }
  });
  const [showGraph, setShowGraph] = useState(false); 
  const [showTable, setShowTable] = useState(false); 

  useEffect(() => {
    if (showGraph) {
      const ctx = document.getElementById('costChart');
      const labels = Object.keys(totalCosts);
      const data = Object.values(totalCosts).map(costs => costs.total.toFixed(2));
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Cost',
            data: data,
            backgroundColor: [
              'rgb(255, 99, 132)', // Dark red
      'rgb(54, 162, 235)', // Dark blue
      'rgb(255, 206, 86)', // Dark yellow
      'rgb(75, 192, 192)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [showGraph, totalCosts]);


  const platforms = {
    AWS: { 
      computePricePerHour: 0.005, 
      storagePricePerGBMonth: 0.02, 
      archivePricePerGBMonth: 0.01, 
      backupPricePerGBMonth: 0.03, 
      networkingPrice: 0.05,
      osPrice: 0 
    },
    Azure: { 
      computePricePerHour: 0.006, 
      storagePricePerGBMonth: 0.022, 
      archivePricePerGBMonth: 0.015, 
      backupPricePerGBMonth: 0.035, 
      networkingPrice: 0.06,
      osPrice: 0
    },
    GCP: { 
      computePricePerHour: 0.004, 
      storagePricePerGBMonth: 0.018, 
      archivePricePerGBMonth: 0.012, 
      backupPricePerGBMonth: 0.025, 
      networkingPrice: 0.055,
      osPrice: 0.01 
    },
    Oracle: { 
      computePricePerHour: 0.007, 
      storagePricePerGBMonth: 0.021, 
      archivePricePerGBMonth: 0.013, 
      backupPricePerGBMonth: 0.03, 
      networkingPrice: 0.05,
      osPrice: 0.015 
    }
  };

  const calculateTCO = () => {
    const newTotalCosts = {};
    Object.entries(platforms).forEach(([platform, prices]) => {
      const computeCost = prices.computePricePerHour * computeHours * durationMonths * 24;
      const storageCost = prices.storagePricePerGBMonth * storageGB * durationMonths;
      const archiveCost = prices.archivePricePerGBMonth * storageGB;
      const backupCost = prices.backupPricePerGBMonth * backupDataGB * durationMonths;
      const networkingCost = prices.networkingPrice * durationMonths;
      const osCost = prices.osPrice * osSelection.numLicenses;
      const totalCost = computeCost + storageCost + archiveCost + backupCost + networkingCost + osCost;
      newTotalCosts[platform] = {
        compute: computeCost,
        storage: storageCost,
        archive: archiveCost,
        backup: backupCost,
        networking: networkingCost,
        total: totalCost,
        os: osCost 
      };
    });
    setTotalCosts(newTotalCosts);
    setShowGraph(true);
    setShowTable(true); 
  };

  return (
    <div className="cloud-platform-calculator">
    <div className="header">
    <h1 style={{ textAlign: 'center', fontSize: '24px' }}>Uconnect Hackathon 2024</h1>
    {/* <img src="https://www.gartner.com/imagesrv/peer-insights/vendors/logos/veritas-technologies.jpg" alt="Vertiras Logo" style={{ display: 'block', margin: '0 auto', width: '300px' }} /> */}
    <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Total Cost of Ownership (TCO) Calculator</h2>
      </div>
      <h1 style={{ fontSize: '24px', fontFamily: 'Arial', fontWeight: 'bold' }}>Empower decision-making by estimating total costs effortlessly using our TCO calculator</h1>
      <h2 style={{ fontSize: '20px', fontFamily: 'Arial', fontWeight: 'bold' }}>Enter the details of your on-premise workloads,we will let you know how much it would cost to run these workloads on the major cloud platforms including Amazon AWS, Microsoft Azure, Oracle OCI and Google GCP.</h2>
      <div className="input-section">
        <label htmlFor="computeHours">Compute Hours:</label>
        <input type="number" id="computeHours" value={computeHours} onChange={(e) => setComputeHours(parseInt(e.target.value))} />
        <label htmlFor="storageGB">Storage (GB):</label>
        <input type="number" id="storageGB" value={storageGB} onChange={(e) => setStorageGB(parseInt(e.target.value))} />
        <label htmlFor="backupDataGB">Backup Data (GB):</label>
        <input type="number" id="backupDataGB" value={backupDataGB} onChange={(e) => setBackupDataGB(parseInt(e.target.value))} />
        <label htmlFor="durationMonths">Duration (Months):</label>
        <input type="number" id="durationMonths" value={durationMonths} onChange={(e) => setDurationMonths(parseInt(e.target.value))} />
        <label htmlFor="osSelection" style={{ fontFamily: 'Arial' }}>Operating System and No. of Licenses:</label>
        <select id="osSelection" value={osSelection.osType} onChange={(e) => setOsSelection({ ...osSelection, osType: e.target.value })}>
          <option value="Windows">Windows</option>
          <option value="Linux">Linux</option>
        </select>
        <input type="number" id="numOsLicenses" value={osSelection.numLicenses} onChange={(e) => setOsSelection({ ...osSelection, numLicenses: parseInt(e.target.value) })} />
        <button onClick={calculateTCO}>Calculate TCO</button>
      </div>
      {showTable && (
        <div className="results">
          <h3 style={{ fontSize: '18px', fontFamily: 'Arial', fontWeight: 'bold' }}>Total Cost of Ownership</h3>
          <table>
            <thead>
              <tr>
                <th>Cloud Platform</th>
                <th>Compute Cost</th>
                <th>Storage Cost</th>
                <th>Archive Cost</th>
                <th>Backup Cost</th>
                <th>Networking Cost</th>
                <th>OS Software Cost</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totalCosts).map(([platform, costs]) => (
                <tr key={platform}>
                  <td>{platform}</td>
                  <td>${costs.compute.toFixed(2)}</td>
                  <td>${costs.storage.toFixed(2)}</td>
                  <td>${costs.archive.toFixed(2)}</td>
                  <td>${costs.backup.toFixed(2)}</td>
                  <td>${costs.networking.toFixed(2)}</td>
                  <td>${costs.os.toFixed(2)}</td> {costs.os.toFixed}
                  <td>${costs.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="results">
        <h3 style={{ fontSize: '18px', fontFamily: 'Arial', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Your Cloud Total Cost of Ownership Analysis Graph</h3> 
          {showGraph && <canvas id="costChart"></canvas>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudPlatformCalculator;
