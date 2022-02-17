const orders = [
  { orderNumber: '12345', location: '1-1' },
  { orderNumber: '12654', location: '4-3' },
  { orderNumber: '11655', location: '5-7' },
  { orderNumber: '19812', location: '6-1' },
  { orderNumber: '18974', location: '2-11' },
  { orderNumber: '16579', location: '5-11' },
  { orderNumber: '19815', location: '5-5' },
  { orderNumber: '19872', location: '3-1' },
];

export const getOrders = () => {
  return orders;
};

export const getOrder = (orderNumber) => {
  return orders.find((order) => order.orderNumber === orderNumber);
};
