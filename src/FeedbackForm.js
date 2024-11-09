// Import necessary libraries
import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Make sure the path is correct
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const FeedbackForm = ({ busStopId }) => {
  // State variables to store form inputs
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!feedback.trim()) {
      alert('Please enter your feedback.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add feedback to Firestore
      await addDoc(collection(db, 'feedbacks'), {
        busStopId,
        feedback: feedback.trim(),
        rating,
        timestamp: Timestamp.now(),
      });
      setFeedback('');
      setRating(5);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Submit Feedback for Stop ID: {busStopId}</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ marginLeft: '10px' }}
              disabled={isSubmitting}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here"
              rows="4"
              cols="40"
              disabled={isSubmitting}
              style={{
                display: 'block',
                marginTop: '10px',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
