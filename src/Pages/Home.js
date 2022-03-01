import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import CreateNewQRCodeModal from '../components/CreateQRCodeModal';
import { rdb } from '../firebase/fire';
import { ref, onValue } from 'firebase/database';

const Home = () => {
  const [RDBData, setRDBData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const ordersRef = ref(rdb, 'PrepackedOrders/');
    onValue(ordersRef, (snapshot) => {
      const orders = [];
      snapshot.forEach((snap) => {
        orders.push({
          orderNumber: snap.key,
          location: snap.val().location,
          packer: snap.val().packer,
        });
      });
      setRDBData(orders);
    });
  }, []);
  useEffect(() => {
    document.body.addEventListener('keyup', onKeyUp);
    return () => {
      document.body.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const onKeyUp = (event) => {
    if (event.key === '/') {
      document.getElementById('searchInput').focus();
    }
  };
  const handleSearchChangeAndFilter = (event) => {
    let value = event.target.value;
    let result = RDBData.filter((data) => data.orderNumber.includes(value));
    if (value) setIsSearching(true);
    else setIsSearching(false);
    setFilteredData(result);
  };

  return (
    <>
      <main className='main'>
        <div className='header'>
          <h1 className='title'>Prepacked Order Locations</h1>
          <section>
            <input
              id='searchInput'
              className='searchInput'
              type={'search'}
              placeholder='Search orders'
              onChange={handleSearchChangeAndFilter}
            />
            <CreateNewQRCodeModal />
          </section>
        </div>
        <div className='body'>
          <table>
            <tbody>
              <tr>
                <th>Order</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
              {isSearching ? (
                filteredData.length === 0 ? (
                  <tr>
                    <td>No results</td>
                    <td></td>
                  </tr>
                ) : (
                  filteredData.map((order, index) => {
                    return <TableRow order={order} key={index} index={index} />;
                  })
                )
              ) : (
                RDBData.map((order, index) => {
                  return <TableRow order={order} key={index} index={index} />;
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Home;
