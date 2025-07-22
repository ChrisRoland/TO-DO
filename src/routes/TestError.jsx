import React from 'react';

export default function TestError() {
// I didn't know if I should add a link to test this.
// Please go to http://localhost:5173/test-error to see it
  throw new Error('This is a test error to check if the error boundary works');
  
  // eslint-disable-next-line no-unreachable
  return (
    <div>
      <h1>If you can see this the error boundary isn't working</h1>
    </div>
  );
}