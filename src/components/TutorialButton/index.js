import { FiHelpCircle } from 'react-icons/fi'
import '../../styles/page.scss'

const TutorialButton = ({ onStart }) => (
  <button type='button' className='tutorial-button' onClick={onStart} aria-label='Abrir tutorial da página'>
    <FiHelpCircle className='tutorial-button__icon' aria-hidden='true' />
    <span className='tutorial-button__label'>Tutorial</span>
  </button>
)

export default TutorialButton
