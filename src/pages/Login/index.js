import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import Cookies from "js-cookie"
import salvaLucroLogo from '../../assets/logoSalvaLucro.png'
import './login.css'
import { useContext } from "react"
import LoadingModal from "../../components/LoadingModal"
import api from "../../services/api"
import md5 from "md5"

///////////////////////////////////////////////////////////////

const Login = () => {
    const {submitLogin, loading, isSignedIn, accessToken, setAccessToken, submitFake,
    setCnpj, setTeste, setRefreshToken, setIsDarkTheme, setIsSignedIn, loadGrupos, grupos, setLoading } = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    useEffect(()=>{
        sessionStorage.clear()
        //localStorage.clear()
        Cookies.remove('cnpj')
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        Cookies.remove('userID')
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

    async function handleTeste(e){
        e.preventDefault()
        submitFake()
    }

    useEffect(()=>{
        console.log('accessToken: ', accessToken)

    },[accessToken])

    return(
        <div className='appPage'>
            <div className='body-login'> 
                <div className='bg-login'></div>
                <form type='submit' className='form-login' onSubmit={handleLogin}>
                 <img className='img-login' src={salvaLucroLogo} alt='logo salva lucro' />
                    <div className='input-container'>
                        <input id='login' className='input-login' type='text' placeholder='usuário' value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input id='senha' className='input-login' type='password' placeholder='senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <hr/>
                        { !loading ? <button type='submit' className='btn btn-primary'>Login</button> : <button type='submit' className='btn btn-primary' disabled>Carregando...</button>}
                        <Link className='pw'>esqueci minha senha</Link>
                        <button className='btn btn-secondary' onClick={handleTeste}>Login Teste</button>
                    </div>
                </form>
            </div>

            { loading ? <LoadingModal/> : <></>}
        </div>
   
    )
}

export default Login