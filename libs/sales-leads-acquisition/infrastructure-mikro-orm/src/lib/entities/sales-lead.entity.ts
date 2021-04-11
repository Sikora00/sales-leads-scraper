import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {
  City,
  CompanySize,
  Country,
  Industry,
  SalesLead,
  SourceAdvertisement,
} from '@sales-leads/sales-leads-acquisition/domain';
import { Url, Uuid } from '@sales-leads/shared/domain-technical';
import { plainToClass } from 'class-transformer';

@Entity({ tableName: 'sales_leads' })
export class SalesLeadEntity {
  @Property({ nullable: true })
  private city: string | null = null;

  @Property({ nullable: true })
  private companySize: string | null = null;

  @Property({ nullable: true })
  private companyWebsite: string | null = null;

  @Property({ nullable: true })
  private country: string | null = null;

  @PrimaryKey()
  private id!: string;

  @Property({ nullable: true })
  private industry: string | null = null;

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
    const city = salesLead.getCity();
    const companySize = salesLead.getCompanySize();
    const companyWebsite = salesLead.getCompanyWebsite();
    const country = salesLead.getCountry();
    const industry = salesLead.getIndustry();
    return SalesLeadEntity.build({
      city: city ? city.value : null,
      companySize: companySize ? companySize.value : null,
      companyWebsite: companyWebsite ? companyWebsite.toString() : null,
      country: country ? country.value : null,
      id: Uuid.generate().value,
      industry: industry ? industry.value : null,
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
  city: string | null;
  companySize: string | null;
  companyWebsite: string | null;
  country: string | null;
  id: string;
  industry: string | null;
  name: string;
  sourceAdvertisementTitle: string;
  sourceAdvertisementUrl: string;
}
