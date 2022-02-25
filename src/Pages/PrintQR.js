import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import './PrintQR.css';
import { useParams } from 'react-router-dom';

const url = 'besttilesf-qr.web.app';

const Layout = ({ orderNumber }) => {
  return (
    <>
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
  let { orderNumber } = useParams();

  useEffect(() => {
    print();
  });

  const print = () => {
    window.print();
  };

  return (
    <div className='main' onLoad={print}>
      <span className='orderNumber'>Pack Inside</span>
      <Layout orderNumber={orderNumber} />
      <br />
      <br />
      <br />
      <br />
      <span className='orderNumber'>Order #</span>
      <Layout orderNumber={orderNumber} />
    </div>
  );
};
export default Order;
