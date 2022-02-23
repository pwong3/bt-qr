import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/fire';
import { doc, deleteDoc } from 'firebase/firestore';

const TableRow = ({ order }) => {
  let navigate = useNavigate();

  const deleteOnClick = async () => {
    await deleteDoc(doc(db, 'orders', order.orderNumber));
  };
  const updateOnClick = () => {
    navigate(`${order.orderNumber}`);
  };
  const printOnClick = () => {
    window.open(`/printQR/${order.orderNumber}`, '_blank');
  };
  return (
    <tr>
      <td>
        <span className='td'>
          <span>{order.orderNumber}</span>
          <button
            type='button'
            className='updateButton'
            onClick={deleteOnClick}
          >
            Delete
          </button>
        </span>
      </td>
      <td>
        <span className='td'>
          <span>{order.location}</span>
          <button
            type='button'
            className='updateButton'
            onClick={updateOnClick}
          >
            Update
          </button>
          <button type='button' className='updateButton' onClick={printOnClick}>
            Print QR Code
          </button>
        </span>
      </td>
    </tr>
  );
};

export default TableRow;
