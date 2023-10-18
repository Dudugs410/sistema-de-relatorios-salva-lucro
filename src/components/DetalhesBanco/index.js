import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { bancosStatic } from "../../contexts/static";

import './detalhesBanco.scss';

const DetalhesBanco = ({ array }) => {
    const { setVendas, setCnpj, teste } = useContext(AuthContext);
    
    useEffect(() => {
        console.log(array);
        if (teste === true) {
            setVendas(bancosStatic);
            setCnpj('000000000000');
        }
    }, []);

    return (
        <div className='window-modal-banco'>
            <div className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className="table table-striped det-table">
                        <thead>
                            <tr className='det-tr-top'>
                                <th className='det-th' scope="col">Banco</th>
                                <th className='det-th' scope="col">Conta</th>
                                <th className='det-th' scope="col">Data Prevista</th>
                                <th className='det-th' scope="col">Valor Bruto</th>
                                <th className='det-th' scope="col">Valor Líquido</th>
                                <th className='det-th' scope="col">Valor Taxa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {array.length > 0 &&
                                array.map((innerArray, index) => (
                                    <React.Fragment key={index}>
                                        {innerArray.map((banco, innerIndex) => (
                                            <tr key={innerIndex} className='det-tr'>
                                                <td className='det-td-vendas' data-label="Banco">{banco.Banco}</td>
                                                <td className='det-td-vendas' data-label="Conta">{banco.Conta}</td>
                                                <td className='det-td-vendas' data-label="Data Prevista">{banco.DataPrevista}</td>
                                                <td className='det-td-vendas' data-label="Valor Bruto">R$<span className='green'>{banco.ValorBruto}</span></td>
                                                <td className='det-td-vendas' data-label="Valor Líquido">R$<span className='green'>{banco.ValorLiquido}</span></td>
                                                <td className='det-td-vendas' data-label="Valor Taxa">R$ <span className='red'>{banco.ValorTaxa}</span></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DetalhesBanco;