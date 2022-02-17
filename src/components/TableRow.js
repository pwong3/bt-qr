import { useNavigate } from 'react-router-dom';

const TableRow = ({ order }) => {
  let navigate = useNavigate();

  const updateOnClick = () => {
    navigate(`${order.orderNumber}`, {
      state: { orderNumber: order.orderNumber, location: order.location },
    });
  };
  const reprintOnClick = () => {
    navigate(`/printQR/${order.orderNumber}`, {
      state: { orderNumber: order.orderNumber },
    });
  };
  return (
    <tr>
      <td>
        <span className='td'>
          <span>{order.orderNumber}</span>
          <button className='updateButton'>Delete</button>
        </span>
      </td>
      <td>
        <span className='td'>
          <span>{order.location}</span>
          <button className='updateButton' onClick={updateOnClick}>
            Update
          </button>
          <button className='updateButton' onClick={reprintOnClick}>
            Reprint
          </button>
        </span>
      </td>
    </tr>
  );
};

export default TableRow;
