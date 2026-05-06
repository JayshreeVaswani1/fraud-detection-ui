import React, {useState} from 'react';
import './App.css';

function App(){
  // State to hold the fraud data
  const[transactionAmount, setTransactionAmount] = useState('');
  const[location, setLocation] = useState('');
  const[customerAge, setCustomerage] = useState('');
  const[timeOfDay, setTimeOfDay] = useState('');
  const[dayOfWeek, setDayOfWeek] = useState('');
  const[transactionVelocity, setTransactionVelocity] = useState('');
  const[loading, setLoading] = useState(false);
  const[result, setResult] = useState<any>(null);
  const[error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // DEBUG:  Log all input values before validation
    console.log('=== Form Submission ===');
    console.log('Transaction Amount:', transactionAmount, 'Type:', typeof transactionAmount);
    console.log('Location:', location, 'Type:', typeof location);
    console.log('Customer Age:', customerAge, 'Type:', typeof customerAge);
    console.log('Time of Day:', timeOfDay, 'Type:', typeof timeOfDay);
    console.log('Day of Week:', dayOfWeek, 'Type:', typeof dayOfWeek);
    console.log('Transaction Velocity:', transactionVelocity, 'Type:', typeof transactionVelocity);

    if(!transactionAmount || !location || !customerAge || !timeOfDay || !dayOfWeek || !transactionVelocity){
        console.log('=== EMPTY FIELD DETECTED ===');
      console.log('Empty fields:', {
        transactionAmount: !transactionAmount,
        location: !location,
        customerAge: !customerAge,
        timeOfDay: !timeOfDay,
        dayOfWeek: !dayOfWeek,
        transactionVelocity: !transactionVelocity
      });
      setError('Please fill in all fields before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try{
      //Parse and validate numbers
      const amount = parseFloat(transactionAmount);
      console.log('Parsed amount:', amount, 'isNaN?', isNaN(amount));
      const age = parseInt(customerAge);
      console.log('Parsed age:', age, 'isNaN?', isNaN(age));
      const dayNum = parseInt(dayOfWeek);
      console.log('Parsed dayNum:', dayNum, 'isNaN?', isNaN(dayNum));
      const velocity = parseInt(transactionVelocity);
      console.log('Parsed velocity:', velocity, 'isNaN?', isNaN(velocity));

    // Check for NaN
      if (isNaN(amount)) {
        throw new Error(`Transaction amount is not a valid number: "${transactionAmount}"`);
      }
      if (isNaN(age)) {
        throw new Error(`Customer age is not a valid number: "${customerAge}"`);
      }
      if (isNaN(dayNum)) {
        throw new Error(`Day of week is not a valid number: "${dayOfWeek}"`);
      }
      if (isNaN(velocity)) {
        throw new Error(`Transaction velocity is not a valid number: "${transactionVelocity}"`);
      }
      

      // Prepare data for ML service call
      const requestData = {
        customer_id: '12345',
        transaction_amount: parseFloat(transactionAmount),
        location: location.trim(),
        customer_age: parseInt(customerAge),
        time_of_day: timeOfDay,
        day_of_week: parseInt(dayOfWeek),
        transaction_velocity: parseInt(transactionVelocity)
      };

      console.log('Sending to ML service:', requestData);
      console.log('All values:', {
        amount: typeof amount,
        age: typeof age,
        dayNum: typeof dayNum,
        velocity: typeof velocity
      });

      // Call YOUR FastAPI service to get fraud prediction!
      const response = await fetch('http://localhost:8000/api/detect-fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to check fraud');
      }

      const data = await response.json();
      console.log('Received from ML service:', data);
      setResult(data);
    }catch (err: any) {
      setError(err.message || 'An error occurred while checking for fraud. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Fraud Detection Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label> Transaction Amount (€): *</label>
          <input 
           type="number"
           value={transactionAmount}
           onChange={(e) => setTransactionAmount(e.target.value)}
           placeholder="Enter amount"
           required
           step="0.01"
           min="0"
          />
        </div>

        <div>
        <label> Location: *</label>
          <input 
           type="text"
           value={location}
           onChange={(e) => setLocation(e.target.value)}
           placeholder="e.g., Belgium"
           required
          />
        </div>

        <div>
        <label> Customer Age: *</label>
          <input 
           type="number"
           value={customerAge}
           onChange={(e) => setCustomerage(e.target.value)}
           placeholder="Enter age"
           required
            min="18"
            max="120"
          />
        </div>

        <div>
        <label> Time of Day: *</label>
          <input 
           type="time"
           value={timeOfDay}
           onChange={(e) => setTimeOfDay(e.target.value)}
           placeholder="e.g., 14:00"
           required
          />
        </div>

        <div>
        <label> Day of Week: *</label>
          <select 
            value={dayOfWeek} 
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
            >
            <option value="">Select day</option>
            <option value="0">Monday</option>
            <option value="1">Tuesday</option>
            <option value="2">Wednesday</option>
            <option value="3">Thursday</option>
            <option value="4">Friday</option>
            <option value="5">Saturday</option>
            <option value="6">Sunday</option>
          </select>
        </div>

        <div>
        <label> Transaction Velocity (last 24h): *</label>
          <input 
           type="number"
           value={transactionVelocity}
           onChange={(e) => setTransactionVelocity(e.target.value)}
           placeholder="Number of transactions"
           required
           min="0"
          />
        </div>
        
        <button type="submit">Check for Fraud</button>
        </form>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <h2>🔍 Analyzing transaction...</h2>
          <p>Your ML model is working!</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          background: '#fee',
          color: '#c00',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>❌ Error</h3>
          <p>{error}</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Make sure your FastAPI service is running on port 8000
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2>🎯 Analysis Complete!</h2>
          
          <div style={{
            fontSize: '48px',
            textAlign: 'center',
            padding: '20px',
            background: result.recommendation === 'APPROVE' ? '#d4edda' :
                       result.recommendation === 'REVIEW' ? '#fff3cd' : '#f8d7da',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            {result.recommendation === 'APPROVE' ? '✅' : 
             result.recommendation === 'REVIEW' ? '⚠️' : '🚫'}
            <div style={{ fontSize: '24px', marginTop: '10px' }}>
              {result.recommendation}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Risk Score: {result.risk_score}/100</h3>
            <div style={{
              background: '#eee',
              height: '30px',
              borderRadius: '15px',
              overflow: 'hidden',
              marginTop: '10px'
            }}>
              <div style={{
                width: `${result.risk_score}%`,
                height: '100%',
                background: result.risk_score < 40 ? '#4CAF50' :
                           result.risk_score < 70 ? '#ff9800' : '#f44336',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          {result.reasons && result.reasons.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Details:</h3>
              <ul style={{ textAlign: 'left' }}>
                {result.reasons.map((reason: string, index: number) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={() => setResult(null)}
            style={{ 
              marginTop: '20px',
              background: '#666'
            }}
          >
            Check Another Transaction
          </button>
        </div>
      )}

    </div>
  );
}

export default App;