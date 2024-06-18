import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrecoutraisonComponent } from './centrecoutraison.component';

describe('CentrecoutraisonComponent', () => {
  let component: CentrecoutraisonComponent;
  let fixture: ComponentFixture<CentrecoutraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrecoutraisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentrecoutraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
