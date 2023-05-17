import { Pie } from "react-chartjs-2"
import { Chart, ArcElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement);

const options = {
    radius: "70%",
    plugins:{
        datalabels:{
            color: 'white',
            font:{
                size: '14px',
                weight: 'bold',
            }
        }
    }

  }

  export default function GraficoTorta({ data }){
    return(
        <Pie data={data} options={options} plugins={[ChartDataLabels]}/>
    )
  } 