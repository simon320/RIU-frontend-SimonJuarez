import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, computed, inject, signal, viewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { HeroService } from '../../services/hero.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ConfirmDialogComponent } from '../../../../common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule
  ]
})
export class HeroListComponent implements AfterViewInit {
  public paginator = viewChild<MatPaginator>(MatPaginator);
  private loadingService = inject(LoadingService);
  private heroService = inject(HeroService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  private pageSize = 5;
  private filter = signal('');
  private pageIndex = signal(0);
  public allHeroes = this.heroService.getAll();

  public filteredHeroes = computed(() => {
    const index = this.pageIndex();
    const term = this.filter().toLowerCase();
    const list = this.allHeroes();

    const filtered = term
      ? list.filter(hero => hero.name.toLowerCase().includes(term))
      : list;

    const start = index * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  });


  ngAfterViewInit(): void {
    console.log(this.allHeroes());
    
    this.paginator()!.page.subscribe((e) => {
      this.pageIndex.set(e.pageIndex);
    });
  }


  public handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
    this.pageIndex.set(0);
  }


  public onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }


  public deleteHero(id: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro que querés eliminar este héroe?' },
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        setTimeout(()=> {
          this.heroService.delete(id);
          this.openSnack('Héroe eliminado con éxito');
          this.loadingService.hide();
        }, 1500 );
      }
    });
  }


  private openSnack(message: string): void {
    this.snack.open(message, 'Cerrar', {
      duration: 2500,
    });
  }

}