import { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Modal from 'react-modal';
import '../App.css';
import { rdb } from '../firebase/fire';
import { ref, set, get, child, update } from 'firebase/database';
import { toast } from 'react-toastify';

const CreateNewQRCodeModalButton = ({ dbRef, url, isTesting }) => {
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
  const handleCreateButton = () => {
    const toPrint = false;
    checkOrderExists(toPrint);
  };
  const handleOnClick = () => {
    const toPrint = true;
    checkOrderExists(toPrint);
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleOnClick();
    }
  };
  const checkOrderExists = (toPrint) => {
    if (!newOrderNumber) {
      toast.error('Please enter order number');
    } else {
      get(child(ref(rdb), `${dbRef}${newOrderNumber}`)).then((snapshot) => {
        if (snapshot.exists()) {
          toast.error(`Order #${newOrderNumber} already exists`);
        } else printQRCode(toPrint);
      });
    }
  };
  const printQRCode = (toPrint) => {
    addData();
    closeModal();
    if (toPrint) {
      update(ref(rdb, `${dbRef}/${newOrderNumber}`), {
        hasPrinted: true,
      });
      window.open(`/printQR/${newOrderNumber}`, '_blank');
    } else toast.success(`Order #${newOrderNumber} created`);
  };

  const addData = () => {
    let time = new Date();
    if (!newOrderNumber) {
      toast.error('Please enter new order number');
    } else {
      set(ref(rdb, `${dbRef}${newOrderNumber}`), {
        location: '',
        packer: '',
        hasPrinted: false,
        lastMoved:
          time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
      });
    }
  };

  return (
    <>
      <button className='button' onClick={openModal}>
        {isTesting ? 'Testing Create' : 'Create New QR Code'}
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
            onKeyUp={handleKeyUp}
          />
          <QRCode value={`${url}/${newOrderNumber}`} />
          <div className='buttonsDiv'>
            <button type='button' className='cancelButton' onClick={closeModal}>
              Cancel
            </button>
            <button
              type='button'
              className='button'
              onClick={handleCreateButton}
            >
              Create Order
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

export default CreateNewQRCodeModalButton;
