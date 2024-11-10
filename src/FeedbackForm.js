// FeedbackForm.js
import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Adjust path as necessary
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FeedbackForm = ({ busStopId, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // Rating from 0 to 5 stars
  const [hoverRating, setHoverRating] = useState(0); // Rating for star hover effect
  const [isSubmitting, setIsSubmitting] = useState(false); // To track submission status

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      alert('Please enter your feedback.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Please select a rating.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'feedbacks'), {
        busStopId,
        feedback: feedback.trim(),
        rating,
        timestamp: Timestamp.now(),
      });
      setFeedback('');
      setRating(0);
      alert('Feedback submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render stars with click and hover effects
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        style={{
          cursor: 'pointer',
          color: index < (hoverRating || rating) ? '#FFD700' : '#ccc',
          fontSize: '1.8em', // Slightly increased size for visibility
          transition: 'color 0.2s', // Smooth transition for hover
        }}
      />
    ));
  };

  return (
    <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
      <h3>Submit Feedback for Stop ID: {busStopId}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Rating:</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            {renderStars()}
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here"
              rows="4"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'none', // Prevent resizing
                fontFamily: 'Arial, sans-serif', // Improved font readability
              }}
              disabled={isSubmitting}
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
            transition: 'background-color 0.3s', // Smooth transition for button color
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;