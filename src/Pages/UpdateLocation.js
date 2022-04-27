import '../App.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdb } from '../firebase/fire';
import { ref, get, child, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import { MdQrCodeScanner } from 'react-icons/md';

const UpdateLocation = ({ orderTR }) => {
  const isTesting = true;

  const [RDBOrder, setRDBOrder] = useState({});
  const [newLocation, setNewLocation] = useState('');
  const [newPacker, setNewPacker] = useState('');
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
            packer: snapshot.val().packer,
            note: snapshot.val().note,
            lastMoved: snapshot.val().lastMoved,
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
  }, [newLocation, newPacker, newNote, order, orderNumber, fbDBRef]);

  const handleNewLocationChange = (event) => {
    setNewLocation(event.target.value);
  };
  const handleNewPackerChange = (event) => {
    setNewPacker(event.target.value);
  };
  const handleNewNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.repeat) {
      return;
    }
    if (event.key === 'Enter') {
      handleOnClick();
    }
  };

  const handleOnClick = () => {
    updateOrder();
    setNewLocation('');
    setNewPacker('');
    setNewNote('');
    toast.success(`Order #${orderNumber} Updated`);
  };

  const updateOrder = () => {
    let time = new Date();
    update(ref(rdb, `${fbDBRef}/${orderNumber}`), {
      location: newLocation ? newLocation : RDBOrder.location,
      packer: newPacker ? newPacker : RDBOrder.packer,
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
    <div className='main'>
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
              <span className='noteH1'>{RDBOrder.note}</span>
            </div>
            <div className='locationPackerDiv'>
              <span className='locationH2'>Moved by</span>
              <span className='packerH1'>{RDBOrder.packer}</span>
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
            <span className='locationScanSpan'>
              <input
                className='locationInput'
                value={newNote}
                type='text'
                placeholder='Enter new note'
                onChange={handleNewNoteChange}
                onKeyDown={handleKeyDown}
              />
            </span>
            <span className='locationScanSpan'>
              <input
                className='locationInput'
                value={newPacker}
                type='text'
                placeholder='Enter new mover'
                onChange={handleNewPackerChange}
                onKeyDown={handleKeyDown}
              />
            </span>
            <button
              id='updateButton'
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
