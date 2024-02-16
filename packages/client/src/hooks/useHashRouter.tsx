import React, { useEffect, useState } from "react";

const useHashRouter = ():[string, React.Dispatch<React.SetStateAction<string>>] => {
  const [hash, setHash] = useState<string>(window.location.hash);

  const handleHashChange = () => {
   setHash(window.location.hash);
  }

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return [ hash, setHash ];
}

export default useHashRouter;