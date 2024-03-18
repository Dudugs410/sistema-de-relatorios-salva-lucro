import { useContext, useEffect } from "react";
import MyCalendar from "../../components/Componente_Calendario";
import ResizableComponent from "../../components/Componente_Resizable";
import { AuthContext } from "../../contexts/auth";
import './teste.scss'
const handleDateChange = () =>{
    console.log('man...')
}

const PageTeste = () => {

  const {isDarkTheme, loading, setLoading} = useContext(AuthContext)

  useEffect(()=>{
    setLoading(false)
  },[])

  const CompTeste = () => {
    return (
      <div className="child">
        <MyCalendar dataInicialExibicao={new Date()} dataFinalExibicao={new Date()} dataBusca={new Date()} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
      </div>
    );
  };

  return (
    <>
      <ResizableComponent width={100} height={100}>
        <CompTeste className='responsive' />
      </ResizableComponent>
    </>
  );
}

export default PageTeste;
