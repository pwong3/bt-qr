import { useState } from 'react';
import TableRow from '../components/TableRow';
import CreateNewQRCodeModal from '../components/CreateQRCodeModal';
import { getOrders } from '../data/orders';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const data = getOrders();

  const handleSearchChangeAndFilter = (event) => {
    let value = event.target.value.toLowerCase();
    let result = data.filter((data) => data.orderNumber.includes(value));
    if (value) setIsSearching(true);
    else setIsSearching(false);
    setFilteredData(result);
  };

  return (
    <>
      <h1 className='title'>Prepacked Order Locations</h1>
      <nav>
        <Link to='/'>Home</Link>
      </nav>
      <main className='main'>
        <section>
          <input
            className='searchInput'
            type={'search'}
            placeholder='Search'
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
              data.map((order, key) => {
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
