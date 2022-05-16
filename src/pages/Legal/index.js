import React from 'react';
import { useParams } from 'react-router-dom';
import UpmeTerm from './UpmeTerms';
import UpmePolicy from './Upmepolicy';

function LegalPage() {
  const { page } = useParams();
  
  return (
    <>
    {page === 'terms' && <UpmeTerm />}
    {page === 'privacy-policy' && <UpmePolicy />}
    </>
  )
}

export default LegalPage;
