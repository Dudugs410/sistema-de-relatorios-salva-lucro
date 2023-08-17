import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import Cookies from "js-cookie"

import salvaLucroLogo from '../../assets/salva-lucro-logo.jpg'

import './login.css'
import { useContext } from "react"
import LoadingModal from "../../components/LoadingModal"

const Login = () => {
    const {submitLogin, loading, isSignedIn, setAccessToken, submitFake} = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    useEffect(()=>{
        sessionStorage.setItem('cnpj', '')
    },[])

    useEffect(()=>{
        if(isSignedIn){
            navigate('/Dashboard')
        }
    },[isSignedIn, navigate])

    async function handleLogin(e){
        e.preventDefault()

        if(login !== '' && password !== ''){
            await submitLogin(login, password)
            .then(()=>{
                setAccessToken(Cookies.get('token'))
            })
        }
    }

    return(
        <div className='appPage'>
            <div className='body-login'>  
                <div className='bg-login'></div>
                <form type='submit' className='form-login' onSubmit={handleLogin}>
                    <div className='input-container'>
                    <img className='img-login' src={salvaLucroLogo} alt='logo salva lucro' />
                        <input id='login' className='input-login' type='text' placeholder='usuário' value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input id='senha' className='input-login' type='password' placeholder='senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <hr/>
                        { !loading ? <button type='submit' className='btn btn-primary'>Login</button> : <button type='submit' className='btn btn-primary' disabled>Carregando...</button>}
                        <Link className='pw'>esqueci minha senha</Link>
                    </div>
                    <button className='btn btn-secondary' onClick={submitFake}>Login Teste</button>
                </form>
            </div>
            
            { loading ? <LoadingModal/> : <></>}
        </div>

        
    )
}

export default Login