export default {
  transaction: {
    verify: (ref: string): Promise<any> => {
      return new Promise(res => {
        setTimeout(() => {
          const result = {
            status: true,
            message: 'Verification successful',
            data: {
              amount: 27000,
              currency: 'NGN',
              transaction_date: '2016-10-01T11:03:09.000Z',
              status: 'success',
              reference: ref,
              domain: 'test',
              metadata: 0,
              gateway_response: 'Successful',
              message: null,
              channel: 'card',
              ip_address: '41.1.25.1',
            },
          };
          res(result);
        }, 100);
      });
    },
  },
};
