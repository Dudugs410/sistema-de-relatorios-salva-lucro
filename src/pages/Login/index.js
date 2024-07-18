import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import salvaLucroLogo from '../../assets/logoSalvaLucro.png'
import './login.css'
import { useContext } from "react"
import LoadingModal from "../../components/LoadingModal"

///////////////////////////////////////////////////////////////

const Login = () => {
    const {
        loginApp,
        isSignedIn, 
    } = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if(isSignedIn === true){
            navigate('/Dashboard')
        }
    },[isSignedIn])

    async function handleLogin(e){
        e.preventDefault()
        
        setLoading(true)
        await loginApp(login, password)
        setLoading(false)
    }

    return(
        <div className='appPage'>
            <div className='body-login'> 
                <div className='bg-login'></div>
                <form type='submit' className='form-login' onSubmit={handleLogin}>
                 <img className='img-login' src={salvaLucroLogo} alt='logo salva lucro' />
                    <div className='input-container-login'>
                        <input id='login' className='input-login' type='text' placeholder='usuário' value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input id='senha' className='input-login' type='password' placeholder='senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <hr className='hr-global' />
                        { !loading ? <button type='submit' className='btn btn-primary'>Login</button> : <button type='submit' className='btn btn-primary' disabled>Login</button>}
                    </div>
                </form>
            </div>
            { loading ? <LoadingModal/> : <></>}
        </div>
   
    )
}

export default Login