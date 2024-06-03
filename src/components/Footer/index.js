/* eslint-disable react/react-in-jsx-scope */

import { useContext } from 'react'
import './footer.scss'
import { AuthContext } from '../../contexts/auth'

const Footer = () =>{
	const { isDarkTheme } = useContext(AuthContext)

	return(
		<>
			<div className='footer-main'>
				<div className='footer-container'>
					<div className='footer-content'>SalvaLucro 2023</div>
				</div>
			</div>
		</>
	)

}

export default Footer