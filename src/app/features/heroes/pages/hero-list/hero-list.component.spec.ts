import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DebugElement, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { routes } from '../../../../app.routes';
import { HeroService } from '../../services/hero.service';
import { HeroListComponent } from './hero-list.component';
import { Hero } from '../../../../common/interfaces/hero.model';

describe('HeroListComponent', () => {
    let fixture: ComponentFixture<HeroListComponent>;
    let component: HeroListComponent;
    let heroServiceMock: jasmine.SpyObj<HeroService>;
    let snackBarMock: jasmine.SpyObj<MatSnackBar>;
    let dialogMock: jasmine.SpyObj<MatDialog>;

    const mockHeroes: Hero[] = [
        { id: 1, name: 'Superman' },
        { id: 2, name: 'Spiderman' },
        { id: 3, name: 'Batman' },
    ];

    beforeEach(async () => {
        heroServiceMock = jasmine.createSpyObj('HeroService', ['getAll', 'delete']);
        snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
        dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

        heroServiceMock.getAll.and.returnValue(signal(mockHeroes));

        dialogMock.open.and.returnValue({
            afterClosed: () => of(true)
        } as MatDialogRef<any>);

        await TestBed.configureTestingModule({
            imports: [
                HeroListComponent,
                NoopAnimationsModule,
            ],
            providers: [
                provideRouter(routes),
                { provide: HeroService, useValue: heroServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: MatDialog, useValue: dialogMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeroListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should filter heroes by name when typing', () => {
        component.handleInput({ target: { value: 'er' } } as any);
        fixture.detectChanges();

        const filtered = component.filteredHeroes();
        expect(filtered.length).toBe(2);
        expect(filtered.some(h => h.name === 'Batman')).toBeFalse();
    });

    it('should delete a hero and show snackbar when confirmed', fakeAsync(() => {
        const heroIdToDelete = 2;

        component.deleteHero(heroIdToDelete);
        fixture.detectChanges();

        tick(1500);
        expect(heroServiceMock.delete).toHaveBeenCalledWith(heroIdToDelete);
        expect(snackBarMock.open).toHaveBeenCalledWith('Héroe eliminado con éxito', 'Cerrar', {
            duration: 2500
        });
    }));

    it('should update the page index when page changes', () => {
        expect(component['pageIndex']()).toBe(0);

        component.onPageChange({ pageIndex: 2 } as PageEvent);

        expect(component['pageIndex']()).toBe(2);
    });

    it('should set pageIndex when paginator emits a page event', () => {
        const paginatorDebug: DebugElement = fixture.debugElement.query(By.directive(MatPaginator));
        const paginator: MatPaginator = paginatorDebug.componentInstance;

        component.ngAfterViewInit();

        paginator.page.emit({ pageIndex: 3 } as PageEvent);
        fixture.detectChanges();

        expect(component['pageIndex']()).toBe(3);
    });
});
