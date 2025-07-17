import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HeroService } from '../../services/hero.service';
import { HeroFormComponent } from './hero-form.component';
import { Hero } from '../../../../common/interfaces/hero.model';

describe('HeroFormComponent', () => {
    let fixture: ComponentFixture<HeroFormComponent>;
    let component: HeroFormComponent;

    let heroServiceMock: jasmine.SpyObj<HeroService>;
    let routerMock: jasmine.SpyObj<Router>;
    let snackBarMock: jasmine.SpyObj<MatSnackBar>;

    const mockHero: Hero = { id: 123, name: 'Black Widow', power: 'Espionaje' };

    beforeEach(async () => {
        heroServiceMock = jasmine.createSpyObj('HeroService', ['getById', 'add', 'update']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);
        snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [
                HeroFormComponent,
                NoopAnimationsModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: HeroService, useValue: heroServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => null
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeroFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form in create mode', () => {
        expect(component.heroForm).toBeTruthy();
        expect(component.heroForm.get('name')?.value).toBe('');
        expect(component.isEditMode()).toBeFalse();
    });

    it('should add a new hero and redirect when form is valid', () => {
        component.heroForm.setValue({ id: 111, name: 'Thor', power: 'Rayo' });
        component.submitForm();

        expect(heroServiceMock.add).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Thor' }));
        expect(snackBarMock.open).toHaveBeenCalledWith('Héroe creado con éxito', 'Cerrar', { duration: 2500 });
        expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
    });

    it('should patch form and update hero in edit mode', () => {
        const route = TestBed.inject(ActivatedRoute);
        spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');
        heroServiceMock.getById.and.returnValue(mockHero);

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.heroForm.get('name')?.value).toBe('Black Widow');
        expect(component.isEditMode()).toBeTrue();

        component.submitForm();

        expect(heroServiceMock.update).toHaveBeenCalledWith(mockHero);
        expect(snackBarMock.open).toHaveBeenCalledWith('Héroe actualizado con éxito', 'Cerrar', { duration: 2500 });
        expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
    });

    it('should redirect to list when not finding a hero with that id', () => {
        const route = TestBed.inject(ActivatedRoute);
        spyOn(route.snapshot.paramMap, 'get').and.returnValue('1234');
        heroServiceMock.getById.and.returnValue(undefined);

        component.ngOnInit();
        fixture.detectChanges();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
    });

    it('should mark form as invalid when name is empty', () => {
        component.heroForm.setValue({ id: 1, name: '', power: '' });
        expect(component.heroForm.invalid).toBeTrue();
        expect(component.heroForm.get('name')?.hasError('required')).toBeTrue();
    });

    it('should mark form as invalid when name is too short', () => {
        component.heroForm.setValue({ id: 1, name: 'A', power: '' });
        expect(component.heroForm.invalid).toBeTrue();
        expect(component.heroForm.get('name')?.hasError('minlength')).toBeTrue();
    });

    it('should mark form as valid with correct data', () => {
        component.heroForm.setValue({ id: 1, name: 'Thor', power: 'Rayo' });
        expect(component.heroForm.valid).toBeTrue();
    });

    it('should navigate back on cancel()', () => {
        component.cancel();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
    });
});
