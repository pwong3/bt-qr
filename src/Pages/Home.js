import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import CreateNewQRCodeModal from '../components/CreateQRCodeModal';
import { db } from '../firebase/fire';
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Home = () => {
  const [FSData, setFSData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, 'orders'), (snapshot) =>
      setFSData(
        snapshot.docs.map((doc) => ({ ...doc.data(), orderNumber: doc.id }))
      )
    );
  }, [FSData]);

  const handleSearchChangeAndFilter = (event) => {
    let value = event.target.value;
    let result = FSData.filter((data) => data.orderNumber.includes(value));
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
                filteredData.map((order, key) => {
                  return <TableRow order={order} key={key} />;
                })
              )
            ) : (
              FSData.map((order, key) => {
                return <TableRow order={order} key={key} />;
              })
            )}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default Home;
