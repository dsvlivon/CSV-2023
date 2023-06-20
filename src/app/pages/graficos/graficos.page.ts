import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EncuestasCliente } from 'src/app/shared/encuestaCliente.interface';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GraficosPage implements OnInit {


  encuestasClientes: Array<any> = [];
  pipeChart: Chart;
  constructor(private firestoreSrv: FirestoreService) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );

    Chart.register(...registerables);


  }


  ngOnInit() {
    const a = this.firestoreSrv.obtenerTodos('encuestasCliente').subscribe(data => {
      console.log(data);
      this.encuestasClientes = data;

    })

  }

  generarGraficoBarras() {

    const ctx = (<any>document.getElementById('pipeChart')).getContext('2d');
    const rangoLimpiezaData = this.encuestasClientes.map(encuesta => encuesta.rangoLimpieza);
    const rangoSatisfechoData = this.encuestasClientes.map(encuesta => encuesta.rangoSatisfecho);
    console.log(rangoSatisfechoData);
    // Obtener las etiquetas para el eje X (por ejemplo, los nombres de los clientes)
    const labels = this.encuestasClientes.map(encuesta => encuesta.cliente);
    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#92949c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];
    this.pipeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Rango Limpieza',
            data: rangoLimpiezaData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
              label: 'Rango Satisfecho',
              data: rangoSatisfechoData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
