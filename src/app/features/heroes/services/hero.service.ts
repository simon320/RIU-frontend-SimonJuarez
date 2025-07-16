import { Injectable, Signal, signal } from '@angular/core';
import { Hero } from '../../../common/interfaces/hero.model';
import { seedHeroes } from './seed-heroes';


@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroes = signal<Hero[]>(seedHeroes);


  public getAll(): Signal<Hero[]> {
    return this.heroes.asReadonly();
  }


  public getById(id: number): Hero | undefined {
    return this.heroes().find( hero => hero.id === id );
  }


  public searchByName(term: string): Hero[] {
    return this.heroes().filter(hero => hero.name.toLowerCase().includes( term.toLowerCase() ));
  }


  public add(hero: Hero): void {
    const newList = [ ...this.heroes(), hero ];
    this.heroes.set(newList);
  }


  public update(changedHero: Hero): void {
    const updated = this.heroes().map(hero => hero.id === changedHero.id ? changedHero : hero);
    this.heroes.set(updated);
  }


  public delete(id: number): void {
    const updated = this.heroes().filter(hero => hero.id !== id);
    this.heroes.set(updated);
  }
}
