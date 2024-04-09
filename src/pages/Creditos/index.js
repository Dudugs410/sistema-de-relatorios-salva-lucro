import './creditos.scss'
import { useContext, useEffect, useState } from 'react'
import TabelaCreditos from '../../components/Componente_TabelaCreditos'
import { AuthContext } from '../../contexts/auth'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'
import Cookies from 'js-cookie'
import { createContext } from 'react'
import { useLocation } from 'react-router-dom'
import BuscarClienteCreditos from '../../components/Componente_BuscarClienteCreditos'
import MyCalendar from '../../components/Componente_Calendario'

export const CreditosContext = createContext({})

const Creditos = () =>{
	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])

	const {
		creditos,
		tableData,
		isDarkTheme,
		detalhes,
		//
		dataBuscaCreditos, 
		dataInicialExibicaoCreditos,
		dataFinalExibicaoCreditos,
		handleDateChangeCreditos,
		arrayAdmCreditos,
	} = useContext(AuthContext)

	return(

			<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Créditos</h1>
						</div>
						<TotalModalidadesComp tipo = 'creditos'/>
						{ creditos.length > 0 ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='creditos'/> : <></> }
						<div className='component-container-vendas'>
							{ creditos.length > 0 ?  <TabelaCreditos array={creditos} /> : <MyCalendar dataInicialExibicao={dataInicialExibicaoCreditos} dataFinalExibicao={dataFinalExibicaoCreditos} dataBusca={dataBuscaCreditos} handleDateChange={handleDateChangeCreditos} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> }
							{ creditos.length > 0 ? <TabelaGenericaAdm Array={arrayAdmCreditos}/> : <></> }
							{ creditos.length > 0 ? <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> : <></> }
						</div>
						<BuscarClienteCreditos />
					</div>
				</div>
			</div>
	)
}

export default Creditos