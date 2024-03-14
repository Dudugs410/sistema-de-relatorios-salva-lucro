import { useContext, useEffect } from "react";
import MyCalendar from "../../components/Componente_Calendario";
import ResizableComponent from "../../components/Componente_Resizeable";
import { AuthContext } from "../../contexts/auth";

const handleDateChange = () =>{
    console.log('man...')
}

const PageTeste = () => {

  const {isDarkTheme, loading, setLoading} = useContext(AuthContext)

  useEffect(()=>{
    setLoading(true)
  },[])

  useEffect(()=>{
    console.log(loading)

  },[loading])

  const compTeste = () => {
    return (
      <div className="child">
        <MyCalendar dataInicialExibicao={new Date()} dataFinalExibicao={new Date()} dataBusca={new Date()} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
      </div>
    );
  };

  return (
    <>
      <ResizableComponent width={100} height={100} child={compTeste()} />
    </>
  );
}

export default PageTeste;
