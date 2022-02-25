import { useState } from 'react';
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import '../App.css';
import { rdb } from '../firebase/fire';
import { ref, set, get, child } from 'firebase/database';

const CreateNewQRCodeModal = () => {
  const url = 'https://www.besttilesf-qr.web.app';
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState('');

  const handleNewOrderNumberChange = (event) => {
    setNewOrderNumber(event.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewOrderNumber('');
  };

  const handleOnClick = () => {
    checkOrderExists();
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      checkOrderExists();
    }
  };
  const checkOrderExists = () => {
    get(child(ref(rdb), `PrepackedOrders/${newOrderNumber}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          alert(`Order #${newOrderNumber} already exists`);
        } else printQRCode();
      }
    );
  };
  const printQRCode = () => {
    addData();
    closeModal();
    window.open(`/printQR/${newOrderNumber}`, '_blank');
  };

  const addData = () => {
    set(ref(rdb, `PrepackedOrders/${newOrderNumber}`), {
      location: '',
      packer: '',
    });
  };

  return (
    <>
      <button className='button' onClick={openModal}>
        Create New QR Code
      </button>
      <Modal
        className='modal'
        overlayClassName='overlay'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <form
          className='createModal'
          onSubmit={(event) => event.preventDefault()}
        >
          <h2>Enter order number</h2>
          <input
            autoFocus
            className='newOrderNumberInput'
            type={'text'}
            placeholder={'Order number'}
            onChange={handleNewOrderNumberChange}
            onKeyUp={handleKeyDown}
          />
          <QRCode
            title={`${url}/${newOrderNumber}`}
            value={`${url}/${newOrderNumber}`}
          />
          <div className='buttonsDiv'>
            <button type='button' className='cancelButton' onClick={closeModal}>
              Cancel
            </button>
            <button type='button' className='button' onClick={handleOnClick}>
              Print QR Code
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewQRCodeModal;
