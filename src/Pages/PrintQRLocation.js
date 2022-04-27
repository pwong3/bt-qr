import { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import '../App.css';

const PrintQRLocation = () => {
  const [qrList, setQrList] = useState([]);
  const [locationNumber, setLocationNumber] = useState('');
  const [header, setHeader] = useState('printQRLocationHeader');

  const handleLocationChange = (event) => {
    setLocationNumber(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.repeat) {
      return;
    }
    if (event.key === 'Enter') {
      addQRButton();
    }
  };
  const addQRButton = () => {
    const currQrList = qrList;
    setQrList([...currQrList, locationNumber]);
    setLocationNumber('');
  };
  const clearButton = () => {
    setQrList([]);
  };
  const printButton = () => {
    setHeader('hidePrintQRLocationHeader');
  };
  return (
    <>
      <div className={header}>
        <h2>Print QR Locations</h2>
        <span>
          <input
            className='locationInput'
            autoFocus
            type='text'
            placeholder='Enter location'
            value={locationNumber}
            onChange={handleLocationChange}
            onKeyDown={handleKeyDown}
          />
          <button className='button' onClick={addQRButton}>
            Add QR
          </button>
          <button className='button' onClick={clearButton}>
            Clear
          </button>
          <button id='printButton' className='button' onClick={printButton}>
            Print
          </button>
        </span>
      </div>

      <div className='qrLocation'>
        {qrList.map((location, index) => {
          return (
            <div key={index}>
              <QRCode title={location} value={location} size={130} />
              <p className='qrCodeP'>{location}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PrintQRLocation;
