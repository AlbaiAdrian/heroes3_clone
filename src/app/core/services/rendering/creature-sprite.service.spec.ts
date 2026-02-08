import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CreatureSpriteService } from './creature-sprite.service';
import { Faction } from '../../models/faction/faction.enum';
import { CreatureAttributeType } from '../../models/creature/creature-attribute-type.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';
import { ResourceType } from '../../models/player/resource-type.enum';


describe('CreatureSpriteService', () => {
  let service: CreatureSpriteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(CreatureSpriteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads sprites for available faction folders', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const originalImage = globalThis.Image;
    class TestImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        this.onload?.();
      }
    }
    Object.defineProperty(globalThis, 'Image', {
      value: TestImage,
      configurable: true,
      writable: true,
    });
    vi.spyOn(service, 'folderExists').mockImplementation((faction) =>
      of(faction === Faction.Castle)
    );

    try {
      service.loadSprites();

      const req = httpMock.expectOne('assets/data/creature/castle.json');
      expect(req.request.method).toBe('GET');
      req.flush([
        {
          code: 'pikeman',
          level: CreatureLevel.Level1,
          faction: Faction.Castle,
          name: 'Pikeman',
          attributes: [{ attributeType: CreatureAttributeType.Defense, value: 1 }],
          cost: [{ type: ResourceType.Gold, value: 60 }],
        },
      ]);

      expect(service.get(Faction.Castle, 'pikeman')).toBeDefined();
      expect(warnSpy).toHaveBeenCalledTimes(Object.values(Faction).length - 1);
    } finally {
      Object.defineProperty(globalThis, 'Image', {
        value: originalImage,
        configurable: true,
        writable: true,
      });
      warnSpy.mockRestore();
    }
  });
});
