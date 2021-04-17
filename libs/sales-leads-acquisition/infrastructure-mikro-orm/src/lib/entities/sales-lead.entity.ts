import { DateType, Entity, PrimaryKey, Property } from '@mikro-orm/core';
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
  @Property({ type: DateType })
  private addedAt = new Date();

  @Property({ nullable: true })
  private city: string | null = null;

  @Property({ nullable: true })
  private companySize: string | null = null;

  @PrimaryKey()
  private companyWebsite: string | null = null;

  @Property({ nullable: true })
  private country: string | null = null;

  @Property({ nullable: true })
  private industry: string | null = null;

  @Property()
  private name!: string;

  @Property()
  private sourceAdvertisementTitle!: string;

  @Property({ columnType: 'varchar(2083)' })
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
      industry: industry ? industry.value : null,
      name: salesLead.getName(),
      sourceAdvertisementTitle: salesLead.getSourceAdvertisement().title,
      sourceAdvertisementUrl: salesLead.getSourceAdvertisement().url.toString(),
    });
  }

  toSalesLead(): SalesLead {
    return SalesLead.restore({
      city: this.city ? new City(this.city) : null,
      companySize: this.companySize ? new CompanySize(this.companySize) : null,
      companyWebsite: this.companyWebsite ? new Url(this.companyWebsite) : null,
      country: this.country ? new Country(this.country) : null,
      industry: this.industry ? new Industry(this.industry) : null,
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
  industry: string | null;
  name: string;
  sourceAdvertisementTitle: string;
  sourceAdvertisementUrl: string;
}
