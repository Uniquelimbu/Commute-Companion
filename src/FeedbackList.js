// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig'; // Make sure the path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';

const FeedbackList = ({ busStopId }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(collection(db, 'feedbacks'), where('busStopId', '==', busStopId));
        const querySnapshot = await getDocs(q);
        const feedbackArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbackArray);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedbacks();
  }, [busStopId]);

  if (feedbacks.length === 0) {
    return <p>No feedback available for this stop.</p>;
  }

  return (
    <div>
      <h4>Feedback for Stop ID: {busStopId}</h4>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <p><strong>Rating:</strong> {feedback.rating}</p>
            <p><strong>Feedback:</strong> {feedback.feedback}</p>
            <p><small><strong>Submitted on:</strong> {feedback.timestamp.toDate().toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
