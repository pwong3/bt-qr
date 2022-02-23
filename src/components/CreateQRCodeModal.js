import { useState } from 'react';
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { db } from '../firebase/fire';
import { doc, setDoc } from 'firebase/firestore';

const CreateNewQRCodeModal = () => {
  const url = 'besttilesf-qr.web.app';
  let navigate = useNavigate();
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

  const printQRCode = async () => {
    await addData();
    setIsOpen(false);
    window.open(`/printQR/${orderNumber}`, '_blank');
  };

  const addData = async () => {
    try {
      await setDoc(doc(db, 'orders', orderNumber), {
        location: '',
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <>
      <button className='qrButton' onClick={openModal}>
        Create New QR Code
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        portalClassName='modal'
      >
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
            <button type='button' className='cancelButton' onClick={closeModal}>
              Cancel
            </button>
            <button type='button' className='printButton' onClick={printQRCode}>
              Print QR Code
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewQRCodeModal;
