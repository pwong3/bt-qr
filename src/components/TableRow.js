import { useState } from 'react';
import { rdb } from '../firebase/fire';
import { remove, child, ref } from 'firebase/database';
import Modal from 'react-modal';
import UpdateLocation from '../Pages/UpdateLocation';

const TableRow = ({ order, index }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);

  const openDeleteModal = () => {
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const openUpdateModal = () => {
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
  };

  const deleteOnClick = () => {
    closeDeleteModal();
    remove(child(ref(rdb), `PrepackedOrders/${order.orderNumber}`));
    alert(`Order # ${order.orderNumber} deleted.`);
  };

  const printOnClick = () => {
    window.open(`/printQR/${order.orderNumber}`, '_blank');
  };
  return (
    <tr>
      <td>
        <span className='td'>
          <span>{index + 1}</span>
          <span>{order.orderNumber}</span>
        </span>
      </td>
      <td>
        <span className='td'>
          <span>
            {order.location} , {order.packer}
          </span>
        </span>
      </td>
      <td>
        <span className='td'>
          <button
            type='button'
            className='updateButton'
            onClick={openUpdateModal}
          >
            Update
          </button>
          <Modal
            className='modal'
            overlayClassName='overlay'
            isOpen={updateModalIsOpen}
            onRequestClose={closeUpdateModal}
            ariaHideApp={false}
          >
            <UpdateLocation orderTR={order.orderNumber} />
          </Modal>
          <button type='button' className='updateButton' onClick={printOnClick}>
            Print QR
          </button>
          <button
            type='button'
            className='updateButton'
            onClick={openDeleteModal}
          >
            Delete
          </button>
          <Modal
            className='modal'
            overlayClassName='overlay'
            isOpen={deleteModalIsOpen}
            onRequestClose={closeDeleteModal}
            ariaHideApp={false}
          >
            <div className='deleteModal'>
              <div>
                <h2>Delete order #{order.orderNumber}</h2>
                <span className='deleteModalButtons'>
                  <button
                    type='button'
                    className='button'
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='cancelButton'
                    onClick={deleteOnClick}
                  >
                    Delete
                  </button>
                </span>
              </div>
            </div>
          </Modal>
        </span>
      </td>
    </tr>
  );
};

export default TableRow;
