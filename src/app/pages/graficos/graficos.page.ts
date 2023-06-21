import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EncuestasCliente } from 'src/app/shared/encuestaCliente.interface';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerComponent]
})
export class GraficosPage implements OnInit {

  spinner = false;
  promedioLimpieza: Array<any> = [];
  promedioSatisfecho: Array<any> = [];
  rangoLimpiezaData: Array<any> = [];
  rangoSatisfechoData: Array<any> = [];
  encuestasClienteData: EncuestasCliente[] = [];

  graficoBarra = false;
  graficoTorta = false;
  graficoLinea = false;

  constructor(private afs: FirestoreService) {
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
    const a = this.afs.obtenerTodos('encuestasCliente').subscribe((data: EncuestasCliente[]) => {
      this.encuestasClienteData = data;
      this.rangoLimpiezaData = this.encuestasClienteData.map(encuesta => encuesta.rangoLimpieza);
      const sumaRangoLimpieza = this.rangoLimpiezaData.reduce((total, valor) => total + valor, 0);
      const promedioRangoLimpieza = sumaRangoLimpieza / this.encuestasClienteData.length;
      this.promedioLimpieza.push(promedioRangoLimpieza);

      this.rangoSatisfechoData = this.encuestasClienteData.map(encuesta => encuesta.rangoSatisfecho);
      const sumaRangoSatisfecho = this.rangoSatisfechoData.reduce((total, valor) => total + valor, 0);
      this.promedioSatisfecho.push(sumaRangoSatisfecho / this.encuestasClienteData.length);
      console.log(this.promedioLimpieza);
      a.unsubscribe();
    })
  }
  createBarChart() {

    this.spinner = true;
    this.graficoBarra = true;

    setTimeout(() => {
      const canvas = document.getElementById('barChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const labels = this.encuestasClienteData.map(encuesta => encuesta.cliente);

      this.spinner = false;
      const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Promedios', ...labels],
          datasets: [
            {
              label: 'Rango de Limpieza',
              data: [this.promedioLimpieza, ...this.rangoLimpiezaData],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Rango de Satisfacción',
              data: [this.promedioSatisfecho, ...this.rangoSatisfechoData],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }, 4000);

  }
  /* DANIEL */
  createTortaChart() {
    this.spinner = true;
    this.graficoTorta = true;

    setTimeout(() => {
      this.spinner = false;
      /* Insertar grafico aca */
    }, 4000);
  }

  /* IGNACIO */
  createLineChart() {
    this.spinner = true;
    this.graficoLinea = true;

    setTimeout(() => {
      this.spinner = false;
      /* Insertar grafico aca */
    }, 4000);
  }
  onCloseBarra() {
    this.graficoBarra = false;
  }
  onCloseTorta() {
    this.graficoTorta = false;
  }
  onCloseLinea() {
    this.graficoLinea = false;
  }

}
