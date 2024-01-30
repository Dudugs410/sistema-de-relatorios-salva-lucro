/* eslint-disable react/react-in-jsx-scope */

import { useContext } from 'react'
import './footer.scss'
import { AuthContext } from '../../contexts/auth'

const Footer = () =>{
	const { isDarkTheme } = useContext(AuthContext)

	return(
		<>
			<div className={`footer-main ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<div className={`footer-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className={`footer-content ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>SalvaLucro 2023</div>
				</div>
			</div>
		</>
	)

}

export default Footer