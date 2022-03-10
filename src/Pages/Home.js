import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import CreateNewQRCodeModalButton from '../components/CreateQRCodeModalButton';
import { rdb } from '../firebase/fire';
import { ref, onValue, remove, child } from 'firebase/database';

const Home = () => {
  const isTesting = true;

  const dbRef = isTesting ? 'testingDB/' : 'PrepackedOrders/';
  const url = 'http://besttilesf-qr.web.app';

  const [RDBData, setRDBData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  // const [isPrintCheckbox, setIsPrintCheckbox] = useState(false);
  // const [isReprintCheckbox, setIsReprintCheckbox] = useState(false);

  useEffect(() => {
    const ordersRef = ref(rdb, dbRef);
    onValue(ordersRef, (snapshot) => {
      const orders = [];
      snapshot.forEach((snap) => {
        orders.push({
          orderNumber: snap.key,
          location: snap.val().location,
          packer: snap.val().packer,
          hasPrinted: snap.val().hasPrinted,
          lastMoved: snap.val().lastMoved,
        });
      });
      setRDBData(orders);
    });
  }, [dbRef]);

  useEffect(() => {
    document.body.addEventListener('keyup', onKeyUp);
    return () => {
      document.body.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // useEffect(() => {
  //   if (isPrintCheckbox) {
  //     let result = RDBData.filter((data) => data.hasPrinted.includes(false));
  //     setSearchedData(result);
  //   }
  // }, [RDBData, isPrintCheckbox]);
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
    setSearchedData(result);
  };
  const handleDelete = (orderNumber) => {
    remove(child(ref(rdb), `${dbRef}/${orderNumber}`));
    if (isSearching) {
      const newSearchedData = searchedData.filter(
        (data) => data.orderNumber !== orderNumber
      );
      setSearchedData(newSearchedData);
    }
  };
  // const handleIsPrintCheckbox = () => {
  //   setIsPrintCheckbox(!isPrintCheckbox);
  // };
  // const handleIsReprintCheckbox = () => {
  //   setIsReprintCheckbox(!isReprintCheckbox);
  // };
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
            <CreateNewQRCodeModalButton
              dbRef={dbRef}
              url={url}
              isTesting={isTesting}
            />
            {/* <span className='checkboxDiv'>
              <span className='checkboxSpan'>
                <input
                  type='checkbox'
                  id='print'
                  name='print'
                  onChange={handleIsPrintCheckbox}
                />
                <label htmlFor='print'>Print</label>
              </span>
              <span className='checkboxSpan'>
                <input
                  type='checkbox'
                  id='reprint'
                  name='reprint'
                  onChange={handleIsReprintCheckbox}
                />
                <label htmlFor='reprint'>Reprint</label>
              </span>
            </span> */}
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
                searchedData.length === 0 ? (
                  <tr>
                    <td>No results</td>
                    <td></td>
                  </tr>
                ) : (
                  searchedData.map((order, index) => {
                    return (
                      <TableRow
                        order={order}
                        key={index}
                        index={index}
                        dbRef={dbRef}
                        url={url}
                        handleDelete={handleDelete}
                      />
                    );
                  })
                )
              ) : (
                RDBData.map((order, index) => {
                  return (
                    <TableRow
                      order={order}
                      key={index}
                      index={index}
                      dbRef={dbRef}
                      url={url}
                      handleDelete={handleDelete}
                    />
                  );
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
