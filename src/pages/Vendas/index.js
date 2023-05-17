import './vendas.css'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import Cookies from 'js-cookie'

import { AuthContext } from '../../contexts/auth'
import api from '../../services/api'
import DisplayData from '../../components/DisplayData'
import BuscarClienteData from '../../components/BuscarClienteData'

const Vendas = () =>{

    let params = {
        cnpj: "03.953.552/0001-02",
        dataInicial: "2023-04-01",
        dataFinal: "2023-04-10"
      };
      
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://app.salvalucro.com.br/api/v1/vendas',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        params: params
      };
      
      useEffect(() => {
        api.get('vendas', config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
      });

    return(
        <div className='appPage'>
            <div className='page-content'>
                <BuscarClienteData/>
                <DisplayData/>
            </div>
        </div>
    )
}

export default Vendas