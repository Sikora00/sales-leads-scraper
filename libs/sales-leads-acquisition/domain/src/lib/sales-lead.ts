import { AggregateRoot } from '@nestjs/cqrs';
import { Url } from './value-objects/url';
import { Country } from './value-objects/country';
import { Industry } from './value-objects/industry';
import { CompanySize } from './value-objects/company-size';
import { SourceAdvertisement } from './value-objects/source-advertisement';
import { City } from './value-objects/city';
import {NewSalesLeadAcquiredEvent} from "./events/new-sales-lead-acquired.event";

export class SalesLead extends AggregateRoot {
  private city: City;
  private companySize: CompanySize;
  private companyWebsite: Url;
  private country: Country;
  private industry: Industry;
  private name: string;
  private sourceAdvertisement: SourceAdvertisement;

  private constructor(data: SalesLeadData) {
    super();
    this.city = data.city;
    this.companySize = data.companySize;
    this.companyWebsite = data.companyWebsite;
    this.country = data.country;
    this.industry = data.industry;
    this.name = data.name;
    this.sourceAdvertisement = data.sourceAdvertisement;
  }

  static acquired(data: SalesLeadData): SalesLead {
    const salesLead = new SalesLead(data);
    salesLead.apply(new NewSalesLeadAcquiredEvent())
    return salesLead
  }
}

export interface SalesLeadData {
  city: City;
  companySize: CompanySize;
  companyWebsite: Url;
  country: Country;
  industry: Industry;
  name: string;
  sourceAdvertisement: SourceAdvertisement;
}
