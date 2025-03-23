import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

export default function Booking() {
  const [booking, setBooking] = useState([]);
  const { user } = useContext(AuthContext); // Access user object from context

  useEffect(() => {
    if (user) {
      const userId = user._id; // Get user ID from the user object
      fetch(`https://tour-backend-i1a8.onrender.com/api/v1/booking/user/${userId}`)
        .then((res) => res.json())
        .then((res) => {
          console.warn(res.data);
          setBooking(res.data);
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
        });
    }
  }, [user]); // Fetch bookings when the user object changes

  // Check if booking is empty or undefined before rendering
  if (!booking || booking.length === 0) {
    return <div>No bookings available</div>;
  }

  const bookingShow = booking.map((boo) => {
    return (
      <div key={boo._id} className="card text-center mt-5">
        <div className="card-header fw-bold">
          {boo.fullName}
        </div>
        <div className="card-body">
          <h5 className="card-title">Tour: {boo.tourName}</h5>
          <h3 className="card-text">Guest: {boo.guestSize}</h3>
          <h3 className="card-text">Phone: {boo.phone}</h3>
        </div>
      </div>
    )
  });

  return (
    <div>
      {bookingShow}
    </div>
  )
}
