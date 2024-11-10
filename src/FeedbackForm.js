// FeedbackForm.js
import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FeedbackForm = ({ busStopId, busStopName, description, wheelchairAccessible, shelterAvailability, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [wheelchairAccessibleResponse, setWheelchairAccessibleResponse] = useState(null);
  const [shelterResponse, setShelterResponse] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (wheelchairAccessibleResponse === null) {
      alert('Please answer the wheelchair accessibility question.');
      return;
    }
    if (shelterResponse === null) {
      alert('Please answer the shelter question.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'feedbacks'), {
        busStopId,
        feedback: feedback.trim(),
        rating,
        wheelchairAccessibleResponse,
        shelterResponse, 
        timestamp: Timestamp.now(),
      });

      setFeedback('');
      setRating(0);
      setWheelchairAccessibleResponse(null);
      setShelterResponse(null);

      alert('Feedback submitted successfully!');
      onClose(); 
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          fontSize: '1.8em',
          transition: 'color 0.2s',
        }}
      />
    ));
  };

  return (
    <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
      <h3 style={{ fontSize: '1.4em', fontWeight: 'bold', marginBottom: '10px' }}>{busStopName}</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Rating:</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>{renderStars()}</div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Was it wheelchair accessible?</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button
              type="button"
              onClick={() => setWheelchairAccessibleResponse(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: wheelchairAccessibleResponse === true ? '#007bff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setWheelchairAccessibleResponse(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: wheelchairAccessibleResponse === false ? '#007bff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Does the bus stop have shelter?</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button
              type="button"
              onClick={() => setShelterResponse(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: shelterResponse === true ? '#007bff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShelterResponse(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: shelterResponse === false ? '#007bff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
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
                resize: 'none',
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
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
