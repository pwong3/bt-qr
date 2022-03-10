import '../App.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdb } from '../firebase/fire';
import { ref, get, child, update } from 'firebase/database';
import { toast } from 'react-toastify';

const UpdateLocation = ({ orderTR, dbRef }) => {
  const [RDBOrder, setRDBOrder] = useState({});
  const [newLocation, setNewLocation] = useState('');
  const [newPacker, setNewPacker] = useState('');
  let { order } = useParams();
  const orderNumber = order ? order : orderTR;
  const fbDBRef = dbRef ? dbRef : 'PrepackedOrders/';

  useEffect(() => {
    const getOrder = () => {
      get(child(ref(rdb), `${fbDBRef}/${orderNumber}`)).then((snapshot) => {
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
      });
    };
    getOrder();
  }, [newLocation, newPacker, order, orderNumber, fbDBRef]);

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
    toast.success(`Order #${orderNumber} Updated`);
  };

  const updateLocation = () => {
    let time = new Date();
    update(ref(rdb, `${fbDBRef}/${orderNumber}`), {
      location: newLocation ? newLocation : RDBOrder.location,
      packer: newPacker ? newPacker : RDBOrder.packer,
      lastMoved: time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
    });
  };
  return (
    <div className='main'>
      <span className='locationH1'>Order # {RDBOrder.orderNumber}</span>
      {RDBOrder.orderExists ? (
        <div>
          <div className='locationPackerSpan'>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Current location</span>
              <span className='locationH1'>{RDBOrder.location}</span>
            </div>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Moved by</span>
              <span className='locationH1'>{RDBOrder.packer}</span>
            </div>
          </div>
          <span className='updateRow'>
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
              placeholder='Enter new mover'
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
        </div>
      ) : (
        <span className='locationH1'>{RDBOrder.location}</span>
      )}
    </div>
  );
};

export default UpdateLocation;
