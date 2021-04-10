import { SalesLead, SalesLeadData } from './sales-lead';
import { City } from './value-objects/city';
import { Url } from './value-objects/url';
import { CompanySize } from './value-objects/company-size';
import { Country } from './value-objects/country';
import { Industry } from './value-objects/industry';
import { SourceAdvertisement } from './value-objects/source-advertisement';

describe('SalesLead', () => {
  describe('when sales lead is acquired', () => {
    let salesLead: SalesLead;
    beforeAll(() => {
      salesLead = SalesLead.acquired(fixture.getSalesLeadData());
    });
    it('should know its name, website, country, industry, company size, source advertisement, advertisement title and city', () => {
      expect(salesLead).toMatchSnapshot();
    });
  });
});

const fixture = {
  getSalesLeadData: (): SalesLeadData => ({
    city: new City('Warsaw'),
    companyWebsite: new Url('https://valueadd.pl'),
    companySize: new CompanySize('50-100'),
    country: new Country('Poland'),
    industry: new Industry('Software Development'),
    name: 'ValueAdd',
    sourceAdvertisement: new SourceAdvertisement(
      new Url('https://just-join-it.com'),
      'NestJS Developer'
    ),
  }),
};
