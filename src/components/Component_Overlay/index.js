import './overlay.scss'

const Overlay = ({ isVisible }) => {
    return isVisible ? <div className="overlay"></div> : null;
};

export default Overlay