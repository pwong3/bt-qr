import QRCode from 'react-qr-code';
import './PrintQR.css';
import { useLocation } from 'react-router-dom';

const url = 'www.besttilesf-qr.web.app';

const Layout = ({ orderNumber }) => {
  return (
    <>
      <span className='orderNumber'>Order #</span>
      <span className='order'>{orderNumber}</span>
      <QRCode
        className='qrCode'
        title={`${url}/${orderNumber}`}
        value={`${url}/${orderNumber}`}
        size={180}
      />
    </>
  );
};

const Order = () => {
  const { state } = useLocation();
  const { orderNumber } = state;
  return (
    <div className='main'>
      <Layout orderNumber={orderNumber} />
      <br />
      <br />
      <br />
      <br />
      <Layout orderNumber={orderNumber} />
    </div>
  );
};
export default Order;
