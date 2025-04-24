import React from 'react';

import { PluggyConnect } from 'react-pluggy-connect';

const PluggyWidget = () => {
  const onSuccess = (itemData) => {
    // do something with the financial data
  };

  const onError = (error) => {
    // handle the error
  };

  return (
    <PluggyConnect
      connectToken={'your-connect-token-here'}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default PluggyWidget