import React, { useEffect, useState, Suspense, lazy, useContext } from 'react';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../contexts/auth.js';

export default function PageTeste() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  const { loadGrupos, carregou, setCarregou } = useContext(AuthContext);
  const [grupi, setGrupi] = useState([]);

  useEffect(() => {
    if (carregou === false) {
      const fetchData = async () => {
        try {
          const temp = await loadGrupos(); // Wait for the data to be fetched
          setGrupi(temp); // Set the fetched data
          setCarregou(true);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData(); // Call fetchData function when component mounts
    }
  }, []);

  useEffect(() => {
    if (grupi.length > 0) {
      Carregated();
    }
  }, [grupi]);

  const Carregated = () => {
    toast.success("Success Notification !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  function Loading() {
    return <p><i>Loading...</i></p>;
  }

  const lazyContainerTest = () =>{
    return(
      <div className='lazy-container'>
        <div className='lazy-list'>
          <div className='lazy-circle'>
          </div>
        </div>
      </div>
    )
  }

  const MarkdownPreview = lazy(() => import('../../components/Componente_LazyLoader/index.js'));

  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} grupi={grupi} />
        </Suspense>
      )}
    </>
  );
}
