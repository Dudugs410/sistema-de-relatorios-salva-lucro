import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"

import './login.css'
import { useContext } from "react"

const Login = () => {
    const {submitLogin, loading, isSignedIn, accessToken} = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    useEffect(()=>{
        if(isSignedIn){
            navigate('/Dashboard')
        }
    },[isSignedIn, navigate])

    async function handleLogin(e){
        e.preventDefault()

        if(login !== '' && password !== ''){
            await submitLogin(login, password)
        }
    }

    return(
        <div className='appPage'>
            <div className='body-login'>  
                <div className='bg-login'>
                </div>
                <form type='submit' className='form-login' onSubmit={handleLogin}>
                    <h1 className='titulo-login'>LOGIN</h1>
                    <div className='input-container'>
                        <input className='input-login' type='text' placeholder='usuário' value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input className='input-login' type='password' placeholder='senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <hr/>
                        { !loading ? <button type='submit' className='btn btn-primary'>Login</button> : <button type='submit' className='btn btn-primary' disabled>Carregando...</button>}
                        <Link className='pw'>esqueci minha senha</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login