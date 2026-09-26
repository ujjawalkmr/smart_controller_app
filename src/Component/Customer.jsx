import React, { useState } from 'react';

// Mock data structuring matching your sketch nodes perfectly
const customersData = [
  {
    id: 'rahul',
    name: 'Rahul',
    devices: [
      { id: 'esp 1', status: 'error' },
      { id: 'esp 2', status: 'all right' },
      { id: 'esp 3', status: 'warning' },
      { id: 'esp 4', status: 'all right' },
      { id: 'esp 5', status: 'all right' },
      { id: 'esp 6', status: 'all right' },
    ]
  },
  {
    id: 'amit',
    name: 'Amit',
    devices: [
      { id: 'esp 1', status: 'all right' },
      { id: 'esp 2', status: 'error' },
      { id: 'esp 3', status: 'all right' },
      { id: 'esp 4', status: 'warning' },
      { id: 'esp 5', status: 'all right' },
      { id: 'esp 6', status: 'all right' },
    ]
  },
  {
    id: 'priya',
    name: 'Priya',
    devices: [
      { id: 'esp 1', status: 'warning' },
      { id: 'esp 2', status: 'all right' },
      { id: 'esp 3', status: 'all right' },
      { id: 'esp 4', status: 'all right' },
      { id: 'esp 5', status: 'error' },
      { id: 'esp 6', status: 'all right' },
    ]
  },
  {
    id: 'vikram',
    name: 'Vikram',
    devices: [
      { id: 'esp 1', status: 'all right' },
      { id: 'esp 2', status: 'error' },
      { id: 'esp 3', status: 'all right' },
      { id: 'esp 4', status: 'all right' },
      { id: 'esp 5', status: 'warning' },
      { id: 'esp 6', status: 'all right' },
    ]
  }
];

export default function CustomerDeviceDashboard() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('all');

  // Filter grid contents based on selector choices
  const filteredCustomers = selectedCustomerId === 'all' 
    ? customersData 
    : customersData.filter(c => c.id === selectedCustomerId);

  // Find active customer if one is selected
  const activeCustomer = customersData.find(c => c.id === selectedCustomerId);

  // Status badge styling helper
  const getStatusColor = (status) => {
    if (status === 'error') return '#d9383a';
    if (status === 'warning') return '#e6a23c';
    return '#2b2b2b'; // "all right" default color
  };

  const styles = {
    container: {
      /* Changed from 40px to 90px to create a safe zone below your fixed navbar */
      padding: '90px 20px 40px 20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
    },
    // Top standalone selector card matching your structural layout box
    headerSelectorCard: {
      border: '4px solid #000000',
      maxWidth: '500px',
      margin: '0 auto 40px auto',
      padding: '20px',
      textAlign: 'left', // Aligned left for cleaner layout alignment
    },
    selectorRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
      gap: '10px'
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: 0,
      whiteSpace: 'nowrap'
    },
    selectDropdown: {
      padding: '6px 12px',
      fontSize: '15px',
      width: '60%',
      border: '2px solid #000000',
      cursor: 'pointer',
    },
    customerDisplayStatus: {
      borderTop: '2px dashed #000000',
      paddingTop: '12px',
      marginTop: '12px',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    // Outer border grid section labeled "here the customer grid"
    gridOuterBox: {
      border: '4px solid #000000',
      padding: '30px 20px 20px 20px',
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
    },
    gridLabel: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'block',
    },
    // Internal 2-column grid layout pattern
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '30px 40px',
    },
    customerCard: {
      border: '4px solid #000000',
      padding: '20px',
      backgroundColor: '#ffffff',
    },
    customerTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '0 0 4px 0',
    },
    subLabel: {
      fontSize: '14px',
      color: '#333333',
      margin: '0 0 10px 0',
    },
    // Mini sub-grid to columnize your ESP 1-3 and ESP 4-6 arrays side-by-side
    deviceSubGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6px 20px',
    },
    deviceItem: {
      fontSize: '15px',
      whiteSpace: 'nowrap',
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. TOP CUSTOMER SELECT CARD WITH STYLING PAIRS */}
      <div style={styles.headerSelectorCard}>
        
        {/* Row 1: Select Customer */}
        <div style={styles.selectorRow}>
          <span style={styles.headerTitle}>Select Customer |</span>
          <select 
            style={styles.selectDropdown}
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="all">-- Show All Customers --</option>
            {customersData.map(c => (
              <option key={c.id} value={c.id}>Customer: {c.name}</option>
            ))}
          </select>
        </div>

        {/* Row 2: Selected Customer */}
        <div style={styles.selectorRow}>
          <span style={styles.headerTitle}>Selected Customer |</span>
          <select 
            style={styles.selectDropdown}
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="all">None</option>
            {customersData.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Display Field: Customer: Name */}
        {activeCustomer && (
          <div style={styles.customerDisplayStatus}>
            Customer : {activeCustomer.name}
          </div>
        )}
      </div>

      {/* 2. MAIN CUSTOMER GRID WRAPPER */}
      <div style={styles.gridOuterBox}>
        <span style={styles.gridLabel}>here the customer grid</span>
        
        <div style={styles.cardsGrid}>
          {filteredCustomers.map((customer) => (
            <div key={customer.id} style={styles.customerCard}>
              <h2 style={styles.customerTitle}>customer:{customer.name} ...</h2>
              <p style={styles.subLabel}>customer devices</p>
              
              {/* Internal two-column device list layout */}
              <div style={styles.deviceSubGrid}>
                {customer.devices.map((device) => (
                  <div key={device.id} style={styles.deviceItem}>
                    {device.id} : <span style={{ 
                      color: getStatusColor(device.status),
                      fontWeight: device.status !== 'all right' ? 'bold' : 'normal' 
                    }}>
                      {device.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
