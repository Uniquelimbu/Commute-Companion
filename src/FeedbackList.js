// FeedbackList.js
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig'; // Adjust path if necessary
import { collection, query, where, getDocs } from 'firebase/firestore';

const FeedbackList = ({ busStopId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const feedbackCollection = collection(db, 'feedbacks');
        const q = query(feedbackCollection, where('busStopId', '==', busStopId));
        const feedbackSnapshot = await getDocs(q);

        const feedbackList = feedbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFeedbacks(feedbackList);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [busStopId]);

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Feedback for Stop ID: {busStopId}</h4>
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbacks.length > 0 ? (
        <ul>
          {feedbacks.map(({ id, feedback, rating, timestamp }) => (
            <li key={id}>
              <p><strong>Rating:</strong> {rating}/5</p>
              <p>{feedback}</p>
              <p><small>{new Date(timestamp.seconds * 1000).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available for this stop.</p>
      )}
    </div>
  );
};

export default FeedbackList;