import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { FiMenu } from "react-icons/fi";
import '../Header/header.scss'
import { Link } from "react-router-dom";



const SideBar = ({ options }) =>{
    const { isDarkTheme } = useContext(AuthContext)

    useEffect(() => {
        function handleClickOutside(event) {
            const sidebarButton = document.querySelector('.side-bar-container .btn-primary');
            const collapseElement = document.getElementById('multiCollapseExample1');
            
            // Check if click occurred outside the collapsed sidebar and the sidebar button is not clicked
            if (collapseElement && !collapseElement.contains(event.target) && event.target !== sidebarButton) {
                const collapse = bootstrap.Collapse.getInstance(collapseElement);
                if (collapse && !collapse._isTransitioning) {
                    collapse.hide();
                }
            }
        }

        // Add event listener to detect clicks on document body
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            // Remove event listener when component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
            <div className='side-bar-container'>
                <p className='p-side-bar'>
                    <a className={`btn btn-primary btn-global a-side-bar ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} data-bs-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><FiMenu size={30}/></a>
                </p>
                <div>
                    <div>
                        <div className="collapse multi-collapse" id="multiCollapseExample1">
                            <div>
                                <ul className={`mobile ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                    {options.map((option, index) => (
                                        <li className="li-sidebar" key={index}>
                                            {option.children ? (
                                                <div className="dropend">
                                                    <button className={`px-2 me-1 btn-mobile dropdown-toggle ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} type="button" id={`dropdownMenuButton${index}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        {option.icone && React.createElement(option.icone)}
                                                        <span className="mb-auto mobile">{option.nome}</span>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-mobile" aria-labelledby={`dropdownMenuButton${index}`} style={{left: 'auto', right: 0}}>
                                                        {option.children.map((childOption, childIndex) => (
                                                            <li className='li-side-bar' key={childIndex}>
                                                                <Link to={childOption.rota} className={`dropdown-item ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                                                    <button className={`px-2 btn-mobile ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                                        {childOption.icone && React.createElement(childOption.icone)}
                                                                        <span className="mb-auto mobile">{childOption.nome}</span>
                                                                    </button>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <Link to={option.rota} className="nav-hover active text-shadow">
                                                    <button className={`px-2 me-1 btn-mobile ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                        {option.icone && React.createElement(option.icone)}
                                                        <span className="mb-auto mobile">{option.nome}</span>
                                                    </button>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default SideBar