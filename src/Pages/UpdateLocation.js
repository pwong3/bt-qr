import '../App.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdb } from '../firebase/fire';
import { ref, get, child, update } from 'firebase/database';

const UpdateLocation = ({ orderTR }) => {
  const [RDBOrder, setRDBOrder] = useState({});
  const [newLocation, setNewLocation] = useState('');
  const [newPacker, setNewPacker] = useState('');
  let { order } = useParams();
  const orderNumber = order ? order : orderTR;

  useEffect(() => {
    const getOrder = () => {
      get(child(ref(rdb), `PrepackedOrders/${orderNumber}`)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            setRDBOrder({
              orderExists: true,
              orderNumber: snapshot.key,
              location: snapshot.val().location,
              packer: snapshot.val().packer,
            });
          } else {
            setRDBOrder({
              orderExists: false,
              orderNumber: order,
              location: 'does not exist',
            });
          }
        }
      );
    };
    getOrder();
  }, [newLocation, newPacker, order, orderNumber]);

  const handleNewLocationChange = (event) => {
    setNewLocation(event.target.value);
  };
  const handleNewPackerChange = (event) => {
    setNewPacker(event.target.value);
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleOnClick();
    }
  };

  const handleOnClick = () => {
    updateLocation();
    setNewLocation('');
    setNewPacker('');
  };

  const updateLocation = () => {
    update(ref(rdb, `PrepackedOrders/${orderNumber}`), {
      location: newLocation ? newLocation : RDBOrder.location,
      packer: newPacker ? newPacker : RDBOrder.packer,
    });
  };
  return (
    <div className='main'>
      <span className='locationH1'>Order # {RDBOrder.orderNumber}</span>
      {RDBOrder.orderExists ? (
        <>
          <div className='locationPackerSpan'>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Current Location</span>
              <span className='locationH1'>{RDBOrder.location}</span>
            </div>
            <div className='locationPackerDiv'>
              <span className='locationH2'>packed by</span>
              <span className='locationH1'>{RDBOrder.packer}</span>
            </div>
          </div>
          <span className='searchRow'>
            <input
              className='locationInput'
              value={newLocation}
              type='text'
              autoFocus
              placeholder='Enter new location'
              onChange={handleNewLocationChange}
              onKeyUp={handleKeyUp}
            />
            <input
              className='locationInput'
              value={newPacker}
              type='text'
              placeholder='Enter new packer'
              onChange={handleNewPackerChange}
              onKeyUp={handleKeyUp}
            />
            <button
              type='button'
              className='updateLocationButton'
              onClick={handleOnClick}
            >
              Update
            </button>
          </span>
        </>
      ) : (
        <span className='locationH1'>{RDBOrder.location}</span>
      )}
    </div>
  );
};

export default UpdateLocation;