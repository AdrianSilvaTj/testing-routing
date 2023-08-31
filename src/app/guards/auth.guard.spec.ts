import { AuthService } from './../services/auth.service';
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from "./auth.guard"
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { fakeRouterStateSnapshot, fakeActivatedRouteSnapshot, mockObservable, fakeParamMap } from 'src/testing';
import { generateOneUser } from '../models/user.mock';

describe('Tests for AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
  })

  it('should be create', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true with session', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1212'
      // },
      paramMap: fakeParamMap({
        idProduct: '1212'
      })
    });
    const routerState = fakeRouterStateSnapshot({});

    const userMock = generateOneUser();
    authService.getUser.and.returnValues(mockObservable(userMock));

    guard.canActivate(activatedRoute, routerState)
    .subscribe(rta => {
      expect(rta).toBeTrue();
      doneFn();
    })
  });

  it('should return true without session', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1212'
      // },
      paramMap: fakeParamMap({
        idProduct: '1212'
      })
    });
    const routerState = fakeRouterStateSnapshot({});

    const userMock = generateOneUser();
    authService.getUser.and.returnValues(mockObservable(null));

    guard.canActivate(activatedRoute, routerState)
    .subscribe(rta => {
      expect(rta).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      doneFn();
    })
  });

  it('should false with idProduct Params', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1212'
      // },
      paramMap: fakeParamMap({
        idProduct: '1212'
      })
    });
    const routerState = fakeRouterStateSnapshot({});

    const userMock = generateOneUser();
    authService.getUser.and.returnValues(mockObservable(null));

    guard.canActivate(activatedRoute, routerState)
    .subscribe(rta => {
      expect(rta).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      doneFn();
    })
  });

})
