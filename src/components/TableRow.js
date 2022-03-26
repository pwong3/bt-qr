import { useState } from 'react';
import { rdb } from '../firebase/fire';
import { ref, update } from 'firebase/database';
import Modal from 'react-modal';
import UpdateLocation from '../Pages/UpdateLocation';
import { toast } from 'react-toastify';

const TableRow = ({ order, index, dbRef, handleDelete }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const hoverTitle = `Last updated: ${order.lastMoved}`;

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
    handleDelete(order.orderNumber);
    toast.success(`Order # ${order.orderNumber} deleted.`);
  };

  const printOnClick = () => {
    update(ref(rdb, `${dbRef}/${order.orderNumber}`), {
      hasPrinted: true,
    });
    window.open(`/printQR/${order.orderNumber}`, '_blank');
  };
  return (
    <>
      <tr id={order.orderNumber}>
        <td>
          <span>{index + 1}</span>
        </td>
        <td id='tdNote' title={hoverTitle}>
          <span className='td'>{order.note ? order.note : '-'}</span>
        </td>
        <td title={hoverTitle}>
          <span className='td'>
            <span>{order.orderNumber}</span>
          </span>
        </td>
        <td title={hoverTitle}>
          <span className='td'>{order.location ? order.location : '-'}</span>
        </td>
        <td title={hoverTitle}>
          <span className='td'>{order.packer ? order.packer : '-'}</span>
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
              closeTimeoutMS={250}
            >
              <UpdateLocation orderTR={order.orderNumber} />
            </Modal>
            <button
              type='button'
              className='updateButton'
              onClick={printOnClick}
            >
              {order.hasPrinted ? 'Reprint QR' : 'Print QR'}
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
              closeTimeoutMS={250}
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
    </>
  );
};

export default TableRow;
