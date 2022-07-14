import { useState } from 'react';
import { rdb } from '../firebase/fire';
import { ref, update } from 'firebase/database';
import Modal from 'react-modal';
import UpdateLocation from '../Pages/UpdateLocation';
import { toast } from 'react-toastify';
import {
  MdOutlineDeleteForever,
  MdOutlineEdit,
  MdOutlinePrint,
  MdOutlinePrintDisabled,
  MdDone,
  MdDoneAll,
} from 'react-icons/md';

const TableRow = ({ order, index, dbRef, handleArchive }) => {
  const [pickedUpModalIsOpen, setPickedUpModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const hoverDateCreated = `Date created: ${order.dateCreated}`;
  const hoverLastMoved = `Last updated: ${order.lastMoved}`;
  const hoverPickedUpDate = `Picked up on: ${order.pickedUpDate}`;

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

  const openPickedUpModal = () => {
    setPickedUpModalIsOpen(true);
  };

  const closePickedUpModal = () => {
    setPickedUpModalIsOpen(false);
  };

  const notPickedUpOnClick = () => {
    closePickedUpModal();
    update(ref(rdb, `${dbRef}/${order.orderNumber}`), {
      pickedUp: false,
      pickedUpDate: 'Not picked up',
    });
  };
  const pickedUpOnClick = () => {
    const action = 'pickedUp';
    let time = new Date();
    closePickedUpModal();
    update(ref(rdb, `${dbRef}/${order.orderNumber}`), {
      pickedUpDate:
        time.toLocaleDateString() + ' - ' + time.toLocaleTimeString(),
    });
    handleArchive(action, order.orderNumber);
    toast.success(`Order # ${order.orderNumber} has been picked up.`);
  };

  const deleteOnClick = () => {
    const action = 'delete';
    closeDeleteModal();
    handleArchive(action, order.orderNumber);
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
        <td title={hoverDateCreated}>
          <span>{index + 1}</span>
        </td>
        <td id='tdNote' title={hoverLastMoved}>
          <span className='td'>{order.note ? order.note : '-'}</span>
        </td>
        <td title={hoverLastMoved}>
          <span className='td'>
            <span>{order.orderNumber}</span>
          </span>
        </td>
        <td title={hoverLastMoved}>
          <span className='td'>{order.location ? order.location : '-'}</span>
        </td>
        {/* <td title={hoverLastMoved}>
          <span className='td'>{order.packer ? order.packer : '-'}</span>
        </td> */}

        <td>
          <span className='td'>
            <button
              title='Update'
              type='button'
              className='updateButton'
              onClick={openUpdateModal}
            >
              <MdOutlineEdit size='1rem' />
            </button>
            <Modal
              className='modal'
              overlayClassName='overlay'
              isOpen={updateModalIsOpen}
              onRequestClose={closeUpdateModal}
              ariaHideApp={false}
              closeTimeoutMS={250}
            >
              <UpdateLocation
                orderTR={order.orderNumber}
                closeUpdateModal={closeUpdateModal}
              />
            </Modal>

            {order.hasPrinted ? (
              <button
                title='Reprint QR'
                type='button'
                className='updateButton'
                onClick={printOnClick}
              >
                <MdOutlinePrint size='1rem' />
              </button>
            ) : (
              <button
                title='Print QR'
                type='button'
                className='updateButton'
                onClick={printOnClick}
              >
                <MdOutlinePrintDisabled size='1rem' />
              </button>
            )}

            {order.pickedUp ? (
              <button
                title={hoverPickedUpDate}
                type='button'
                className='updateButton'
                onClick={openPickedUpModal}
              >
                <MdDoneAll size='1rem' />
              </button>
            ) : (
              <button
                title={hoverPickedUpDate}
                type='button'
                className='updateButton'
                onClick={openPickedUpModal}
              >
                <MdDone size='1rem' />
              </button>
            )}
            <Modal
              className='modal'
              overlayClassName='overlay'
              isOpen={pickedUpModalIsOpen}
              onRequestClose={closePickedUpModal}
              ariaHideApp={false}
              closeTimeoutMS={250}
            >
              <div className='deleteModal'>
                <div>
                  <h2>Order #{order.orderNumber} has been all picked up?</h2>
                  <span className='deleteModalButtons'>
                    <button
                      type='button'
                      className='cancelButton'
                      onClick={notPickedUpOnClick}
                    >
                      No
                    </button>
                    <button
                      type='button'
                      className='button'
                      onClick={pickedUpOnClick}
                    >
                      Yes
                    </button>
                  </span>
                </div>
              </div>
            </Modal>

            <button
              title='Delete'
              type='button'
              className='updateButton'
              onClick={openDeleteModal}
            >
              <MdOutlineDeleteForever size='1rem' />
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
