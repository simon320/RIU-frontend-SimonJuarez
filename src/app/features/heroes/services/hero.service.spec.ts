import { signal } from '@angular/core';
import { HeroService } from './hero.service';
import { TestBed } from '@angular/core/testing';

import { Hero } from '../../../common/interfaces/hero.model';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  afterEach(() => {
    service['heroes'] = signal<Hero[]>([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all heroes', () => {
      const heroes = service.getAll()();
      expect(heroes.length).toBe(12);
    });
  });

  describe('getById', () => {
    it('should return the correct hero by id', () => {
      const hero = service.getById(2);
      expect(hero?.id).toBe(2);
      expect(hero?.name).toBe('Batman');
    });

    it('should return undefined for non-existent id', () => {
      const hero = service.getById(99);
      expect(hero).toBeUndefined();
    });
  });

  describe('searchByName', () => {
    it('should return heroes matching the search term', () => {
      const results = service.searchByName('man');
      expect(results.length).toBe(6);

      const results2 = service.searchByName('der');
      expect(results2.length).toBe(2);
    });

    it('should return empty array if no matches found', () => {
      const results = service.searchByName('asd');
      expect(results).toEqual([]);
    });

    it('should handle empty search term by returning all heroes', () => {
      const heroes = service.getAll()();
      const results = service.searchByName('');
      expect(results.length).toBe(heroes.length);
    });
  });

  describe('add', () => {
    it('should add a new hero', () => {
      const newHero: Hero = { id: Date.now(), name: 'Iron Man' };
      const initialCount = service.getAll()().length;
      
      service.add(newHero);
      
      const heroes = service.getAll()();
      expect(heroes.length).toBe(initialCount + 1);
    });
  });

  describe('update', () => {
    it('should update an existing hero', () => {
      const updatedHero: Hero = { id: 3, name: 'Wonder Woman Updated' };
      service.update(updatedHero);
      
      const hero = service.getById(3);
      expect(hero?.name).toBe('Wonder Woman Updated');
    });

    it('should not modify heroes if id does not exist', () => {
      const nonExistentHero: Hero = { id: 99, name: 'Non-existent' };
      const initialHeroes = service.getAll()();
      
      service.update(nonExistentHero);
      
      const heroes = service.getAll()();
      expect(heroes).toEqual(initialHeroes);
    });
  });

  describe('delete', () => {
    it('should remove the hero with the specified id', () => {
      const initialCount = service.getAll()().length;
      service.delete(2);
      
      const heroes = service.getAll()();
      expect(heroes.length).toBe(initialCount - 1);
      expect(heroes.find(h => h.id === 2)).toBeUndefined();
    });

    it('should not modify heroes if id does not exist', () => {
      const initialHeroes = service.getAll()();
      service.delete(99);
      
      const heroes = service.getAll()();
      expect(heroes).toEqual(initialHeroes);
    });
  });
});