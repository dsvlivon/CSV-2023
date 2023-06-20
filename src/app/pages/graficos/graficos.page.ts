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
export class GraficosPage implements OnInit, AfterViewInit {

  @ViewChild('graficoBarras') graficoBarrasCanvas: ElementRef;

  encuestas: Array<any> = [];
  pipeChart: Chart;
  constructor(private firestoreSrv: FirestoreService) { }

  ngAfterViewInit(): void {
    this.generarGraficoBarras();
  }

  ngOnInit() {
    this.firestoreSrv.obtenerTodos('encuestasCliente').subscribe(data => {
      this.encuestas = data;
        console.log(data);
      /* data.forEach(element => {
        let data = element.payload.doc.data();
        this.encuestas.push(data);
        console.log(this.encuestas);
      }) */
    })
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

  generarGraficoBarras() {
    const ctx = this.graficoBarrasCanvas.nativeElement.getContext('2d');

    // Obtener los datos necesarios para el gráfico
    const etiquetas = this.encuestas.map(encuesta => encuesta.cliente);
    const datosRangoLimpieza = this.encuestas.map(encuesta => 
      console.log(encuesta));
      console.log(datosRangoLimpieza)
    const datosRangoSatisfecho = this.encuestas.map(encuesta => encuesta.rangoSatisfecho);

    // Crear el gráfico de barras
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Rango Limpieza',
            data: datosRangoLimpieza,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Rango Satisfecho',
            data: datosRangoSatisfecho,
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
