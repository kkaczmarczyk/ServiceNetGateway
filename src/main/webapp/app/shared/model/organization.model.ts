import { Moment } from 'moment';
import { IProgram } from 'app/shared/model//program.model';
import { IService } from 'app/shared/model//service.model';

export interface IOrganization {
  id?: number;
  name?: string;
  alternateName?: string;
  description?: any;
  email?: string;
  url?: string;
  taxStatus?: string;
  taxId?: string;
  yearIncorporated?: Moment;
  legalStatus?: string;
  active?: boolean;
  updatedAt?: Moment;
  locationName?: string;
  locationId?: number;
  replacedById?: number;
  sourceDocumentDateUploaded?: string;
  sourceDocumentId?: number;
  accountName?: string;
  accountId?: number;
  fundingId?: number;
  programs?: IProgram[];
  services?: IService[];
}

export const defaultValue: Readonly<IOrganization> = {
  active: false
};
