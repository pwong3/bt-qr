import { useLocation } from 'react-router-dom';

const UpdateLocation = () => {
  const { state } = useLocation();
  const { orderNumber, location } = state;
  return (
    <>
      <h1>Order # {orderNumber}</h1>
      <h1>Current Location</h1>
      <p>{location}</p>
      <h1>Enter new location</h1>
      <input></input>
      <button>Update</button>
    </>
  );
};

export default UpdateLocation;
