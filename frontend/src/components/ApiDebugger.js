import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { parkingAPI } from '../services/api';

const ApiDebugger = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name, apiCall) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data: response.data,
          type: typeof response.data,
          isArray: Array.isArray(response.data),
          length: Array.isArray(response.data) ? response.data.length : 'N/A',
          keys: Array.isArray(response.data) && response.data.length > 0 
            ? Object.keys(response.data[0]) 
            : 'N/A'
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error.message,
          response: error.response?.data
        }
      }));
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>API Debugger</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Button 
            variant="primary" 
            className="me-2 mb-2"
            onClick={() => testEndpoint('getAllRows', parkingAPI.getAllRows)}
            disabled={loading}
          >
            Test getAllRows
          </Button>
          <Button 
            variant="secondary" 
            className="me-2 mb-2"
            onClick={() => testEndpoint('getAllRowsAlt', parkingAPI.getAllRowsAlt)}
            disabled={loading}
          >
            Test getAllRows (Alt)
          </Button>
          <Button 
            variant="info" 
            className="me-2 mb-2"
            onClick={() => testEndpoint('getAllRowsWithParsing', parkingAPI.getAllRowsWithParsing)}
            disabled={loading}
          >
            Test with Manual Parsing
          </Button>
        </div>

        {Object.entries(results).map(([name, result]) => (
          <Alert key={name} variant={result.success ? 'success' : 'danger'}>
            <h6>{name}</h6>
            <pre style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ApiDebugger;