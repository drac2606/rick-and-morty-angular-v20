import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subject, debounceTime, distinctUntilChanged, takeUntil, filter, tap } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  private api = inject(Api);
  public characters = this.api.characters;

  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  public hasCharacters = computed(() => this.characters().length > 0);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadInitialCharacters();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      tap(() => {
        this.loading = true;
        this.errorMessage = '';
      }),
      filter(term => term.trim().length > 0 || term === ''),
    ).subscribe(term => {
      if (term.trim() === '') {
        this.loadInitialCharacters();
      } else {
        this.api.searchCharacters(term)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {},
            error: () => {
              this.errorMessage = 'No se encontraron personajes con ese término de búsqueda.';
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.getCharacters()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {},
        error: () => {
          this.errorMessage = 'Error al cargar los personajes.';
        }
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onSearchKeyup(event: KeyboardEvent): void {
    this.searchSubject.next(this.searchTerm);
  }
}