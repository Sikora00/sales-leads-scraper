import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {
  City,
  CompanySize,
  Country,
  Industry,
  SalesLead,
  SourceAdvertisement,
} from '@sales-leads/sales-leads-acquisition/domain';
import { Url } from '@sales-leads/shared/domain-technical';
import { plainToClass } from 'class-transformer';

@Entity({ tableName: 'sales_leads' })
export class SalesLeadEntity {
  @Property()
  private city!: string;

  @Property()
  private companySize!: string;

  @Property()
  private companyWebsite!: string;

  @Property()
  private country!: string;

  @PrimaryKey()
  private id!: string;

  @Property()
  private industry!: string;

  @Property()
  private name!: string;

  @Property()
  private sourceAdvertisementTitle!: string;

  @Property()
  private sourceAdvertisementUrl!: string;

  private static build(data: SalesLeadEntityData): SalesLeadEntity {
    return plainToClass(SalesLeadEntity, data);
  }

  static fromSalesLead(salesLead: SalesLead): SalesLeadEntity {
    return SalesLeadEntity.build({
      city: salesLead.getCity().value,
      companySize: salesLead.getCompanySize().value,
      companyWebsite: salesLead.getCompanyWebsite().toString(),
      country: salesLead.getCountry().value,
      id: '4ef28c8d-1ede-45e2-9deb-4f8a815c562d',
      industry: salesLead.getIndustry().value,
      name: salesLead.getName(),
      sourceAdvertisementTitle: salesLead.getSourceAdvertisement().title,
      sourceAdvertisementUrl: salesLead.getSourceAdvertisement().url.toString(),
    });
  }

  toSalesLead(): SalesLead {
    return SalesLead.restore({
      city: new City(this.city),
      companySize: new CompanySize(this.companySize),
      companyWebsite: new Url(this.companyWebsite),
      country: new Country(this.country),
      industry: new Industry(this.industry),
      name: this.name,
      sourceAdvertisement: new SourceAdvertisement(
        new Url(this.sourceAdvertisementUrl),
        this.sourceAdvertisementTitle
      ),
    });
  }
}

export interface SalesLeadEntityData {
  city: string;
  companySize: string;
  companyWebsite: string;
  country: string;
  id: string;
  industry: string;
  name: string;
  sourceAdvertisementTitle: string;
  sourceAdvertisementUrl: string;
}
