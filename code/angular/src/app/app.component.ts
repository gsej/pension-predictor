import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Model1ContainerComponent } from './model1/components/model1-container/model1-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Model1ContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pension-predictor';





   public changeModel(event: any) {
    console.log("model changed to " + event.target.value);
   }





}
