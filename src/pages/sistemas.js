import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import SistemasEnfermedades from '../components/Sistemas';

const Sistemas = React.memo(() => {
  console.log('Sistenas');
  return (
    <BasicLayout>
      <SistemasEnfermedades />
    </BasicLayout>
  );
});
export default Sistemas;
