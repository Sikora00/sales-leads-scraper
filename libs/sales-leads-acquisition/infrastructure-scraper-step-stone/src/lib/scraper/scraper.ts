import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as scrapeIt from 'scrape-it';
import { Url } from '@sales-leads/shared/domain-technical';
import { defer, from, Observable, Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class Scraper implements OnModuleDestroy {
  private headers = {
    'authority': 'www.stepstone.de',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'referer': 'https://www.stepstone.de/5/job-search-simple.html?ke=Angular',
    'accept-language': 'en-US,en;q=0.9,pl;q=0.8,de;q=0.7',
    'cookie': 'dtCookie=35$16E95939E2D8602759A3C273B07285EF|9d8ef954bd9e252f|1; cfid=e7a5f207-7fd8-4037-887d-5e47009e2727; cftoken=0; USER_HASH_ID=c291fc09-51c2-46b7-aa23-3608af2f61f4; V5=1; UXUSER=%20%3B%20%3B%20%3B; STEPSTONEV5LANG=en; CIDFORRETURNINGVISIT=SE_GOOGLE; CIDFORRETURNINGVISITISSET=%22yes%22; rxVisitor=16113981946922LRGONFT3LP78F3EOVICHB0S3J31KNJ3; s_fid=0CDA45D3BB31ED2F-24FE29387EA61B7A; s_cc=true; s_vi=[CS]v1|302F78E31A4862A8-400007EAA29F5031[CE]; CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1616835015791%7Cconsent:true; _hjTLDTest=1; _hjid=6e0233ac-c79c-4639-9b22-df7578e00f04; _fbp=fb.1.1616835016280.1314383544; ONLINE_CF=10.147.4.212; trackingteam_abtest_version=group3b; iom_consent=0000000000&1618079000643; showJapuboxPopup=false; APPVER=v5; s_sq=%5B%5BB%5D%5D; previous-searches=Nestjs%7B%23-%23%7D%7B%23-%23%7D1618092009737%7B%23-%23%7D0%7B%7C-%7C%7DAngular%7B%23-%23%7D%7B%23-%23%7D1618080688109; utag_main=v_id:017872e06ebb000f6f932f78421603068001c06000bd0$_sn:3$_se:11$_ss:0$_st:1618093810458$vapi_domain:stepstone.de$poc__listing_links2:aaa$ses_id:1618090502416%3Bexp-session$_pn:8%3Bexp-session$prev_p:Resultlist%20Responsive%3Bexp-session; ioam2018=00186f140d5a863b7605ef1c7:1647852615971:1616835015971:.stepstone.de:41:stepston:core_search:noevent:1618092010754:1wz2o4; _uetsid=d402e0709a2911eb862071c745899d6c; _uetvid=735fbb608ed911ebb4265735f02be2ad; dtLatC=2; JSESSIONID=F20D4A0DD2B707B527FEF55A46E54CF1; bm_sz=1E68D322DB482563EE8D762C8A962CBA~YAAQLR0SAvwzAXd4AQAATBHtvQvYH9Yq7HQ50G9bv/k77T+tAEk7rRVrGYllw/T7e/y/X/JS+7w8y6lq90ZjcMfobMkpM13v83ImRbSLI4t22VFUNnq5qDQ6dCR9sX7ogK+5lEwJLaoR7gjc9VJ8ftWoBZpo4LRJq5rI+APRzw140NtkuHGoCUaDscOe8mM+LBg=; _abck=21F9441FC956D20E45E40135F8886392~0~YAAQLR0SAv0zAXd4AQAATBHtvQWkzo64mKM0ine/j11aIHEOQSNBIzzlErwWg+9QoZwIcBUN5e6e24Oo2OffKjVUtydBOQLmNtqLbHoyaYX4gB5KT4HvmbaVh5y0KVhQ+0uNL9wav3/PjOKWWgh1Zo6JP5bVAEH5CELC2LTCRyCsCBCW+pcUHq8qFAnLJMpjk3Tmfnx42bedkbWV2x436CNYD2tI1AqnhfpkYml1iA2tDlZvDc80ZpRoWVbA+XYGzLY9eWWU62DifhEaGtiMwwyVZL2SJ2jRKeCbh8mOIcxEkYUT0q5nONhvPFpS21fGf7rvfjpOch5wZf91uW1zLKLEU5F2FavSuoGBf0NRZqi8SEd37l/Gz9JpfwcdSyPW/6K7bEXLUhrDC/2dKR1lQVy9T5KbtSPWBw==~-1~-1~-1; dtPC=35$486633931_963h-vIRTHPOMHJTRVMPRAUFPTRMRMHAUUKOUM-0e0; rxvt=1618097421687|1618095621687; RT="z=1&dm=stepstone.de&si=d5adf53d-b6c7-45c8-8f07-775f1779ef58&ss=knc56p1d&sl=1&tt=0&obo=1&ld=7if57&ul=7if58"; dtSa=-; cftoken=0; USER_HASH_ID=d9b91d58-c140-45f1-9d2a-6bae17b642e6; V5=1; UXUSER=BLACKLIST%3BA%3B%20%3B; STEPSTONEV5LANG=en; JSESSIONID=B75F731F7F43865D1D9E754043EB2388; ONLINE_CF=10.147.5.105; cfid=e7a5f207-7fd8-4037-887d-5e47009e2727; ak_bmsc=952B605B0E244936E531CBA3B23ADA77685E646C29700000ED8C726031D1377F~pl1eTQLIs36wx6jO1v12vOvFGonLIuAW4p+QdboLrd3xscFjt3DCWF98+sNqyVJT/pAmbUDNBRbMgFxX+pusX5uVEjlNaYPYNly1po0hmL7xQYW+pdxqpBQ6jY0Th0i6TJzgK4THKfC128IIxfnJz8O1ZMI+NJM6qxS3dgS/2KBc3FuGYYoTiyjaQTFAFUcjYLm4bR6+Fwyu4XwexC4YibADjKD/z27qN+sOsTVtibasQ=; _abck=21F9441FC956D20E45E40135F8886392~-1~YAAQbGReaFtCd3Z4AQAA4H12vwVlsIGw6Pj+2Tm8+nwT1E5f3dwuc4fPsulW9bMcaSheCXak59gxg/YjKi0H6PuKqlPq6VygSDqcwkDmP+ZKEQ8N/BGJb6Z1QFrtiIXYwlY7mfM/D9YEYKSfsCsx9GFPI60K+JUVukWMUrsYoXm68Y/WCY+ydqnlWbt2UrhZUAleWfxq36w8tawVuyEyyxz+h7dD60o68eXaGf/v9e+u2bv+sUr2zx2VEeedvvzx96OPBGO0VrCVnF9NHbXC22BfYA3kU55MHZ179F6+EV7261docDrijjNVfCiuxncXhI3TbLCgBJAxJ33Ls8gZgi5xb6XjjtEDYmc73aFg2LJLpiczxlHcFiTZlbJoVS0=~0~-1~-1'
  };

  private tasks$ = new Subject<Observable<void>>();
  protected src$ = this.tasks$.pipe(mergeMap((command) => command, 20));
  private sub: Subscription;

  constructor() {
    this.sub = this.src$.subscribe();
  }

  scrape<T>(
    url: Url,
    opts: scrapeIt.ScrapeOptions
  ): Promise<scrapeIt.ScrapeResult<T>> {
    return new Promise((resolve) => {
      this.tasks$.next(
        defer(() =>
          from(
            scrapeIt<T>(
              { url: url.toString(), headers: this.headers },
              opts
            ).then(resolve)
          )
        )
      );
    });
  }

  onModuleDestroy(): void {
    this.sub.unsubscribe();
  }
}
