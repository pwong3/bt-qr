import '../App.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdb } from '../firebase/fire';
import { ref, get, child, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import { MdQrCodeScanner } from 'react-icons/md';

const UpdateLocation = ({ orderTR, closeUpdateModal }) => {
  const isTesting = true;

  const [RDBOrder, setRDBOrder] = useState({});
  const [newLocation, setNewLocation] = useState('');
  const [newNote, setNewNote] = useState('');
  const [readerID, setReaderID] = useState('reader-hidden');
  let { order } = useParams();
  const orderNumber = order ? order : orderTR;
  const fbDBRef = isTesting ? 'testingDB/' : 'PrepackedOrders/';
  // const fbDBRef = dbRef ? dbRef : 'PrepackedOrders/';

  useEffect(() => {
    const getOrder = () => {
      get(child(ref(rdb), `${fbDBRef}/${orderNumber}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setRDBOrder({
            orderExists: true,
            orderNumber: snapshot.key,
            location: snapshot.val().location,
            note: snapshot.val().note,
            lastMoved: snapshot.val().lastMoved,
          });
          setNewNote(snapshot.val().note);
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
  }, [newLocation, order, orderNumber, fbDBRef]);

  useEffect(() => {
    setNewNote(RDBOrder.note);
  }, []);

  const handleNewLocationChange = (event) => {
    setNewLocation(event.target.value);
  };

  const handleNewNoteChange = (event) => {
    setNewNote(event.target.value);
    // setNewNote((prevState) => {
    //   return { ...prevState, ...event.target.value };
    // });
  };
  const handleKeyDown = (event) => {
    if (event.repeat) {
      return;
    }
    if (event.key === 'Enter') {
      handleUpdateButtonOnClick();
    }
  };

  const handleUpdateButtonOnClick = () => {
    updateOrder();
    setNewLocation('');
    toast.success(`Order #${orderNumber} Updated`);
    if (orderTR) closeUpdateModal();
  };

  const updateOrder = () => {
    let time = new Date();
    update(ref(rdb, `${fbDBRef}/${orderNumber}`), {
      location: newLocation ? newLocation : RDBOrder.location,
      note: newNote ? newNote : RDBOrder.note,
      lastMoved: time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
    });
  };

  const startScan = () => {
    setReaderID('readerShow');
    const html5QrCode = new Html5Qrcode(`${readerID}`);
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      /* handle success */
      setNewLocation(decodedText);
      setReaderID('readerHidden');
      html5QrCode
        .stop()
        .then((ignore) => {
          // QR Code scanning is stopped.
        })
        .catch((err) => {
          // Stop failed, handle it.
        });
    };
    let qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
      let minEdgePercentage = 0.7; // 70%
      let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
      let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
      return {
        width: qrboxSize,
        height: qrboxSize,
      };
    };
    const config = { fps: 10, qrbox: qrboxFunction };
    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      qrCodeSuccessCallback
    );
  };

  return (
    <div className='updateLocation'>
      <span className='locationH1'>Order # {RDBOrder.orderNumber}</span>
      <div id={readerID}></div>
      {RDBOrder.orderExists ? (
        <div className='locationContent'>
          <div className='locationPackerSpan'>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Current location</span>
              <span className='locationH1'>{RDBOrder.location}</span>
            </div>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Note</span>
              <textarea
                rows='4'
                className='locationNote'
                type='text'
                placeholder='Enter notes'
                value={newNote}
                onChange={handleNewNoteChange}
              />
            </div>
          </div>

          <span className='updateRow'>
            <span className='locationScanSpan'>
              <input
                className='locationInput'
                value={newLocation}
                type='text'
                autoFocus
                placeholder='Enter new location'
                onChange={handleNewLocationChange}
                onKeyDown={handleKeyDown}
              />
              <MdQrCodeScanner
                size='2.25rem'
                id='scanButton'
                onClick={startScan}
              />
            </span>

            <button
              id='updateButton'
              type='button'
              className='updateLocationButton'
              onClick={handleUpdateButtonOnClick}
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
