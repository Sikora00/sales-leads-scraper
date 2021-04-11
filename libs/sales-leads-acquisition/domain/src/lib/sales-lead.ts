import { AggregateRoot } from '@nestjs/cqrs';
import { Url } from '@sales-leads/shared/domain-technical';
import { Country } from './value-objects/country';
import { Industry } from './value-objects/industry';
import { CompanySize } from './value-objects/company-size';
import { SourceAdvertisement } from './value-objects/source-advertisement';
import { City } from './value-objects/city';
import { NewSalesLeadAcquiredEvent } from './events/new-sales-lead-acquired.event';

export class SalesLead extends AggregateRoot {
  private city: City | null;
  private companySize: CompanySize | null;
  private companyWebsite: Url | null;
  private country: Country | null;
  private industry: Industry | null;
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
    salesLead.apply(new NewSalesLeadAcquiredEvent());
    return salesLead;
  }

  static restore(data: SalesLeadData): SalesLead {
    return new SalesLead(data);
  }

  getCity(): City | null {
    return this.city;
  }

  getCompanySize(): CompanySize | null {
    return this.companySize;
  }

  getCompanyWebsite(): Url | null {
    return this.companyWebsite;
  }

  getCountry(): Country | null {
    return this.country;
  }

  getIndustry(): Industry | null {
    return this.industry;
  }

  getName(): string {
    return this.name;
  }

  getSourceAdvertisement(): SourceAdvertisement {
    return this.sourceAdvertisement;
  }
}

export interface SalesLeadData {
  city: City | null;
  companySize: CompanySize | null;
  companyWebsite: Url | null;
  country: Country | null;
  industry: Industry | null;
  name: string;
  sourceAdvertisement: SourceAdvertisement;
}
