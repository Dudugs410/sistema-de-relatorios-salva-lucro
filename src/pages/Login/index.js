import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import salvaLucroLogo from '../../assets/logoSalvaLucro.png'
import sifraLogo from '../../assets/logoSifra.png'
import mgLogo from '../../assets/logoMG.png'
import './login.css'
import { useContext } from "react"
import LoadingModal from "../../components/LoadingModal"
import ContextSelector from "../../components/ContextSelector"

const Login = () => {
    const {
        loginApp,
        isSignedIn,
        setIsSignedIn,
    } = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentLogo, setCurrentLogo] = useState(salvaLucroLogo)

    // Function to get logo based on context
    const getLogoByContext = () => {
        const context = localStorage.getItem('selectedContext') || 'SL';
        switch(context) {
            case 'Sifra':
                return sifraLogo;
            case 'MG':
                return mgLogo;
            case 'SL':
            default:
                return salvaLucroLogo;
        }
    }

    // Listen for context changes
    useEffect(() => {
        const handleContextChange = () => {
            setCurrentLogo(getLogoByContext());
        };

        window.addEventListener('contextChange', handleContextChange);
        
        // Set initial logo
        setCurrentLogo(getLogoByContext());

        return () => {
            window.removeEventListener('contextChange', handleContextChange);
        };
    }, []);

    useEffect(()=>{
        if(localStorage.getItem('isSignedIn')){
            setIsSignedIn(JSON.parse(localStorage.getItem('isSignedIn')))
        }
    },[])

    useEffect(()=>{
        if(isSignedIn === true){
            const path = localStorage.getItem('currentPath')
            if(path !== '/'){
                navigate(`/${path}`)
            }
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
            <ContextSelector/>
            <div className='body-login'> 
                <div className='bg-login'></div>
                <form type='submit' className='form-login' onSubmit={handleLogin}>
                 <img className='img-login' src={currentLogo} alt='logo' />
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