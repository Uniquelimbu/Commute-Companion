import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const FeedbackList = ({ busStopId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch feedback from Firestore
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const feedbackQuery = query(
        collection(db, 'feedbacks'),
        where('busStopId', '==', busStopId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(feedbackQuery);
      const feedbackData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to fetch feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback when component mounts and when busStopId changes
  useEffect(() => {
    fetchFeedback();
  }, [busStopId]);

  if (loading) {
    return <p>Loading feedback...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Feedback for Bus Stop {busStopId}</h3>
      {feedbacks.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {feedbacks.map((feedback) => (
            <li key={feedback.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <strong>Rating:</strong> {feedback.rating} / 5
              <br />
              <strong>Comment:</strong> {feedback.feedback}
              <br />
              <small style={{ color: '#555' }}>
                {new Date(feedback.timestamp.seconds * 1000).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available for this bus stop.</p>
      )}
    </div>
  );
};

export default FeedbackList;
