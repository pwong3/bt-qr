import { useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import BTLogo from '../resource/BT_Logo.png';
import '../App.css';
import { useParams } from 'react-router-dom';

const Layout = ({ orderNumber, url }) => {
  return (
    <>
      <span className='order'>{orderNumber}</span>
      <QRCode
        className='qrCode'
        title={`${url}/${orderNumber}`}
        value={`${url}/${orderNumber}`}
        size={180}
        // logoImage={BTLogo}
        // logoWidth={60}
        // removeQrCodeBehindLogo={true}
      />
    </>
  );
};

const PrintQR = () => {
  const url = 'http://besttilesf-qr.web.app';
  let { orderNumber } = useParams();

  useEffect(() => {
    print();
  });

  const print = () => {
    window.print();
    // setTimeout(window.close);
  };

  return (
    <div className='printMain' onLoad={print}>
      <span className='orderNumber'>Pack Inside</span>
      <Layout orderNumber={orderNumber} url={url} />
      <br />
      <br />
      <br />
      <span className='orderNumber'>Packed Inside</span>
      <Layout orderNumber={orderNumber} url={url} />
    </div>
  );
};
export default PrintQR;
