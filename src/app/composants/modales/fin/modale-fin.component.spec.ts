import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleFinComponent } from './modale-fin.component';

describe('ModaleFinComponent', () => {
  let component: ModaleFinComponent;
  let fixture: ComponentFixture<ModaleFinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleFinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaleFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
