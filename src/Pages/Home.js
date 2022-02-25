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

  const handleSearchChangeAndFilter = (event) => {
    let value = event.target.value;
    let result = RDBData.filter((data) => data.orderNumber.includes(value));
    if (value) setIsSearching(true);
    else setIsSearching(false);
    setFilteredData(result);
  };

  return (
    <>
      <h1 className='title'>Prepacked Order Locations</h1>
      <main className='main'>
        <section>
          <input
            className='searchInput'
            type={'search'}
            placeholder='Search orders'
            onChange={handleSearchChangeAndFilter}
          />
          <CreateNewQRCodeModal />
        </section>
        <table className='table'>
          <tbody>
            <tr>
              <th>Order</th>
              <th>Location</th>
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
      </main>
    </>
  );
};

export default Home;
