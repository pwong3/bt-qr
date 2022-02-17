import { useState } from 'react';
import QRCode from 'react-qr-code';
import Modal from 'react-modal';

const CreateNewQRCodeModal = () => {
  const url = 'www.besttilesf-qr.web.app/order';
  const [modalIsOpen, setIsOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleOrderNumberChange = (event) => {
    setOrderNumber(event.target.value);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const printQRCode = () => {
    window.open('localhost:3000/order');
  };
  return (
    <>
      <button className='qrButton' onClick={openModal}>
        Create New QR Code
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <form className='modalForm'>
          <h2>Enter order number</h2>
          <input
            className='orderNumberInput'
            type={'text'}
            placeholder={'Order number'}
            onChange={handleOrderNumberChange}
          />
          <QRCode
            title={`${url}/${orderNumber}`}
            value={`${url}/${orderNumber}`}
          />
          <div className='buttonsDiv'>
            <button className='cancelButton' onClick={closeModal}>
              Cancel
            </button>
            <button className='printButton' onClick={printQRCode}>
              Print QR Code
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewQRCodeModal;
