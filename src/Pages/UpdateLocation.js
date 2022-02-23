import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase/fire';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../App.css';

const UpdateLocation = () => {
  const [FSOrder, setFSOrder] = useState({});
  const [newLocation, setNewLocation] = useState('');
  let { order } = useParams();

  useEffect(() => {
    const getOrder = async () => {
      const docRef = doc(db, 'orders', order);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFSOrder({
          orderNumber: docSnap.id,
          location: docSnap.data().location,
        });
      } else {
        setFSOrder({
          orderNumber: order,
          location: 'does not exist',
        });
      }
    };
    getOrder();
  }, [FSOrder, order]);

  const handleNewLocationChange = (event) => {
    setNewLocation(event.target.value);
  };

  const updateOnClick = () => {
    updateLocation();
    setNewLocation('');
  };

  const updateLocation = async () => {
    await setDoc(doc(db, 'orders', order), {
      location: newLocation,
    });
  };
  return (
    <div className='main'>
      <span className='locationH1'>Order # {FSOrder.orderNumber}</span>
      <span className='locationH2'>Current Location</span>
      <span className='locationH1'>{FSOrder.location}</span>
      <span className='locationH2'>Enter new location</span>
      <span className='searchRow'>
        <input
          className='locationInput'
          value={newLocation}
          type='text'
          placeholder='New location'
          onChange={handleNewLocationChange}
        />
        <button
          type='button'
          className='updateLocationButton'
          onClick={updateOnClick}
        >
          Update
        </button>
      </span>
    </div>
  );
};

export default UpdateLocation;
