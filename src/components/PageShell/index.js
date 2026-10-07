import '../../styles/page.scss'

const PageShell = ({ title, children, className = '', tour }) => (
  <div className={`page ${className}`.trim()}>
    <div className='page__title-bar'>
      <h1 className='page__title'>{title}</h1>
    </div>
    <hr className='hr-global'/>
    <div className='page__body' data-tour={tour}>{children}</div>
  </div>
)

export default PageShell
