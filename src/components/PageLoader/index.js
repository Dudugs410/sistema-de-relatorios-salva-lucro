import './pageLoader.scss'

const PageLoader = ({ message = 'Carregando...', fullScreen = true }) => (
  <div className={`page-loader${fullScreen ? ' page-loader--full' : ''}`} role='status' aria-live='polite'>
    <div className='page-loader__spinner' aria-hidden='true' />
    <p className='page-loader__message'>{message}</p>
  </div>
)

export default PageLoader
