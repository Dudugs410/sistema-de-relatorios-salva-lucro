import { FiHelpCircle } from 'react-icons/fi'
import '../../styles/page.scss'

const TutorialButton = ({ onStart }) => (
  <button type='button' className='tutorial-button' onClick={onStart} aria-label='Abrir tutorial da página' title='Tutorial'>
    <FiHelpCircle />
  </button>
)

export default TutorialButton
