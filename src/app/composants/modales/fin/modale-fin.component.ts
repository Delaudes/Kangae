import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-modale-fin',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle],
  templateUrl: './modale-fin.component.html',
  styleUrl: './modale-fin.component.scss'
})
export class ModaleFinComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
}

export interface DialogData {
  gagnant: string;
}
