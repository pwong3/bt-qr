import { useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Modal from 'react-modal';
import '../App.css';
import { rdb } from '../firebase/fire';
import { ref, set, get, child, update } from 'firebase/database';
import { toast } from 'react-toastify';

const CreateNewQRCodeModalButton = ({
  dbRef,
  url,
  isTesting,
  scrollTo,
  setIsSearchingFalse,
}) => {
  const orderNumberRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState('');

  const handleNewOrderNumberChange = (event) => {
    setNewOrderNumber(event.target.value);
  };

  const openModal = () => {
    setIsSearchingFalse();
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
  const handlePrintQRCodeButton = () => {
    const toPrint = true;
    checkOrderExists(toPrint);
  };
  const handleKeyDown = (event) => {
    if (event.repeat) {
      return;
    }
    if (event.key === 'Enter') {
      handlePrintQRCodeButton();
    }
  };
  const checkOrderExists = (toPrint) => {
    if (!newOrderNumber) {
      toast.error('Please enter order number');
      orderNumberRef.current.focus();
    } else {
      get(child(ref(rdb), `${dbRef}${newOrderNumber}`)).then((snapshot) => {
        if (snapshot.exists()) {
          toast.error(`Order #${newOrderNumber} already exists`);
          orderNumberRef.current.focus();
        } else printQRCode(toPrint);
      });
    }
  };

  const addData = () => {
    let time = new Date();
    if (!newOrderNumber) {
      toast.error('Please enter new order number');
    } else {
      set(ref(rdb, `${dbRef}${newOrderNumber}`), {
        location: '',
        // packer: '',
        note: '',
        hasPrinted: false,
        dateCreated:
          time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
        lastMoved:
          time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
        pickedUp: false,
        pickedUpDate: 'Not picked up',
      });
    }
  };

  const printQRCode = (toPrint) => {
    addData();
    closeModal();
    scrollTo(newOrderNumber);
    if (toPrint) {
      update(ref(rdb, `${dbRef}/${newOrderNumber}`), {
        hasPrinted: true,
      });
      window.open(`/printQR/${newOrderNumber}`, '_blank');
      toast.success(`Order #${newOrderNumber} created`);
    } else {
      toast.success(`Order #${newOrderNumber} created`);
    }
  };

  return (
    <>
      <button
        className='button'
        style={{ display: 'inline-block' }}
        onClick={openModal}
      >
        {isTesting ? 'Testing Create' : 'Create New QR Code'}
      </button>

      <Modal
        className='modal'
        overlayClassName='overlay'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        closeTimeoutMS={250}
      >
        <form
          className='createModal'
          onSubmit={(event) => event.preventDefault()}
        >
          <h2>Enter order number</h2>
          <input
            autoFocus
            ref={orderNumberRef}
            className='newOrderNumberInput'
            type={'text'}
            placeholder={'Order number'}
            onChange={handleNewOrderNumberChange}
            onKeyDown={handleKeyDown}
          />
          <QRCode value={`${url}/${newOrderNumber}`} />
          <div className='buttonsDiv'>
            <button
              title='Cancel Order'
              type='button'
              id='createQRcancelButton'
              className='cancelButton'
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              title='Create Order Only'
              type='button'
              id='createQRcreateButton'
              className='button'
              onClick={handleCreateButton}
            >
              Create Order
            </button>
            <button
              title='Create and Print QR'
              type='button'
              id='createQRprintButton'
              className='button'
              onClick={handlePrintQRCodeButton}
            >
              Print QR Code
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewQRCodeModalButton;
